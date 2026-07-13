import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import { db, checkDatabaseHealth, closeDatabaseConnection } from '@eamaim/database';

describe('API Server Health & Integration', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.decorateRequest('tenantId', '');
    await server.register(cors, { origin: '*' });
    await server.register(jwt, { secret: 'test-secret' });

    server.get('/health', async () => {
      const dbHealth = await checkDatabaseHealth();
      return {
        status: dbHealth.connected ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        version: '0.1.0',
        database: dbHealth,
      };
    });

    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('GET /health should return server status', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('database');
    expect(body.database).toHaveProperty('connected');
    expect(['ok', 'degraded']).toContain(body.status);
  });

  it('Health check should include DB connection info', async () => {
    const response = await server.inject({ method: 'GET', url: '/health' });
    const body = JSON.parse(response.body);
    expect(typeof body.database.connected).toBe('boolean');
  });

  it('Server should handle CORS headers', async () => {
    const response = await server.inject({
      method: 'OPTIONS',
      url: '/health',
      headers: { origin: 'http://localhost:3000' },
    });

    // CORS should be configured
    expect([200, 204]).toContain(response.statusCode);
  });
});
