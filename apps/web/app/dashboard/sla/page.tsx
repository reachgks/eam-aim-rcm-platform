'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Timer, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SlaPage() {
  const { data: summary } = useQuery({ queryKey: ['sla-summary'], queryFn: () => api.get('/api/v1/sla/summary') });
  const { data: slas } = useQuery({ queryKey: ['sla-list'], queryFn: () => api.get('/api/v1/sla') });
  const { data: breaches } = useQuery({ queryKey: ['sla-breaches'], queryFn: () => api.get('/api/v1/sla/breaches?limit=10') });
  const d = summary?.data || {};
  const slaList = slas?.data || [];
  const breachList = breaches?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">SLA Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card border-brand-500/20"><Timer className="w-5 h-5 text-brand-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{d.totalSlas || 0}</p><p className="text-sm text-slate-400">Total SLAs</p></div></div>
        <div className="stat-card border-rose-500/20"><AlertTriangle className="w-5 h-5 text-rose-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{d.totalBreaches || 0}</p><p className="text-sm text-slate-400">Total Breaches</p></div></div>
        <div className="stat-card border-emerald-500/20"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{d.activeTracking || 0}</p><p className="text-sm text-slate-400">Active Tracking</p></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">SLA Definitions</h3>
          {slaList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No SLAs defined</p> : (
            <div className="space-y-2">{slaList.slice(0, 8).map((s: any) => (
              <div key={s.id} className="p-3 rounded-lg bg-slate-800/30 flex items-center justify-between">
                <div><p className="text-sm text-white">{s.name}</p><p className="text-xs text-slate-500">{s.description?.slice(0, 50) || '—'}</p></div>
                <span className={`badge ${s.isActive ? 'badge-success' : 'badge-neutral'}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            ))}</div>
          )}
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Breaches</h3>
          {breachList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No breaches</p> : (
            <div className="space-y-2">{breachList.map((b: any) => (
              <div key={b.id} className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                <p className="text-sm text-white">{b.breachType || 'SLA Breach'}</p>
                <p className="text-xs text-slate-500">{b.createdAt ? new Date(b.createdAt).toLocaleString() : '—'}</p>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  );
}
