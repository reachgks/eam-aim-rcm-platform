import { FastifyInstance } from 'fastify';
import { safetyPermitService } from '../services/safety-permit.service';

export async function safetyRoutes(server: FastifyInstance) {
  server.get('/permits', async (request) => {
    const { status, page, limit } = request.query as any;
    return safetyPermitService.findAllPermits(request.tenantId, { status, page: Number(page) || undefined, limit: Number(limit) || undefined });
  });

  server.get('/permits/:id', async (request, reply) => {
    const { id } = request.params as any;
    const permit = await safetyPermitService.findPermitById(request.tenantId, id);
    if (!permit) return reply.code(404).send({ error: 'Permit not found' });
    return { data: permit };
  });

  server.post('/permits', async (request, reply) => {
    return reply.code(201).send({ data: await safetyPermitService.createPermit(request.tenantId, request.body) });
  });

  server.patch('/permits/:id/status', async (request, reply) => {
    const { id } = request.params as any;
    const { status } = request.body as any;
    const updated = await safetyPermitService.updatePermitStatus(request.tenantId, id, status);
    if (!updated) return reply.code(404).send({ error: 'Permit not found' });
    return { data: updated };
  });

  server.get('/permit-types', async (request) => ({ data: await safetyPermitService.getPermitTypes(request.tenantId) }));

  server.get('/loto', async (request) => {
    const { assetId } = request.query as any;
    return { data: await safetyPermitService.getLotoProcedures(request.tenantId, assetId) };
  });

  server.post('/observations', async (request, reply) => {
    return reply.code(201).send({ data: await safetyPermitService.createObservation(request.tenantId, request.body) });
  });

  server.get('/observations', async (request) => {
    const { limit } = request.query as any;
    return { data: await safetyPermitService.getObservations(request.tenantId, { limit: Number(limit) || undefined }) };
  });
}
