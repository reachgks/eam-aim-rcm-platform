import { FastifyInstance } from 'fastify';

export async function projectsRoutes(server: FastifyInstance) {
  server.get('/', async (request, reply) => {
    const { page = 1, limit = 50 } = request.query as any;
    return { data: [], pagination: { page, limit, total: 0 } };
  });

  server.get('/:id', async (request, reply) => {
    const { id } = request.params as any;
    return { data: null };
  });

  server.post('/', async (request, reply) => {
    return reply.code(201).send({ data: request.body });
  });

  server.put('/:id', async (request, reply) => {
    const { id } = request.params as any;
    return { data: { id, ...(request.body as any) } };
  });

  server.delete('/:id', async (request, reply) => {
    return { success: true };
  });
}

