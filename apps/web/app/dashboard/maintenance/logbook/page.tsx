'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, ClipboardList, Plus, Search,
  Filter, Calendar, Sun, Sunset, Moon, AlertTriangle,
  Wrench, Clock, CheckCircle2, XCircle, BarChart3,
} from 'lucide-react';

const typeConfig: Record<string, { label: string; icon: string; color: string }> = {
  BREAKDOWN: { label: 'Breakdown', icon: '🔴', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  PREVENTIVE: { label: 'Preventive', icon: '🟢', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  SCHEDULED: { label: 'Scheduled', icon: '🔵', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  INSPECTION: { label: 'Inspection', icon: '🔍', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  EMERGENCY: { label: 'Emergency', icon: '🚨', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
};

const shiftConfig: Record<string, { label: string; icon: any; color: string }> = {
  MORNING: { label: 'Morning', icon: Sun, color: 'text-amber-400' },
  AFTERNOON: { label: 'Afternoon', icon: Sunset, color: 'text-orange-400' },
  NIGHT: { label: 'Night', icon: Moon, color: 'text-indigo-400' },
};

const statusConfig: Record<string, { color: string }> = {
  OPEN: { color: 'bg-sky-500/15 text-sky-400 border-sky-500/20' },
  IN_PROGRESS: { color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  COMPLETED: { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  DEFERRED: { color: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
};

export default function ShiftLogbookPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    machineName: '', sectionName: '', plantName: '',
    logEntryType: '', shiftType: '', dateFrom: '', dateTo: '', status: '',
  });
  const [activeTab, setActiveTab] = useState<'all' | 'breakdown' | 'preventive' | 'scheduled'>('all');
  const limit = 20;

  const effectiveType = activeTab === 'all' ? filters.logEntryType
    : activeTab === 'breakdown' ? 'BREAKDOWN'
    : activeTab === 'preventive' ? 'PREVENTIVE' : 'SCHEDULED';

  const queryParams = new URLSearchParams({
    page: String(page), limit: String(limit),
    ...(filters.machineName && { machineName: filters.machineName }),
    ...(filters.sectionName && { sectionName: filters.sectionName }),
    ...(filters.plantName && { plantName: filters.plantName }),
    ...(effectiveType && { logEntryType: effectiveType }),
    ...(filters.shiftType && { shiftType: filters.shiftType }),
    ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
    ...(filters.dateTo && { dateTo: filters.dateTo }),
    ...(filters.status && { status: filters.status }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['shift-logbook', page, filters, activeTab],
    queryFn: () => api.get(`/api/v1/shift-logbook?${queryParams}`),
  });

  const { data: summaryData } = useQuery({
    queryKey: ['shift-logbook-summary'],
    queryFn: () => api.get('/api/v1/shift-logbook/summary'),
  });

  const { data: locationsData } = useQuery({
    queryKey: ['asset-locations'],
    queryFn: () => api.get<{ data: any[] }>('/api/v1/assets/locations'),
  });

  const entries = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit, total: 0, totalPages: 0 };
  const summary = summaryData?.data || {};
  const locations = locationsData?.data || [];
  const plants = locations.filter((l: any) => l.locationType === 'SITE');
  const sections = locations.filter((l: any) => ['BUILDING', 'ZONE'].includes(l.locationType));

  const updateFilter = (k: string, v: string) => { setFilters(f => ({ ...f, [k]: v })); setPage(1); };

  const clearFilters = () => {
    setFilters({ machineName: '', sectionName: '', plantName: '', logEntryType: '', shiftType: '', dateFrom: '', dateTo: '', status: '' });
    setPage(1);
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/maintenance" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Maintenance
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">Shift Logbook</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-brand-400" /> Maintenance Shift Logbook
          </h1>
          <p className="text-slate-400 mt-1">{pagination.total} log entries</p>
        </div>
        <Link href="/dashboard/maintenance/logbook/new" className="btn-primary text-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> New Entry
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="stat-card border-brand-500/20">
          <p className="text-2xl font-bold text-white">{summary.total || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Total Entries</p>
        </div>
        {['BREAKDOWN', 'PREVENTIVE', 'SCHEDULED', 'EMERGENCY'].map(t => (
          <div key={t} className={`stat-card ${typeConfig[t]?.color || ''}`}>
            <p className="text-2xl font-bold text-white">{summary.byType?.[t] || 0}</p>
            <p className="text-xs text-slate-500 mt-1">{typeConfig[t]?.icon} {typeConfig[t]?.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="glass-card p-1 flex gap-1">
        {[
          { key: 'all', label: 'All Logs' },
          { key: 'breakdown', label: '🔴 Breakdown' },
          { key: 'preventive', label: '🟢 Preventive' },
          { key: 'scheduled', label: '🔵 Scheduled' },
        ].map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key as any); setPage(1); }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'text-slate-500 hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" value={filters.machineName} onChange={e => updateFilter('machineName', e.target.value)}
              placeholder="Search machine..." className="input-field pl-10 py-2 text-sm rounded-lg" />
          </div>
          <select value={filters.plantName} onChange={e => updateFilter('plantName', e.target.value)}
            className="input-field py-2 text-sm rounded-lg w-40">
            <option value="">All Plants</option>
            {plants.map((p: any) => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <select value={filters.sectionName} onChange={e => updateFilter('sectionName', e.target.value)}
            className="input-field py-2 text-sm rounded-lg w-40">
            <option value="">All Sections</option>
            {sections.map((s: any) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          {activeTab === 'all' && (
            <select value={filters.logEntryType} onChange={e => updateFilter('logEntryType', e.target.value)}
              className="input-field py-2 text-sm rounded-lg w-40">
              <option value="">All Types</option>
              {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          )}
          <select value={filters.shiftType} onChange={e => updateFilter('shiftType', e.target.value)}
            className="input-field py-2 text-sm rounded-lg w-36">
            <option value="">All Shifts</option>
            <option value="MORNING">☀️ Morning</option>
            <option value="AFTERNOON">🌅 Afternoon</option>
            <option value="NIGHT">🌙 Night</option>
          </select>
          <div className="flex items-center gap-1.5">
            <input type="date" value={filters.dateFrom} onChange={e => updateFilter('dateFrom', e.target.value)}
              className="input-field py-2 text-xs rounded-lg w-36" />
            <span className="text-slate-600">—</span>
            <input type="date" value={filters.dateTo} onChange={e => updateFilter('dateTo', e.target.value)}
              className="input-field py-2 text-xs rounded-lg w-36" />
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-ghost text-xs">Clear</button>
          )}
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                {['Date', 'Shift', 'Type', 'Machine', 'Section', 'Plant', 'Description', 'Downtime', 'Status', 'Technician'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="table-row"><td colSpan={10} className="px-4 py-3"><div className="skeleton h-4 w-full rounded" /></td></tr>
                ))
              ) : entries.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No log entries found</p>
                </td></tr>
              ) : (
                entries.map((e: any) => {
                  const tc = typeConfig[e.logEntryType] || { label: e.logEntryType, icon: '📋', color: '' };
                  const sc = shiftConfig[e.shiftType];
                  const stc = statusConfig[e.status] || statusConfig.OPEN;
                  return (
                    <tr key={e.id} className="table-row">
                      <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">{e.shiftDate}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`flex items-center gap-1 ${sc?.color || 'text-slate-400'}`}>
                          {sc?.label || e.shiftType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${tc.color}`}>{tc.icon} {tc.label}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white font-medium">{e.machineName || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{e.sectionName || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{e.plantName || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-300 max-w-[200px] truncate">{e.description || '—'}</td>
                      <td className="px-4 py-3 text-sm">
                        {e.downtimeMinutes ? (
                          <span className="text-amber-400 font-mono">{e.downtimeMinutes}m</span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${stc.color}`}>{e.status?.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">{e.attendedBy || '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50">
            <p className="text-sm text-slate-500">
              {(page - 1) * limit + 1}–{Math.min(page * limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="btn-ghost text-xs disabled:opacity-30">← Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= pagination.totalPages}
                className="btn-ghost text-xs disabled:opacity-30">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
