'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Box, Wrench, Package, ShoppingCart,
  DollarSign, Activity, Shield, FileCheck, Building2,
  Users, Briefcase, ClipboardList, Timer, BadgeCheck,
  BarChart3, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/dashboard/assets', icon: Box, label: 'Assets' },
      { href: '/dashboard/maintenance', icon: Wrench, label: 'Maintenance' },
      { href: '/dashboard/inventory', icon: Package, label: 'Inventory' },
      { href: '/dashboard/procurement', icon: ShoppingCart, label: 'Procurement' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { href: '/dashboard/telemetry', icon: Activity, label: 'Telemetry' },
      { href: '/dashboard/rcm', icon: BarChart3, label: 'RCM' },
      { href: '/dashboard/financials', icon: DollarSign, label: 'Financials' },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { href: '/dashboard/safety', icon: Shield, label: 'Safety' },
      { href: '/dashboard/regulatory', icon: FileCheck, label: 'Regulatory' },
      { href: '/dashboard/sla', icon: Timer, label: 'SLA' },
    ],
  },
  {
    label: 'Management',
    items: [
      { href: '/dashboard/labor', icon: Users, label: 'Labor' },
      { href: '/dashboard/projects', icon: Briefcase, label: 'Projects' },
      { href: '/dashboard/service-requests', icon: ClipboardList, label: 'Service Requests' },
      { href: '/dashboard/warranty', icon: BadgeCheck, label: 'Warranty' },
      { href: '/dashboard/bim', icon: Building2, label: 'BIM' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/50 z-40 transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800/50">
        <div className="w-9 h-9 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0 shadow-glow-brand">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="ml-3 animate-fade-in">
            <p className="text-sm font-bold text-white">EAM Platform</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Enterprise</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-2 px-3">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-brand-400' : ''}`} />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 flex items-center justify-center border-t border-slate-800/50 text-slate-500 hover:text-white hover:bg-slate-800/30 transition-all"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
