'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, Plus, Search, ChevronLeft, ChevronRight,
  Users, FileText, Truck, DollarSign, ArrowUpRight
} from 'lucide-react';

const poStatusColors: Record<string, string> = {
  DRAFT: 'badge-neutral', SUBMITTED: 'badge-brand', APPROVED: 'badge-info',
  ORDERED: 'bg-sky-500/15 text-sky-400 border border-sky-500/20',
  PARTIAL: 'badge-warning', RECEIVED: 'badge-success', CANCELLED: 'badge-neutral',
};

export default function ProcurementPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'vendors' | 'pos'>('pos');
  const limit = 15;

  const { data: vendorsData } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => api.get('/api/v1/procurement/vendors?limit=100'),
  });

  const { data: posData, isLoading: posLoading } = useQuery({
    queryKey: ['purchase-orders', page],
    queryFn: () => api.get(`/api/v1/procurement/purchase-orders?page=${page}&limit=${limit}`),
  });

  const vendors = vendorsData?.data || [];
  const purchaseOrders = posData?.data || [];
  const poPagination = posData?.pagination || { page: 1, limit, total: 0, totalPages: 0 };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Procurement</h1>
          <p className="text-slate-400 mt-1">Vendors, purchase orders & goods receipts</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card border-brand-500/20">
          <Users className="w-5 h-5 text-brand-400" />
          <div className="mt-2">
            <p className="text-2xl font-bold text-white">{vendors.length}</p>
            <p className="text-sm text-slate-400">Vendors</p>
          </div>
        </div>
        <div className="stat-card border-sky-500/20">
          <FileText className="w-5 h-5 text-sky-400" />
          <div className="mt-2">
            <p className="text-2xl font-bold text-white">{poPagination.total}</p>
            <p className="text-sm text-slate-400">Purchase Orders</p>
          </div>
        </div>
        <div className="stat-card border-emerald-500/20">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <div className="mt-2">
            <p className="text-2xl font-bold text-white">
              ${purchaseOrders.reduce((a: number, po: any) => a + Number(po.totalAmount || 0), 0).toLocaleString()}
            </p>
            <p className="text-sm text-slate-400">Total Value (This Page)</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-800/40 rounded-lg p-1 w-fit">
        {['pos', 'vendors'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'pos' ? 'Purchase Orders' : 'Vendors'}
          </button>
        ))}
      </div>

      {activeTab === 'pos' ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  {['PO Number', 'Vendor', 'Status', 'Total Amount', 'Created'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="table-row">{Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-24 rounded" /></td>
                    ))}</tr>
                  ))
                ) : purchaseOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500"><ShoppingCart className="w-8 h-8 mx-auto mb-2 text-slate-600" />No purchase orders</td></tr>
                ) : (
                  purchaseOrders.map((po: any) => (
                    <tr key={po.id} className="table-row">
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/procurement/${po.id}`} className="text-sm font-medium text-brand-400 hover:text-brand-300 font-mono transition-colors">
                          {po.poNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-white">{po.vendorId || '—'}</td>
                      <td className="px-4 py-3"><span className={`badge ${poStatusColors[po.status] || 'badge-neutral'}`}>{po.status?.replace(/_/g, ' ')}</span></td>
                      <td className="px-4 py-3 text-sm text-white font-medium">{po.totalAmount ? `$${Number(po.totalAmount).toLocaleString()}` : '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{new Date(po.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {poPagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50">
              <p className="text-sm text-slate-500">Page {page} of {poPagination.totalPages}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-2 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage(p => Math.min(poPagination.totalPages, p + 1))} disabled={page === poPagination.totalPages} className="btn-ghost p-2 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.length === 0 ? (
            <div className="glass-card p-12 text-center col-span-full">
              <Users className="w-10 h-10 mx-auto mb-3 text-slate-600" />
              <p className="text-white font-medium">No vendors registered</p>
            </div>
          ) : (
            vendors.map((vendor: any) => (
              <div key={vendor.id} className="glass-card p-5 hover:border-brand-500/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{vendor.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{vendor.code}</p>
                  </div>
                  <span className={`badge ${vendor.isActive ? 'badge-success' : 'badge-neutral'}`}>
                    {vendor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-400">
                  {vendor.category && <p>Category: <span className="text-white">{vendor.category}</span></p>}
                  {vendor.contactName && <p>Contact: <span className="text-white">{vendor.contactName}</span></p>}
                  {vendor.contactEmail && <p>Email: <span className="text-brand-400">{vendor.contactEmail}</span></p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
