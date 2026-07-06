import { FastifyInstance } from 'fastify';
import { warrantyService } from '../services/warranty.service';

export async function warrantyRoutes(server: FastifyInstance) {
  server.get('/terms', async (request) => ({ data: await warrantyService.findAllTerms(request.tenantId) }));

  server.get('/coverage', async (request) => {
    const { assetId } = request.query as any;
    return { data: await warrantyService.getCoverage(request.tenantId, assetId) };
  });

  server.post('/coverage', async (request, reply) => {
    return reply.code(201).send({ data: await warrantyService.createCoverage(request.tenantId, request.body) });
  });

  server.get('/claims', async (request) => {
    const { status, page, limit } = request.query as any;
    return warrantyService.findAllClaims(request.tenantId, { status, page: Number(page) || undefined, limit: Number(limit) || undefined });
  });

  server.post('/claims', async (request, reply) => {
    return reply.code(201).send({ data: await warrantyService.createClaim(request.tenantId, request.body) });
  });
}
