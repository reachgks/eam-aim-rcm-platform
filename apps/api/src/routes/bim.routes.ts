import { FastifyInstance } from 'fastify';
import { bimService } from '../services/bim.service';

export async function bimRoutes(server: FastifyInstance) {
  server.get('/models', async (request) => ({ data: await bimService.findAllModels(request.tenantId) }));

  server.get('/models/:id', async (request, reply) => {
    const { id } = request.params as any;
    const model = await bimService.findModelById(request.tenantId, id);
    if (!model) return reply.code(404).send({ error: 'IFC model not found' });
    return { data: model };
  });

  server.post('/models', async (request, reply) => {
    return reply.code(201).send({ data: await bimService.createModel(request.tenantId, request.body) });
  });

  server.post('/element-links', async (request, reply) => {
    return reply.code(201).send({ data: await bimService.linkElementToAsset(request.tenantId, request.body) });
  });

  server.get('/asset-links/:assetId', async (request) => {
    const { assetId } = request.params as any;
    return { data: await bimService.getAssetLinks(request.tenantId, assetId) };
  });
}
