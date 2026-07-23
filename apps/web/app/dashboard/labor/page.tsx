'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, Hammer, Clock, Award } from 'lucide-react';

export default function LaborPage() {
  const { data: crafts } = useQuery({ queryKey: ['crafts'], queryFn: () => api.get('/api/v1/labor/crafts') });
  const { data: crews } = useQuery({ queryKey: ['crews'], queryFn: () => api.get('/api/v1/labor/crews') });
  const { data: shifts } = useQuery({ queryKey: ['shifts'], queryFn: () => api.get('/api/v1/labor/shifts') });
  const { data: certs } = useQuery({ queryKey: ['certs'], queryFn: () => api.get('/api/v1/labor/certifications') });
  const craftList = crafts?.data || []; const crewList = crews?.data || []; const shiftList = shifts?.data || []; const certList = certs?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Labor & Workforce</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card border-brand-500/20"><Hammer className="w-5 h-5 text-brand-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{craftList.length}</p><p className="text-sm text-slate-400">Crafts</p></div></div>
        <div className="stat-card border-sky-500/20"><Users className="w-5 h-5 text-sky-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{crewList.length}</p><p className="text-sm text-slate-400">Crews</p></div></div>
        <div className="stat-card border-amber-500/20"><Clock className="w-5 h-5 text-amber-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{shiftList.length}</p><p className="text-sm text-slate-400">Shifts</p></div></div>
        <div className="stat-card border-emerald-500/20"><Award className="w-5 h-5 text-emerald-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{certList.length}</p><p className="text-sm text-slate-400">Certifications</p></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5"><h3 className="text-sm font-semibold text-white mb-4">Crafts</h3>{craftList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No crafts</p> : (<div className="space-y-2">{craftList.map((c: any) => (<div key={c.id} className="p-3 rounded-lg bg-slate-800/30 flex justify-between"><p className="text-sm text-white">{c.name}</p><span className="badge badge-neutral">{c.code || '—'}</span></div>))}</div>)}</div>
        <div className="glass-card p-5"><h3 className="text-sm font-semibold text-white mb-4">Crews</h3>{crewList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No crews</p> : (<div className="space-y-2">{crewList.map((c: any) => (<div key={c.id} className="p-3 rounded-lg bg-slate-800/30"><p className="text-sm text-white">{c.name}</p><p className="text-xs text-slate-500">{c.description || '—'}</p></div>))}</div>)}</div>
      </div>
    </div>
  );
}
