import { FastifyInstance } from 'fastify';
import { assetService } from '../services/asset.service';

export async function assetRoutes(server: FastifyInstance) {
  // GET /api/v1/assets — List with pagination & filtering
  server.get('/', async (request, reply) => {
    const { page, limit, search, status, criticality, assetTypeId, locationId, sortBy, sortOrder } = request.query as any;
    const result = await assetService.findAll(request.tenantId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search, status, criticality, assetTypeId, locationId, sortBy, sortOrder,
    });
    return result;
  });

  // GET /api/v1/assets/summary/status — Status breakdown
  server.get('/summary/status', async (request) => {
    return { data: await assetService.getStatusSummary(request.tenantId) };
  });

  // GET /api/v1/assets/summary/criticality — Criticality breakdown
  server.get('/summary/criticality', async (request) => {
    return { data: await assetService.getCriticalitySummary(request.tenantId) };
  });

  // GET /api/v1/assets/:id — Get asset with related data
  server.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const asset = await assetService.findById(request.tenantId, id);
    if (!asset) return reply.code(404).send({ error: 'Asset not found' });
    return { data: asset };
  });

  // GET /api/v1/assets/:id/hierarchy — Recursive hierarchy tree
  server.get('/:id/hierarchy', async (request) => {
    const { id } = request.params as any;
    const tree = await assetService.getHierarchy(request.tenantId, id);
    return { data: tree };
  });

  // POST /api/v1/assets — Create asset
  server.post('/', async (request, reply) => {
    const asset = await assetService.create(request.tenantId, request.body as any);
    return reply.code(201).send({ data: asset });
  });

  // PUT /api/v1/assets/:id — Update asset
  server.put('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const updated = await assetService.update(request.tenantId, id, request.body as any);
    if (!updated) return reply.code(404).send({ error: 'Asset not found' });
    return { data: updated };
  });

  // DELETE /api/v1/assets/:id — Soft delete (set status DISPOSED)
  server.delete('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const deleted = await assetService.delete(request.tenantId, id);
    if (!deleted) return reply.code(404).send({ error: 'Asset not found' });
    return { success: true };
  });
}
