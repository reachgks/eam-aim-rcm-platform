'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Calendar, Repeat, Settings2 } from 'lucide-react';

export default function MaintenancePlansPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['maintenance-plans'],
    queryFn: () => api.get('/api/v1/maintenance/plans'),
  });

  const plans = data?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/maintenance" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Maintenance
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-600" />
        <span className="text-white font-medium">Maintenance Plans</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance Plans</h1>
          <p className="text-slate-400 mt-1">Preventive & predictive scheduling</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)}
        </div>
      ) : plans.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Settings2 className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-white font-medium">No maintenance plans</p>
          <p className="text-slate-500 mt-1 text-sm">Plans are created via the API or by background workers</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan: any) => (
            <div key={plan.id} className="glass-card p-5 hover:border-brand-500/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-slate-800/60">
                  <Repeat className="w-5 h-5 text-brand-400" />
                </div>
                <span className={`badge ${plan.isActive ? 'badge-success' : 'badge-neutral'}`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{plan.name || plan.planCode}</h3>
              <p className="text-xs text-slate-500 font-mono mb-3">{plan.planCode}</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>{plan.planType?.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Every {plan.frequencyValue} {plan.frequencyUnit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
