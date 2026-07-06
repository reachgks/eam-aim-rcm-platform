import { eq, and, desc, sql, count } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { dataQualityRules, dataQualityScores } from '@eamaim/database/schema';

export class DataQualityService {
  async getRules(tenantId: string) {
    return db.select().from(dataQualityRules).where(eq(dataQualityRules.tenantId, tenantId));
  }

  async createRule(tenantId: string, data: any) {
    const [rule] = await db.insert(dataQualityRules).values({ ...data, tenantId }).returning();
    return rule;
  }

  async getScores(tenantId: string, entityId?: string) {
    const conditions = [eq(dataQualityScores.tenantId, tenantId)];
    if (entityId) conditions.push(eq(dataQualityScores.entityId, entityId));
    return db.select().from(dataQualityScores).where(and(...conditions)).orderBy(desc(dataQualityScores.calculatedAt));
  }
}

export const dataQualityService = new DataQualityService();
