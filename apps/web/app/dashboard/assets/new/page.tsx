'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, Save, Loader2, CheckCircle2, Plus, Trash2,
  MapPin, GitBranch, Radio, ClipboardCheck, ChevronLeft, Shield, AlertTriangle,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════

interface SensorEntry {
  sensorCode: string;
  name: string;
  sensorType: string;
  unit: string;
  minValue: string;
  maxValue: string;
  alarmLow: string;
  alarmHigh: string;
}

const SENSOR_TYPES = [
  'TEMPERATURE', 'PRESSURE', 'VIBRATION', 'FLOW', 'LEVEL',
  'SPEED', 'CURRENT', 'VOLTAGE', 'HUMIDITY', 'CUSTOM',
];

const SENSOR_UNITS: Record<string, string> = {
  TEMPERATURE: '°C', PRESSURE: 'bar', VIBRATION: 'mm/s', FLOW: 'm³/h',
  LEVEL: 'm', SPEED: 'RPM', CURRENT: 'A', VOLTAGE: 'V', HUMIDITY: '%', CUSTOM: '',
};

const STEPS = [
  { label: 'Basic Info', icon: ClipboardCheck },
  { label: 'Location & Hierarchy', icon: MapPin },
  { label: 'Telemetry Sensors', icon: Radio },
  { label: 'Review & Submit', icon: Shield },
];

const emptySensor = (): SensorEntry => ({
  sensorCode: '', name: '', sensorType: 'TEMPERATURE', unit: '°C',
  minValue: '', maxValue: '', alarmLow: '', alarmHigh: '',
});

// ═══════════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function NewAssetPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');

  // ── Form State ──
  const [form, setForm] = useState({
    tagNumber: '', name: '', description: '', manufacturer: '', model: '',
    serialNumber: '', status: 'PLANNED', criticality: 'C',
    installDate: '', commissionDate: '',
    functionalLocationId: '', assetTypeId: '', parentAssetId: '',
  });
  const [sensors, setSensors] = useState<SensorEntry[]>([]);

  // ── API Queries ──
  const { data: locationsData } = useQuery({
    queryKey: ['asset-locations'],
    queryFn: () => api.get<{ data: any[] }>('/api/v1/assets/locations'),
  });
  const { data: typesData } = useQuery({
    queryKey: ['asset-types'],
    queryFn: () => api.get<{ data: any[] }>('/api/v1/assets/types'),
  });
  const { data: assetsData } = useQuery({
    queryKey: ['asset-simple-list'],
    queryFn: () => api.get<{ data: any[] }>('/api/v1/assets/list-simple'),
  });

  const locations = locationsData?.data || [];
  const assetTypes = typesData?.data || [];
  const parentAssets = assetsData?.data || [];

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  // ── Mutation ──
  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/api/v1/assets', data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/assets/${res.data.id}`), 1500);
    },
  });

  const handleSubmit = () => {
    const validSensors = sensors.filter(s => s.sensorCode && s.name);
    mutation.mutate({
      ...form,
      installDate: form.installDate || undefined,
      commissionDate: form.commissionDate || undefined,
      functionalLocationId: form.functionalLocationId || undefined,
      assetTypeId: form.assetTypeId || undefined,
      parentAssetId: form.parentAssetId || undefined,
      sensors: validSensors.length > 0 ? validSensors.map(s => ({
        sensorCode: s.sensorCode, name: s.name, sensorType: s.sensorType,
        unit: s.unit || undefined,
        minValue: s.minValue || undefined, maxValue: s.maxValue || undefined,
        alarmLow: s.alarmLow || undefined, alarmHigh: s.alarmHigh || undefined,
      })) : undefined,
    });
  };

  // ── Navigation ──
  const goNext = () => { setSlideDir('left'); setStep(s => Math.min(s + 1, 3)); };
  const goPrev = () => { setSlideDir('right'); setStep(s => Math.max(s - 1, 0)); };

  const canProceed = step === 0 ? form.tagNumber && form.name : true;

  // ── Helpers ──
  const selectedLocation = locations.find((l: any) => l.id === form.functionalLocationId);
  const selectedType = assetTypes.find((t: any) => t.id === form.assetTypeId);
  const selectedParent = parentAssets.find((a: any) => a.id === form.parentAssetId);
  const needsApproval = form.criticality === 'A' || form.criticality === 'B';

  const critLabels: Record<string, { label: string; color: string }> = {
    A: { label: 'Critical', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' },
    B: { label: 'Important', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
    C: { label: 'Standard', color: 'text-sky-400 bg-sky-500/15 border-sky-500/30' },
    D: { label: 'Non-critical', color: 'text-slate-400 bg-slate-500/15 border-slate-500/30' },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SUCCESS STATE
  // ═══════════════════════════════════════════════════════════════════════════
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-5 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Asset Registered Successfully</h2>
        <p className="text-slate-400 mt-2">
          {needsApproval ? 'Sent for approval. Redirecting...' : 'Redirecting to asset detail...'}
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/assets" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Assets
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">Register New Asset</span>
      </div>

      {/* ── Step Indicator ── */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-3 flex-1">
              <button
                onClick={() => { setSlideDir(i > step ? 'left' : 'right'); setStep(i); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                  i === step
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    : i < step
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <s.icon className="w-4 h-4" />
                <span className="hidden md:inline">{s.label}</span>
                <span className="md:hidden">{i + 1}</span>
              </button>
              {i < 3 && <div className={`flex-1 h-px ${i < step ? 'bg-emerald-500/40' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Step Content ── */}
      <div className="glass-card p-6 min-h-[420px]">
        {/* ─── STEP 1: Basic Info ─── */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-brand-400" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Tag Number *</label>
                <input value={form.tagNumber} onChange={e => update('tagNumber', e.target.value)}
                  className="input-field py-2.5 text-sm rounded-lg" placeholder="e.g., P-101-A" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Asset Name *</label>
                <input value={form.name} onChange={e => update('name', e.target.value)}
                  className="input-field py-2.5 text-sm rounded-lg" placeholder="e.g., Centrifugal Pump" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Manufacturer</label>
                <input value={form.manufacturer} onChange={e => update('manufacturer', e.target.value)}
                  className="input-field py-2.5 text-sm rounded-lg" placeholder="e.g., Sulzer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Model</label>
                <input value={form.model} onChange={e => update('model', e.target.value)}
                  className="input-field py-2.5 text-sm rounded-lg" placeholder="e.g., CPE 65-200" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Serial Number</label>
                <input value={form.serialNumber} onChange={e => update('serialNumber', e.target.value)}
                  className="input-field py-2.5 text-sm rounded-lg font-mono" placeholder="SN-12345" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Status *</label>
                <select value={form.status} onChange={e => update('status', e.target.value)}
                  className="input-field py-2.5 text-sm rounded-lg">
                  {['PLANNED', 'ORDERED', 'RECEIVED', 'INSTALLED', 'COMMISSIONING', 'ACTIVE', 'STANDBY'].map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Criticality *</label>
                <select value={form.criticality} onChange={e => update('criticality', e.target.value)}
                  className="input-field py-2.5 text-sm rounded-lg">
                  <option value="A">A — Critical</option>
                  <option value="B">B — Important</option>
                  <option value="C">C — Standard</option>
                  <option value="D">D — Non-critical</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Install Date</label>
                <input type="date" value={form.installDate} onChange={e => update('installDate', e.target.value)}
                  className="input-field py-2.5 text-sm rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Commission Date</label>
                <input type="date" value={form.commissionDate} onChange={e => update('commissionDate', e.target.value)}
                  className="input-field py-2.5 text-sm rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg min-h-[80px] resize-y" placeholder="Optional description..." rows={3} />
            </div>

            {/* Approval Notice */}
            {needsApproval && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-300 text-sm font-medium">Approval Required</p>
                  <p className="text-amber-400/70 text-xs mt-0.5">
                    Criticality {form.criticality} assets require {form.criticality === 'A' ? '2-step (Engineer → Manager)' : '1-step (Manager)'} approval before activation.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 2: Location & Hierarchy ─── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-400" /> Location & Hierarchy
            </h3>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Functional Location</label>
              <select value={form.functionalLocationId} onChange={e => update('functionalLocationId', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg">
                <option value="">— Select Location —</option>
                {locations.map((loc: any) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.locationType === 'SITE' ? '🏭' : loc.locationType === 'BUILDING' ? '🏢' : loc.locationType === 'FLOOR' ? '📐' : loc.locationType === 'ZONE' ? '📍' : '🚪'}{' '}
                    [{loc.code}] {loc.name}
                  </option>
                ))}
              </select>
              {selectedLocation && (
                <div className="mt-2 p-2.5 rounded-lg bg-brand-500/5 border border-brand-500/15 text-xs">
                  <span className="text-slate-400">Selected: </span>
                  <span className="text-brand-400 font-medium">{selectedLocation.name}</span>
                  <span className="ml-2 text-slate-500">({selectedLocation.locationType})</span>
                </div>
              )}
            </div>

            {/* Asset Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Asset Type</label>
              <select value={form.assetTypeId} onChange={e => update('assetTypeId', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg">
                <option value="">— Select Asset Type —</option>
                {assetTypes.map((t: any) => (
                  <option key={t.id} value={t.id}>[{t.code}] {t.name}{t.category ? ` (${t.category})` : ''}</option>
                ))}
              </select>
            </div>

            {/* Parent Asset */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                <GitBranch className="w-4 h-4 inline mr-1" /> Parent Asset <span className="text-slate-500">(establishes hierarchy)</span>
              </label>
              <select value={form.parentAssetId} onChange={e => update('parentAssetId', e.target.value)}
                className="input-field py-2.5 text-sm rounded-lg">
                <option value="">— No Parent (Top-level Asset) —</option>
                {parentAssets.map((a: any) => (
                  <option key={a.id} value={a.id}>[{a.tagNumber}] {a.name}</option>
                ))}
              </select>
              {selectedParent && (
                <div className="mt-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-2">Hierarchy Preview</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="px-2.5 py-1 rounded bg-slate-700/50 text-slate-300 border border-slate-600/30">
                      {selectedParent.tagNumber}
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-400" />
                    <div className="px-2.5 py-1 rounded bg-brand-500/15 text-brand-400 border border-brand-500/30 font-medium">
                      {form.tagNumber || 'New Asset'} ← new
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── STEP 3: Telemetry Sensors ─── */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-brand-400" /> Telemetry Sensors
              </h3>
              <button type="button" onClick={() => setSensors(s => [...s, emptySensor()])}
                className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Sensor
              </button>
            </div>

            {sensors.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Radio className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No sensors configured yet</p>
                <p className="text-xs mt-1 text-slate-600">Click "Add Sensor" to attach IoT sensors to this asset</p>
                <button type="button" onClick={() => setSensors([emptySensor()])}
                  className="mt-4 btn-primary text-xs px-4 py-2 flex items-center gap-1.5 mx-auto">
                  <Plus className="w-3.5 h-3.5" /> Add First Sensor
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sensors.map((sensor, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Sensor #{idx + 1}</span>
                      <button type="button" onClick={() => setSensors(s => s.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:text-rose-300 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Sensor Code *</label>
                        <input value={sensor.sensorCode} onChange={e => {
                          const v = e.target.value; setSensors(s => s.map((x, i) => i === idx ? { ...x, sensorCode: v } : x));
                        }} className="input-field py-2 text-xs rounded-lg font-mono" placeholder="TEMP-001" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Name *</label>
                        <input value={sensor.name} onChange={e => {
                          const v = e.target.value; setSensors(s => s.map((x, i) => i === idx ? { ...x, name: v } : x));
                        }} className="input-field py-2 text-xs rounded-lg" placeholder="Bearing Temperature" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Type *</label>
                        <select value={sensor.sensorType} onChange={e => {
                          const v = e.target.value;
                          setSensors(s => s.map((x, i) => i === idx ? { ...x, sensorType: v, unit: SENSOR_UNITS[v] || '' } : x));
                        }} className="input-field py-2 text-xs rounded-lg">
                          {SENSOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Unit</label>
                        <input value={sensor.unit} onChange={e => {
                          const v = e.target.value; setSensors(s => s.map((x, i) => i === idx ? { ...x, unit: v } : x));
                        }} className="input-field py-2 text-xs rounded-lg" placeholder="°C" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Min</label>
                        <input type="number" value={sensor.minValue} onChange={e => {
                          const v = e.target.value; setSensors(s => s.map((x, i) => i === idx ? { ...x, minValue: v } : x));
                        }} className="input-field py-2 text-xs rounded-lg" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Max</label>
                        <input type="number" value={sensor.maxValue} onChange={e => {
                          const v = e.target.value; setSensors(s => s.map((x, i) => i === idx ? { ...x, maxValue: v } : x));
                        }} className="input-field py-2 text-xs rounded-lg" placeholder="100" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Alarm Low</label>
                        <input type="number" value={sensor.alarmLow} onChange={e => {
                          const v = e.target.value; setSensors(s => s.map((x, i) => i === idx ? { ...x, alarmLow: v } : x));
                        }} className="input-field py-2 text-xs rounded-lg text-amber-400" placeholder="10" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Alarm High</label>
                        <input type="number" value={sensor.alarmHigh} onChange={e => {
                          const v = e.target.value; setSensors(s => s.map((x, i) => i === idx ? { ...x, alarmHigh: v } : x));
                        }} className="input-field py-2 text-xs rounded-lg text-rose-400" placeholder="90" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 4: Review & Submit ─── */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-400" /> Review & Submit
            </h3>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Asset Info */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Asset Details</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Tag</span><span className="text-white font-mono">{form.tagNumber || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="text-white">{form.name || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Manufacturer</span><span className="text-slate-300">{form.manufacturer || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Model</span><span className="text-slate-300">{form.model || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Serial No.</span><span className="text-slate-300 font-mono">{form.serialNumber || '—'}</span></div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Criticality</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${critLabels[form.criticality]?.color}`}>
                      {form.criticality} — {critLabels[form.criticality]?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location & Hierarchy */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Location & Hierarchy</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Location</span><span className="text-white">{selectedLocation?.name || 'Not set'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Asset Type</span><span className="text-white">{selectedType?.name || 'Not set'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Parent Asset</span><span className="text-white">{selectedParent ? `${selectedParent.tagNumber} - ${selectedParent.name}` : 'Top-level'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Install Date</span><span className="text-slate-300">{form.installDate || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Commission</span><span className="text-slate-300">{form.commissionDate || '—'}</span></div>
                </div>
              </div>
            </div>

            {/* Sensors Summary */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Telemetry Sensors ({sensors.filter(s => s.sensorCode).length})</p>
              {sensors.filter(s => s.sensorCode).length > 0 ? (
                <div className="space-y-1.5">
                  {sensors.filter(s => s.sensorCode).map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-slate-700/30">
                      <div className="flex items-center gap-2">
                        <Radio className="w-3.5 h-3.5 text-brand-400" />
                        <span className="text-white font-mono text-xs">{s.sensorCode}</span>
                        <span className="text-slate-400">—</span>
                        <span className="text-slate-300">{s.name}</span>
                      </div>
                      <span className="text-xs text-slate-500 px-2 py-0.5 rounded bg-slate-700/50">{s.sensorType}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No sensors configured</p>
              )}
            </div>

            {/* Approval Banner */}
            {needsApproval && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-300 font-semibold text-sm">Approval Workflow Active</p>
                  <p className="text-amber-400/70 text-xs mt-1">
                    This Criticality {form.criticality} asset will be created with status <strong>PENDING APPROVAL</strong>.{' '}
                    {form.criticality === 'A'
                      ? 'It requires 2-step approval: Step 1 (Engineer) → Step 2 (Manager).'
                      : 'It requires 1-step approval by a Manager.'}
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {mutation.isError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {(mutation.error as any)?.message || 'Failed to create asset'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Navigation Footer ── */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div>
            {step > 0 && (
              <button type="button" onClick={goPrev} className="btn-secondary flex items-center gap-2 text-sm">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            )}
            {step === 0 && (
              <Link href="/dashboard/assets" className="btn-secondary text-sm">Cancel</Link>
            )}
          </div>
          <div className="flex items-center gap-3">
            {step < 3 ? (
              <button type="button" onClick={goNext} disabled={!canProceed}
                className="btn-primary flex items-center gap-2 text-sm disabled:opacity-40">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={mutation.isPending || !form.tagNumber || !form.name}
                className="btn-primary flex items-center gap-2 text-sm disabled:opacity-40">
                {mutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</>
                ) : (
                  <><Save className="w-4 h-4" /> {needsApproval ? 'Submit for Approval' : 'Register Asset'}</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
