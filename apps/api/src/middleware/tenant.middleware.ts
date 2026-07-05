import { FastifyInstance } from 'fastify';

export async function tenantMiddleware(server: FastifyInstance) {
  server.addHook('onRequest', async (request, reply) => {
    const tenantId = request.headers['x-tenant-id'] as string;
    const jwtTenantId = (request.user as any)?.tenantId;
    const effectiveTenantId = tenantId || jwtTenantId;

    if (!effectiveTenantId) {
      return reply.code(400).send({ error: 'Tenant ID required' });
    }

    (request as any).tenantId = effectiveTenantId;

    // Set PostgreSQL session variable for RLS
    // await db.execute(sql`SET app.current_tenant_id = ${effectiveTenantId}`);
  });
}
