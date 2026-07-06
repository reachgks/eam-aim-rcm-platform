import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { costTransactions, assetCostRollup } from '@eamaim/database/schema';

export class CostRollupService2 {
  async getTransactions(tenantId: string, options: { assetId?: string; limit?: number } = {}) {
    const conditions = [eq(costTransactions.tenantId, tenantId)];
    if (options.assetId) conditions.push(eq(costTransactions.assetId, options.assetId));
    return db.select().from(costTransactions).where(and(...conditions))
      .orderBy(desc(costTransactions.transactionDate)).limit(options.limit || 100);
  }

  async createTransaction(tenantId: string, data: any) {
    const [tx] = await db.insert(costTransactions).values({ ...data, tenantId }).returning();
    return tx;
  }

  async getRollup(tenantId: string, assetId: string) {
    return db.select().from(assetCostRollup)
      .where(and(eq(assetCostRollup.tenantId, tenantId), eq(assetCostRollup.assetId, assetId)))
      .orderBy(desc(assetCostRollup.periodStart));
  }
}

export const costRollupService2 = new CostRollupService2();
