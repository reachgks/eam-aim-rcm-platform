'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DollarSign, TrendingDown, Building2, PiggyBank } from 'lucide-react';

export default function FinancialsPage() {
  const { data: costSummary } = useQuery({ queryKey: ['cost-summary'], queryFn: () => api.get('/api/v1/reports/financials/cost-summary') });
  const { data: costCenters } = useQuery({ queryKey: ['cost-centers'], queryFn: () => api.get('/api/v1/financials/cost-centers') });
  const { data: budgets } = useQuery({ queryKey: ['budgets'], queryFn: () => api.get('/api/v1/financials/budgets') });

  const costs = costSummary?.data || [];
  const centers = costCenters?.data || [];
  const budgetList = budgets?.data || [];
  const totalCost = costs.reduce((a: number, c: any) => a + Number(c.total_amount || 0), 0);

  const categoryColors: Record<string, string> = { LABOR: 'bg-sky-500', MATERIAL: 'bg-amber-500', SERVICE: 'bg-purple-500', OVERHEAD: 'bg-rose-500', DEPRECIATION: 'bg-emerald-500', OTHER: 'bg-slate-500' };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Financials</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card border-emerald-500/20"><DollarSign className="w-5 h-5 text-emerald-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">${totalCost.toLocaleString()}</p><p className="text-sm text-slate-400">Total Costs</p></div></div>
        <div className="stat-card border-brand-500/20"><Building2 className="w-5 h-5 text-brand-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{centers.length}</p><p className="text-sm text-slate-400">Cost Centers</p></div></div>
        <div className="stat-card border-amber-500/20"><PiggyBank className="w-5 h-5 text-amber-400" /><div className="mt-2"><p className="text-2xl font-bold text-white">{budgetList.length}</p><p className="text-sm text-slate-400">Budgets</p></div></div>
      </div>

      {/* Cost Breakdown */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Cost Breakdown by Category</h3>
        <div className="space-y-3">
          {costs.map((c: any) => {
            const pct = totalCost > 0 ? (Number(c.total_amount) / totalCost) * 100 : 0;
            return (
              <div key={c.cost_category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-400">{c.cost_category}</span>
                  <div className="flex items-center gap-3"><span className="text-xs text-slate-500">{c.transaction_count} txns</span><span className="text-sm font-medium text-white">${Number(c.total_amount).toLocaleString()}</span></div>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${categoryColors[c.cost_category] || 'bg-slate-600'} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
