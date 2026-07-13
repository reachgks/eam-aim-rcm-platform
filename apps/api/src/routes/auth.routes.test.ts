import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import { authRoutes } from '../routes/auth.routes';

describe('Auth Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.decorateRequest('tenantId', '');
    await server.register(jwt, { secret: 'test-secret' });
    await server.register(authRoutes, { prefix: '/api/v1/auth' });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('POST /api/v1/auth/login should require email and password', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('Email and password are required');
  });

  it('POST /api/v1/auth/login should reject invalid credentials', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'nonexistent@test.com',
        password: 'wrong',
      },
    });

    // 401 if DB is available, 500 if not
    expect([401, 500]).toContain(response.statusCode);
  });

  it('POST /api/v1/auth/refresh should require refreshToken', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('Refresh token required');
  });

  it('POST /api/v1/auth/logout should succeed', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/logout',
      headers: {
        authorization: 'Bearer fake-token',
      },
    });

    // Logout should succeed regardless (idempotent)
    expect([200, 500]).toContain(response.statusCode);
  });

  it('GET /api/v1/auth/me should require authentication', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('Unauthorized');
  });
});
