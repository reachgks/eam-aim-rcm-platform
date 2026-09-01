'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, Shield, AlertTriangle, TrendingUp,
  BarChart3, RefreshCw, Loader2, Activity, Zap, Target,
  MapPin, PlayCircle,
} from 'lucide-react';

const riskColors: Record<string, { label: string; color: string; bg: string; accent: string }> = {
  CRITICAL: { label: 'Critical', color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/30', accent: 'from-rose-600/20 to-rose-600/5' },
  HIGH: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30', accent: 'from-orange-600/20 to-orange-600/5' },
  MEDIUM: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30', accent: 'from-amber-600/20 to-amber-600/5' },
  LOW: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', accent: 'from-emerald-600/20 to-emerald-600/5' },
};

export default function RiskDashboardPage() {
  const queryClient = useQueryClient();

  const { data: dashData, isLoading } = useQuery({
    queryKey: ['risk-dashboard'],
    queryFn: () => api.get<{ data: any }>('/api/v1/risk/dashboard'),
  });

  const { data: heatmapData } = useQuery({
    queryKey: ['risk-heatmap'],
    queryFn: () => api.get<{ data: any[] }>('/api/v1/risk/heatmap'),
  });

  const batchMutation = useMutation({
    mutationFn: () => api.post('/api/v1/risk/calculate-batch', {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['risk-dashboard'] }),
  });

  const dashboard = dashData?.data || { byLevel: {}, topRisk: [], totalAnalyzed: 0 };
  const heatmap = heatmapData?.data || [];

  const getBarWidth = (count: number) => {
    const max = Math.max(
      dashboard.byLevel?.CRITICAL || 0,
      dashboard.byLevel?.HIGH || 0,
      dashboard.byLevel?.MEDIUM || 0,
      dashboard.byLevel?.LOW || 0,
      1,
    );
    return `${(count / max) * 100}%`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/rcm" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> RCM
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">Risk Analyzer</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-400" /> Asset Risk Analyzer
          </h1>
          <p className="text-slate-400 mt-1">Composite risk scoring across your fleet</p>
        </div>
        <button onClick={() => batchMutation.mutate()} disabled={batchMutation.isPending}
          className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-50">
          {batchMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
          Run Fleet Analysis
        </button>
      </div>

      {/* Fleet Risk KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="stat-card bg-gradient-to-br from-brand-600/20 to-brand-600/5 border-brand-500/20">
          <BarChart3 className="w-5 h-5 text-brand-400" />
          <p className="text-2xl font-bold text-white mt-2">{dashboard.totalAnalyzed || 0}</p>
          <p className="text-xs text-slate-500">Analyzed</p>
        </div>
        {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(level => (
          <div key={level} className={`stat-card bg-gradient-to-br ${riskColors[level].accent} ${riskColors[level].bg}`}>
            <AlertTriangle className={`w-5 h-5 ${riskColors[level].color}`} />
            <p className={`text-2xl font-bold ${riskColors[level].color} mt-2`}>{dashboard.byLevel?.[level] || 0}</p>
            <p className="text-xs text-slate-500">{riskColors[level].label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-400" /> Risk Distribution
          </h3>
          <div className="space-y-3">
            {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(level => {
              const cnt = dashboard.byLevel?.[level] || 0;
              return (
                <div key={level} className="flex items-center gap-3">
                  <span className={`text-xs font-bold w-16 ${riskColors[level].color}`}>{riskColors[level].label}</span>
                  <div className="flex-1 h-6 bg-slate-800/50 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${level === 'CRITICAL' ? 'bg-rose-500' : level === 'HIGH' ? 'bg-orange-500' : level === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'} transition-all duration-700`}
                      style={{ width: getBarWidth(cnt) }} />
                  </div>
                  <span className="text-sm font-bold text-white w-8 text-right">{cnt}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Heat Map (by Location) */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-400" /> Risk Heat Map (by Location)
          </h3>
          {heatmap.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No location risk data. Run fleet analysis first.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {heatmap.map((h: any, i: number) => {
                const score = Number(h.avgRisk || 0);
                const bgColor = score > 80 ? 'bg-rose-500/20 border-rose-500/40'
                  : score > 60 ? 'bg-orange-500/20 border-orange-500/40'
                  : score > 40 ? 'bg-amber-500/20 border-amber-500/40'
                  : 'bg-emerald-500/20 border-emerald-500/40';
                return (
                  <div key={i} className={`p-3 rounded-lg border ${bgColor}`}>
                    <p className="text-xs text-slate-400 truncate">{h.locationName || h.locationCode || 'Unknown'}</p>
                    <p className="text-lg font-bold text-white mt-1">{score.toFixed(0)}<span className="text-xs text-slate-500">/100</span></p>
                    <p className="text-[10px] text-slate-500">{h.assetCount || 0} assets</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top 10 High-Risk Assets */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Top High-Risk Assets
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                {['Asset', 'Tag', 'Risk Score', 'Level', 'Criticality', 'Failure', 'FMEA', 'Maintenance', 'Sensor', 'Last Analysis'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="table-row"><td colSpan={10} className="px-4 py-3"><div className="skeleton h-4 w-full rounded" /></td></tr>
                ))
              ) : (dashboard.topRisk || []).length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                  No risk data. Click "Run Fleet Analysis" to calculate.</td></tr>
              ) : (
                (dashboard.topRisk || []).map((r: any) => {
                  const rc = riskColors[r.riskLevel] || riskColors.LOW;
                  return (
                    <tr key={r.id} className="table-row">
                      <td className="px-4 py-3 text-sm text-white font-medium">{r.assetName || r.assetId?.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-sm text-brand-400 font-mono">{r.tagNumber || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${
                              Number(r.riskScore) > 80 ? 'bg-rose-500' : Number(r.riskScore) > 60 ? 'bg-orange-500' : Number(r.riskScore) > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} style={{ width: `${Math.min(Number(r.riskScore), 100)}%` }} />
                          </div>
                          <span className="text-sm font-bold text-white">{Number(r.riskScore).toFixed(0)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`badge text-xs ${rc.bg} ${rc.color}`}>{rc.label}</span></td>
                      <td className="px-4 py-3 text-sm text-slate-300">{Number(r.criticalityComponent || 0).toFixed(0)}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{Number(r.failureComponent || 0).toFixed(0)}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{Number(r.fmeaComponent || 0).toFixed(0)}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{Number(r.maintenanceComponent || 0).toFixed(0)}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{Number(r.sensorComponent || 0).toFixed(0)}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{r.assessedAt ? new Date(r.assessedAt).toLocaleDateString() : '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {batchMutation.isSuccess && (
        <div className="glass-card p-4 border-emerald-500/30 bg-emerald-500/5">
          <p className="text-sm text-emerald-400 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Fleet analysis completed. Risk scores have been calculated.
          </p>
        </div>
      )}
    </div>
  );
}
