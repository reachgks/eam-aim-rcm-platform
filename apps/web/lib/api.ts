import { useAuthStore } from '@/stores/auth.store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: any
  ) {
    super(data?.error || data?.message || `API Error ${status}`);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit & { noAuth?: boolean } = {}
): Promise<T> {
  const { token, tenantId, logout } = useAuthStore.getState();
  const { noAuth, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (!noAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (tenantId) {
    headers['x-tenant-id'] = tenantId;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (res.status === 401) {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiError(401, { error: 'Session expired' });
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, errorData);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

// Typed API helpers
export const api = {
  get: <T = any>(path: string) => apiFetch<T>(path),
  post: <T = any>(path: string, body: any) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T = any>(path: string, body: any) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T = any>(path: string, body: any) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = any>(path: string) =>
    apiFetch<T>(path, { method: 'DELETE' }),
};
