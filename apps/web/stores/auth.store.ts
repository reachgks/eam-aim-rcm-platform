'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tenantId: string | null;
  isAuthenticated: boolean;

  setAuth: (data: { user: User; token: string; refreshToken: string }) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      tenantId: null,
      isAuthenticated: false,

      setAuth: ({ user, token, refreshToken }) =>
        set({
          user,
          token,
          refreshToken,
          tenantId: user.tenantId,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          tenantId: null,
          isAuthenticated: false,
        }),

      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === 'admin') return true;
        if (user.permissions.includes('ADMIN:*')) return true;
        if (user.permissions.includes(permission)) return true;
        const module = permission.split('_')[0];
        return user.permissions.includes(`${module}:*`);
      },
    }),
    {
      name: 'eam-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        tenantId: state.tenantId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
