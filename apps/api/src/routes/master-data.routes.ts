import { FastifyInstance } from 'fastify';
import { masterDataService } from '../services/master-data.service';

export async function masterDataRoutes(server: FastifyInstance) {
  server.get('/', async (request, reply) => {
    return masterDataService.getRegistry();
  });

  server.get('/:tableKey/export-csv', async (request, reply) => {
    const { tableKey } = request.params as { tableKey: string };
    try {
      const csv = await masterDataService.exportCsv(request.tenantId, tableKey);
      reply.header('Content-Type', 'text/csv');
      reply.header('Content-Disposition', `attachment; filename="${tableKey}.csv"`);
      return csv;
    } catch (error: any) {
      server.log.error(error);
      return reply.code(400).send({ error: error.message });
    }
  });

  server.post('/:tableKey/import-csv', async (request, reply) => {
    const { tableKey } = request.params as { tableKey: string };
    try {
      const data = await request.file();
      if (!data) return reply.code(400).send({ error: 'No file uploaded' });
      
      const buffer = await data.toBuffer();
      const csvContent = buffer.toString('utf-8');
      
      const result = await masterDataService.importCsv(request.tenantId, tableKey, csvContent);
      return result;
    } catch (error: any) {
      server.log.error(error);
      return reply.code(400).send({ error: error.message });
    }
  });

  server.get('/:tableKey', async (request, reply) => {
    const { tableKey } = request.params as { tableKey: string };
    const query = request.query as { page?: number; limit?: number; search?: string };
    
    try {
      const result = await masterDataService.getRecords(request.tenantId, tableKey, query);
      return result;
    } catch (error: any) {
      server.log.error(error);
      return reply.code(400).send({ error: error.message });
    }
  });

  server.post('/:tableKey', async (request, reply) => {
    const { tableKey } = request.params as { tableKey: string };
    try {
      const result = await masterDataService.createRecord(request.tenantId, tableKey, request.body);
      return result;
    } catch (error: any) {
      server.log.error(error);
      return reply.code(400).send({ error: error.message });
    }
  });

  server.put('/:tableKey/:id', async (request, reply) => {
    const { tableKey, id } = request.params as { tableKey: string; id: string };
    try {
      const result = await masterDataService.updateRecord(request.tenantId, tableKey, id, request.body);
      return result;
    } catch (error: any) {
      server.log.error(error);
      return reply.code(400).send({ error: error.message });
    }
  });

  server.delete('/:tableKey/:id', async (request, reply) => {
    const { tableKey, id } = request.params as { tableKey: string; id: string };
    try {
      const result = await masterDataService.deleteRecord(request.tenantId, tableKey, id);
      return result;
    } catch (error: any) {
      server.log.error(error);
      return reply.code(400).send({ error: error.message });
    }
  });
}
