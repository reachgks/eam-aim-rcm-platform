'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Building2, Layers, Link2 } from 'lucide-react';

export default function BimPage() {
  const { data: models } = useQuery({ queryKey: ['bim-models'], queryFn: () => api.get('/api/v1/bim/models') });
  const modelList = models?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">BIM Integration</h1>
      <p className="text-slate-400">IFC model management & element-asset linking</p>
      <div className="stat-card border-brand-500/20 w-fit"><Building2 className="w-5 h-5 text-brand-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{modelList.length}</p><p className="text-sm text-slate-400">IFC Models</p></div></div>
      {modelList.length === 0 ? (<div className="glass-card p-12 text-center"><Building2 className="w-10 h-10 mx-auto mb-3 text-slate-600" /><p className="text-white font-medium">No BIM models uploaded</p></div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{modelList.map((m: any) => (
          <div key={m.id} className="glass-card p-5 hover:border-brand-500/20 transition-all">
            <div className="flex items-center gap-3 mb-3"><div className="p-2 rounded-lg bg-brand-500/10"><Building2 className="w-5 h-5 text-brand-400" /></div><div><h3 className="text-sm font-semibold text-white">{m.name || m.fileName}</h3><p className="text-xs text-slate-500">{m.fileSize ? `${(m.fileSize / 1024 / 1024).toFixed(1)} MB` : '—'}</p></div></div>
            <div className="space-y-1 text-xs text-slate-400"><p>Format: <span className="text-white">{m.format || 'IFC'}</span></p><p>Created: <span className="text-white">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}</span></p></div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
