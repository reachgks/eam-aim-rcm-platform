'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Save, Loader2, CheckCircle2 } from 'lucide-react';

export default function NewAssetPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    tagNumber: '',
    name: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    status: 'PLANNED',
    criticality: 'C',
    installDate: '',
    commissionDate: '',
    description: '',
  });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/api/v1/assets', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/assets/${res.data.id}`), 1200);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      installDate: form.installDate || undefined,
      commissionDate: form.commissionDate || undefined,
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Asset Registered</h2>
        <p className="text-slate-400 mt-1">Redirecting to asset detail...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/assets" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Assets
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">Register New Asset</span>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-6">Register New Asset</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Tag Number *</label>
              <input
                value={form.tagNumber}
                onChange={e => update('tagNumber', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg"
                placeholder="e.g., P-101-A"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Asset Name *</label>
              <input
                value={form.name}
                onChange={e => update('name', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg"
                placeholder="e.g., Centrifugal Pump"
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Manufacturer</label>
              <input
                value={form.manufacturer}
                onChange={e => update('manufacturer', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg"
                placeholder="e.g., Sulzer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Model</label>
              <input
                value={form.model}
                onChange={e => update('model', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg"
                placeholder="e.g., CPE 65-200"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Serial Number</label>
              <input
                value={form.serialNumber}
                onChange={e => update('serialNumber', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg font-mono"
                placeholder="SN-12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Status *</label>
              <select
                value={form.status}
                onChange={e => update('status', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg"
              >
                {['PLANNED', 'ORDERED', 'RECEIVED', 'INSTALLED', 'COMMISSIONING', 'ACTIVE', 'STANDBY'].map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Criticality *</label>
              <select
                value={form.criticality}
                onChange={e => update('criticality', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg"
              >
                <option value="A">A — Critical</option>
                <option value="B">B — Important</option>
                <option value="C">C — Standard</option>
                <option value="D">D — Non-critical</option>
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Install Date</label>
              <input
                type="date"
                value={form.installDate}
                onChange={e => update('installDate', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Commission Date</label>
              <input
                type="date"
                value={form.commissionDate}
                onChange={e => update('commissionDate', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/50">
            <Link href="/dashboard/assets" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Register Asset</>
              )}
            </button>
          </div>

          {mutation.isError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {(mutation.error as any)?.message || 'Failed to create asset'}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
