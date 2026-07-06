import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { db, setTenantContext, checkDatabaseHealth, closeDatabaseConnection } from '@eamaim/database';
import { assetRoutes } from './routes/assets.routes';
import { authRoutes } from './routes/auth.routes';
import { maintenanceRoutes } from './routes/maintenance.routes';
import { cdeRoutes } from './routes/cde.routes';
import { rcmRoutes } from './routes/rcm.routes';
import { telemetryRoutes } from './routes/telemetry.routes';
import { inventoryRoutes } from './routes/inventory.routes';
import { procurementRoutes } from './routes/procurement.routes';
import { financialsRoutes } from './routes/financials.routes';
import { laborRoutes } from './routes/labor.routes';
import { safetyRoutes } from './routes/safety.routes';
import { regulatoryRoutes } from './routes/regulatory.routes';
import { tenantRoutes } from './routes/tenants.routes';
import { bimRoutes } from './routes/bim.routes';
import { oirairRoutes } from './routes/oir-air.routes';
import { contractorsRoutes } from './routes/contractors.routes';
import { projectsRoutes } from './routes/projects.routes';
import { servicerequestsRoutes } from './routes/service-requests.routes';
import { slaRoutes } from './routes/sla.routes';
import { warrantyRoutes } from './routes/warranty.routes';
import { reportsRoutes } from './routes/reports.routes';

// ── Decorate Fastify with shared instances ──
declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
  }
  interface FastifyRequest {
    tenantId: string;
  }
}

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
});

async function bootstrap() {
  // ── Decorate with Database ──
  server.decorate('db', db);
  server.decorateRequest('tenantId', '');

  // ── Plugins ──
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    sign: { expiresIn: '24h' },
  });

  // ── Tenant Context Middleware ──
  server.addHook('onRequest', async (request, reply) => {
    const headerTenantId = request.headers['x-tenant-id'] as string;
    if (headerTenantId) {
      request.tenantId = headerTenantId;
      await setTenantContext(headerTenantId);
    }
  });

  // ── Audit Logging Hook ──
  server.addHook('onResponse', async (request, reply) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      server.log.info({
        action: request.method,
        path: request.url,
        tenantId: request.tenantId,
        statusCode: reply.statusCode,
        responseTime: reply.elapsedTime,
      }, 'audit');
    }
  });

  // ── Routes ──
  await server.register(authRoutes, { prefix: '/api/v1/auth' });
  await server.register(tenantRoutes, { prefix: '/api/v1/tenants' });
  await server.register(assetRoutes, { prefix: '/api/v1/assets' });
  await server.register(maintenanceRoutes, { prefix: '/api/v1/maintenance' });
  await server.register(cdeRoutes, { prefix: '/api/v1/cde' });
  await server.register(rcmRoutes, { prefix: '/api/v1/rcm' });
  await server.register(telemetryRoutes, { prefix: '/api/v1/telemetry' });
  await server.register(inventoryRoutes, { prefix: '/api/v1/inventory' });
  await server.register(procurementRoutes, { prefix: '/api/v1/procurement' });
  await server.register(financialsRoutes, { prefix: '/api/v1/financials' });
  await server.register(laborRoutes, { prefix: '/api/v1/labor' });
  await server.register(safetyRoutes, { prefix: '/api/v1/safety' });
  await server.register(regulatoryRoutes, { prefix: '/api/v1/regulatory' });
  await server.register(bimRoutes, { prefix: '/api/v1/bim' });
  await server.register(oirairRoutes, { prefix: '/api/v1/oir-air' });
  await server.register(contractorsRoutes, { prefix: '/api/v1/contractors' });
  await server.register(projectsRoutes, { prefix: '/api/v1/projects' });
  await server.register(servicerequestsRoutes, { prefix: '/api/v1/service-requests' });
  await server.register(slaRoutes, { prefix: '/api/v1/sla' });
  await server.register(warrantyRoutes, { prefix: '/api/v1/warranty' });
  await server.register(reportsRoutes, { prefix: '/api/v1/reports' });

  // ── Health Check ──
  server.get('/health', async () => {
    const dbHealth = await checkDatabaseHealth();
    return {
      status: dbHealth.connected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      database: dbHealth,
    };
  });

  // ── Graceful Shutdown ──
  const shutdown = async (signal: string) => {
    server.log.info(`${signal} received, shutting down gracefully...`);
    await server.close();
    await closeDatabaseConnection();
    process.exit(0);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // ── Start ──
  const port = parseInt(process.env.PORT || '3001', 10);
  const host = process.env.HOST || '0.0.0.0';

  try {
    await server.listen({ port, host });
    server.log.info(`🚀 EAM/AIM/RCM API running on ${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

bootstrap();

export default server;
