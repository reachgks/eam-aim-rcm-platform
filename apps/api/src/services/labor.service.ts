import { eq, and, count, desc, asc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { crafts, craftCertifications, crews, crewMembers, laborBookings, laborRates, shifts, laborAvailability } from '@eamaim/database/schema';

export class LaborService {
  async findAllCrafts(tenantId: string) {
    return db.select().from(crafts).where(eq(crafts.tenantId, tenantId)).orderBy(asc(crafts.name));
  }

  async createCraft(tenantId: string, data: any) {
    const [craft] = await db.insert(crafts).values({ ...data, tenantId }).returning();
    return craft;
  }

  async findAllCrews(tenantId: string) {
    return db.select().from(crews).where(eq(crews.tenantId, tenantId)).orderBy(asc(crews.name));
  }

  async getCrewWithMembers(tenantId: string, crewId: string) {
    const [crew] = await db.select().from(crews).where(and(eq(crews.id, crewId), eq(crews.tenantId, tenantId))).limit(1);
    if (!crew) return null;
    const members = await db.select().from(crewMembers).where(eq(crewMembers.crewId, crewId));
    return { ...crew, members };
  }

  async bookLabor(tenantId: string, data: any) {
    const [booking] = await db.insert(laborBookings).values({ ...data, tenantId }).returning();
    return booking;
  }

  async getLaborBookings(tenantId: string, options: { workOrderId?: string; userId?: string } = {}) {
    const conditions = [eq(laborBookings.tenantId, tenantId)];
    if (options.workOrderId) conditions.push(eq(laborBookings.workOrderId, options.workOrderId));
    if (options.userId) conditions.push(eq(laborBookings.userId, options.userId));
    return db.select().from(laborBookings).where(and(...conditions)).orderBy(desc(laborBookings.createdAt));
  }

  async getLaborRates(tenantId: string) {
    return db.select().from(laborRates).where(eq(laborRates.tenantId, tenantId));
  }

  async getShifts(tenantId: string) {
    return db.select().from(shifts).where(eq(shifts.tenantId, tenantId));
  }

  async getCertifications(tenantId: string, userId?: string) {
    const conditions = [eq(craftCertifications.tenantId, tenantId)];
    if (userId) conditions.push(eq(craftCertifications.userId, userId));
    return db.select().from(craftCertifications).where(and(...conditions));
  }
}

export const laborService = new LaborService();
