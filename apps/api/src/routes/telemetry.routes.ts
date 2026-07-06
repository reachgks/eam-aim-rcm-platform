import { FastifyInstance } from 'fastify';
import { telemetryService } from '../services/telemetry.service';

export async function telemetryRoutes(server: FastifyInstance) {
  server.get('/sensors', async (request) => {
    const { assetId, page, limit } = request.query as any;
    return telemetryService.findAllSensors(request.tenantId, { assetId, page: Number(page) || undefined, limit: Number(limit) || undefined });
  });

  server.post('/sensors', async (request, reply) => {
    return reply.code(201).send({ data: await telemetryService.createSensor(request.tenantId, request.body) });
  });

  server.get('/readings/:sensorId', async (request) => {
    const { sensorId } = request.params as any;
    const { limit } = request.query as any;
    return { data: await telemetryService.getLatestReadings(request.tenantId, sensorId, Number(limit) || 100) };
  });

  server.get('/readings/:sensorId/aggregated', async (request) => {
    const { sensorId } = request.params as any;
    const { bucketSize, hoursBack } = request.query as any;
    return { data: await telemetryService.getAggregatedReadings(request.tenantId, sensorId, bucketSize || '1 hour', Number(hoursBack) || 24) };
  });

  server.get('/alerts', async (request) => ({ data: await telemetryService.getActiveAlerts(request.tenantId) }));

  server.patch('/alerts/:id/acknowledge', async (request, reply) => {
    const { id } = request.params as any;
    const { userId } = request.body as any;
    const alert = await telemetryService.acknowledgeAlert(request.tenantId, id, userId);
    if (!alert) return reply.code(404).send({ error: 'Alert not found' });
    return { data: alert };
  });

  server.get('/alert-rules', async (request) => ({ data: await telemetryService.getAlertRules(request.tenantId) }));

  server.post('/alert-rules', async (request, reply) => {
    return reply.code(201).send({ data: await telemetryService.createAlertRule(request.tenantId, request.body) });
  });

  server.get('/events', async (request) => {
    const { sensorId, severity, limit } = request.query as any;
    return { data: await telemetryService.getEvents(request.tenantId, { sensorId, severity, limit: Number(limit) || undefined }) };
  });
}
