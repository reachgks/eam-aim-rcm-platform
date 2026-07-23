'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';
import {
  Box, Plus, Search, Filter, ChevronRight, ChevronLeft,
  ArrowUpDown, AlertTriangle, CheckCircle2, Pause, XCircle
} from 'lucide-react';

const statusColors: Record<string, string> = {
  ACTIVE: 'badge-success',
  STANDBY: 'badge-warning',
  PLANNED: 'badge-brand',
  INSTALLED: 'badge-info',
  COMMISSIONING: 'badge-info',
  OUT_OF_SERVICE: 'badge-danger',
  DECOMMISSIONED: 'badge-neutral',
  DISPOSED: 'badge-neutral',
  ORDERED: 'badge-brand',
  RECEIVED: 'badge-info',
};

const criticalityColors: Record<string, string> = {
  A: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  B: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  C: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  D: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
};

const criticalityLabels: Record<string, string> = {
  A: 'Critical', B: 'Important', C: 'Standard', D: 'Non-critical',
};

export default function AssetsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const limit = 15;

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search && { search }),
    ...(statusFilter && { status: statusFilter }),
    ...(criticalityFilter && { criticality: criticalityFilter }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['assets', page, search, statusFilter, criticalityFilter],
    queryFn: () => api.get(`/api/v1/assets?${queryParams}`),
  });

  const { data: statusSummary } = useQuery({
    queryKey: ['assets', 'status-summary'],
    queryFn: () => api.get('/api/v1/assets/summary/status'),
  });

  const assets = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit, total: 0, totalPages: 0 };
  const totalAssets = pagination.total;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Asset Register</h1>
          <p className="text-slate-400 mt-1">{totalAssets} assets across your facility</p>
        </div>
        <Link href="/dashboard/assets/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Register Asset
        </Link>
      </div>

      {/* Quick status cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {statusSummary?.data?.map((s: any) => (
          <button
            key={s.status}
            onClick={() => setStatusFilter(statusFilter === s.status ? '' : s.status)}
            className={`glass-panel p-3 text-left transition-all duration-200 ${
              statusFilter === s.status ? 'ring-1 ring-brand-500 border-brand-500/30' : ''
            }`}
          >
            <p className="text-lg font-bold text-white">{s.count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.status.replace(/_/g, ' ')}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by tag number or name..."
              className="input-field pl-10 py-2 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field w-40 py-2 text-sm rounded-lg"
          >
            <option value="">All Status</option>
            {['ACTIVE', 'STANDBY', 'PLANNED', 'OUT_OF_SERVICE', 'DECOMMISSIONED'].map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <select
            value={criticalityFilter}
            onChange={(e) => { setCriticalityFilter(e.target.value); setPage(1); }}
            className="input-field w-40 py-2 text-sm rounded-lg"
          >
            <option value="">All Criticality</option>
            {['A', 'B', 'C', 'D'].map(c => (
              <option key={c} value={c}>{c} — {criticalityLabels[c]}</option>
            ))}
          </select>
          {(search || statusFilter || criticalityFilter) && (
            <button
              onClick={() => { setSearch(''); setStatusFilter(''); setCriticalityFilter(''); setPage(1); }}
              className="btn-ghost text-xs"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Asset Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                {['Tag Number', 'Name', 'Status', 'Criticality', 'Location', 'Manufacturer', 'Serial No.'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="table-row">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="skeleton h-4 w-24 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    <Box className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p>No assets found</p>
                  </td>
                </tr>
              ) : (
                assets.map((asset: any) => (
                  <tr key={asset.id} className="table-row group">
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/assets/${asset.id}`}
                        className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        {asset.tagNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-white">{asset.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${statusColors[asset.status] || 'badge-neutral'}`}>
                        {asset.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {asset.criticality && (
                        <span className={`badge border ${criticalityColors[asset.criticality] || ''}`}>
                          {asset.criticality} — {criticalityLabels[asset.criticality]}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{asset.functionalLocationId ? '📍' : '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{asset.manufacturer || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 font-mono text-xs">{asset.serialNumber || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50">
            <p className="text-sm text-slate-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost p-2 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    p === page ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="btn-ghost p-2 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
