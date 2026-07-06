import { eq, and, count, desc, asc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { workPermits, permitTypes, isolationPoints, lotoProcedures, safetyObservations } from '@eamaim/database/schema';

export class SafetyPermitService {
  async findAllPermits(tenantId: string, options: { status?: string; page?: number; limit?: number } = {}) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100);
    const conditions = [eq(workPermits.tenantId, tenantId)];
    if (options.status) conditions.push(eq(workPermits.status, options.status as any));
    const where = and(...conditions);
    const [data, [{ total }]] = await Promise.all([
      db.select().from(workPermits).where(where).orderBy(desc(workPermits.createdAt)).limit(limit).offset((page - 1) * limit),
      db.select({ total: count() }).from(workPermits).where(where),
    ]);
    return { data, pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) } };
  }

  async findPermitById(tenantId: string, id: string) {
    const [permit] = await db.select().from(workPermits).where(and(eq(workPermits.id, id), eq(workPermits.tenantId, tenantId))).limit(1);
    if (!permit) return null;
    const isolations = await db.select().from(isolationPoints).where(eq(isolationPoints.workPermitId, id));
    return { ...permit, isolationPoints: isolations };
  }

  async createPermit(tenantId: string, data: any) {
    const [permit] = await db.insert(workPermits).values({ ...data, tenantId }).returning();
    return permit;
  }

  async updatePermitStatus(tenantId: string, id: string, status: string) {
    const [updated] = await db.update(workPermits).set({ status }).where(and(eq(workPermits.id, id), eq(workPermits.tenantId, tenantId))).returning();
    return updated || null;
  }

  async getPermitTypes(tenantId: string) {
    return db.select().from(permitTypes).where(eq(permitTypes.tenantId, tenantId));
  }

  async getLotoProcedures(tenantId: string, assetId?: string) {
    const conditions = [eq(lotoProcedures.tenantId, tenantId)];
    if (assetId) conditions.push(eq(lotoProcedures.assetId, assetId));
    return db.select().from(lotoProcedures).where(and(...conditions));
  }

  async createObservation(tenantId: string, data: any) {
    const [obs] = await db.insert(safetyObservations).values({ ...data, tenantId }).returning();
    return obs;
  }

  async getObservations(tenantId: string, options: { limit?: number } = {}) {
    return db.select().from(safetyObservations).where(eq(safetyObservations.tenantId, tenantId))
      .orderBy(desc(safetyObservations.createdAt)).limit(options.limit || 50);
  }
}

export const safetyPermitService = new SafetyPermitService();
