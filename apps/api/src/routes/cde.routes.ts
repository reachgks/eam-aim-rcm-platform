import { FastifyInstance } from 'fastify';
import { cdeWorkflowService } from '../services/cde-workflow.service';

export async function cdeRoutes(server: FastifyInstance) {
  server.get('/containers', async (request) => {
    const { page, limit, status } = request.query as any;
    return cdeWorkflowService.findAllContainers(request.tenantId, { page: Number(page) || undefined, limit: Number(limit) || undefined, status });
  });

  server.get('/containers/:id', async (request, reply) => {
    const { id } = request.params as any;
    const container = await cdeWorkflowService.findContainerById(request.tenantId, id);
    if (!container) return reply.code(404).send({ error: 'Container not found' });
    return { data: container };
  });

  server.post('/containers', async (request, reply) => {
    return reply.code(201).send({ data: await cdeWorkflowService.createContainer(request.tenantId, request.body) });
  });

  server.post('/containers/:id/transition', async (request, reply) => {
    const { id } = request.params as any;
    const { state, userId, notes } = request.body as any;
    return { data: await cdeWorkflowService.transitionState(request.tenantId, id, state, userId, notes) };
  });

  server.get('/documents', async (request) => {
    const { assetId } = request.query as any;
    return { data: await cdeWorkflowService.getDocumentRegistry(request.tenantId, { assetId }) };
  });

  server.get('/handover-packages', async (request) => {
    return { data: await cdeWorkflowService.getHandoverPackages(request.tenantId) };
  });
}
