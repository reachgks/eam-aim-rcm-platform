import { FastifyInstance } from 'fastify';
import { db } from '@eamaim/database';
import { auditLog } from '@eamaim/database/schema';

/**
 * Maps HTTP methods to audit action enum values.
 */
const methodToAction: Record<string, string> = {
  POST: 'CREATE',
  PUT: 'UPDATE',
  PATCH: 'UPDATE',
  DELETE: 'DELETE',
};

/**
 * Extracts entity type and ID from the request URL.
 * e.g. /api/v1/assets/abc-123 → { entityType: 'assets', entityId: 'abc-123' }
 */
function extractEntityInfo(url: string): { entityType: string; entityId: string | null } {
  const segments = url.replace(/\?.*$/, '').split('/').filter(Boolean);
  // URL pattern: api / v1 / <module> / <id?> / <sub-resource?> / <sub-id?>
  // We want the primary module and its ID
  const moduleIndex = segments.indexOf('v1');
  if (moduleIndex >= 0 && segments[moduleIndex + 1]) {
    const entityType = segments[moduleIndex + 1]; // e.g. 'assets', 'maintenance'
    const entityId = segments[moduleIndex + 2] || null; // e.g. UUID or null
    // Only treat it as an ID if it looks like a UUID or numeric
    const isId = entityId && /^[0-9a-f-]{8,}$/i.test(entityId);
    return { entityType, entityId: isId ? entityId : null };
  }
  return { entityType: 'unknown', entityId: null };
}

export async function auditMiddleware(server: FastifyInstance) {
  server.addHook('onResponse', async (request, reply) => {
    const method = request.method;
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return;

    const tenantId = (request as any).tenantId;
    if (!tenantId) return; // Skip non-tenant requests (health checks, etc.)

    const userId = (request.user as any)?.sub || null;
    const action = methodToAction[method] || 'UPDATE';
    const { entityType, entityId } = extractEntityInfo(request.url);

    // Fire-and-forget async write — do NOT await to avoid slowing the response
    // (response has already been sent at this point in onResponse hook)
    db.insert(auditLog).values({
      tenantId,
      userId,
      action: action as any,
      entityType,
      entityId,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'] || null,
    }).catch((err) => {
      // Log DB write failures but never crash the request
      server.log.warn({ err: err.message, entityType, action }, 'Audit log write failed');
    });

    // Also log to stdout for observability
    server.log.info({
      audit: true,
      action,
      entityType,
      entityId,
      userId,
      tenantId,
      statusCode: reply.statusCode,
      responseTime: reply.elapsedTime,
    }, 'audit');
  });
}
