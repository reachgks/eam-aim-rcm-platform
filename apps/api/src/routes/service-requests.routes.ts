import { FastifyInstance } from 'fastify';
import { eq, and, count, desc } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { serviceRequests, requestCategories, requestComments } from '@eamaim/database/schema';

export async function servicerequestsRoutes(server: FastifyInstance) {
  server.get('/', async (request) => {
    const { page = 1, limit = 50, status } = request.query as any;
    const conditions = [eq(serviceRequests.tenantId, request.tenantId)];
    if (status) conditions.push(eq(serviceRequests.status, status as any));
    const where = and(...conditions);
    const pg = Number(page); const lim = Math.min(Number(limit), 100);
    const [data, [{ total }]] = await Promise.all([
      db.select().from(serviceRequests).where(where).orderBy(desc(serviceRequests.createdAt)).limit(lim).offset((pg - 1) * lim),
      db.select({ total: count() }).from(serviceRequests).where(where),
    ]);
    return { data, pagination: { page: pg, limit: lim, total: Number(total), totalPages: Math.ceil(Number(total) / lim) } };
  });

  server.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const [sr] = await db.select().from(serviceRequests).where(and(eq(serviceRequests.id, id), eq(serviceRequests.tenantId, request.tenantId))).limit(1);
    if (!sr) return reply.code(404).send({ error: 'Service request not found' });
    const comments = await db.select().from(requestComments).where(eq(requestComments.serviceRequestId, id)).orderBy(desc(requestComments.createdAt));
    return { data: { ...sr, comments } };
  });

  server.post('/', async (request, reply) => {
    const [sr] = await db.insert(serviceRequests).values({ ...(request.body as any), tenantId: request.tenantId }).returning();
    return reply.code(201).send({ data: sr });
  });

  server.post('/:id/comments', async (request, reply) => {
    const { id } = request.params as any;
    const [comment] = await db.insert(requestComments).values({ ...(request.body as any), tenantId: request.tenantId, serviceRequestId: id }).returning();
    return reply.code(201).send({ data: comment });
  });

  server.get('/categories', async (request) => {
    return { data: await db.select().from(requestCategories).where(eq(requestCategories.tenantId, request.tenantId)) };
  });
}
