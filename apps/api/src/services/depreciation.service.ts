import { eq, and, count, desc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  depreciationProfiles, depreciationSchedule, assetValuations,
  assetCostRollup, costTransactions, costCenters, budgets,
  budgetLineItems, replacementAnalyses,
} from '@eamaim/database/schema';

export class DepreciationService {
  async findProfilesByAsset(tenantId: string, assetId: string) {
    return db.select().from(depreciationProfiles)
      .where(and(eq(depreciationProfiles.tenantId, tenantId), eq(depreciationProfiles.assetId, assetId)));
  }

  async createProfile(tenantId: string, data: any) {
    const [profile] = await db.insert(depreciationProfiles).values({ ...data, tenantId }).returning();
    return profile;
  }

  async getSchedule(tenantId: string, profileId: string) {
    return db.select().from(depreciationSchedule)
      .where(and(eq(depreciationSchedule.tenantId, tenantId), eq(depreciationSchedule.profileId, profileId)))
      .orderBy(depreciationSchedule.periodNumber);
  }

  async postScheduleEntry(tenantId: string, data: any) {
    const [entry] = await db.insert(depreciationSchedule).values({ ...data, tenantId, isPosted: true, postedAt: new Date() }).returning();
    // Also record as cost transaction
    await db.insert(costTransactions).values({
      tenantId,
      sourceType: 'DEPRECIATION',
      sourceId: entry.id,
      assetId: data.assetId,
      costCenterId: data.costCenterId,
      transactionDate: data.periodEnd,
      amount: data.depreciationAmount,
      costCategory: 'DEPRECIATION',
      description: `Depreciation period ${data.periodNumber}`,
    });
    return entry;
  }

  async getAssetValuations(tenantId: string, assetId: string) {
    return db.select().from(assetValuations)
      .where(and(eq(assetValuations.tenantId, tenantId), eq(assetValuations.assetId, assetId)))
      .orderBy(desc(assetValuations.valuationDate));
  }

  async createValuation(tenantId: string, data: any) {
    const [val] = await db.insert(assetValuations).values({ ...data, tenantId }).returning();
    return val;
  }
}

export class CostRollupService {
  async getCostRollup(tenantId: string, assetId: string, periodType?: string) {
    const conditions = [eq(assetCostRollup.tenantId, tenantId), eq(assetCostRollup.assetId, assetId)];
    if (periodType) conditions.push(eq(assetCostRollup.periodType, periodType as any));
    return db.select().from(assetCostRollup).where(and(...conditions)).orderBy(desc(assetCostRollup.periodStart));
  }

  async getCostTransactions(tenantId: string, options: { assetId?: string; costCenterId?: string; limit?: number } = {}) {
    const conditions = [eq(costTransactions.tenantId, tenantId)];
    if (options.assetId) conditions.push(eq(costTransactions.assetId, options.assetId));
    if (options.costCenterId) conditions.push(eq(costTransactions.costCenterId, options.costCenterId));
    return db.select().from(costTransactions).where(and(...conditions))
      .orderBy(desc(costTransactions.transactionDate)).limit(options.limit || 100);
  }

  async getCostCenters(tenantId: string) {
    return db.select().from(costCenters).where(eq(costCenters.tenantId, tenantId));
  }

  async getBudgets(tenantId: string, fiscalYear?: number) {
    const conditions = [eq(budgets.tenantId, tenantId)];
    if (fiscalYear) conditions.push(eq(budgets.fiscalYear, fiscalYear));
    return db.select().from(budgets).where(and(...conditions));
  }

  async getReplacementAnalysis(tenantId: string, assetId: string) {
    return db.select().from(replacementAnalyses)
      .where(and(eq(replacementAnalyses.tenantId, tenantId), eq(replacementAnalyses.assetId, assetId)))
      .orderBy(desc(replacementAnalyses.analysisDate));
  }

  async createReplacementAnalysis(tenantId: string, data: any) {
    const [analysis] = await db.insert(replacementAnalyses).values({ ...data, tenantId }).returning();
    return analysis;
  }

  // ── Aggregate cost rollup from transactions ──
  async calculateRollup(tenantId: string, assetId: string, periodStart: string, periodEnd: string) {
    const result = await db.execute(sql`
      SELECT
        COALESCE(SUM(CASE WHEN cost_category = 'LABOR' THEN amount ELSE 0 END), 0) as labor_cost,
        COALESCE(SUM(CASE WHEN cost_category = 'MATERIAL' THEN amount ELSE 0 END), 0) as material_cost,
        COALESCE(SUM(CASE WHEN cost_category = 'SERVICE' THEN amount ELSE 0 END), 0) as service_cost,
        COALESCE(SUM(CASE WHEN cost_category = 'OVERHEAD' THEN amount ELSE 0 END), 0) as overhead_cost,
        COALESCE(SUM(CASE WHEN cost_category = 'DEPRECIATION' THEN amount ELSE 0 END), 0) as depreciation_cost,
        COUNT(*) as transaction_count
      FROM cost_transactions
      WHERE tenant_id = ${tenantId}
        AND asset_id = ${assetId}
        AND transaction_date >= ${periodStart}
        AND transaction_date <= ${periodEnd}
    `);
    return result.rows[0];
  }
}

export const depreciationService = new DepreciationService();
export const costRollupService = new CostRollupService();
