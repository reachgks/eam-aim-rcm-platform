'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Briefcase, GitBranch } from 'lucide-react';

export default function ProjectsPage() {
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: () => api.get('/api/v1/projects') });
  const { data: moc } = useQuery({ queryKey: ['moc'], queryFn: () => api.get('/api/v1/projects/moc') });
  const projectList = projects?.data || []; const mocList = moc?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Capital Projects & MOC</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stat-card border-brand-500/20"><Briefcase className="w-5 h-5 text-brand-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{projectList.length}</p><p className="text-sm text-slate-400">Projects</p></div></div>
        <div className="stat-card border-amber-500/20"><GitBranch className="w-5 h-5 text-amber-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{mocList.length}</p><p className="text-sm text-slate-400">Management of Change</p></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5"><h3 className="text-sm font-semibold text-white mb-4">Projects</h3>{projectList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No projects</p> : (<div className="space-y-2">{projectList.map((p: any) => (<div key={p.id} className="p-3 rounded-lg bg-slate-800/30"><div className="flex justify-between mb-1"><p className="text-sm text-white">{p.name || p.projectCode}</p><span className={`badge ${p.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`}>{p.status}</span></div><p className="text-xs text-slate-500">{p.description?.slice(0, 80) || '—'}</p></div>))}</div>)}</div>
        <div className="glass-card p-5"><h3 className="text-sm font-semibold text-white mb-4">MOC Requests</h3>{mocList.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">No MOC requests</p> : (<div className="space-y-2">{mocList.map((m: any) => (<div key={m.id} className="p-3 rounded-lg bg-slate-800/30"><p className="text-sm text-white">{m.title || m.mocNumber}</p><p className="text-xs text-slate-500">{m.changeType || '—'} · {m.status}</p></div>))}</div>)}</div>
      </div>
    </div>
  );
}
