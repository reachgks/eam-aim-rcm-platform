import { FastifyInstance } from 'fastify';
import { rcmAnalysisService } from '../services/rcm-analysis.service';

export async function rcmRoutes(server: FastifyInstance) {
  server.get('/fmea/:assetId', async (request) => {
    const { assetId } = request.params as any;
    return { data: await rcmAnalysisService.getFmeaByAsset(request.tenantId, assetId) };
  });

  server.post('/functions', async (request, reply) => {
    return reply.code(201).send({ data: await rcmAnalysisService.createFunction(request.tenantId, request.body) });
  });

  server.post('/fmea', async (request, reply) => {
    return reply.code(201).send({ data: await rcmAnalysisService.createFmeaEntry(request.tenantId, request.body) });
  });

  server.get('/failure-events', async (request) => {
    const { assetId } = request.query as any;
    return { data: await rcmAnalysisService.getFailureEvents(request.tenantId, assetId) };
  });

  server.post('/failure-events', async (request, reply) => {
    return reply.code(201).send({ data: await rcmAnalysisService.recordFailureEvent(request.tenantId, request.body) });
  });

  server.get('/decisions', async (request) => {
    const { failureModeId } = request.query as any;
    return { data: await rcmAnalysisService.getRcmDecisions(request.tenantId, failureModeId) };
  });

  server.post('/decisions', async (request, reply) => {
    return reply.code(201).send({ data: await rcmAnalysisService.createRcmDecision(request.tenantId, request.body) });
  });

  server.get('/criticality/:assetId', async (request) => {
    const { assetId } = request.params as any;
    return { data: await rcmAnalysisService.getCriticalityAnalysis(request.tenantId, assetId) };
  });

  server.get('/reliability/:assetId', async (request) => {
    const { assetId } = request.params as any;
    return { data: await rcmAnalysisService.getReliabilityMetrics(request.tenantId, assetId) };
  });

  server.get('/rca', async (request) => ({ data: await rcmAnalysisService.getRootCauseAnalyses(request.tenantId) }));

  server.post('/rca', async (request, reply) => {
    return reply.code(201).send({ data: await rcmAnalysisService.createRca(request.tenantId, request.body) });
  });

  server.get('/weibull', async (request) => ({ data: await rcmAnalysisService.getWeibullAnalyses(request.tenantId) }));

  server.get('/ram', async (request) => {
    const { systemAssetId } = request.query as any;
    return { data: await rcmAnalysisService.getRamAnalyses(request.tenantId, systemAssetId) };
  });
}
