import { FastifyInstance } from 'fastify';

export async function authMiddleware(server: FastifyInstance) {
  server.addHook('onRequest', async (request, reply) => {
    const publicPaths = ['/health', '/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/sso/callback'];
    if (publicPaths.some(p => request.url.startsWith(p))) return;

    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }
  });
}
