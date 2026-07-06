import { FastifyInstance } from 'fastify';
import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { capitalProjects, projectPhases, projectTasks, managementOfChange, mocApprovals } from '@eamaim/database/schema';

export async function projectsRoutes(server: FastifyInstance) {
  server.get('/', async (request) => {
    return { data: await db.select().from(capitalProjects).where(eq(capitalProjects.tenantId, request.tenantId)).orderBy(desc(capitalProjects.createdAt)) };
  });

  server.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const [project] = await db.select().from(capitalProjects).where(and(eq(capitalProjects.id, id), eq(capitalProjects.tenantId, request.tenantId))).limit(1);
    if (!project) return reply.code(404).send({ error: 'Project not found' });
    const [phases, tasks] = await Promise.all([
      db.select().from(projectPhases).where(eq(projectPhases.projectId, id)).orderBy(asc(projectPhases.phaseOrder)),
      db.select().from(projectTasks).where(eq(projectTasks.projectId, id)),
    ]);
    return { data: { ...project, phases, tasks } };
  });

  server.post('/', async (request, reply) => {
    const [project] = await db.insert(capitalProjects).values({ ...(request.body as any), tenantId: request.tenantId }).returning();
    return reply.code(201).send({ data: project });
  });

  server.get('/moc', async (request) => {
    return { data: await db.select().from(managementOfChange).where(eq(managementOfChange.tenantId, request.tenantId)).orderBy(desc(managementOfChange.createdAt)) };
  });

  server.post('/moc', async (request, reply) => {
    const [moc] = await db.insert(managementOfChange).values({ ...(request.body as any), tenantId: request.tenantId }).returning();
    return reply.code(201).send({ data: moc });
  });
}
