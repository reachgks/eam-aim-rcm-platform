import { FastifyInstance } from 'fastify';
import { laborService } from '../services/labor.service';

export async function laborRoutes(server: FastifyInstance) {
  server.get('/crafts', async (request) => ({ data: await laborService.findAllCrafts(request.tenantId) }));

  server.post('/crafts', async (request, reply) => {
    return reply.code(201).send({ data: await laborService.createCraft(request.tenantId, request.body) });
  });

  server.get('/crews', async (request) => ({ data: await laborService.findAllCrews(request.tenantId) }));

  server.get('/crews/:id', async (request, reply) => {
    const { id } = request.params as any;
    const crew = await laborService.getCrewWithMembers(request.tenantId, id);
    if (!crew) return reply.code(404).send({ error: 'Crew not found' });
    return { data: crew };
  });

  server.post('/bookings', async (request, reply) => {
    return reply.code(201).send({ data: await laborService.bookLabor(request.tenantId, request.body) });
  });

  server.get('/bookings', async (request) => {
    const { workOrderId, userId } = request.query as any;
    return { data: await laborService.getLaborBookings(request.tenantId, { workOrderId, userId }) };
  });

  server.get('/rates', async (request) => ({ data: await laborService.getLaborRates(request.tenantId) }));
  server.get('/shifts', async (request) => ({ data: await laborService.getShifts(request.tenantId) }));
  server.get('/certifications', async (request) => {
    const { userId } = request.query as any;
    return { data: await laborService.getCertifications(request.tenantId, userId) };
  });
}
