import { FastifyInstance } from 'fastify';
import { shiftLogbookService } from '../services/shift-logbook.service';

export async function shiftLogbookRoutes(server: FastifyInstance) {
  // GET /api/v1/shift-logbook
  server.get('/', async (request) => {
    const { page, limit, machineName, sectionName, plantName, locationId, assetId, logEntryType, shiftType, dateFrom, dateTo, status } = request.query as any;
    return shiftLogbookService.getLogEntries(request.tenantId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      machineName, sectionName, plantName, locationId, assetId, logEntryType, shiftType, dateFrom, dateTo, status,
    });
  });

  // POST /api/v1/shift-logbook
  server.post('/', async (request, reply) => {
    const entry = await shiftLogbookService.createLogEntry(request.tenantId, request.body as any);
    return reply.code(201).send({ data: entry });
  });

  // GET /api/v1/shift-logbook/summary
  server.get('/summary', async (request) => {
    const { date, shiftType } = request.query as any;
    return { data: await shiftLogbookService.getShiftSummary(request.tenantId, date, shiftType) };
  });

  // GET /api/v1/shift-logbook/breakdown-summary
  server.get('/breakdown-summary', async (request) => {
    const { dateFrom, dateTo } = request.query as any;
    return { data: await shiftLogbookService.getBreakdownSummary(request.tenantId, dateFrom, dateTo) };
  });

  // GET /api/v1/shift-logbook/preventive-summary
  server.get('/preventive-summary', async (request) => {
    const { dateFrom, dateTo } = request.query as any;
    return { data: await shiftLogbookService.getPreventiveSummary(request.tenantId, dateFrom, dateTo) };
  });

  // GET /api/v1/shift-logbook/scheduled-summary
  server.get('/scheduled-summary', async (request) => {
    const { dateFrom, dateTo } = request.query as any;
    return { data: await shiftLogbookService.getScheduledSummary(request.tenantId, dateFrom, dateTo) };
  });

  // PUT /api/v1/shift-logbook/:id
  server.put('/:id', async (request, reply) => {
    const { id } = request.params as any;
    const updated = await shiftLogbookService.updateLogEntry(request.tenantId, id, request.body as any);
    if (!updated) return reply.code(404).send({ error: 'Log entry not found' });
    return { data: updated };
  });
}
