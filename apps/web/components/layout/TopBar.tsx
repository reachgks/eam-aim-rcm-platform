'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { LogOut, Bell, Search, User } from 'lucide-react';

export function TopBar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '??';

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-xl">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search assets, work orders, items..."
            className="input-field pl-10 py-2 text-sm bg-slate-900/40 border-slate-800/50 rounded-lg"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-800/50 rounded border border-slate-700/50">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950" />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-800/50">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[11px] text-slate-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-glow-brand">
            {initials}
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
