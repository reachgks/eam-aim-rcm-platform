import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
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

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
});

async function bootstrap() {
  // ── Plugins ──
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    sign: { expiresIn: '24h' },
  });

  // ── Middleware ──
  server.addHook('onRequest', async (request, reply) => {
    // Set tenant context for RLS
    const tenantId = request.headers['x-tenant-id'];
    if (tenantId) {
      (request as any).tenantId = tenantId;
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

  // ── Health Check ──
  server.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
  }));

  // ── Start ──
  const port = parseInt(process.env.PORT || '3001', 10);
  const host = process.env.HOST || '0.0.0.0';

  try {
    await server.listen({ port, host });
    server.log.info(`EAM/AIM/RCM API running on ${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

bootstrap();

export default server;
