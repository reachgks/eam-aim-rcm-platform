'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { BarChart3, AlertTriangle, Activity, Cpu, Target, TrendingUp } from 'lucide-react';

export default function RcmPage() {
  const { data: failureEvents } = useQuery({ queryKey: ['failure-events'], queryFn: () => api.get('/api/v1/rcm/failure-events') });
  const { data: decisions } = useQuery({ queryKey: ['rcm-decisions'], queryFn: () => api.get('/api/v1/rcm/decisions') });
  const { data: rca } = useQuery({ queryKey: ['rca'], queryFn: () => api.get('/api/v1/rcm/rca') });
  const { data: weibull } = useQuery({ queryKey: ['weibull'], queryFn: () => api.get('/api/v1/rcm/weibull') });

  const failures = failureEvents?.data || [];
  const decisionList = decisions?.data || [];
  const rcaList = rca?.data || [];
  const weibullList = weibull?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Reliability-Centered Maintenance</h1>
      <p className="text-slate-400">FMEA, failure analysis, Weibull, and RCM decisions</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card border-rose-500/20"><AlertTriangle className="w-5 h-5 text-rose-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{failures.length}</p><p className="text-sm text-slate-400">Failure Events</p></div></div>
        <div className="stat-card border-brand-500/20"><Target className="w-5 h-5 text-brand-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{decisionList.length}</p><p className="text-sm text-slate-400">RCM Decisions</p></div></div>
        <div className="stat-card border-amber-500/20"><Activity className="w-5 h-5 text-amber-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{rcaList.length}</p><p className="text-sm text-slate-400">Root Cause Analyses</p></div></div>
        <div className="stat-card border-purple-500/20"><TrendingUp className="w-5 h-5 text-purple-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{weibullList.length}</p><p className="text-sm text-slate-400">Weibull Analyses</p></div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Failure Events</h3>
          {failures.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No failure events recorded</p> : (
            <div className="space-y-2">{failures.slice(0, 8).map((f: any) => (
              <div key={f.id} className="p-3 rounded-lg bg-slate-800/30 flex items-center justify-between">
                <div><p className="text-sm text-white">{f.rootCause || 'Failure event'}</p><p className="text-xs text-slate-500">{f.failureDate ? new Date(f.failureDate).toLocaleDateString() : '—'} · Downtime: {f.downtime || '—'} hrs</p></div>
              </div>
            ))}</div>
          )}
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">RCM Decisions</h3>
          {decisionList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No decisions</p> : (
            <div className="space-y-2">{decisionList.slice(0, 8).map((d: any) => (
              <div key={d.id} className="p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center justify-between mb-1"><span className="badge badge-brand">{d.taskType}</span><span className="text-xs text-slate-500">Every {d.interval}</span></div>
                <p className="text-sm text-slate-300">{d.justification?.slice(0, 80) || '—'}</p>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  );
}
