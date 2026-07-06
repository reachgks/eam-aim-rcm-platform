import { FastifyInstance } from 'fastify';
import { regulatoryService } from '../services/regulatory.service';

export async function regulatoryRoutes(server: FastifyInstance) {
  server.get('/regulations', async (request) => ({ data: await regulatoryService.findAllRegulations(request.tenantId) }));

  server.get('/requirements', async (request) => {
    const { regulationId } = request.query as any;
    return { data: await regulatoryService.getRequirements(request.tenantId, regulationId) };
  });

  server.get('/inspections', async (request) => {
    const { assetId, result, page, limit } = request.query as any;
    return regulatoryService.findAllInspections(request.tenantId, { assetId, result, page: Number(page) || undefined, limit: Number(limit) || undefined });
  });

  server.post('/inspections', async (request, reply) => {
    return reply.code(201).send({ data: await regulatoryService.createInspection(request.tenantId, request.body) });
  });

  server.get('/violations', async (request) => {
    const { status } = request.query as any;
    return { data: await regulatoryService.findAllViolations(request.tenantId, { status }) };
  });

  server.post('/violations', async (request, reply) => {
    return reply.code(201).send({ data: await regulatoryService.createViolation(request.tenantId, request.body) });
  });

  server.get('/corrective-actions', async (request) => {
    const { status } = request.query as any;
    return { data: await regulatoryService.findAllCorrectiveActions(request.tenantId, { status }) };
  });

  server.post('/corrective-actions', async (request, reply) => {
    return reply.code(201).send({ data: await regulatoryService.createCorrectiveAction(request.tenantId, request.body) });
  });

  server.get('/audit-reports', async (request) => ({ data: await regulatoryService.getAuditReports(request.tenantId) }));

  server.get('/dashboard', async (request) => ({ data: await regulatoryService.getComplianceDashboard(request.tenantId) }));
}
