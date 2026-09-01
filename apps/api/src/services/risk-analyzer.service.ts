import { eq, and, count, desc, sql, gte } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  riskAssessments, riskMitigations, criticalityAnalyses,
  failureEvents, fmeaAnalyses, fmeaWorksheets,
  workOrders, assets, functionalLocations,
} from '@eamaim/database/schema';

export class RiskAnalyzerService {
  async calculateRiskScore(tenantId: string, assetId: string, userId?: string) {
    // 1. Criticality score (from criticality_analyses.score, 0-100)
    const critRecords = await db.select({ score: criticalityAnalyses.score })
      .from(criticalityAnalyses)
      .where(and(eq(criticalityAnalyses.tenantId, tenantId), eq(criticalityAnalyses.assetId, assetId)))
      .orderBy(desc(criticalityAnalyses.createdAt))
      .limit(1);
    const critScore = critRecords.length > 0 && critRecords[0].score ? Number(critRecords[0].score) : 50;

    // 2. Failure frequency (count events in last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const failCountRes = await db.select({ total: count() })
      .from(failureEvents)
      .where(and(
        eq(failureEvents.tenantId, tenantId),
        eq(failureEvents.assetId, assetId),
        gte(failureEvents.createdAt, twelveMonthsAgo),
      ));
    const failCount = Number(failCountRes[0]?.total || 0);
    const failScore = Math.max(0, 100 - (failCount * 20));

    // 3. FMEA RPN (get max RPN from fmea_worksheets linked via fmea_analyses.asset_id)
    const fmeaEntries = await db.select({ id: fmeaAnalyses.id })
      .from(fmeaAnalyses)
      .where(and(eq(fmeaAnalyses.tenantId, tenantId), eq(fmeaAnalyses.assetId, assetId)));
    let fmeaScore = 100;
    if (fmeaEntries.length > 0) {
      const analysisIds = fmeaEntries.map(e => e.id);
      const rpnRes = await db.execute(
        sql`SELECT MAX(rpn) as max_rpn FROM fmea_worksheets WHERE analysis_id = ANY(${analysisIds})`
      );
      const maxRpn = Number((rpnRes as any).rows?.[0]?.max_rpn || 0);
      fmeaScore = Math.max(0, 100 - (maxRpn / 10));
    }

    // 4. Maintenance compliance (completed PM WOs / total PM WOs)
    const pmTotal = await db.select({ total: count() }).from(workOrders)
      .where(and(eq(workOrders.tenantId, tenantId), eq(workOrders.assetId, assetId), eq(workOrders.type, 'PREVENTIVE')));
    const pmComplete = await db.select({ total: count() }).from(workOrders)
      .where(and(eq(workOrders.tenantId, tenantId), eq(workOrders.assetId, assetId), eq(workOrders.type, 'PREVENTIVE'), eq(workOrders.status, 'COMPLETED')));
    const maintScore = Number(pmTotal[0]?.total) > 0
      ? (Number(pmComplete[0]?.total) / Number(pmTotal[0]?.total)) * 100
      : 80;

    // 5. Sensor health (placeholder)
    const sensorScore = 80;

    // Composite score
    const compositeScore = Math.round(
      (critScore * 0.30) + (failScore * 0.25) + (fmeaScore * 0.20) + (maintScore * 0.15) + (sensorScore * 0.10)
    );

    const riskLevel = compositeScore > 80 ? 'CRITICAL' : compositeScore > 60 ? 'HIGH' : compositeScore > 40 ? 'MEDIUM' : 'LOW';

    const [assessment] = await db.insert(riskAssessments).values({
      tenantId, assetId,
      riskScore: String(compositeScore),
      riskLevel: riskLevel as any,
      criticalityComponent: String(critScore),
      failureComponent: String(failScore),
      fmeaComponent: String(fmeaScore),
      maintenanceComponent: String(maintScore),
      sensorComponent: String(sensorScore),
      assessedAt: new Date(),
      assessedBy: userId || undefined,
    }).returning();

    return assessment;
  }

  async batchCalculateRisk(tenantId: string) {
    const assetList = await db.select({ id: assets.id }).from(assets).where(eq(assets.tenantId, tenantId));
    let processed = 0;
    for (const asset of assetList) {
      try { await this.calculateRiskScore(tenantId, asset.id); processed++; } catch { /* skip */ }
    }
    return { processed, total: assetList.length };
  }

  async getRiskDashboard(tenantId: string) {
    const all = await db.select().from(riskAssessments)
      .where(eq(riskAssessments.tenantId, tenantId))
      .orderBy(desc(riskAssessments.assessedAt));

    // Latest per asset
    const latestByAsset = new Map<string, any>();
    for (const r of all) {
      if (!latestByAsset.has(r.assetId)) latestByAsset.set(r.assetId, r);
    }
    const latest = Array.from(latestByAsset.values());

    const byLevel: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    for (const r of latest) {
      if (r.riskLevel && byLevel[r.riskLevel] !== undefined) byLevel[r.riskLevel]++;
    }

    // Top 10 by risk score descending
    const sorted = [...latest].sort((a, b) => Number(b.riskScore || 0) - Number(a.riskScore || 0));
    const top10Ids = sorted.slice(0, 10).map(r => r.assetId);

    let topRisk: any[] = [];
    if (top10Ids.length > 0) {
      const assetRows = await db.select({ id: assets.id, name: assets.name, tagNumber: assets.tagNumber })
        .from(assets).where(sql`${assets.id} = ANY(${top10Ids})`);
      const assetMap = new Map(assetRows.map(a => [a.id, a]));

      topRisk = sorted.slice(0, 10).map(r => ({
        ...r,
        assetName: assetMap.get(r.assetId)?.name,
        tagNumber: assetMap.get(r.assetId)?.tagNumber,
      }));
    }

    return { totalAnalyzed: latest.length, byLevel, topRisk };
  }

  async getRiskHistory(tenantId: string, assetId: string) {
    return db.select().from(riskAssessments)
      .where(and(eq(riskAssessments.tenantId, tenantId), eq(riskAssessments.assetId, assetId)))
      .orderBy(desc(riskAssessments.assessedAt)).limit(20);
  }

  async getRiskHeatMap(tenantId: string) {
    const all = await db.select().from(riskAssessments)
      .where(eq(riskAssessments.tenantId, tenantId))
      .orderBy(desc(riskAssessments.assessedAt));

    const latestByAsset = new Map<string, any>();
    for (const r of all) {
      if (!latestByAsset.has(r.assetId)) latestByAsset.set(r.assetId, r);
    }
    const latest = Array.from(latestByAsset.values());
    const assetIds = latest.map(r => r.assetId);

    if (assetIds.length === 0) return [];

    const assetRows = await db.select({
      id: assets.id, functionalLocationId: assets.functionalLocationId,
    }).from(assets).where(sql`${assets.id} = ANY(${assetIds})`);

    const locIds = [...new Set(assetRows.map(a => a.functionalLocationId).filter(Boolean))] as string[];
    if (locIds.length === 0) return [];

    const locs = await db.select().from(functionalLocations).where(sql`${functionalLocations.id} = ANY(${locIds})`);
    const locMap = new Map(locs.map(l => [l.id, l]));

    const assetLocMap = new Map(assetRows.map(a => [a.id, a.functionalLocationId]));

    // Group risk by location
    const locRisk = new Map<string, { scores: number[]; loc: any }>();
    for (const r of latest) {
      const locId = assetLocMap.get(r.assetId);
      if (!locId) continue;
      const loc = locMap.get(locId);
      if (!loc) continue;
      if (!locRisk.has(locId)) locRisk.set(locId, { scores: [], loc });
      locRisk.get(locId)!.scores.push(Number(r.riskScore || 0));
    }

    return Array.from(locRisk.values()).map(({ scores, loc }) => ({
      locationName: loc.name,
      locationCode: loc.code,
      avgRisk: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
      assetCount: scores.length,
    }));
  }

  async createMitigation(tenantId: string, data: any) {
    const [m] = await db.insert(riskMitigations).values({ ...data, tenantId }).returning();
    return m;
  }

  async updateMitigation(tenantId: string, id: string, data: any) {
    const [m] = await db.update(riskMitigations).set({ ...data, updatedAt: new Date() })
      .where(and(eq(riskMitigations.id, id), eq(riskMitigations.tenantId, tenantId))).returning();
    return m || null;
  }

  async getMitigations(tenantId: string, assetId?: string) {
    const conditions = [eq(riskMitigations.tenantId, tenantId)];
    if (assetId) conditions.push(eq(riskMitigations.assetId, assetId));
    return db.select().from(riskMitigations).where(and(...conditions));
  }
}

export const riskAnalyzerService = new RiskAnalyzerService();
