'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft, ChevronRight, Wrench, Clock, User, Box,
  CheckCircle2, AlertTriangle, PlayCircle, Pause, XCircle,
  ListChecks, Package, FileCheck, Loader2
} from 'lucide-react';

const statusColors: Record<string, string> = {
  DRAFT: 'badge-neutral', PLANNED: 'badge-brand', APPROVED: 'badge-info',
  IN_PROGRESS: 'bg-sky-500/15 text-sky-400 border border-sky-500/20',
  ON_HOLD: 'badge-warning', COMPLETED: 'badge-success', CANCELLED: 'badge-neutral',
  CLOSED: 'bg-slate-600/15 text-slate-400 border border-slate-600/20',
};

const priorityColors: Record<string, string> = {
  CRITICAL: 'badge-danger', HIGH: 'badge-warning', MEDIUM: 'badge-info', LOW: 'badge-neutral',
};

const statusFlow: Record<string, string[]> = {
  DRAFT: ['PLANNED', 'CANCELLED'],
  PLANNED: ['APPROVED', 'CANCELLED'],
  APPROVED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['ON_HOLD', 'COMPLETED'],
  ON_HOLD: ['IN_PROGRESS', 'CANCELLED'],
  COMPLETED: ['CLOSED'],
};

const statusIcons: Record<string, any> = {
  IN_PROGRESS: PlayCircle,
  ON_HOLD: Pause,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
  PLANNED: Clock,
  APPROVED: FileCheck,
};

export default function WorkOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [changingStatus, setChangingStatus] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['work-order', id],
    queryFn: () => api.get(`/api/v1/maintenance/work-orders/${id}`),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus: string) => api.patch(`/api/v1/maintenance/work-orders/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-order', id] });
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      queryClient.invalidateQueries({ queryKey: ['wo-summary'] });
      setChangingStatus(false);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-48 rounded-xl" />
        <div className="grid grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="skeleton h-64 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <AlertTriangle className="w-10 h-10 mb-3 text-amber-400" />
        <p className="text-lg font-medium text-white">Work order not found</p>
        <button onClick={() => router.back()} className="btn-secondary mt-4">Go back</button>
      </div>
    );
  }

  const wo = data.data;
  const tasks = wo.tasks || [];
  const spareParts = wo.spareParts || [];
  const approvals = wo.approvals || [];
  const nextStatuses = statusFlow[wo.status] || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/maintenance" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Maintenance
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">{wo.woNumber}</span>
      </div>

      {/* Header Card */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-600/30 to-blue-600/30 border border-sky-500/20 flex items-center justify-center">
              <Wrench className="w-7 h-7 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white font-mono">{wo.woNumber}</h1>
                <span className={`badge ${statusColors[wo.status] || 'badge-neutral'}`}>{wo.status?.replace(/_/g, ' ')}</span>
                <span className={`badge ${priorityColors[wo.priority] || 'badge-neutral'}`}>{wo.priority}</span>
              </div>
              <p className="text-slate-400 mt-1">{wo.description || 'No description'}</p>
            </div>
          </div>

          {/* Status transition buttons */}
          {nextStatuses.length > 0 && (
            <div className="flex items-center gap-2">
              {nextStatuses.map(status => {
                const Icon = statusIcons[status] || ChevronRight;
                const isDestructive = status === 'CANCELLED';
                return (
                  <button
                    key={status}
                    onClick={() => statusMutation.mutate(status)}
                    disabled={statusMutation.isPending}
                    className={`${isDestructive ? 'btn-danger' : status === 'COMPLETED' ? 'bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all' : 'btn-secondary'} flex items-center gap-2 text-sm`}
                  >
                    {statusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
                    {status.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Info */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Work Order Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                { label: 'Type', value: wo.type?.replace(/_/g, ' '), icon: Wrench },
                { label: 'Priority', value: wo.priority, icon: AlertTriangle },
                { label: 'Scheduled Start', value: wo.scheduledStart ? new Date(wo.scheduledStart).toLocaleString() : '—', icon: Clock },
                { label: 'Scheduled End', value: wo.scheduledEnd ? new Date(wo.scheduledEnd).toLocaleString() : '—', icon: Clock },
                { label: 'Actual Start', value: wo.actualStart ? new Date(wo.actualStart).toLocaleString() : '—', icon: PlayCircle },
                { label: 'Actual End', value: wo.actualEnd ? new Date(wo.actualEnd).toLocaleString() : '—', icon: CheckCircle2 },
                { label: 'Actual Hours', value: wo.actualHours ? `${wo.actualHours} hrs` : '—', icon: Clock },
                { label: 'Actual Cost', value: wo.actualCost ? `$${Number(wo.actualCost).toLocaleString()}` : '—', icon: Box },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-start gap-2 py-2 border-b border-slate-800/30">
                  <Icon className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-brand-400" /> Tasks ({tasks.length})
              </h3>
            </div>
            {tasks.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No tasks assigned</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task: any, i: number) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-slate-700/60 flex items-center justify-center text-xs font-mono text-slate-400 flex-shrink-0">
                      {task.sequence || i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{task.description}</p>
                      {task.estimatedHours && (
                        <p className="text-xs text-slate-500 mt-0.5">Est. {task.estimatedHours} hrs</p>
                      )}
                    </div>
                    <span className={`badge ${
                      task.status === 'COMPLETED' ? 'badge-success' :
                      task.status === 'IN_PROGRESS' ? 'badge-info' : 'badge-neutral'
                    }`}>{task.status || 'PENDING'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spare Parts */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" /> Spare Parts ({spareParts.length})
            </h3>
            {spareParts.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No spare parts recorded</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase py-2">Item</th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase py-2">Qty</th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase py-2">Unit Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {spareParts.map((sp: any) => (
                    <tr key={sp.id} className="border-b border-slate-800/30">
                      <td className="py-2 text-sm text-white">{sp.stockItemId}</td>
                      <td className="py-2 text-sm text-slate-400 text-right">{sp.quantityUsed}</td>
                      <td className="py-2 text-sm text-slate-400 text-right">{sp.unitCost ? `$${Number(sp.unitCost).toFixed(2)}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Status Flow</h3>
            <div className="space-y-3">
              {['DRAFT', 'PLANNED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'].map((s, i) => {
                const isCurrent = s === wo.status;
                const isPast = ['DRAFT', 'PLANNED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'].indexOf(wo.status) >= i;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      isCurrent ? 'bg-brand-500 ring-4 ring-brand-500/20' :
                      isPast ? 'bg-emerald-500' : 'bg-slate-700'
                    }`} />
                    <span className={`text-sm ${isCurrent ? 'text-white font-semibold' : isPast ? 'text-slate-400' : 'text-slate-600'}`}>
                      {s.replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approvals */}
          {approvals.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" /> Approvals
              </h3>
              <div className="space-y-3">
                {approvals.map((appr: any) => (
                  <div key={appr.id} className="p-3 rounded-lg bg-slate-800/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">Step {appr.approvalStep}</span>
                      <span className={`badge ${appr.decision === 'APPROVED' ? 'badge-success' : appr.decision === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                        {appr.decision || 'PENDING'}
                      </span>
                    </div>
                    {appr.comments && <p className="text-xs text-slate-500 mt-1">{appr.comments}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-800/30">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-300">{new Date(wo.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Updated</span>
                <span className="text-slate-300">{new Date(wo.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
