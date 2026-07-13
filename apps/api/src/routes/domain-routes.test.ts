import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import { telemetryRoutes } from '../routes/telemetry.routes';
import { rcmRoutes } from '../routes/rcm.routes';
import { safetyRoutes } from '../routes/safety.routes';
import { regulatoryRoutes } from '../routes/regulatory.routes';

function setupServer(routeFn: Function, prefix: string): FastifyInstance {
  const server = Fastify({ logger: false });
  server.decorateRequest('tenantId', 'test-tenant-id');
  server.addHook('onRequest', async (request) => {
    request.tenantId = 'test-tenant-id';
  });
  return server;
}

describe('Telemetry Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = setupServer(telemetryRoutes, '/api/v1/telemetry');
    await server.register(jwt, { secret: 'test-secret' });
    await server.register(telemetryRoutes, { prefix: '/api/v1/telemetry' });
    await server.ready();
  });

  afterAll(() => server.close());

  it('GET /sensors should return paginated sensor list', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/telemetry/sensors' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('pagination');
  });

  it('GET /alerts should return active alerts', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/telemetry/alerts' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /alert-rules should return rules', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/telemetry/alert-rules' });
    expect(res.statusCode).toBe(200);
  });
});

describe('RCM Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = setupServer(rcmRoutes, '/api/v1/rcm');
    await server.register(jwt, { secret: 'test-secret' });
    await server.register(rcmRoutes, { prefix: '/api/v1/rcm' });
    await server.ready();
  });

  afterAll(() => server.close());

  it('GET /rca should return root cause analyses', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/rcm/rca' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /weibull should return Weibull analyses', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/rcm/weibull' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /failure-events should return events', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/rcm/failure-events' });
    expect(res.statusCode).toBe(200);
  });
});

describe('Safety Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = setupServer(safetyRoutes, '/api/v1/safety');
    await server.register(jwt, { secret: 'test-secret' });
    await server.register(safetyRoutes, { prefix: '/api/v1/safety' });
    await server.ready();
  });

  afterAll(() => server.close());

  it('GET /permits should return paginated permits', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/safety/permits' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /permit-types should return types', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/safety/permit-types' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /observations should return safety observations', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/safety/observations' });
    expect(res.statusCode).toBe(200);
  });
});

describe('Regulatory Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = setupServer(regulatoryRoutes, '/api/v1/regulatory');
    await server.register(jwt, { secret: 'test-secret' });
    await server.register(regulatoryRoutes, { prefix: '/api/v1/regulatory' });
    await server.ready();
  });

  afterAll(() => server.close());

  it('GET /regulations should return list', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/regulatory/regulations' });
    expect(res.statusCode).toBe(200);
  });

  it('GET /dashboard should return compliance summary', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/regulatory/dashboard' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveProperty('totalRequirements');
    expect(body.data).toHaveProperty('openViolations');
  });

  it('GET /inspections should return paginated inspections', async () => {
    const res = await server.inject({ method: 'GET', url: '/api/v1/regulatory/inspections' });
    expect(res.statusCode).toBe(200);
  });
});
