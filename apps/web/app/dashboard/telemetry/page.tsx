'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';
import { Activity, Cpu, AlertTriangle, Bell, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TelemetryPage() {
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data: sensorsData, isLoading } = useQuery({
    queryKey: ['sensors', page],
    queryFn: () => api.get(`/api/v1/telemetry/sensors?page=${page}&limit=${limit}`),
  });

  const { data: alertsData } = useQuery({
    queryKey: ['active-alerts'],
    queryFn: () => api.get('/api/v1/telemetry/alerts'),
  });

  const { data: rulesData } = useQuery({
    queryKey: ['alert-rules'],
    queryFn: () => api.get('/api/v1/telemetry/alert-rules'),
  });

  const sensors = sensorsData?.data || [];
  const pagination = sensorsData?.pagination || { page: 1, limit, total: 0, totalPages: 0 };
  const alerts = alertsData?.data || [];
  const rules = rulesData?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Telemetry & IoT</h1>
          <p className="text-slate-400 mt-1">Real-time sensor monitoring & alerts</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card border-purple-500/20">
          <Cpu className="w-5 h-5 text-purple-400" />
          <div className="mt-2">
            <p className="text-2xl font-bold text-white">{pagination.total}</p>
            <p className="text-sm text-slate-400">Registered Sensors</p>
          </div>
        </div>
        <div className="stat-card border-rose-500/20">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <div className="mt-2">
            <p className="text-2xl font-bold text-white">{alerts.length}</p>
            <p className="text-sm text-slate-400">Active Alerts</p>
          </div>
        </div>
        <div className="stat-card border-amber-500/20">
          <Bell className="w-5 h-5 text-amber-400" />
          <div className="mt-2">
            <p className="text-2xl font-bold text-white">{rules.length}</p>
            <p className="text-sm text-slate-400">Alert Rules</p>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="glass-card p-5 border-rose-500/20">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Active Alerts
          </h3>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert: any) => (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                <div>
                  <p className="text-sm text-white">{alert.sensorId}</p>
                  <p className="text-xs text-slate-500">Value: {alert.alertValue} · {alert.severity}</p>
                </div>
                <span className="badge badge-danger">{alert.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sensor Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800/50">
          <h3 className="text-sm font-semibold text-white">Sensor Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                {['Sensor Code', 'Name', 'Type', 'Unit', 'Asset'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="table-row">{Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-24 rounded" /></td>
                  ))}</tr>
                ))
              ) : sensors.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500"><Cpu className="w-8 h-8 mx-auto mb-2 text-slate-600" />No sensors registered</td></tr>
              ) : (
                sensors.map((s: any) => (
                  <tr key={s.id} className="table-row">
                    <td className="px-4 py-3 text-sm font-mono text-brand-400">{s.sensorCode}</td>
                    <td className="px-4 py-3 text-sm text-white">{s.name}</td>
                    <td className="px-4 py-3"><span className="badge badge-info">{s.sensorType || '—'}</span></td>
                    <td className="px-4 py-3 text-sm text-slate-400">{s.unit || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 font-mono text-xs">{s.assetId ? s.assetId.slice(0, 8) + '...' : '—'}</td>
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
