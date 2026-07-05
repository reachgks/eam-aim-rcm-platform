import { FastifyInstance } from 'fastify';

export async function authRoutes(server: FastifyInstance) {
  server.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;
    // TODO: Validate credentials, generate JWT
    const token = server.jwt.sign({ sub: 'user-id', email, tenantId: 'tenant-id' });
    return { token, refreshToken: 'refresh-token', expiresIn: 86400 };
  });

  server.post('/register', async (request, reply) => {
    return reply.code(201).send({ message: 'User registered' });
  });

  server.post('/refresh', async (request, reply) => {
    return { token: 'new-token', refreshToken: 'new-refresh' };
  });

  server.post('/logout', async (request, reply) => {
    return { message: 'Logged out' };
  });

  server.get('/me', async (request, reply) => {
    return { user: null };
  });

  server.post('/sso/callback', async (request, reply) => {
    return { token: 'sso-token' };
  });
}
