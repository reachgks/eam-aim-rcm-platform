import { FastifyInstance } from 'fastify';
import { depreciationService, costRollupService } from '../services/depreciation.service';

export async function financialsRoutes(server: FastifyInstance) {
  // Depreciation
  server.get('/depreciation/profiles', async (request) => {
    const { assetId } = request.query as any;
    return { data: await depreciationService.findProfilesByAsset(request.tenantId, assetId) };
  });

  server.post('/depreciation/profiles', async (request, reply) => {
    return reply.code(201).send({ data: await depreciationService.createProfile(request.tenantId, request.body) });
  });

  server.get('/depreciation/schedule/:profileId', async (request) => {
    const { profileId } = request.params as any;
    return { data: await depreciationService.getSchedule(request.tenantId, profileId) };
  });

  server.post('/depreciation/schedule/post', async (request, reply) => {
    return reply.code(201).send({ data: await depreciationService.postScheduleEntry(request.tenantId, request.body) });
  });

  // Valuations
  server.get('/valuations', async (request) => {
    const { assetId } = request.query as any;
    return { data: await depreciationService.getAssetValuations(request.tenantId, assetId) };
  });

  server.post('/valuations', async (request, reply) => {
    return reply.code(201).send({ data: await depreciationService.createValuation(request.tenantId, request.body) });
  });

  // Cost Rollup
  server.get('/cost-rollup', async (request) => {
    const { assetId, periodType } = request.query as any;
    return { data: await costRollupService.getCostRollup(request.tenantId, assetId, periodType) };
  });

  server.get('/cost-rollup/calculate', async (request) => {
    const { assetId, periodStart, periodEnd } = request.query as any;
    return { data: await costRollupService.calculateRollup(request.tenantId, assetId, periodStart, periodEnd) };
  });

  // Cost Transactions
  server.get('/transactions', async (request) => {
    const { assetId, costCenterId, limit } = request.query as any;
    return { data: await costRollupService.getCostTransactions(request.tenantId, { assetId, costCenterId, limit: Number(limit) || undefined }) };
  });

  // Cost Centers & Budgets
  server.get('/cost-centers', async (request) => {
    return { data: await costRollupService.getCostCenters(request.tenantId) };
  });

  server.get('/budgets', async (request) => {
    const { fiscalYear } = request.query as any;
    return { data: await costRollupService.getBudgets(request.tenantId, Number(fiscalYear) || undefined) };
  });

  // Replacement Analysis
  server.get('/replacement-analysis', async (request) => {
    const { assetId } = request.query as any;
    return { data: await costRollupService.getReplacementAnalysis(request.tenantId, assetId) };
  });

  server.post('/replacement-analysis', async (request, reply) => {
    return reply.code(201).send({ data: await costRollupService.createReplacementAnalysis(request.tenantId, request.body) });
  });
}
