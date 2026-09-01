'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, Shield, AlertTriangle, CheckCircle2,
  BarChart3, RefreshCw, Loader2, TrendingUp, Clock,
} from 'lucide-react';

const gradeConfig: Record<string, { label: string; color: string; bg: string }> = {
  A: { label: 'Critical', color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/30' },
  B: { label: 'Important', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  C: { label: 'Standard', color: 'text-sky-400', bg: 'bg-sky-500/15 border-sky-500/30' },
  D: { label: 'Non-critical', color: 'text-slate-400', bg: 'bg-slate-500/15 border-slate-500/30' },
};

export default function CriticalityDashboardPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['criticality-dashboard'],
    queryFn: () => api.get<{ data: any }>('/api/v1/rcm/criticality/dashboard'),
  });

  const { data: queueData } = useQuery({
    queryKey: ['reassessment-queue'],
    queryFn: () => api.get<{ data: any[] }>('/api/v1/rcm/criticality/reassessment-queue'),
  });

  const { data: assetsData } = useQuery({
    queryKey: ['asset-simple-list'],
    queryFn: () => api.get<{ data: any[] }>('/api/v1/assets/list-simple'),
  });

  const dashboard = data?.data || { totalAssessed: 0, byGrade: { A: 0, B: 0, C: 0, D: 0 }, overdueCount: 0, assessments: [] };
  const queue = queueData?.data || [];
  const allAssets = assetsData?.data || [];

  // ── Assessment Modal State ──
  const [showAssess, setShowAssess] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [scores, setScores] = useState({ safetyImpact: 3, environmentalImpact: 3, productionImpact: 3, qualityImpact: 3, maintenanceCostImpact: 3 });
  const [methodology, setMethodology] = useState('SEMI_QUANTITATIVE');
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (assetId: string) => api.post(`/api/v1/rcm/criticality/${assetId}`, { ...scores, methodology, notes }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['criticality-dashboard'] }); setShowAssess(false); },
  });

  const rawScore = (scores.safetyImpact * 5) + (scores.environmentalImpact * 4) + (scores.productionImpact * 4) + (scores.qualityImpact * 3) + (scores.maintenanceCostImpact * 2);
  const normalizedScore = Math.round((rawScore / 90) * 100);
  const previewGrade = normalizedScore > 75 ? 'A' : normalizedScore > 50 ? 'B' : normalizedScore > 25 ? 'C' : 'D';

  const impactLabels: Record<number, string> = { 1: 'Negligible', 2: 'Minor', 3: 'Moderate', 4: 'Major', 5: 'Catastrophic' };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/rcm" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> RCM
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">Criticality Analysis</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-400" /> Criticality Analysis
          </h1>
          <p className="text-slate-400 mt-1">Assess asset criticality using ISO 14224 / API 580 methodology</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => refetch()} className="btn-secondary text-sm flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => setShowAssess(true)} className="btn-primary text-sm flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" /> Run Assessment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="stat-card border-brand-500/20">
          <p className="text-2xl font-bold text-white">{dashboard.totalAssessed}</p>
          <p className="text-xs text-slate-500 mt-1">Total Assessed</p>
        </div>
        {(['A', 'B', 'C', 'D'] as const).map(g => (
          <div key={g} className={`stat-card ${gradeConfig[g].bg}`}>
            <p className={`text-2xl font-bold ${gradeConfig[g].color}`}>{dashboard.byGrade[g] || 0}</p>
            <p className="text-xs text-slate-500 mt-1">{gradeConfig[g].label} ({g})</p>
          </div>
        ))}
        <div className="stat-card border-amber-500/20">
          <p className="text-2xl font-bold text-amber-400">{dashboard.overdueCount}</p>
          <p className="text-xs text-slate-500 mt-1">Overdue Reviews</p>
        </div>
      </div>

      {/* Assessment Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800/50">
          <h3 className="text-sm font-semibold text-white">All Assessments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                {['Asset', 'Score', 'Grade', 'Safety', 'Environ.', 'Production', 'Quality', 'Maint Cost', 'Assessed', 'Next Review'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="table-row"><td colSpan={10} className="px-4 py-3"><div className="skeleton h-4 w-full rounded" /></td></tr>
                ))
              ) : dashboard.assessments.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-slate-500">No assessments yet. Click "Run Assessment" to start.</td></tr>
              ) : (
                dashboard.assessments.map((a: any) => (
                  <tr key={a.id} className="table-row">
                    <td className="px-4 py-3 text-sm text-brand-400 font-mono">{a.assetId?.slice(0, 8)}...</td>
                    <td className="px-4 py-3"><span className="text-sm font-bold text-white">{a.score}</span></td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${gradeConfig[a.overallCriticality]?.bg || ''} ${gradeConfig[a.overallCriticality]?.color || ''}`}>
                        {a.overallCriticality} — {gradeConfig[a.overallCriticality]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">{a.safetyImpact}/5</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{a.environmentalImpact}/5</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{a.productionImpact}/5</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{a.qualityImpact}/5</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{a.maintenanceCostImpact}/5</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{a.assessedAt ? new Date(a.assessedAt).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{a.nextReviewDate || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reassessment Queue */}
      {queue.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Overdue Reassessments ({queue.length})
          </h3>
          <div className="space-y-2">
            {queue.map((q: any) => (
              <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                <div>
                  <span className="text-sm text-white font-mono">{q.assetId?.slice(0, 8)}...</span>
                  <span className="ml-3 text-xs text-slate-500">Due: {q.nextReviewDate}</span>
                </div>
                <button onClick={() => { setSelectedAsset(q.assetId); setShowAssess(true); }} className="btn-secondary text-xs">
                  Reassess
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Assessment Modal ── */}
      {showAssess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAssess(false)}>
          <div className="glass-card p-6 w-full max-w-lg space-y-5 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white">Run Criticality Assessment</h3>

            {/* Asset Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Select Asset *</label>
              <select value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)} className="input-field py-2.5 text-sm rounded-lg">
                <option value="">— Choose asset —</option>
                {allAssets.map((a: any) => <option key={a.id} value={a.id}>[{a.tagNumber}] {a.name}</option>)}
              </select>
            </div>

            {/* Impact Sliders */}
            {[
              { key: 'safetyImpact', label: 'Safety Impact', weight: '×5', color: 'text-rose-400' },
              { key: 'environmentalImpact', label: 'Environmental Impact', weight: '×4', color: 'text-emerald-400' },
              { key: 'productionImpact', label: 'Production Impact', weight: '×4', color: 'text-amber-400' },
              { key: 'qualityImpact', label: 'Quality Impact', weight: '×3', color: 'text-sky-400' },
              { key: 'maintenanceCostImpact', label: 'Maintenance Cost', weight: '×2', color: 'text-purple-400' },
            ].map(f => (
              <div key={f.key}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400">{f.label} <span className="text-slate-600">{f.weight}</span></label>
                  <span className={`text-xs font-bold ${f.color}`}>{(scores as any)[f.key]}/5 — {impactLabels[(scores as any)[f.key]]}</span>
                </div>
                <input type="range" min={1} max={5} value={(scores as any)[f.key]}
                  onChange={e => setScores(s => ({ ...s, [f.key]: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-brand-500" />
              </div>
            ))}

            {/* Preview */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 border border-slate-700/40">
              <div>
                <p className="text-xs text-slate-500">Computed Score</p>
                <p className="text-xl font-bold text-white">{normalizedScore}<span className="text-sm text-slate-500">/100</span></p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${gradeConfig[previewGrade]?.bg} ${gradeConfig[previewGrade]?.color}`}>
                {previewGrade} — {gradeConfig[previewGrade]?.label}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAssess(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={() => selectedAsset && mutation.mutate(selectedAsset)}
                disabled={!selectedAsset || mutation.isPending}
                className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-40">
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Submit Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
