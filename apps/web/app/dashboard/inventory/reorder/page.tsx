'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, AlertTriangle, Package, ShoppingCart } from 'lucide-react';

export default function ReorderAlertsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['reorder-alerts'],
    queryFn: () => api.get('/api/v1/inventory/reorder-alerts'),
  });

  const alerts = data?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/inventory" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Inventory
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">Reorder Alerts</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">Reorder Alerts</h1>
        <p className="text-slate-400 mt-1">{alerts.length} items below reorder point</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
      ) : alerts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Package className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
          <p className="text-white font-medium">All stock levels healthy</p>
          <p className="text-slate-500 mt-1 text-sm">No items are below their reorder point</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert: any, i: number) => (
            <div key={i} className="glass-card p-5 flex items-center justify-between hover:border-amber-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{alert.item_name || alert.item_code || `Item ${i + 1}`}</p>
                  <p className="text-xs text-slate-500 font-mono">{alert.item_code}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-rose-400 font-bold">{alert.quantity_on_hand ?? '—'}</p>
                  <p className="text-xs text-slate-500">On Hand</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-400 font-bold">{alert.reorder_point ?? '—'}</p>
                  <p className="text-xs text-slate-500">Reorder Point</p>
                </div>
                <div className="text-center">
                  <p className="text-brand-400 font-bold">{alert.reorder_quantity ?? '—'}</p>
                  <p className="text-xs text-slate-500">Order Qty</p>
                </div>
                <Link href="/dashboard/procurement" className="btn-secondary flex items-center gap-1.5 text-xs">
                  <ShoppingCart className="w-3.5 h-3.5" /> Create PO
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
