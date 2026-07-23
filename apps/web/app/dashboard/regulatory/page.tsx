'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { FileCheck, AlertTriangle, ClipboardCheck, BookOpen } from 'lucide-react';

export default function RegulatoryPage() {
  const { data: dashboard } = useQuery({ queryKey: ['reg-dashboard'], queryFn: () => api.get('/api/v1/regulatory/dashboard') });
  const { data: regulations } = useQuery({ queryKey: ['regulations'], queryFn: () => api.get('/api/v1/regulatory/regulations') });
  const { data: violations } = useQuery({ queryKey: ['violations'], queryFn: () => api.get('/api/v1/regulatory/violations') });
  const { data: inspections } = useQuery({ queryKey: ['inspections'], queryFn: () => api.get('/api/v1/regulatory/inspections?limit=10') });

  const d = dashboard?.data || {};
  const regList = regulations?.data || [];
  const violList = violations?.data || [];
  const inspList = inspections?.data || [];
  const complianceRate = d.totalRequirements > 0 ? Math.round((d.passedInspections / d.totalRequirements) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Regulatory Compliance</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card border-emerald-500/20">
          <div className="flex items-center justify-between"><FileCheck className="w-5 h-5 text-emerald-400" /></div>
          <div className="mt-2"><p className="text-3xl font-bold text-white">{complianceRate}%</p><p className="text-sm text-slate-400">Compliance Rate</p></div>
          <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${complianceRate}%` }} /></div>
        </div>
        <div className="stat-card border-brand-500/20">
          <BookOpen className="w-5 h-5 text-brand-400" />
          <div className="mt-2"><p className="text-2xl font-bold text-white">{d.totalRequirements || 0}</p><p className="text-sm text-slate-400">Requirements</p></div>
        </div>
        <div className="stat-card border-rose-500/20">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <div className="mt-2"><p className="text-2xl font-bold text-white">{d.openViolations || 0}</p><p className="text-sm text-slate-400">Open Violations</p></div>
        </div>
        <div className="stat-card border-amber-500/20">
          <ClipboardCheck className="w-5 h-5 text-amber-400" />
          <div className="mt-2"><p className="text-2xl font-bold text-white">{d.openCorrectiveActions || 0}</p><p className="text-sm text-slate-400">Open CAPAs</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regulations */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Regulations ({regList.length})</h3>
          {regList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">None</p> : (
            <div className="space-y-2">{regList.slice(0, 6).map((r: any) => (
              <div key={r.id} className="p-3 rounded-lg bg-slate-800/30">
                <p className="text-sm text-white">{r.name}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{r.code} · {r.authority}</p>
              </div>
            ))}</div>
          )}
        </div>

        {/* Violations */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Violations</h3>
          {violList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No violations</p> : (
            <div className="space-y-2">{violList.slice(0, 6).map((v: any) => (
              <div key={v.id} className="p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center justify-between mb-1">
                  <span className={`badge ${v.severity === 'CRITICAL' ? 'badge-danger' : v.severity === 'MAJOR' ? 'badge-warning' : 'badge-info'}`}>{v.severity}</span>
                  <span className={`badge ${v.status === 'OPEN' ? 'badge-danger' : 'badge-success'}`}>{v.status}</span>
                </div>
                <p className="text-sm text-slate-300 mt-1">{v.description?.slice(0, 80) || '—'}</p>
              </div>
            ))}</div>
          )}
        </div>

        {/* Recent Inspections */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Inspections</h3>
          {inspList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No inspections</p> : (
            <div className="space-y-2">{inspList.slice(0, 6).map((insp: any) => (
              <div key={insp.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <div>
                  <p className="text-sm text-white">{insp.inspectorName || 'Inspector'}</p>
                  <p className="text-xs text-slate-500">{insp.inspectionDate ? new Date(insp.inspectionDate).toLocaleDateString() : '—'}</p>
                </div>
                <span className={`badge ${insp.result === 'PASS' ? 'badge-success' : insp.result === 'FAIL' ? 'badge-danger' : 'badge-warning'}`}>{insp.result || 'PENDING'}</span>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  );
}
