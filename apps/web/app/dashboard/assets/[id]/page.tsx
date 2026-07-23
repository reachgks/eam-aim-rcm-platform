'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Box, MapPin, Calendar, Hash, Settings2,
  Activity, Wrench, FileText, ChevronRight, ExternalLink,
  AlertTriangle, CheckCircle2, Clock, Network
} from 'lucide-react';

const statusColors: Record<string, string> = {
  ACTIVE: 'badge-success', STANDBY: 'badge-warning', PLANNED: 'badge-brand',
  OUT_OF_SERVICE: 'badge-danger', DECOMMISSIONED: 'badge-neutral', DISPOSED: 'badge-neutral',
};

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

      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600/30 to-purple-600/30 border border-brand-500/20 flex items-center justify-center">
              <Box className="w-7 h-7 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{asset.name}</h1>
                <span className={`badge ${statusColors[asset.status] || 'badge-neutral'}`}>
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
          </div>
        </div>
      </div>

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

          {/* Lifecycle Events */}
          {lifecycle.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Lifecycle History</h3>
              <div className="space-y-3">
                {lifecycle.map((event: any) => (
                  <div key={event.id} className="flex items-start gap-3 py-2 border-b border-slate-800/30 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-white">{event.event}</p>
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
    </div>
  );
}
