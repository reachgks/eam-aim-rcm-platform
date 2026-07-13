import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import { inventoryRoutes } from '../routes/inventory.routes';

describe('Inventory Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify({ logger: false });
    server.decorateRequest('tenantId', 'test-tenant-id');
    await server.register(jwt, { secret: 'test-secret' });
    server.addHook('onRequest', async (request) => {
      request.tenantId = 'test-tenant-id';
    });
    await server.register(inventoryRoutes, { prefix: '/api/v1/inventory' });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('GET /stock-items should return paginated results', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/inventory/stock-items',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('pagination');
  });

  it('GET /stock-items/:id should return 404 for non-existent item', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/inventory/stock-items/00000000-0000-0000-0000-000000000000',
    });

    expect(response.statusCode).toBe(404);
  });

  it('GET /storerooms should return storeroom list', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/inventory/storerooms',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('data');
  });

  it('GET /reorder-alerts should return items below reorder point', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/inventory/reorder-alerts',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('data');
  });
});
