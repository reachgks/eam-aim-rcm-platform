import { FastifyInstance } from 'fastify';
import { maintenanceService } from '../services/maintenance.service';

export async function maintenanceRoutes(server: FastifyInstance) {
  // ── Work Orders ──

  // GET /api/v1/maintenance/work-orders
  server.get('/work-orders', async (request) => {
    const { page, limit, status, type, priority, assetId, assignedTo, sortBy, sortOrder } = request.query as any;
    return maintenanceService.findAllWorkOrders(request.tenantId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status, type, priority, assetId, assignedTo, sortBy, sortOrder,
    });
  });

  // GET /api/v1/maintenance/work-orders/summary — Dashboard counts
  server.get('/work-orders/summary', async (request) => {
    return { data: await maintenanceService.getWoSummary(request.tenantId) };
  });

  // GET /api/v1/maintenance/work-orders/:id
  server.get('/work-orders/:id', async (request, reply) => {
    const { id } = request.params as any;
    const wo = await maintenanceService.findWorkOrderById(request.tenantId, id);
    if (!wo) return reply.code(404).send({ error: 'Work order not found' });
    return { data: wo };
  });

  // POST /api/v1/maintenance/work-orders
  server.post('/work-orders', async (request, reply) => {
    const wo = await maintenanceService.createWorkOrder(request.tenantId, request.body);
    return reply.code(201).send({ data: wo });
  });

  // PUT /api/v1/maintenance/work-orders/:id
  server.put('/work-orders/:id', async (request, reply) => {
    const { id } = request.params as any;
    const updated = await maintenanceService.updateWorkOrder(request.tenantId, id, request.body);
    if (!updated) return reply.code(404).send({ error: 'Work order not found' });
    return { data: updated };
  });

  // PATCH /api/v1/maintenance/work-orders/:id/status
  server.patch('/work-orders/:id/status', async (request, reply) => {
    const { id } = request.params as any;
    const { status } = request.body as any;
    const wo = await maintenanceService.changeStatus(request.tenantId, id, status);
    if (!wo) return reply.code(404).send({ error: 'Work order not found' });
    return { data: wo };
  });

  // POST /api/v1/maintenance/work-orders/:id/tasks
  server.post('/work-orders/:id/tasks', async (request, reply) => {
    const { id } = request.params as any;
    const task = await maintenanceService.addTask(request.tenantId, id, request.body);
    return reply.code(201).send({ data: task });
  });

  // POST /api/v1/maintenance/work-orders/:id/spare-parts
  server.post('/work-orders/:id/spare-parts', async (request, reply) => {
    const { id } = request.params as any;
    const usage = await maintenanceService.recordSparePartUsage(request.tenantId, id, request.body);
    return reply.code(201).send({ data: usage });
  });

  // ── Maintenance Plans ──

  // GET /api/v1/maintenance/plans
  server.get('/plans', async (request) => {
    const plans = await maintenanceService.findAllPlans(request.tenantId);
    return { data: plans };
  });

  // POST /api/v1/maintenance/plans
  server.post('/plans', async (request, reply) => {
    const plan = await maintenanceService.createPlan(request.tenantId, request.body);
    return reply.code(201).send({ data: plan });
  });
}
