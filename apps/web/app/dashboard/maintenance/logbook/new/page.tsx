'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, ClipboardList, Save, Loader2, CheckCircle2,
} from 'lucide-react';

const typeOptions = [
  { value: 'BREAKDOWN', label: '🔴 Breakdown Maintenance', desc: 'Unplanned equipment failure' },
  { value: 'PREVENTIVE', label: '🟢 Preventive Maintenance', desc: 'Scheduled PM task' },
  { value: 'SCHEDULED', label: '🔵 Scheduled Maintenance', desc: 'Planned maintenance activity' },
  { value: 'INSPECTION', label: '🔍 Inspection', desc: 'Routine inspection' },
  { value: 'EMERGENCY', label: '🚨 Emergency', desc: 'Emergency repair' },
];

const shiftOptions = [
  { value: 'MORNING', label: '☀️ Morning Shift (06:00–14:00)' },
  { value: 'AFTERNOON', label: '🌅 Afternoon Shift (14:00–22:00)' },
  { value: 'NIGHT', label: '🌙 Night Shift (22:00–06:00)' },
];

export default function NewLogEntryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    shiftDate: new Date().toISOString().split('T')[0],
    shiftType: 'MORNING',
    logEntryType: '',
    assetId: '',
    functionalLocationId: '',
    description: '',
    actionTaken: '',
    partsUsed: '',
    downtimeMinutes: '',
    attendedBy: '',
    startedAt: '',
    completedAt: '',
    status: 'OPEN',
    remarks: '',
    workOrderId: '',
  });

  const { data: assetsData } = useQuery({
    queryKey: ['asset-simple-list'],
    queryFn: () => api.get<{ data: any[] }>('/api/v1/assets/list-simple'),
  });

  const { data: locationsData } = useQuery({
    queryKey: ['asset-locations'],
    queryFn: () => api.get<{ data: any[] }>('/api/v1/assets/locations'),
  });

  const assets = assetsData?.data || [];
  const locations = locationsData?.data || [];
  const plants = locations.filter((l: any) => l.locationType === 'SITE');
  const sections = locations.filter((l: any) => ['BUILDING', 'FLOOR', 'ZONE', 'ROOM'].includes(l.locationType));

  const mutation = useMutation({
    mutationFn: () => api.post('/api/v1/shift-logbook', {
      ...form,
      downtimeMinutes: form.downtimeMinutes ? Number(form.downtimeMinutes) : undefined,
      startedAt: form.startedAt || undefined,
      completedAt: form.completedAt || undefined,
      assetId: form.assetId || undefined,
      functionalLocationId: form.functionalLocationId || undefined,
      workOrderId: form.workOrderId || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-logbook'] });
      router.push('/dashboard/maintenance/logbook');
    },
  });

  const updateField = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/maintenance" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Maintenance
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <Link href="/dashboard/maintenance/logbook" className="text-slate-500 hover:text-white transition-colors">
          Logbook
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">New Entry</span>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <ClipboardList className="w-6 h-6 text-brand-400" /> New Log Entry
      </h1>

      {/* Form */}
      <div className="glass-card p-6 space-y-6">
        {/* Shift Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800/50 pb-2">Shift Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Shift Date *</label>
              <input type="date" value={form.shiftDate} onChange={e => updateField('shiftDate', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Shift *</label>
              <select value={form.shiftType} onChange={e => updateField('shiftType', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg">
                {shiftOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Maintenance Type */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800/50 pb-2">Maintenance Type *</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {typeOptions.map(t => (
              <button key={t.value} onClick={() => updateField('logEntryType', t.value)}
                className={`p-3 rounded-lg text-left border transition-all ${
                  form.logEntryType === t.value
                    ? 'bg-brand-500/15 border-brand-500/40 ring-1 ring-brand-500/30'
                    : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50'
                }`}>
                <p className="text-sm text-white font-medium">{t.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Asset & Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800/50 pb-2">Asset & Location</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Machine / Asset</label>
              <select value={form.assetId} onChange={e => updateField('assetId', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg">
                <option value="">— Select machine —</option>
                {assets.map((a: any) => <option key={a.id} value={a.id}>[{a.tagNumber}] {a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Location</label>
              <select value={form.functionalLocationId} onChange={e => updateField('functionalLocationId', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg">
                <option value="">— Select location —</option>
                {locations.map((l: any) => <option key={l.id} value={l.id}>[{l.locationType}] {l.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800/50 pb-2">Details</h3>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Description *</label>
            <textarea value={form.description} onChange={e => updateField('description', e.target.value)}
              rows={3} placeholder="Describe the maintenance activity..."
              className="input-field py-2.5 text-sm rounded-lg" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Action Taken</label>
            <textarea value={form.actionTaken} onChange={e => updateField('actionTaken', e.target.value)}
              rows={2} placeholder="What was done to resolve the issue..."
              className="input-field py-2.5 text-sm rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Parts Used</label>
              <input type="text" value={form.partsUsed} onChange={e => updateField('partsUsed', e.target.value)}
                placeholder="e.g., Bearing SKF-6205" className="input-field py-2.5 text-sm rounded-lg" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Downtime (minutes)</label>
              <input type="number" value={form.downtimeMinutes} onChange={e => updateField('downtimeMinutes', e.target.value)}
                placeholder="0" className="input-field py-2.5 text-sm rounded-lg" />
            </div>
          </div>
        </div>

        {/* Time & Personnel */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800/50 pb-2">Time & Personnel</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Start Time</label>
              <input type="datetime-local" value={form.startedAt} onChange={e => updateField('startedAt', e.target.value)}
                className="input-field py-2.5 text-xs rounded-lg" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">End Time</label>
              <input type="datetime-local" value={form.completedAt} onChange={e => updateField('completedAt', e.target.value)}
                className="input-field py-2.5 text-xs rounded-lg" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Technician / Attended By</label>
              <input type="text" value={form.attendedBy} onChange={e => updateField('attendedBy', e.target.value)}
                placeholder="Name / team" className="input-field py-2.5 text-sm rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Status</label>
              <select value={form.status} onChange={e => updateField('status', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg">
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="DEFERRED">Deferred</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Remarks</label>
              <input type="text" value={form.remarks} onChange={e => updateField('remarks', e.target.value)}
                placeholder="Additional notes..." className="input-field py-2.5 text-sm rounded-lg" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
          <Link href="/dashboard/maintenance/logbook" className="btn-secondary text-sm">Cancel</Link>
          <button onClick={() => mutation.mutate()}
            disabled={!form.logEntryType || !form.description || mutation.isPending}
            className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-40">
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Log Entry
          </button>
        </div>

        {mutation.isError && (
          <p className="text-sm text-rose-400 mt-2">Error saving entry. Please try again.</p>
        )}
      </div>
    </div>
  );
}
