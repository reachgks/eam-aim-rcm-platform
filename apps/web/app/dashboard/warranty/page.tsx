'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { BadgeCheck, FileText, AlertCircle } from 'lucide-react';

export default function WarrantyPage() {
  const { data: terms } = useQuery({ queryKey: ['warranty-terms'], queryFn: () => api.get('/api/v1/warranty/terms') });
  const { data: coverage } = useQuery({ queryKey: ['warranty-coverage'], queryFn: () => api.get('/api/v1/warranty/coverage') });
  const { data: claims } = useQuery({ queryKey: ['warranty-claims'], queryFn: () => api.get('/api/v1/warranty/claims?limit=20') });
  const termList = terms?.data || []; const coverageList = coverage?.data || []; const claimList = claims?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Warranty Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card border-brand-500/20"><BadgeCheck className="w-5 h-5 text-brand-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{termList.length}</p><p className="text-sm text-slate-400">Warranty Terms</p></div></div>
        <div className="stat-card border-emerald-500/20"><FileText className="w-5 h-5 text-emerald-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{coverageList.length}</p><p className="text-sm text-slate-400">Active Coverage</p></div></div>
        <div className="stat-card border-amber-500/20"><AlertCircle className="w-5 h-5 text-amber-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{claimList.length}</p><p className="text-sm text-slate-400">Claims</p></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5"><h3 className="text-sm font-semibold text-white mb-4">Warranty Terms</h3>{termList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No terms</p> : (<div className="space-y-2">{termList.map((t: any) => (<div key={t.id} className="p-3 rounded-lg bg-slate-800/30"><p className="text-sm text-white">{t.name || t.warrantyType}</p><p className="text-xs text-slate-500">{t.durationMonths ? `${t.durationMonths} months` : '—'}</p></div>))}</div>)}</div>
        <div className="glass-card p-5"><h3 className="text-sm font-semibold text-white mb-4">Recent Claims</h3>{claimList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No claims</p> : (<div className="space-y-2">{claimList.map((c: any) => (<div key={c.id} className="p-3 rounded-lg bg-slate-800/30 flex justify-between"><div><p className="text-sm text-white">{c.claimNumber || c.description?.slice(0, 40) || 'Claim'}</p><p className="text-xs text-slate-500">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</p></div><span className={`badge ${c.status === 'APPROVED' ? 'badge-success' : c.status === 'DENIED' ? 'badge-danger' : 'badge-warning'}`}>{c.status || 'PENDING'}</span></div>))}</div>)}</div>
      </div>
    </div>
  );
}
