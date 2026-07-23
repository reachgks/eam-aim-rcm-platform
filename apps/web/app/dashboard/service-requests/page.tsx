'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';

const statusColors: Record<string, string> = { NEW: 'badge-brand', OPEN: 'badge-info', IN_PROGRESS: 'bg-sky-500/15 text-sky-400 border border-sky-500/20', RESOLVED: 'badge-success', CLOSED: 'badge-neutral' };

export default function ServiceRequestsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({ queryKey: ['service-requests', page], queryFn: () => api.get(`/api/v1/service-requests?page=${page}&limit=15`) });
  const requests = data?.data || []; const pagination = data?.pagination || { page: 1, total: 0, totalPages: 0 };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Service Requests</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-slate-800/50">{['#', 'Description', 'Status', 'Priority', 'Created'].map(h => (<th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>))}</tr></thead>
          <tbody>{isLoading ? Array.from({ length: 5 }).map((_, i) => (<tr key={i} className="table-row">{Array.from({ length: 5 }).map((_, j) => (<td key={j} className="px-4 py-3"><div className="skeleton h-4 w-24 rounded" /></td>))}</tr>)) : requests.length === 0 ? (<tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500"><ClipboardList className="w-8 h-8 mx-auto mb-2 text-slate-600" />No service requests</td></tr>) : requests.map((sr: any) => (
            <tr key={sr.id} className="table-row"><td className="px-4 py-3 text-sm font-mono text-brand-400">{sr.requestNumber || sr.id?.slice(0, 8)}</td><td className="px-4 py-3 text-sm text-white max-w-[300px] truncate">{sr.description || '—'}</td><td className="px-4 py-3"><span className={`badge ${statusColors[sr.status] || 'badge-neutral'}`}>{sr.status}</span></td><td className="px-4 py-3"><span className={`badge ${sr.priority === 'HIGH' ? 'badge-danger' : sr.priority === 'MEDIUM' ? 'badge-warning' : 'badge-neutral'}`}>{sr.priority || '—'}</span></td><td className="px-4 py-3 text-sm text-slate-400">{sr.createdAt ? new Date(sr.createdAt).toLocaleDateString() : '—'}</td></tr>
          ))}</tbody></table>
        {pagination.totalPages > 1 && (<div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50"><p className="text-sm text-slate-500">Page {page} of {pagination.totalPages}</p><div className="flex gap-1"><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-2 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button><button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="btn-ghost p-2 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button></div></div>)}
      </div>
    </div>
  );
}
