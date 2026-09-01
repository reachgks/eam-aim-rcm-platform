'use client';

import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiFetch } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, Database, Plus, Search, Upload,
  Download, Trash2, Edit3, Save, X, Check, AlertTriangle,
  FileSpreadsheet, Loader2, Settings2, ChevronDown, Filter,
} from 'lucide-react';

// ── Module category groupings for sidebar ──
const MODULE_GROUPS = [
  {
    label: 'Asset Management',
    icon: '🏗️',
    tables: ['asset-types', 'functional-locations'],
  },
  {
    label: 'Classification & Taxonomy',
    icon: '🏷️',
    tables: ['failure-codes', 'cause-codes'],
  },
  {
    label: 'Inventory & Warehouse',
    icon: '📦',
    tables: ['storerooms', 'stock-items'],
  },
  {
    label: 'Procurement',
    icon: '🛒',
    tables: ['vendors'],
  },
  {
    label: 'Safety & Compliance',
    icon: '🛡️',
    tables: ['permit-types', 'regulations'],
  },
  {
    label: 'Finance',
    icon: '💰',
    tables: ['cost-centers'],
  },
  {
    label: 'Service Management',
    icon: '🎫',
    tables: ['sla-definitions', 'request-categories'],
  },
  {
    label: 'Performance & Labor',
    icon: '📊',
    tables: ['kpi-definitions', 'crafts'],
  },
];

export default function MasterDataPage() {
  const queryClient = useQueryClient();
  const [activeTable, setActiveTable] = useState('asset-types');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [showAddRow, setShowAddRow] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});
  const [importResult, setImportResult] = useState<any>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const limit = 25;

  // Fetch registry
  const { data: registryData } = useQuery({
    queryKey: ['master-data-registry'],
    queryFn: () => api.get<{ data: any[] }>('/api/v1/master-data'),
  });
  const registry = registryData?.data || [];
  const activeConfig = registry.find((r: any) => r.key === activeTable);

  // Fetch records
  const { data: recordsData, isLoading } = useQuery({
    queryKey: ['master-data', activeTable, page, search],
    queryFn: () => api.get(`/api/v1/master-data/${activeTable}?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`),
    enabled: !!activeTable,
  });
  const records = recordsData?.data || [];
  const pagination = recordsData?.pagination || { page: 1, limit, total: 0, totalPages: 0 };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => api.post(`/api/v1/master-data/${activeTable}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['master-data', activeTable] }); setShowAddRow(false); setNewRowData({}); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/api/v1/master-data/${activeTable}/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['master-data', activeTable] }); setEditingRow(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/master-data/${activeTable}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master-data', activeTable] }),
  });

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const { token, tenantId } = useAuthStore.getState();
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/master-data/${activeTable}/import-csv`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...(tenantId ? { 'x-tenant-id': tenantId } : {}),
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Import failed');
      return res.json();
    },
    onSuccess: (data) => {
      setImportResult(data);
      queryClient.invalidateQueries({ queryKey: ['master-data', activeTable] });
    },
    onError: (err: any) => setImportResult({ error: err.message }),
  });

  const handleExport = useCallback(async () => {
    const { token, tenantId } = useAuthStore.getState();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/master-data/${activeTable}/export-csv`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(tenantId ? { 'x-tenant-id': tenantId } : {}),
      },
    });
    const csv = await res.text();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${activeTable}.csv`; a.click();
    URL.revokeObjectURL(url);
  }, [activeTable]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { importMutation.mutate(file); }
    e.target.value = '';
  };

  const startEdit = (record: any) => {
    setEditingRow(record.id);
    const d: Record<string, any> = {};
    activeConfig?.columns?.forEach((col: any) => { d[col.key] = record[col.key] ?? ''; });
    setEditData(d);
  };

  const columns = activeConfig?.columns || [];

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/settings" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Settings
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">Master Data Configuration</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-brand-400" /> Master Data Configuration
          </h1>
          <p className="text-slate-400 mt-1">Manage reference data, taxonomies, and configurations across all modules</p>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Sidebar — Module Groups */}
        <div className="w-64 shrink-0 space-y-1">
          {MODULE_GROUPS.map(group => (
            <div key={group.label} className="mb-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold px-3 py-1">
                {group.icon} {group.label}
              </p>
              {group.tables.map(tKey => {
                const reg = registry.find((r: any) => r.key === tKey);
                const isActive = activeTable === tKey;
                return (
                  <button key={tKey} onClick={() => { setActiveTable(tKey); setPage(1); setSearch(''); setShowAddRow(false); setEditingRow(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}>
                    {reg?.label || tKey}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Toolbar */}
          <div className="glass-card p-4 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder={`Search ${activeConfig?.label || ''}...`}
                className="input-field pl-10 py-2 text-sm rounded-lg" />
            </div>
            <button onClick={() => { setShowAddRow(true); setNewRowData({}); }}
              className="btn-primary text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Record
            </button>
            <button onClick={handleExport} className="btn-secondary text-sm flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={() => setShowImportModal(true)} className="btn-secondary text-sm flex items-center gap-1.5">
              <Upload className="w-4 h-4" /> Import CSV
            </button>
          </div>

          {/* Import Result Banner */}
          {importResult && (
            <div className={`glass-card p-3 flex items-center justify-between ${importResult.error ? 'border-rose-500/30 bg-rose-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
              <p className={`text-sm ${importResult.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                {importResult.error ? `❌ ${importResult.error}` : `✅ Imported ${importResult.inserted || 0} records.`}
                {importResult.errors?.length > 0 && ` (${importResult.errors.length} errors)`}
              </p>
              <button onClick={() => setImportResult(null)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* Data Table */}
          <div className="glass-card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-brand-400" />
                {activeConfig?.label || activeTable}
                <span className="text-xs text-slate-500 font-normal ml-2">{pagination.total} records</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    {columns.map((col: any) => (
                      <th key={col.key} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {col.label} {col.required && <span className="text-brand-400">*</span>}
                      </th>
                    ))}
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add Row */}
                  {showAddRow && (
                    <tr className="bg-brand-500/5 border-b border-brand-500/20">
                      {columns.map((col: any) => (
                        <td key={col.key} className="px-4 py-2">
                          {col.type === 'boolean' ? (
                            <select value={String(newRowData[col.key] ?? true)} onChange={e => setNewRowData(d => ({ ...d, [col.key]: e.target.value === 'true' }))}
                              className="input-field py-1.5 text-xs rounded">
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          ) : (
                            <input type={col.type === 'number' ? 'number' : 'text'}
                              value={newRowData[col.key] || ''} onChange={e => setNewRowData(d => ({ ...d, [col.key]: e.target.value }))}
                              placeholder={col.label} className="input-field py-1.5 text-xs rounded w-full" />
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => createMutation.mutate(newRowData)} disabled={createMutation.isPending}
                            className="p-1 text-emerald-400 hover:bg-emerald-500/15 rounded">
                            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setShowAddRow(false)} className="p-1 text-slate-400 hover:text-white rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Data Rows */}
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="table-row"><td colSpan={columns.length + 1} className="px-4 py-3"><div className="skeleton h-4 w-full rounded" /></td></tr>
                    ))
                  ) : records.length === 0 ? (
                    <tr><td colSpan={columns.length + 1} className="px-4 py-12 text-center text-slate-500">
                      <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>No records found</p>
                      <p className="text-xs mt-1">Add records manually or import from CSV</p>
                    </td></tr>
                  ) : (
                    records.map((rec: any) => (
                      <tr key={rec.id} className="table-row group">
                        {columns.map((col: any) => (
                          <td key={col.key} className="px-4 py-2.5 text-sm">
                            {editingRow === rec.id ? (
                              col.type === 'boolean' ? (
                                <select value={String(editData[col.key] ?? rec[col.key])} onChange={e => setEditData(d => ({ ...d, [col.key]: e.target.value === 'true' }))}
                                  className="input-field py-1 text-xs rounded">
                                  <option value="true">Yes</option>
                                  <option value="false">No</option>
                                </select>
                              ) : (
                                <input type={col.type === 'number' ? 'number' : 'text'}
                                  value={editData[col.key] ?? ''} onChange={e => setEditData(d => ({ ...d, [col.key]: e.target.value }))}
                                  className="input-field py-1 text-xs rounded w-full" />
                              )
                            ) : (
                              col.type === 'boolean' ? (
                                <span className={`badge text-xs ${rec[col.key] ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/15 text-slate-400 border-slate-500/20'}`}>
                                  {rec[col.key] ? 'Yes' : 'No'}
                                </span>
                              ) : (
                                <span className="text-slate-300">{rec[col.key] ?? <span className="text-slate-600">—</span>}</span>
                              )
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-2.5 text-right">
                          {editingRow === rec.id ? (
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => updateMutation.mutate({ id: rec.id, data: editData })} disabled={updateMutation.isPending}
                                className="p-1 text-emerald-400 hover:bg-emerald-500/15 rounded">
                                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              </button>
                              <button onClick={() => setEditingRow(null)} className="p-1 text-slate-400 hover:text-white rounded">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEdit(rec)} className="p-1 text-slate-400 hover:text-brand-400 rounded" title="Edit">
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => { if (confirm('Delete this record?')) deleteMutation.mutate(rec.id); }}
                                className="p-1 text-slate-400 hover:text-rose-400 rounded" title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
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
      </div>

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowImportModal(false)}>
          <div className="glass-card p-6 w-full max-w-lg space-y-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-brand-400" /> Import CSV — {activeConfig?.label}
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-dashed border-slate-700/50 bg-slate-800/30 text-center">
                <Upload className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                <p className="text-sm text-slate-400 mb-2">Drop a CSV file or click to browse</p>
                <input type="file" ref={fileInputRef} accept=".csv" onChange={e => { handleFileSelect(e); setShowImportModal(false); }} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} disabled={importMutation.isPending}
                  className="btn-primary text-sm">
                  {importMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Select CSV File
                </button>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-400">Expected CSV columns:</p>
                <div className="flex flex-wrap gap-1.5">
                  {columns.map((col: any) => (
                    <span key={col.key} className={`px-2 py-0.5 rounded text-[10px] border ${
                      col.required ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' : 'bg-slate-800/50 text-slate-500 border-slate-700/30'
                    }`}>
                      {col.key}{col.required ? ' *' : ''}
                    </span>
                  ))}
                </div>
                <p className="mt-2">First row must be a header row matching the column keys above.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={handleExport} className="btn-ghost text-xs flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Download Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} accept=".csv" onChange={handleFileSelect} className="hidden" />
    </div>
  );
}
