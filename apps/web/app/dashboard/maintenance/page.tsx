'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';
import {
  Wrench, Plus, Search, ChevronLeft, ChevronRight,
  Clock, CheckCircle2, AlertTriangle, Pause, PlayCircle,
  LayoutList, LayoutGrid
} from 'lucide-react';

const statusColors: Record<string, string> = {
  DRAFT: 'badge-neutral',
  PLANNED: 'badge-brand',
  APPROVED: 'badge-info',
  IN_PROGRESS: 'bg-sky-500/15 text-sky-400 border border-sky-500/20',
  ON_HOLD: 'badge-warning',
  COMPLETED: 'badge-success',
  CANCELLED: 'badge-neutral',
  CLOSED: 'bg-slate-600/15 text-slate-400 border border-slate-600/20',
};

const priorityColors: Record<string, string> = {
  CRITICAL: 'badge-danger',
  HIGH: 'badge-warning',
  MEDIUM: 'badge-info',
  LOW: 'badge-neutral',
};

const typeIcons: Record<string, string> = {
  PREVENTIVE: '🔧',
  CORRECTIVE: '🔴',
  PREDICTIVE: '📊',
  EMERGENCY: '🚨',
  CONDITION_BASED: '📡',
  PROJECT: '📋',
};

export default function MaintenancePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const limit = 15;

  const queryParams = new URLSearchParams({
    page: String(page), limit: String(limit),
    ...(statusFilter && { status: statusFilter }),
    ...(typeFilter && { type: typeFilter }),
    ...(priorityFilter && { priority: priorityFilter }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['work-orders', page, statusFilter, typeFilter, priorityFilter],
    queryFn: () => api.get(`/api/v1/maintenance/work-orders?${queryParams}`),
  });

  const { data: summary } = useQuery({
    queryKey: ['wo-summary'],
    queryFn: () => api.get('/api/v1/maintenance/work-orders/summary'),
  });

  const workOrders = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit, total: 0, totalPages: 0 };
  const byStatus = summary?.data?.byStatus || [];
  const byPriority = summary?.data?.byPriority || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance</h1>
          <p className="text-slate-400 mt-1">{pagination.total} work orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/60 rounded-lg border border-slate-700/50 p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <Link href="/dashboard/maintenance/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Work Order
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {byStatus.map((s: any) => (
          <button
            key={s.status}
            onClick={() => setStatusFilter(statusFilter === s.status ? '' : s.status)}
            className={`glass-panel p-3 text-left transition-all duration-200 ${
              statusFilter === s.status ? 'ring-1 ring-brand-500 border-brand-500/30' : ''
            }`}
          >
            <p className="text-lg font-bold text-white">{s.count}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.status.replace(/_/g, ' ')}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search work orders..."
              className="input-field pl-10 py-2 text-sm"
            />
          </div>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="input-field w-44 py-2 text-sm rounded-lg">
            <option value="">All Types</option>
            {['PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'EMERGENCY', 'CONDITION_BASED'].map(t => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }} className="input-field w-36 py-2 text-sm rounded-lg">
            <option value="">All Priority</option>
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {(statusFilter || typeFilter || priorityFilter) && (
            <button onClick={() => { setStatusFilter(''); setTypeFilter(''); setPriorityFilter(''); setPage(1); }} className="btn-ghost text-xs">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
          {['PLANNED', 'APPROVED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED'].map(status => {
            const filtered = workOrders.filter((wo: any) => wo.status === status);
            return (
              <div key={status} className="glass-card p-4 min-w-[240px]">
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge ${statusColors[status] || 'badge-neutral'}`}>{status.replace(/_/g, ' ')}</span>
                  <span className="text-xs text-slate-500">{filtered.length}</span>
                </div>
                <div className="space-y-2">
                  {filtered.length === 0 ? (
                    <p className="text-xs text-slate-600 text-center py-6">No items</p>
                  ) : (
                    filtered.map((wo: any) => (
                      <Link
                        key={wo.id}
                        href={`/dashboard/maintenance/${wo.id}`}
                        className="block p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/20 hover:border-slate-600/40 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-mono text-brand-400">{wo.woNumber}</span>
                          <span className={`badge text-[10px] ${priorityColors[wo.priority] || ''}`}>{wo.priority}</span>
                        </div>
                        <p className="text-sm text-white line-clamp-2 group-hover:text-brand-300 transition-colors">
                          {wo.description || wo.woNumber}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                          <span>{typeIcons[wo.type] || '🔧'} {wo.type?.replace(/_/g, ' ')}</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  {['WO Number', 'Description', 'Type', 'Priority', 'Status', 'Scheduled', 'Assigned'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="table-row">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-24 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : workOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      <Wrench className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                      <p>No work orders found</p>
                    </td>
                  </tr>
                ) : (
                  workOrders.map((wo: any) => (
                    <tr key={wo.id} className="table-row group">
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/maintenance/${wo.id}`} className="text-sm font-medium text-brand-400 hover:text-brand-300 font-mono transition-colors">
                          {wo.woNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 max-w-[280px]">
                        <p className="text-sm text-white truncate">{wo.description || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-400">{typeIcons[wo.type]} {wo.type?.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${priorityColors[wo.priority] || 'badge-neutral'}`}>{wo.priority}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${statusColors[wo.status] || 'badge-neutral'}`}>{wo.status?.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {wo.scheduledStart ? new Date(wo.scheduledStart).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">{wo.assignedTo || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50">
              <p className="text-sm text-slate-500">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-2 disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="btn-ghost p-2 disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">By Priority</h3>
          <div className="space-y-3">
            {byPriority.map((p: any) => {
              const total = byPriority.reduce((a: number, b: any) => a + Number(b.count), 0);
              const pct = total > 0 ? (Number(p.count) / total) * 100 : 0;
              const barColor: Record<string, string> = { CRITICAL: 'bg-rose-500', HIGH: 'bg-amber-500', MEDIUM: 'bg-sky-500', LOW: 'bg-slate-500' };
              return (
                <div key={p.priority}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">{p.priority}</span>
                    <span className="text-sm font-medium text-white">{p.count}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor[p.priority] || 'bg-slate-600'} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center justify-between">
            <span>Maintenance Plans</span>
            <Link href="/dashboard/maintenance/plans" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all →</Link>
          </h3>
          <PlansList />
        </div>
      </div>
    </div>
  );
}

function PlansList() {
  const { data, isLoading } = useQuery({
    queryKey: ['maintenance-plans'],
    queryFn: () => api.get('/api/v1/maintenance/plans'),
  });

  if (isLoading) return <div className="py-8 text-center text-slate-500 text-sm">Loading...</div>;
  const plans = data?.data || [];
  if (plans.length === 0) return <p className="text-sm text-slate-500 py-4 text-center">No maintenance plans configured</p>;

  return (
    <div className="space-y-2">
      {plans.slice(0, 5).map((plan: any) => (
        <div key={plan.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
          <div>
            <p className="text-sm text-white">{plan.name || plan.planCode}</p>
            <p className="text-xs text-slate-500 mt-0.5">{plan.planType?.replace(/_/g, ' ')} · Every {plan.frequencyValue} {plan.frequencyUnit}</p>
          </div>
          <span className={`badge ${plan.isActive ? 'badge-success' : 'badge-neutral'}`}>
            {plan.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      ))}
    </div>
  );
}
