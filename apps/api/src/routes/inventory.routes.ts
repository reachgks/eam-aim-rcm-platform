import { FastifyInstance } from 'fastify';
import { inventoryService } from '../services/inventory.service';

export async function inventoryRoutes(server: FastifyInstance) {
  server.get('/stock-items', async (request) => {
    const { page, limit, search, storeroomId } = request.query as any;
    return inventoryService.findAllStockItems(request.tenantId, { page: Number(page) || undefined, limit: Number(limit) || undefined, search, storeroomId });
  });

  server.get('/stock-items/:id', async (request, reply) => {
    const { id } = request.params as any;
    const item = await inventoryService.findStockItemById(request.tenantId, id);
    if (!item) return reply.code(404).send({ error: 'Stock item not found' });
    return { data: item };
  });

  server.post('/stock-items', async (request, reply) => {
    const item = await inventoryService.createStockItem(request.tenantId, request.body);
    return reply.code(201).send({ data: item });
  });

  server.put('/stock-items/:id', async (request, reply) => {
    const { id } = request.params as any;
    const updated = await inventoryService.updateStockItem(request.tenantId, id, request.body);
    if (!updated) return reply.code(404).send({ error: 'Stock item not found' });
    return { data: updated };
  });

  server.post('/transactions', async (request, reply) => {
    const tx = await inventoryService.recordTransaction(request.tenantId, request.body);
    return reply.code(201).send({ data: tx });
  });

  server.get('/storerooms', async (request) => {
    return { data: await inventoryService.getStorerooms(request.tenantId) };
  });

  server.get('/bom/:assetId', async (request) => {
    const { assetId } = request.params as any;
    return { data: await inventoryService.getBomForAsset(request.tenantId, assetId) };
  });

  server.get('/reorder-alerts', async (request) => {
    return { data: await inventoryService.checkReorderPoints(request.tenantId) };
  });
}
