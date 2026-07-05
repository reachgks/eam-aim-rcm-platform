export interface TenantContext { tenantId: string; userId: string; permissions: string[]; }
export function createTenantContext(tenantId: string, userId: string, permissions: string[] = []): TenantContext { return { tenantId, userId, permissions }; }
