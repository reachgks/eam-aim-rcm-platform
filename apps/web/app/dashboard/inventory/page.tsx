'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';
import {
  Package, Plus, Search, ChevronLeft, ChevronRight,
  AlertTriangle, Warehouse, ArrowUpRight
} from 'lucide-react';

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 15;

  const { data, isLoading } = useQuery({
    queryKey: ['stock-items', page, search],
    queryFn: () => api.get(`/api/v1/inventory/stock-items?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`),
  });

  const { data: storerooms } = useQuery({
    queryKey: ['storerooms'],
    queryFn: () => api.get('/api/v1/inventory/storerooms'),
  });

  const { data: reorderAlerts } = useQuery({
    queryKey: ['reorder-alerts'],
    queryFn: () => api.get('/api/v1/inventory/reorder-alerts'),
  });

  const items = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit, total: 0, totalPages: 0 };
  const alertCount = reorderAlerts?.data?.length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-slate-400 mt-1">{pagination.total} stock items</p>
        </div>
        <Link href="/dashboard/inventory/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Stock Item
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card border-brand-500/20">
          <Package className="w-5 h-5 text-brand-400" />
          <div className="mt-2">
            <p className="text-2xl font-bold text-white">{pagination.total}</p>
            <p className="text-sm text-slate-400">Total Items</p>
          </div>
        </div>
        <div className="stat-card border-emerald-500/20">
          <Warehouse className="w-5 h-5 text-emerald-400" />
          <div className="mt-2">
            <p className="text-2xl font-bold text-white">{storerooms?.data?.length || 0}</p>
            <p className="text-sm text-slate-400">Storerooms</p>
          </div>
        </div>
        <Link href="/dashboard/inventory/reorder" className="stat-card border-amber-500/20 group cursor-pointer">
          <div className="flex items-center justify-between">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-white">{alertCount}</p>
            <p className="text-sm text-slate-400">Reorder Alerts</p>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by item code or name..."
            className="input-field pl-10 py-2 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                {['Item Code', 'Name', 'Category', 'Unit Cost', 'UOM'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="table-row">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-24 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    No stock items found
                  </td>
                </tr>
              ) : (
                items.map((item: any) => (
                  <tr key={item.id} className="table-row">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/inventory/${item.id}`} className="text-sm font-medium text-brand-400 hover:text-brand-300 font-mono transition-colors">
                        {item.itemCode}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{item.name}</td>
                    <td className="px-4 py-3"><span className="badge badge-neutral">{item.category || '—'}</span></td>
                    <td className="px-4 py-3 text-sm text-slate-400">{item.unitCost ? `$${Number(item.unitCost).toFixed(2)}` : '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{item.unitOfMeasure || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50">
            <p className="text-sm text-slate-500">Page {page} of {pagination.totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-2 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="btn-ghost p-2 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
