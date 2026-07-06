import { FastifyInstance } from 'fastify';
import { authService } from '../services/auth.service';

export async function authRoutes(server: FastifyInstance) {
  // POST /api/v1/auth/login
  server.post('/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password are required' });
    }

    const result = await authService.login(email, password, request.ip, request.headers['user-agent']);
    if (!result) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    // Sign JWT with user info
    const jwt = server.jwt.sign({
      sub: result.user.id,
      email: result.user.email,
      tenantId: result.user.tenantId,
      role: result.user.role,
    });

    return {
      token: jwt,
      refreshToken: result.refreshToken,
      expiresIn: 86400,
      user: result.user,
    };
  });

  // POST /api/v1/auth/refresh
  server.post('/refresh', async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken: string };
    if (!refreshToken) {
      return reply.code(400).send({ error: 'Refresh token required' });
    }

    const result = await authService.refresh(refreshToken);
    if (!result) {
      return reply.code(401).send({ error: 'Invalid or expired refresh token' });
    }

    return result;
  });

  // POST /api/v1/auth/logout
  server.post('/logout', async (request, reply) => {
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || '';
    await authService.logout(token);
    return { message: 'Logged out' };
  });

  // GET /api/v1/auth/me — Current user profile
  server.get('/me', async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).sub;
      const user = await authService.getCurrentUser(userId);
      if (!user) return reply.code(404).send({ error: 'User not found' });
      return { data: user };
    } catch {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });
}
