'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

export default function SafetyPage() {
  const { data: permits } = useQuery({ queryKey: ['permits'], queryFn: () => api.get('/api/v1/safety/permits?limit=20') });
  const { data: permitTypes } = useQuery({ queryKey: ['permit-types'], queryFn: () => api.get('/api/v1/safety/permit-types') });
  const { data: observations } = useQuery({ queryKey: ['observations'], queryFn: () => api.get('/api/v1/safety/observations?limit=10') });

  const permitList = permits?.data || [];
  const typeList = permitTypes?.data || [];
  const obsList = observations?.data || [];
  const statusColors: Record<string, string> = { ACTIVE: 'badge-success', ISSUED: 'badge-info', EXPIRED: 'badge-danger', CLOSED: 'badge-neutral', SUSPENDED: 'badge-warning' };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Safety & Permits</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card border-emerald-500/20">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div className="mt-2"><p className="text-2xl font-bold text-white">{permitList.length}</p><p className="text-sm text-slate-400">Work Permits</p></div>
        </div>
        <div className="stat-card border-brand-500/20">
          <Lock className="w-5 h-5 text-brand-400" />
          <div className="mt-2"><p className="text-2xl font-bold text-white">{typeList.length}</p><p className="text-sm text-slate-400">Permit Types</p></div>
        </div>
        <div className="stat-card border-amber-500/20">
          <Eye className="w-5 h-5 text-amber-400" />
          <div className="mt-2"><p className="text-2xl font-bold text-white">{obsList.length}</p><p className="text-sm text-slate-400">Observations</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Permits</h3>
          {permitList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No permits</p> : (
            <div className="space-y-2">
              {permitList.slice(0, 8).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                  <div>
                    <p className="text-sm text-white">{p.permitNumber}</p>
                    <p className="text-xs text-slate-500">{p.validFrom ? new Date(p.validFrom).toLocaleDateString() : '—'}</p>
                  </div>
                  <span className={`badge ${statusColors[p.status] || 'badge-neutral'}`}>{p.status?.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Safety Observations</h3>
          {obsList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No observations</p> : (
            <div className="space-y-2">
              {obsList.map((o: any) => (
                <div key={o.id} className="p-3 rounded-lg bg-slate-800/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="badge badge-neutral">{o.observationType}</span>
                    <span className={`badge ${o.severity === 'HIGH' ? 'badge-danger' : o.severity === 'MEDIUM' ? 'badge-warning' : 'badge-info'}`}>{o.severity}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">{o.description?.slice(0, 100) || '—'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
