'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Box, MapPin, Calendar, Hash, Settings2,
  Activity, Wrench, FileText, ChevronRight, ExternalLink,
  AlertTriangle, CheckCircle2, Clock, Network, ArrowRightCircle,
  ShieldCheck, XCircle, Loader2, MessageSquare, ChevronDown,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  PLANNED: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  PENDING_APPROVAL: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  INSTALLED: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  ACTIVE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  INACTIVE: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  DECOMMISSIONED: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  DISPOSED: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
};

const statusIcons: Record<string, any> = {
  PLANNED: Clock, PENDING_APPROVAL: Clock, INSTALLED: Settings2,
  ACTIVE: CheckCircle2, INACTIVE: XCircle, DECOMMISSIONED: AlertTriangle, DISPOSED: XCircle,
};

// Full lifecycle in order for the progress bar
const LIFECYCLE_ORDER = ['PLANNED', 'INSTALLED', 'ACTIVE', 'INACTIVE', 'DECOMMISSIONED', 'DISPOSED'];

const criticalityConfig: Record<string, { color: string; label: string }> = {
  A: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', label: 'Critical' },
  B: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Important' },
  C: { color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', label: 'Standard' },
  D: { color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', label: 'Non-critical' },
};

function InfoRow({ label, value, icon: Icon, mono }: { label: string; value: any; icon?: any; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-800/30 last:border-0">
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </div>
      <span className={`text-sm text-right ${mono ? 'font-mono text-slate-400' : 'text-white'}`}>
        {value || '—'}
      </span>
    </div>
  );
}

export default function AssetDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState<any>(null);
  const [transitionComment, setTransitionComment] = useState('');
  const [showApprovalAction, setShowApprovalAction] = useState<string | null>(null);
  const [approvalComment, setApprovalComment] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['assets', id],
    queryFn: () => api.get(`/api/v1/assets/${id}`),
    enabled: !!id,
  });

  const { data: hierarchyData } = useQuery({
    queryKey: ['assets', id, 'hierarchy'],
    queryFn: () => api.get(`/api/v1/assets/${id}/hierarchy`),
    enabled: !!id,
  });

  const { data: reliabilityData } = useQuery({
    queryKey: ['rcm', 'reliability', id],
    queryFn: () => api.get(`/api/v1/rcm/reliability/${id}`),
    enabled: !!id,
  });

  // Status transition mutation
  const transitionMutation = useMutation({
    mutationFn: (body: { requestedStatus: string; comments?: string }) =>
      api.post(`/api/v1/assets/${id}/request-status-change`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', id] });
      setShowTransitionModal(false);
      setSelectedTransition(null);
      setTransitionComment('');
    },
  });

  // Approval decision mutation
  const approvalMutation = useMutation({
    mutationFn: (body: { approvalId: string; decision: 'APPROVED' | 'REJECTED'; comments?: string }) =>
      api.post(`/api/v1/assets/${id}/approvals`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', id] });
      setShowApprovalAction(null);
      setApprovalComment('');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="skeleton h-8 w-64 rounded" />
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-48 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <AlertTriangle className="w-10 h-10 mb-3 text-amber-400" />
        <p className="text-lg font-medium text-white">Asset not found</p>
        <p className="mt-1">The requested asset could not be loaded.</p>
        <button onClick={() => router.back()} className="btn-secondary mt-4">Go back</button>
      </div>
    );
  }

  const asset = data.data;
  const crit = criticalityConfig[asset.criticality] || criticalityConfig.D;
  const reliability = reliabilityData?.data?.[0];
  const children = asset.children || [];
  const lifecycle = asset.lifecycleEvents || [];
  const attributes = asset.attributes || [];
  const hierarchy = hierarchyData?.data || [];
  const approvals = asset.approvals || [];
  const allowedTransitions = asset.allowedTransitions || [];
  const pendingApprovals = approvals.filter((a: any) => a.status === 'PENDING');

  // Current lifecycle stage for progress indicator
  const currentStageIndex = LIFECYCLE_ORDER.indexOf(asset.status === 'PENDING_APPROVAL' ? 'PLANNED' : asset.status);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/assets" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Assets
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">{asset.tagNumber}</span>
      </div>

      {/* Header with Status & Transition Actions */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600/30 to-purple-600/30 border border-brand-500/20 flex items-center justify-center">
              <Box className="w-7 h-7 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{asset.name}</h1>
                <span className={`badge border ${statusColors[asset.status] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'}`}>
                  {asset.status?.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-slate-400 mt-1">
                <span className="font-mono text-brand-400">{asset.tagNumber}</span>
                {asset.manufacturer && <span className="ml-3 text-slate-500">by {asset.manufacturer}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge border ${crit.color} text-sm px-3 py-1`}>
              {asset.criticality} — {crit.label}
            </span>
            {/* Status Transition Buttons */}
            {allowedTransitions.length > 0 && (
              <div className="flex gap-1.5 ml-3">
                {allowedTransitions.map((t: any) => (
                  <button key={t.targetStatus}
                    onClick={() => { setSelectedTransition(t); setShowTransitionModal(true); }}
                    className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5">
                    <ArrowRightCircle className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Lifecycle Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/40">
          <div className="flex items-center gap-0">
            {LIFECYCLE_ORDER.map((stage, i) => {
              const isActive = asset.status === stage;
              const isPast = i < currentStageIndex;
              const StIcon = statusIcons[stage] || Clock;
              return (
                <div key={stage} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive ? 'border-brand-500 bg-brand-500/20 text-brand-400 shadow-glow-brand scale-110' :
                      isPast ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500' :
                      'border-slate-700 bg-slate-800/50 text-slate-600'
                    }`}>
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : <StIcon className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-[10px] mt-1.5 font-medium tracking-wide ${
                      isActive ? 'text-brand-400' : isPast ? 'text-emerald-500/70' : 'text-slate-600'
                    }`}>
                      {stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {i < LIFECYCLE_ORDER.length - 1 && (
                    <div className={`h-0.5 w-full mx-1 rounded ${
                      isPast ? 'bg-emerald-500/40' : 'bg-slate-800'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          {asset.status === 'PENDING_APPROVAL' && (
            <p className="text-xs text-amber-400 text-center mt-3 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Awaiting approval for status transition
            </p>
          )}
        </div>
      </div>

      {/* Pending Approvals Banner */}
      {pendingApprovals.length > 0 && (
        <div className="glass-card p-4 border-amber-500/20 bg-amber-500/5">
          <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Pending Approvals ({pendingApprovals.length})
          </h3>
          <div className="space-y-2">
            {pendingApprovals.map((ap: any) => (
              <div key={ap.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-amber-400">#{ap.approvalStep}</span>
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      {ap.approvalType === 'STATUS_CHANGE' ? (
                        <><span className="text-slate-400">{ap.previousStatus}</span> → <span className="text-brand-400">{ap.requestedStatus}</span></>
                      ) : (
                        <span>Asset Creation Approval</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">Requires: <span className="text-slate-400">{ap.approverRole}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {showApprovalAction === ap.id ? (
                    <div className="flex items-center gap-2">
                      <input type="text" placeholder="Comment..." value={approvalComment}
                        onChange={e => setApprovalComment(e.target.value)}
                        className="input-field py-1 px-2 text-xs rounded w-40" />
                      <button onClick={() => approvalMutation.mutate({ approvalId: ap.id, decision: 'APPROVED', comments: approvalComment })}
                        disabled={approvalMutation.isPending}
                        className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20">
                        {approvalMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : '✓ Approve'}
                      </button>
                      <button onClick={() => approvalMutation.mutate({ approvalId: ap.id, decision: 'REJECTED', comments: approvalComment })}
                        disabled={approvalMutation.isPending}
                        className="px-2.5 py-1 rounded text-xs font-medium bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/20">
                        ✗ Reject
                      </button>
                      <button onClick={() => setShowApprovalAction(null)} className="text-slate-500 hover:text-white">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setShowApprovalAction(ap.id); setApprovalComment(''); }}
                      className="btn-secondary text-xs flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {reliability && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card border-emerald-500/20">
            <p className="text-xs text-slate-500 uppercase tracking-wider">MTBF</p>
            <p className="text-2xl font-bold text-white">{Number(reliability.mtbf || 0).toFixed(0)}<span className="text-sm text-slate-400 ml-1">hrs</span></p>
          </div>
          <div className="stat-card border-amber-500/20">
            <p className="text-xs text-slate-500 uppercase tracking-wider">MTTR</p>
            <p className="text-2xl font-bold text-white">{Number(reliability.mttr || 0).toFixed(1)}<span className="text-sm text-slate-400 ml-1">hrs</span></p>
          </div>
          <div className="stat-card border-sky-500/20">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Availability</p>
            <p className="text-2xl font-bold text-white">{(Number(reliability.availability || 0) * 100).toFixed(1)}<span className="text-sm text-slate-400 ml-1">%</span></p>
          </div>
          <div className="stat-card border-rose-500/20">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Failure Count</p>
            <p className="text-2xl font-bold text-white">{reliability.failureCount || 0}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Asset Details</h3>
            <InfoRow label="Tag Number" value={asset.tagNumber} icon={Hash} mono />
            <InfoRow label="Serial Number" value={asset.serialNumber} icon={Settings2} mono />
            <InfoRow label="Model" value={asset.model} icon={Box} />
            <InfoRow label="Manufacturer" value={asset.manufacturer} icon={Box} />
            <InfoRow label="Install Date" value={asset.installDate ? new Date(asset.installDate).toLocaleDateString() : null} icon={Calendar} />
            <InfoRow label="Commission Date" value={asset.commissionDate ? new Date(asset.commissionDate).toLocaleDateString() : null} icon={Calendar} />
          </div>

          {/* Custom Attributes */}
          {attributes.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Attributes</h3>
              {attributes.map((attr: any) => (
                <InfoRow key={attr.id} label={attr.attributeKey} value={attr.attributeValue} />
              ))}
            </div>
          )}

          {/* Approval History */}
          {approvals.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400" /> Approval & Transition History
              </h3>
              <div className="space-y-2">
                {approvals.map((ap: any) => (
                  <div key={ap.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                      ap.status === 'APPROVED' ? 'bg-emerald-500/15 text-emerald-400' :
                      ap.status === 'REJECTED' ? 'bg-rose-500/15 text-rose-400' :
                      'bg-amber-500/15 text-amber-400'
                    }`}>
                      {ap.status === 'APPROVED' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                       ap.status === 'REJECTED' ? <XCircle className="w-3.5 h-3.5" /> :
                       <Clock className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white">
                          {ap.approvalType === 'STATUS_CHANGE' ? (
                            <>{ap.previousStatus} → <span className="text-brand-400">{ap.requestedStatus}</span></>
                          ) : 'Asset Creation'}
                          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                            ap.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                            ap.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400' :
                            'bg-amber-500/10 text-amber-400'
                          }`}>{ap.status}</span>
                        </p>
                        <span className="text-[10px] text-slate-600">
                          {ap.decidedAt ? new Date(ap.decidedAt).toLocaleDateString() : new Date(ap.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Step {ap.approvalStep} • Role: {ap.approverRole}
                        {ap.comments && <span className="text-slate-400 ml-1">— {ap.comments}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lifecycle Events */}
          {lifecycle.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Lifecycle History</h3>
              <div className="space-y-3">
                {lifecycle.map((event: any) => (
                  <div key={event.id} className="flex items-start gap-3 py-2 border-b border-slate-800/30 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-white">{event.description || event.eventType}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(event.eventDate || event.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Child Assets */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Network className="w-4 h-4 text-brand-400" /> Child Assets
            </h3>
            {children.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No child assets</p>
            ) : (
              <div className="space-y-2">
                {children.map((child: any) => (
                  <Link
                    key={child.id}
                    href={`/dashboard/assets/${child.id}`}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/40 transition-colors group"
                  >
                    <div>
                      <p className="text-sm text-white group-hover:text-brand-400 transition-colors">{child.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{child.tagNumber}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Hierarchy */}
          {hierarchy.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Hierarchy</h3>
              <div className="space-y-1 text-sm">
                {hierarchy.slice(0, 10).map((node: any, i: number) => (
                  <div key={node.id || i} className="flex items-center gap-2 py-1" style={{ paddingLeft: `${(node.depth || 0) * 16}px` }}>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span className={`${node.id === id ? 'text-brand-400 font-medium' : 'text-slate-400'}`}>
                      {node.name || node.tag_number}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Related</h3>
            <div className="space-y-1">
              <Link href={`/dashboard/maintenance?assetId=${id}`} className="nav-item text-sm">
                <Wrench className="w-4 h-4" /> Work Orders
              </Link>
              <Link href={`/dashboard/rcm?assetId=${id}`} className="nav-item text-sm">
                <Activity className="w-4 h-4" /> RCM Analysis
              </Link>
              <Link href={`/dashboard/telemetry?assetId=${id}`} className="nav-item text-sm">
                <Activity className="w-4 h-4" /> Sensors
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Status Transition Request Modal */}
      {showTransitionModal && selectedTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowTransitionModal(false)}>
          <div className="glass-card p-6 w-full max-w-md space-y-5 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowRightCircle className="w-5 h-5 text-brand-400" />
                Request Status Change
              </h3>
              <button onClick={() => setShowTransitionModal(false)} className="text-slate-500 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Transition visual */}
            <div className="flex items-center justify-center gap-3 py-4">
              <div className={`badge border px-3 py-1.5 ${statusColors[asset.status]}`}>
                {asset.status?.replace(/_/g, ' ')}
              </div>
              <ArrowRightCircle className="w-5 h-5 text-brand-400" />
              <div className={`badge border px-3 py-1.5 ${statusColors[selectedTransition.targetStatus]}`}>
                {selectedTransition.targetStatus?.replace(/_/g, ' ')}
              </div>
            </div>

            <div className="space-y-1 text-sm text-slate-400 bg-slate-800/30 rounded-lg p-3">
              <p><span className="text-slate-500">Asset:</span> {asset.name} ({asset.tagNumber})</p>
              <p><span className="text-slate-500">Criticality:</span> {asset.criticality} — {crit.label}</p>
              <p><span className="text-slate-500">Requires approval by:</span> <span className="text-brand-400">{selectedTransition.approverRole}</span></p>
              {asset.criticality === 'A' && (
                <p className="text-xs text-amber-400 mt-1">⚠ Critical asset — requires multi-step approval</p>
              )}
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">Comments / Justification</label>
              <textarea value={transitionComment} onChange={e => setTransitionComment(e.target.value)}
                rows={3} placeholder="Provide reason for this status change..."
                className="input-field text-sm rounded-lg w-full" />
            </div>

            {transitionMutation.isError && (
              <p className="text-xs text-rose-400">❌ {(transitionMutation.error as any)?.message || 'Failed to submit request'}</p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setShowTransitionModal(false)} className="btn-ghost text-sm">Cancel</button>
              <button
                onClick={() => transitionMutation.mutate({ requestedStatus: selectedTransition.targetStatus, comments: transitionComment })}
                disabled={transitionMutation.isPending}
                className="btn-primary text-sm flex items-center gap-1.5">
                {transitionMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
