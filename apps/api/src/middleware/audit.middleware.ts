import { FastifyInstance } from 'fastify';

export async function auditMiddleware(server: FastifyInstance) {
  server.addHook('onResponse', async (request, reply) => {
    const method = request.method;
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const auditEntry = {
        userId: (request.user as any)?.sub,
        tenantId: (request as any).tenantId,
        action: method,
        resource: request.url,
        statusCode: reply.statusCode,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        timestamp: new Date().toISOString(),
      };
      // TODO: Write to audit_log table asynchronously
      server.log.info({ audit: auditEntry }, 'Audit log entry');
    }
  });
}
