import { FastifyInstance } from 'fastify';
import { procurementService } from '../services/procurement.service';

export async function procurementRoutes(server: FastifyInstance) {
  server.get('/vendors', async (request) => {
    const { page, limit, search } = request.query as any;
    return procurementService.findAllVendors(request.tenantId, { page: Number(page) || undefined, limit: Number(limit) || undefined, search });
  });

  server.post('/vendors', async (request, reply) => {
    return reply.code(201).send({ data: await procurementService.createVendor(request.tenantId, request.body) });
  });

  server.put('/vendors/:id', async (request, reply) => {
    const { id } = request.params as any;
    const updated = await procurementService.updateVendor(request.tenantId, id, request.body);
    if (!updated) return reply.code(404).send({ error: 'Vendor not found' });
    return { data: updated };
  });

  server.post('/requisitions', async (request, reply) => {
    return reply.code(201).send({ data: await procurementService.createRequisition(request.tenantId, request.body) });
  });

  server.get('/purchase-orders', async (request) => {
    const { page, limit, status } = request.query as any;
    return procurementService.findAllPOs(request.tenantId, { page: Number(page) || undefined, limit: Number(limit) || undefined, status });
  });

  server.get('/purchase-orders/:id', async (request, reply) => {
    const { id } = request.params as any;
    const po = await procurementService.findPOById(request.tenantId, id);
    if (!po) return reply.code(404).send({ error: 'PO not found' });
    return { data: po };
  });

  server.post('/purchase-orders', async (request, reply) => {
    return reply.code(201).send({ data: await procurementService.createPO(request.tenantId, request.body) });
  });

  server.post('/goods-receipts', async (request, reply) => {
    return reply.code(201).send({ data: await procurementService.receiveGoods(request.tenantId, request.body) });
  });
}
