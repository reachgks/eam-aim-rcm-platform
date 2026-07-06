import { FastifyInstance } from 'fastify';
import { tenantService } from '../services/tenant.service';

export async function tenantRoutes(server: FastifyInstance) {
  server.get('/', async () => ({ data: await tenantService.findAll() }));

  server.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const tenant = await tenantService.findById(id);
    if (!tenant) return reply.code(404).send({ error: 'Tenant not found' });
    return { data: tenant };
  });

  server.get('/slug/:slug', async (request, reply) => {
    const { slug } = request.params as any;
    const tenant = await tenantService.findBySlug(slug);
    if (!tenant) return reply.code(404).send({ error: 'Tenant not found' });
    return { data: tenant };
  });

  server.post('/', async (request, reply) => {
    return reply.code(201).send({ data: await tenantService.create(request.body) });
  });

  server.put('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const updated = await tenantService.update(id, request.body);
    if (!updated) return reply.code(404).send({ error: 'Tenant not found' });
    return { data: updated };
  });
}
