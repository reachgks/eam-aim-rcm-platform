import { eq, and, count, desc, asc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  assetFunctions as functions, functionalFailures, failureModes, fmeaAnalyses as fmeaAnalysis,
  failureEvents, rcmDecisions, criticalityAnalyses as criticalityAnalysis, reliabilityMetrics,
  rootCauseAnalyses, weibullAnalyses, ramAnalyses,
} from '@eamaim/database/schema';

export class RcmAnalysisService {
  // ── FMEA ──
  async getFmeaByAsset(tenantId: string, assetId: string) {
    const funcs = await db.select().from(functions).where(and(eq(functions.tenantId, tenantId), eq(functions.assetId, assetId)));
    const funcIds = funcs.map(f => f.id);
    if (funcIds.length === 0) return { functions: [], functionalFailures: [], failureModes: [], fmeaEntries: [] };

    const [ff, fm, fmea] = await Promise.all([
      db.select().from(functionalFailures).where(and(eq(functionalFailures.tenantId, tenantId), sql`${functionalFailures.functionId} = ANY(${funcIds})`)),
      db.select().from(failureModes).where(eq(failureModes.tenantId, tenantId)),
      db.select().from(fmeaAnalysis).where(eq(fmeaAnalysis.tenantId, tenantId)),
    ]);
    return { functions: funcs, functionalFailures: ff, failureModes: fm, fmeaEntries: fmea };
  }

  async createFunction(tenantId: string, data: any) {
    const [func] = await db.insert(functions).values({ ...data, tenantId }).returning();
    return func;
  }

  async createFmeaEntry(tenantId: string, data: any) {
    const [entry] = await db.insert(fmeaAnalysis).values({ ...data, tenantId }).returning();
    return entry;
  }

  // ── Failure Events ──
  async recordFailureEvent(tenantId: string, data: any) {
    const [event] = await db.insert(failureEvents).values({ ...data, tenantId }).returning();
    return event;
  }

  async getFailureEvents(tenantId: string, assetId?: string) {
    const conditions = [eq(failureEvents.tenantId, tenantId)];
    if (assetId) conditions.push(eq(failureEvents.assetId, assetId));
    return db.select().from(failureEvents).where(and(...conditions)).orderBy(desc(failureEvents.eventDate));
  }

  // ── RCM Decisions ──
  async getRcmDecisions(tenantId: string, failureModeId?: string) {
    const conditions = [eq(rcmDecisions.tenantId, tenantId)];
    if (failureModeId) conditions.push(eq(rcmDecisions.failureModeId, failureModeId));
    return db.select().from(rcmDecisions).where(and(...conditions));
  }

  async createRcmDecision(tenantId: string, data: any) {
    const [decision] = await db.insert(rcmDecisions).values({ ...data, tenantId }).returning();
    return decision;
  }

  // ── Criticality ──
  async getCriticalityAnalysis(tenantId: string, assetId: string) {
    return db.select().from(criticalityAnalysis)
      .where(and(eq(criticalityAnalysis.tenantId, tenantId), eq(criticalityAnalysis.assetId, assetId)))
      .orderBy(desc(criticalityAnalysis.createdAt));
  }

  async createCriticalityAssessment(tenantId: string, assetId: string, data: any) {
    // Weighted scoring: Safety(5) + Environment(4) + Production(4) + Quality(3) + Maintenance(2) = max 90
    const s = Number(data.safetyImpact || 1);
    const e = Number(data.environmentalImpact || 1);
    const p = Number(data.productionImpact || 1);
    const q = Number(data.qualityImpact || 1);
    const m = Number(data.maintenanceCostImpact || 1);
    const rawScore = (s * 5) + (e * 4) + (p * 4) + (q * 3) + (m * 2);
    const normalized = Math.round((rawScore / 90) * 100);
    const grade = normalized > 75 ? 'A' : normalized > 50 ? 'B' : normalized > 25 ? 'C' : 'D';

    const [assessment] = await db.insert(criticalityAnalysis).values({
      tenantId, assetId,
      methodology: data.methodology || 'SEMI_QUANTITATIVE',
      safetyImpact: s, environmentalImpact: e, productionImpact: p,
      qualityImpact: q, maintenanceCostImpact: m,
      score: String(normalized), overallCriticality: grade,
      assessedBy: data.assessedBy, assessedAt: new Date(),
      nextReviewDate: data.nextReviewDate, notes: data.notes,
    }).returning();

    // Update asset criticality
    const { assets } = await import('@eamaim/database/schema');
    await db.update(assets).set({ criticality: grade as any }).where(and(eq(assets.id, assetId), eq(assets.tenantId, tenantId)));

    return assessment;
  }

  async getCriticalityDashboard(tenantId: string) {
    const all = await db.select().from(criticalityAnalysis)
      .where(eq(criticalityAnalysis.tenantId, tenantId))
      .orderBy(desc(criticalityAnalysis.createdAt));

    // Latest assessment per asset
    const latestByAsset = new Map<string, any>();
    for (const a of all) {
      if (!latestByAsset.has(a.assetId)) latestByAsset.set(a.assetId, a);
    }
    const latest = Array.from(latestByAsset.values());

    const byGrade = { A: 0, B: 0, C: 0, D: 0 };
    for (const a of latest) {
      if (a.overallCriticality && byGrade[a.overallCriticality as keyof typeof byGrade] !== undefined) {
        byGrade[a.overallCriticality as keyof typeof byGrade]++;
      }
    }

    const overdue = latest.filter(a => a.nextReviewDate && new Date(a.nextReviewDate) < new Date());

    return { totalAssessed: latest.length, byGrade, overdueCount: overdue.length, assessments: latest };
  }

  async getAssetsForReassessment(tenantId: string) {
    const all = await db.select().from(criticalityAnalysis)
      .where(eq(criticalityAnalysis.tenantId, tenantId))
      .orderBy(desc(criticalityAnalysis.createdAt));

    const latestByAsset = new Map<string, any>();
    for (const a of all) {
      if (!latestByAsset.has(a.assetId)) latestByAsset.set(a.assetId, a);
    }
    return Array.from(latestByAsset.values()).filter(a => a.nextReviewDate && new Date(a.nextReviewDate) <= new Date());
  }


  // ── Reliability Metrics ──
  async getReliabilityMetrics(tenantId: string, assetId: string) {
    return db.select().from(reliabilityMetrics)
      .where(and(eq(reliabilityMetrics.tenantId, tenantId), eq(reliabilityMetrics.assetId, assetId)))
      .orderBy(desc(reliabilityMetrics.calculationDate)).limit(12);
  }

  // ── RCA ──
  async getRootCauseAnalyses(tenantId: string) {
    return db.select().from(rootCauseAnalyses)
      .where(eq(rootCauseAnalyses.tenantId, tenantId)).orderBy(desc(rootCauseAnalyses.startedAt));
  }

  async createRca(tenantId: string, data: any) {
    const [{ total }] = await db.select({ total: count() }).from(rootCauseAnalyses).where(eq(rootCauseAnalyses.tenantId, tenantId));
    const rcaNumber = `RCA-${String(Number(total) + 1).padStart(4, '0')}`;
    const [rca] = await db.insert(rootCauseAnalyses).values({ ...data, tenantId, rcaNumber }).returning();
    return rca;
  }

  // ── Weibull ──
  async getWeibullAnalyses(tenantId: string) {
    return db.select().from(weibullAnalyses).where(eq(weibullAnalyses.tenantId, tenantId)).orderBy(desc(weibullAnalyses.analysisDate));
  }

  // ── RAM ──
  async getRamAnalyses(tenantId: string, systemAssetId?: string) {
    const conditions = [eq(ramAnalyses.tenantId, tenantId)];
    if (systemAssetId) conditions.push(eq(ramAnalyses.systemAssetId, systemAssetId));
    return db.select().from(ramAnalyses).where(and(...conditions)).orderBy(desc(ramAnalyses.analysisDate));
  }
}

export const rcmAnalysisService = new RcmAnalysisService();
