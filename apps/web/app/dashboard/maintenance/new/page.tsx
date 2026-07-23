'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Save, Loader2, CheckCircle2 } from 'lucide-react';

export default function NewWorkOrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    type: 'CORRECTIVE',
    priority: 'MEDIUM',
    description: '',
    assetId: '',
    assignedTo: '',
    scheduledStart: '',
    scheduledEnd: '',
    estimatedHours: '',
    estimatedCost: '',
  });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/api/v1/maintenance/work-orders', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      queryClient.invalidateQueries({ queryKey: ['wo-summary'] });
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/maintenance/${res.data.id}`), 1200);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : undefined,
      estimatedCost: form.estimatedCost ? Number(form.estimatedCost) : undefined,
      scheduledStart: form.scheduledStart || undefined,
      scheduledEnd: form.scheduledEnd || undefined,
      assetId: form.assetId || undefined,
      assignedTo: form.assignedTo || undefined,
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Work Order Created</h2>
        <p className="text-slate-400 mt-1">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/maintenance" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Maintenance
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">New Work Order</span>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-6">Create Work Order</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type + Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Type *</label>
              <select value={form.type} onChange={e => update('type', e.target.value)} className="input-field py-2.5 text-sm rounded-lg">
                {['PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'EMERGENCY', 'CONDITION_BASED', 'PROJECT'].map(t => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority *</label>
              <select value={form.priority} onChange={e => update('priority', e.target.value)} className="input-field py-2.5 text-sm rounded-lg">
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              className="input-field py-2.5 text-sm rounded-lg min-h-[100px] resize-y"
              placeholder="Describe the work to be done..."
              required
            />
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Scheduled Start</label>
              <input type="datetime-local" value={form.scheduledStart} onChange={e => update('scheduledStart', e.target.value)} className="input-field py-2.5 text-sm rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Scheduled End</label>
              <input type="datetime-local" value={form.scheduledEnd} onChange={e => update('scheduledEnd', e.target.value)} className="input-field py-2.5 text-sm rounded-lg" />
            </div>
          </div>

          {/* Estimates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Estimated Hours</label>
              <input type="number" step="0.5" min="0" value={form.estimatedHours} onChange={e => update('estimatedHours', e.target.value)} className="input-field py-2.5 text-sm rounded-lg" placeholder="e.g., 4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Estimated Cost ($)</label>
              <input type="number" step="0.01" min="0" value={form.estimatedCost} onChange={e => update('estimatedCost', e.target.value)} className="input-field py-2.5 text-sm rounded-lg" placeholder="e.g., 500" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/50">
            <Link href="/dashboard/maintenance" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
              ) : (
                <><Save className="w-4 h-4" /> Create Work Order</>
              )}
            </button>
          </div>

          {mutation.isError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {(mutation.error as any)?.message || 'Failed to create work order'}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
