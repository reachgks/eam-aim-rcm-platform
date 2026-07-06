import { eq, and, count, desc } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { warrantyTerms, warrantyCoverage, warrantyClaims } from '@eamaim/database/schema';

export class WarrantyService {
  async findAllTerms(tenantId: string) {
    return db.select().from(warrantyTerms).where(eq(warrantyTerms.tenantId, tenantId));
  }

  async getCoverage(tenantId: string, assetId?: string) {
    const conditions = [eq(warrantyCoverage.tenantId, tenantId)];
    if (assetId) conditions.push(eq(warrantyCoverage.assetId, assetId));
    return db.select().from(warrantyCoverage).where(and(...conditions));
  }

  async createCoverage(tenantId: string, data: any) {
    const [coverage] = await db.insert(warrantyCoverage).values({ ...data, tenantId }).returning();
    return coverage;
  }

  async findAllClaims(tenantId: string, options: { status?: string; page?: number; limit?: number } = {}) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100);
    const conditions = [eq(warrantyClaims.tenantId, tenantId)];
    if (options.status) conditions.push(eq(warrantyClaims.status, options.status as any));
    const where = and(...conditions);
    const [data, [{ total }]] = await Promise.all([
      db.select().from(warrantyClaims).where(where).orderBy(desc(warrantyClaims.createdAt)).limit(limit).offset((page - 1) * limit),
      db.select({ total: count() }).from(warrantyClaims).where(where),
    ]);
    return { data, pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) } };
  }

  async createClaim(tenantId: string, data: any) {
    const [claim] = await db.insert(warrantyClaims).values({ ...data, tenantId }).returning();
    return claim;
  }
}

export const warrantyService = new WarrantyService();
