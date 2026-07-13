'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import {
  Box, Wrench, Package, AlertTriangle, TrendingUp, TrendingDown,
  CheckCircle2, Clock, Activity, Shield, BarChart3, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

function StatCard({
  title, value, subtitle, icon: Icon, trend, trendUp, color, href,
}: {
  title: string; value: string | number; subtitle: string;
  icon: any; trend?: string; trendUp?: boolean; color: string; href?: string;
}) {
  const colorMap: Record<string, string> = {
    brand: 'from-brand-600/20 to-brand-600/5 border-brand-500/20 text-brand-400',
    emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-600/20 to-amber-600/5 border-amber-500/20 text-amber-400',
    rose: 'from-rose-600/20 to-rose-600/5 border-rose-500/20 text-rose-400',
    sky: 'from-sky-600/20 to-sky-600/5 border-sky-500/20 text-sky-400',
    purple: 'from-purple-600/20 to-purple-600/5 border-purple-500/20 text-purple-400',
  };

  const Card = href ? Link : 'div';

  return (
    <Card
      href={href || ''}
      className={`stat-card bg-gradient-to-br ${colorMap[color]} group ${href ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-lg bg-slate-800/60">
          <Icon className="w-5 h-5" />
        </div>
        {href && (
          <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400 mt-0.5">{title}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-slate-500">{subtitle}</p>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
    </Card>
  );
}

function StatusBadge({ status, count }: { status: string; count: number }) {
  const colors: Record<string, string> = {
    ACTIVE: 'badge-success',
    COMPLETED: 'badge-success',
    IN_PROGRESS: 'badge-info',
    PLANNED: 'badge-brand',
    DRAFT: 'badge-neutral',
    ON_HOLD: 'badge-warning',
    OVERDUE: 'badge-danger',
    CRITICAL: 'badge-danger',
    HIGH: 'badge-warning',
    MEDIUM: 'badge-info',
    LOW: 'badge-neutral',
    STANDBY: 'badge-warning',
    OUT_OF_SERVICE: 'badge-danger',
  };

  return (
    <div className="flex items-center justify-between py-2.5">
      <span className={`badge ${colors[status] || 'badge-neutral'}`}>{status.replace(/_/g, ' ')}</span>
      <span className="text-sm font-semibold text-white">{count}</span>
    </div>
  );
}

function SectionCard({ title, children, href }: { title: string; children: React.ReactNode; href?: string }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {href && (
          <Link href={href} className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: assetSummary } = useQuery({
    queryKey: ['reports', 'assets'],
    queryFn: () => api.get('/api/v1/reports/assets/summary'),
  });

  const { data: maintenanceKpis } = useQuery({
    queryKey: ['reports', 'maintenance'],
    queryFn: () => api.get('/api/v1/reports/maintenance/kpis'),
  });

  const { data: woSummary } = useQuery({
    queryKey: ['maintenance', 'summary'],
    queryFn: () => api.get('/api/v1/maintenance/work-orders/summary'),
  });

  const { data: assetStatus } = useQuery({
    queryKey: ['assets', 'status'],
    queryFn: () => api.get('/api/v1/assets/summary/status'),
  });

  const { data: reorderAlerts } = useQuery({
    queryKey: ['inventory', 'reorder'],
    queryFn: () => api.get('/api/v1/inventory/reorder-alerts'),
  });

  const { data: slaSummary } = useQuery({
    queryKey: ['sla', 'summary'],
    queryFn: () => api.get('/api/v1/sla/summary'),
  });

  const { data: complianceDash } = useQuery({
    queryKey: ['regulatory', 'dashboard'],
    queryFn: () => api.get('/api/v1/regulatory/dashboard'),
  });

  // Extract KPI values safely
  const mkpi = maintenanceKpis?.data || {};
  const totalAssets = assetStatus?.data?.reduce((acc: number, s: any) => acc + Number(s.count || 0), 0) || 0;
  const activeAssets = assetStatus?.data?.find((s: any) => s.status === 'ACTIVE')?.count || 0;
  const reorderCount = reorderAlerts?.data?.length || 0;
  const openWOs = woSummary?.data?.byStatus?.find((s: any) => s.status === 'IN_PROGRESS')?.count || 0;
  const breaches = slaSummary?.data?.totalBreaches || 0;
  const compliance = complianceDash?.data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.firstName}
          </h1>
          <p className="text-slate-400 mt-1">Here&apos;s what&apos;s happening across your facility</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Assets" value={totalAssets} subtitle={`${activeAssets} active`} icon={Box} trend="+3.2%" trendUp color="brand" href="/dashboard/assets" />
        <StatCard title="Open Work Orders" value={openWOs} subtitle="In progress" icon={Wrench} color="sky" href="/dashboard/maintenance" />
        <StatCard title="Completed WOs" value={mkpi.completed || 0} subtitle="This period" icon={CheckCircle2} trend="+12%" trendUp color="emerald" />
        <StatCard title="Reorder Alerts" value={reorderCount} subtitle="Items low" icon={Package} color={reorderCount > 0 ? 'amber' : 'emerald'} href="/dashboard/inventory" />
        <StatCard title="SLA Breaches" value={breaches} subtitle="Total recorded" icon={Clock} color={breaches > 0 ? 'rose' : 'emerald'} href="/dashboard/sla" />
        <StatCard title="Compliance" value={compliance ? `${Math.round((compliance.passedInspections / Math.max(compliance.totalRequirements, 1)) * 100)}%` : '—'} subtitle={`${compliance?.openViolations || 0} violations`} icon={Shield} color={compliance?.openViolations > 0 ? 'amber' : 'emerald'} href="/dashboard/regulatory" />
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Work Order Status */}
        <SectionCard title="Work Order Status" href="/dashboard/maintenance">
          <div className="divide-y divide-slate-800/50">
            {woSummary?.data?.byStatus?.map((s: any) => (
              <StatusBadge key={s.status} status={s.status} count={Number(s.count)} />
            )) || (
              <div className="py-8 text-center text-slate-500 text-sm">Loading...</div>
            )}
          </div>
        </SectionCard>

        {/* WO by Priority */}
        <SectionCard title="Work Orders by Priority" href="/dashboard/maintenance">
          <div className="divide-y divide-slate-800/50">
            {woSummary?.data?.byPriority?.map((p: any) => (
              <StatusBadge key={p.priority} status={p.priority} count={Number(p.count)} />
            )) || (
              <div className="py-8 text-center text-slate-500 text-sm">Loading...</div>
            )}
          </div>
        </SectionCard>

        {/* Asset Status */}
        <SectionCard title="Asset Status" href="/dashboard/assets">
          <div className="divide-y divide-slate-800/50">
            {assetStatus?.data?.map((s: any) => (
              <StatusBadge key={s.status} status={s.status} count={Number(s.count)} />
            )) || (
              <div className="py-8 text-center text-slate-500 text-sm">Loading...</div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { icon: Wrench, label: 'New Work Order', href: '/dashboard/maintenance', color: 'text-sky-400' },
            { icon: Box, label: 'Register Asset', href: '/dashboard/assets', color: 'text-brand-400' },
            { icon: Package, label: 'Stock Issue', href: '/dashboard/inventory', color: 'text-amber-400' },
            { icon: Shield, label: 'Work Permit', href: '/dashboard/safety', color: 'text-emerald-400' },
            { icon: Activity, label: 'Sensor Data', href: '/dashboard/telemetry', color: 'text-purple-400' },
            { icon: BarChart3, label: 'Reports', href: '/dashboard/rcm', color: 'text-rose-400' },
          ].map(({ icon: Icon, label, href, color }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800/30 hover:border-slate-700/50 transition-all duration-200 group"
            >
              <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
              <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
