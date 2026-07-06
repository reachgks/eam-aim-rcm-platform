import { FastifyInstance } from 'fastify';
import { eq, and, count, desc, asc } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { contractors, contracts, contractLineItems, contractorPersonnel, contractorSafety } from '@eamaim/database/schema';

export async function contractorsRoutes(server: FastifyInstance) {
  server.get('/', async (request) => {
    const data = await db.select().from(contractors).where(eq(contractors.tenantId, request.tenantId)).orderBy(asc(contractors.name));
    return { data };
  });

  server.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const [contractor] = await db.select().from(contractors).where(and(eq(contractors.id, id), eq(contractors.tenantId, request.tenantId))).limit(1);
    if (!contractor) return reply.code(404).send({ error: 'Contractor not found' });
    const [activeContracts, personnel] = await Promise.all([
      db.select().from(contracts).where(and(eq(contracts.contractorId, id), eq(contracts.tenantId, request.tenantId))),
      db.select().from(contractorPersonnel).where(eq(contractorPersonnel.contractorId, id)),
    ]);
    return { data: { ...contractor, contracts: activeContracts, personnel } };
  });

  server.post('/', async (request, reply) => {
    const [contractor] = await db.insert(contractors).values({ ...(request.body as any), tenantId: request.tenantId }).returning();
    return reply.code(201).send({ data: contractor });
  });

  server.get('/contracts', async (request) => {
    return { data: await db.select().from(contracts).where(eq(contracts.tenantId, request.tenantId)).orderBy(desc(contracts.createdAt)) };
  });

  server.post('/contracts', async (request, reply) => {
    const [contract] = await db.insert(contracts).values({ ...(request.body as any), tenantId: request.tenantId }).returning();
    return reply.code(201).send({ data: contract });
  });
}
