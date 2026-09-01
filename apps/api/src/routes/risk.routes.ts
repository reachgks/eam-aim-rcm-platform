import { FastifyInstance } from 'fastify';
import { riskAnalyzerService } from '../services/risk-analyzer.service';

export async function riskRoutes(server: FastifyInstance) {
  // GET /api/v1/risk/dashboard
  server.get('/dashboard', async (request) => {
    return { data: await riskAnalyzerService.getRiskDashboard(request.tenantId) };
  });

  // GET /api/v1/risk/heatmap
  server.get('/heatmap', async (request) => {
    return { data: await riskAnalyzerService.getRiskHeatMap(request.tenantId) };
  });

  // POST /api/v1/risk/calculate/:assetId
  server.post('/calculate/:assetId', async (request, reply) => {
    const { assetId } = request.params as any;
    const result = await riskAnalyzerService.calculateRiskScore(request.tenantId, assetId, request.userId);
    return reply.code(201).send({ data: result });
  });

  // POST /api/v1/risk/calculate-batch
  server.post('/calculate-batch', async (request, reply) => {
    const result = await riskAnalyzerService.batchCalculateRisk(request.tenantId);
    return reply.code(201).send({ data: result });
  });

  // GET /api/v1/risk/:assetId/history
  server.get('/:assetId/history', async (request) => {
    const { assetId } = request.params as any;
    return { data: await riskAnalyzerService.getRiskHistory(request.tenantId, assetId) };
  });

  // GET /api/v1/risk/:assetId/mitigations
  server.get('/:assetId/mitigations', async (request) => {
    const { assetId } = request.params as any;
    return { data: await riskAnalyzerService.getMitigations(request.tenantId, assetId) };
  });

  // POST /api/v1/risk/mitigations
  server.post('/mitigations', async (request, reply) => {
    const result = await riskAnalyzerService.createMitigation(request.tenantId, request.body as any);
    return reply.code(201).send({ data: result });
  });

  // PUT /api/v1/risk/mitigations/:id
  server.put('/mitigations/:id', async (request, reply) => {
    const { id } = request.params as any;
    const result = await riskAnalyzerService.updateMitigation(request.tenantId, id, request.body as any);
    if (!result) return reply.code(404).send({ error: 'Mitigation not found' });
    return { data: result };
  });
}
