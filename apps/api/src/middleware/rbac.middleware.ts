import { FastifyInstance } from 'fastify';

export async function rbacMiddleware(server: FastifyInstance) {
  server.decorateRequest('permissions', null);

  server.addHook('onRequest', async (request, reply) => {
    const user = request.user as any;
    if (!user) return;
    // TODO: Load user permissions from database
    (request as any).permissions = user.permissions || [];
  });
}

export function requirePermission(...permissions: string[]) {
  return async (request: any, reply: any) => {
    const userPermissions = request.permissions || [];
    const hasPermission = permissions.some(p => userPermissions.includes(p));
    if (!hasPermission) {
      reply.code(403).send({ error: 'Forbidden', message: 'Insufficient permissions' });
    }
  };
}
