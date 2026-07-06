import { FastifyInstance } from 'fastify';
import { airEnforcementService } from '../services/air-enforcement.service';

export async function oirairRoutes(server: FastifyInstance) {
  server.get('/oirs', async (request) => ({ data: await airEnforcementService.getOirs(request.tenantId) }));

  server.get('/airs', async (request) => {
    const { oirId } = request.query as any;
    return { data: await airEnforcementService.getAirs(request.tenantId, oirId) };
  });

  server.post('/airs', async (request, reply) => {
    return reply.code(201).send({ data: await airEnforcementService.createAir(request.tenantId, request.body) });
  });

  server.post('/compliance-check', async (request, reply) => {
    const { assetId, airId, userId } = request.body as any;
    return reply.code(201).send({ data: await airEnforcementService.runComplianceCheck(request.tenantId, assetId, airId, userId) });
  });

  server.get('/compliance-checks', async (request) => {
    const { assetId } = request.query as any;
    return { data: await airEnforcementService.getComplianceChecks(request.tenantId, assetId) };
  });

  server.get('/idps', async (request) => ({ data: await airEnforcementService.getIdps(request.tenantId) }));

  server.get('/loin', async (request) => {
    const { assetTypeId } = request.query as any;
    return { data: await airEnforcementService.getLoinDefinitions(request.tenantId, assetTypeId) };
  });
}
