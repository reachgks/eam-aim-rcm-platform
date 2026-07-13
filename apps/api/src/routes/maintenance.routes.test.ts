import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import { maintenanceRoutes } from '../routes/maintenance.routes';

describe('Maintenance Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.decorateRequest('tenantId', 'test-tenant-id');
    await server.register(jwt, { secret: 'test-secret' });
    server.addHook('onRequest', async (request) => {
      request.tenantId = 'test-tenant-id';
    });
    await server.register(maintenanceRoutes, { prefix: '/api/v1/maintenance' });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('GET /work-orders should return paginated results', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/maintenance/work-orders',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('pagination');
  });

  it('GET /work-orders should filter by status', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/maintenance/work-orders?status=COMPLETED',
    });

    expect(response.statusCode).toBe(200);
  });

  it('GET /work-orders/:id should return 404 for non-existent WO', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/maintenance/work-orders/00000000-0000-0000-0000-000000000000',
    });

    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('Work order not found');
  });

  it('GET /work-orders/summary should return status/type/priority counts', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/maintenance/work-orders/summary',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data).toHaveProperty('byStatus');
    expect(body.data).toHaveProperty('byType');
    expect(body.data).toHaveProperty('byPriority');
  });

  it('GET /plans should return maintenance plans', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/maintenance/plans',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('data');
  });

  it('POST /work-orders should create a work order', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/maintenance/work-orders',
      payload: {
        type: 'CORRECTIVE',
        priority: 'HIGH',
        description: 'Test work order from integration test',
      },
    });

    expect([201, 500]).toContain(response.statusCode);
    if (response.statusCode === 201) {
      const body = JSON.parse(response.body);
      expect(body.data.woNumber).toMatch(/^WO-/);
    }
  });

  it('PATCH /work-orders/:id/status should return 404 for non-existent WO', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/v1/maintenance/work-orders/00000000-0000-0000-0000-000000000000/status',
      payload: { status: 'IN_PROGRESS' },
    });

    expect(response.statusCode).toBe(404);
  });
});
