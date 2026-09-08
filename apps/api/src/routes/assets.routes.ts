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

  // GET /api/v1/assets/locations — All functional locations for picker
  server.get('/locations', async (request) => {
    return { data: await assetService.getLocations(request.tenantId) };
  });

  // GET /api/v1/assets/types — All asset types for picker
  server.get('/types', async (request) => {
    return { data: await assetService.getAssetTypes(request.tenantId) };
  });

  // GET /api/v1/assets/list-simple — Minimal asset list for parent picker
  server.get('/list-simple', async (request) => {
    return { data: await assetService.getSimpleList(request.tenantId) };
  });

  // GET /api/v1/assets/summary/status — Status breakdown
  server.get('/summary/status', async (request) => {
    return { data: await assetService.getStatusSummary(request.tenantId) };
  });

  // GET /api/v1/assets/summary/criticality — Criticality breakdown
  server.get('/summary/criticality', async (request) => {
    return { data: await assetService.getCriticalitySummary(request.tenantId) };
  });

  // GET /api/v1/assets/pending-approvals — All pending approvals for current user's role
  server.get('/pending-approvals', async (request) => {
    const { role } = request.query as any;
    return { data: await assetService.getPendingApprovals(request.tenantId, role) };
  });

  // GET /api/v1/assets/:id — Get asset with related data + allowed transitions
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

  // GET /api/v1/assets/:id/approvals — Get approval status
  server.get('/:id/approvals', async (request) => {
    const { id } = request.params as any;
    return { data: await assetService.getApprovals(request.tenantId, id) };
  });

  // GET /api/v1/assets/:id/status-history — Get status transition history
  server.get('/:id/status-history', async (request) => {
    const { id } = request.params as any;
    return { data: await assetService.getStatusHistory(request.tenantId, id) };
  });

  // POST /api/v1/assets — Create asset (with optional sensors & auto approval)
  server.post('/', async (request, reply) => {
    const asset = await assetService.create(request.tenantId, request.body as any);
    return reply.code(201).send({ data: asset });
  });

  // POST /api/v1/assets/:id/request-status-change — Request a status transition
  server.post('/:id/request-status-change', async (request, reply) => {
    const { id } = request.params as any;
    const { requestedStatus, comments } = request.body as any;
    const result = await assetService.requestStatusTransition(
      request.tenantId, id, requestedStatus, request.userId, comments
    );
    if (result.error) return reply.code(400).send({ error: result.error });
    return reply.code(201).send(result);
  });

  // POST /api/v1/assets/:id/approvals — Process approval decision
  server.post('/:id/approvals', async (request, reply) => {
    const { id } = request.params as any;
    const { approvalId, decision, comments } = request.body as any;
    const result = await assetService.processApproval(
      request.tenantId, id, approvalId, request.userId, decision, comments
    );
    if (!result) return reply.code(404).send({ error: 'Approval not found' });
    if ((result as any).error) return reply.code(400).send(result);
    return { data: result };
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
