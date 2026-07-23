'use client';
import { useAuthStore } from '@/stores/auth.store';
import { Settings, User, Shield, Building2 } from 'lucide-react';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><User className="w-4 h-4 text-brand-400" /> Profile</h3>
        <div className="space-y-3">
          {[{ l: 'Name', v: `${user?.firstName} ${user?.lastName}` }, { l: 'Email', v: user?.email }, { l: 'Role', v: user?.role }, { l: 'Tenant ID', v: user?.tenantId }].map(({ l, v }) => (
            <div key={l} className="flex justify-between py-2 border-b border-slate-800/30"><span className="text-sm text-slate-500">{l}</span><span className="text-sm text-white">{v || '—'}</span></div>
          ))}
        </div>
      </div>
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-brand-400" /> Permissions</h3>
        <div className="flex flex-wrap gap-2">{user?.permissions?.map((p: string) => (<span key={p} className="badge badge-brand text-xs">{p}</span>)) || <p className="text-sm text-slate-500">No permissions loaded</p>}</div>
      </div>
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-brand-400" /> System</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-800/30"><span className="text-slate-500">Platform Version</span><span className="text-white">0.1.0</span></div>
          <div className="flex justify-between py-2 border-b border-slate-800/30"><span className="text-slate-500">API URL</span><span className="text-brand-400 font-mono text-xs">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}</span></div>
          <div className="flex justify-between py-2"><span className="text-slate-500">Environment</span><span className="text-white">{process.env.NODE_ENV || 'development'}</span></div>
        </div>
      </div>
    </div>
  );
}
