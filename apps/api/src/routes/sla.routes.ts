import { FastifyInstance } from 'fastify';
import { slaService } from '../services/sla.service';

export async function slaRoutes(server: FastifyInstance) {
  server.get('/', async (request) => ({ data: await slaService.findAll(request.tenantId) }));

  server.get('/summary', async (request) => ({ data: await slaService.getSummary(request.tenantId) }));

  server.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const sla = await slaService.findById(request.tenantId, id);
    if (!sla) return reply.code(404).send({ error: 'SLA not found' });
    return { data: sla };
  });

  server.post('/', async (request, reply) => {
    return reply.code(201).send({ data: await slaService.create(request.tenantId, request.body) });
  });

  server.get('/breaches', async (request) => {
    const { slaId, limit } = request.query as any;
    return { data: await slaService.getBreaches(request.tenantId, { slaId, limit: Number(limit) || undefined }) };
  });
}
