import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@eamaim/database';
import { roleAssignments, roles } from '@eamaim/database/schema';
import { eq, and } from 'drizzle-orm';

/**
 * In-memory permission cache (per-request is too expensive for high-traffic APIs).
 * TTL = 5 minutes. Keyed by `userId:tenantId`.
 */
const permissionCache = new Map<string, { permissions: string[]; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function resolvePermissions(userId: string, tenantId: string): Promise<string[]> {
  const cacheKey = `${userId}:${tenantId}`;
  const cached = permissionCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.permissions;
  }

  // Load from DB: user → role_assignments → roles.permissions
  const assignments = await db.select({
    permissions: roles.permissions,
  })
    .from(roleAssignments)
    .innerJoin(roles, and(
      eq(roleAssignments.roleId, roles.id),
      eq(roles.isActive, true),
    ))
    .where(and(
      eq(roleAssignments.userId, userId),
      eq(roleAssignments.tenantId, tenantId),
    ));

  // Flatten all role permissions into a deduplicated set
  const allPermissions = new Set<string>();
  for (const assignment of assignments) {
    const perms = assignment.permissions;
    if (Array.isArray(perms)) {
      perms.forEach(p => allPermissions.add(p));
    } else if (perms && typeof perms === 'object') {
      // Handle object-style permissions: { assets: ['create','read','*'], ... }
      for (const [module, actions] of Object.entries(perms)) {
        if (Array.isArray(actions)) {
          if (actions.includes('*')) {
            allPermissions.add(`${module.toUpperCase()}:*`);
          } else {
            actions.forEach(a => allPermissions.add(`${module.toUpperCase()}_${a.toUpperCase()}`));
          }
        }
      }
    }
  }

  const result = Array.from(allPermissions);
  permissionCache.set(cacheKey, { permissions: result, expiresAt: Date.now() + CACHE_TTL_MS });
  return result;
}

/**
 * RBAC middleware plugin — loads user permissions from DB and decorates the request.
 */
export async function rbacMiddleware(server: FastifyInstance) {
  server.decorateRequest('permissions', null);

  server.addHook('onRequest', async (request: FastifyRequest, _reply: FastifyReply) => {
    const user = request.user as any;
    if (!user?.sub) return;

    const tenantId = (request as any).tenantId;
    if (!tenantId) return;

    const permissions = await resolvePermissions(user.sub, tenantId);
    (request as any).permissions = permissions;
  });
}

/**
 * Route-level permission guard factory.
 * Usage: server.get('/admin', { preHandler: requirePermission('ADMIN_USERS') }, handler)
 *
 * Supports wildcard: 'ASSETS:*' matches any ASSETS_* permission.
 */
export function requirePermission(...requiredPermissions: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userPermissions: string[] = (request as any).permissions || [];

    // Admin wildcard — if user has any *:* or module:* that covers the requirement
    const hasPermission = requiredPermissions.some(required => {
      // Direct match
      if (userPermissions.includes(required)) return true;

      // Wildcard match: user has 'ASSETS:*' and we require 'ASSET_CREATE'
      const requiredModule = required.split('_')[0];
      if (userPermissions.includes(`${requiredModule}:*`)) return true;

      // Super-admin wildcard
      if (userPermissions.includes('*:*') || userPermissions.includes('ADMIN:*')) return true;

      return false;
    });

    if (!hasPermission) {
      reply.code(403).send({
        error: 'Forbidden',
        message: 'Insufficient permissions',
        required: requiredPermissions,
      });
    }
  };
}

/**
 * Invalidate cached permissions for a user (call after role change).
 */
export function invalidatePermissionCache(userId: string, tenantId: string) {
  permissionCache.delete(`${userId}:${tenantId}`);
}

/**
 * Clear the entire permission cache (call on role definition changes).
 */
export function clearPermissionCache() {
  permissionCache.clear();
}
