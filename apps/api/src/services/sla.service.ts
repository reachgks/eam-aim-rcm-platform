import { eq, and, count, desc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { slaDefinitions, slaTargets, slaTracking, slaBreaches } from '@eamaim/database/schema';

export class SlaService {
  async findAll(tenantId: string) {
    return db.select().from(slaDefinitions).where(eq(slaDefinitions.tenantId, tenantId));
  }

  async findById(tenantId: string, id: string) {
    const [sla] = await db.select().from(slaDefinitions).where(and(eq(slaDefinitions.id, id), eq(slaDefinitions.tenantId, tenantId))).limit(1);
    if (!sla) return null;
    const [targets, breaches] = await Promise.all([
      db.select().from(slaTargets).where(eq(slaTargets.slaId, id)),
      db.select().from(slaBreaches).where(and(eq(slaBreaches.tenantId, tenantId), eq(slaBreaches.slaId, id))).orderBy(desc(slaBreaches.breachedAt)).limit(20),
    ]);
    return { ...sla, targets, recentBreaches: breaches };
  }

  async create(tenantId: string, data: any) {
    const [sla] = await db.insert(slaDefinitions).values({ ...data, tenantId }).returning();
    return sla;
  }

  async getBreaches(tenantId: string, options: { slaId?: string; limit?: number } = {}) {
    const conditions = [eq(slaBreaches.tenantId, tenantId)];
    if (options.slaId) conditions.push(eq(slaBreaches.slaId, options.slaId));
    return db.select().from(slaBreaches).where(and(...conditions)).orderBy(desc(slaBreaches.breachedAt)).limit(options.limit || 50);
  }

  async getSummary(tenantId: string) {
    const [totalSlas, totalBreaches, activeTracking] = await Promise.all([
      db.select({ total: count() }).from(slaDefinitions).where(eq(slaDefinitions.tenantId, tenantId)),
      db.select({ total: count() }).from(slaBreaches).where(eq(slaBreaches.tenantId, tenantId)),
      db.select({ total: count() }).from(slaTracking).where(eq(slaTracking.tenantId, tenantId)),
    ]);
    return { totalSlas: Number(totalSlas[0].total), totalBreaches: Number(totalBreaches[0].total), activeTracking: Number(activeTracking[0].total) };
  }
}

export const slaService = new SlaService();
