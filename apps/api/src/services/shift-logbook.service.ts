import { eq, and, count, desc, sql, gte, lte, ilike, sum } from 'drizzle-orm';
import { db } from '@eamaim/database';
import { shiftLogEntries, assets, functionalLocations } from '@eamaim/database/schema';

export class ShiftLogbookService {
  async getLogEntries(tenantId: string, filters: {
    page?: number; limit?: number; machineName?: string; sectionName?: string;
    plantName?: string; locationId?: string; assetId?: string; logEntryType?: string;
    shiftType?: string; dateFrom?: string; dateTo?: string; status?: string;
  }) {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const offset = (page - 1) * limit;

    const conditions: any[] = [eq(shiftLogEntries.tenantId, tenantId)];

    if (filters.machineName) conditions.push(ilike(shiftLogEntries.machineName, `%${filters.machineName}%`));
    if (filters.sectionName) conditions.push(ilike(shiftLogEntries.sectionName, `%${filters.sectionName}%`));
    if (filters.plantName) conditions.push(ilike(shiftLogEntries.plantName, `%${filters.plantName}%`));
    if (filters.locationId) conditions.push(eq(shiftLogEntries.functionalLocationId, filters.locationId));
    if (filters.assetId) conditions.push(eq(shiftLogEntries.assetId, filters.assetId));
    if (filters.logEntryType) conditions.push(eq(shiftLogEntries.logEntryType, filters.logEntryType as any));
    if (filters.shiftType) conditions.push(eq(shiftLogEntries.shiftType, filters.shiftType as any));
    if (filters.status) conditions.push(eq(shiftLogEntries.status, filters.status as any));
    if (filters.dateFrom) conditions.push(gte(shiftLogEntries.shiftDate, filters.dateFrom));
    if (filters.dateTo) conditions.push(lte(shiftLogEntries.shiftDate, filters.dateTo));

    const where = and(...conditions);

    const [data, [{ total }]] = await Promise.all([
      db.select().from(shiftLogEntries).where(where)
        .orderBy(desc(shiftLogEntries.shiftDate), desc(shiftLogEntries.createdAt))
        .limit(limit).offset(offset),
      db.select({ total: count() }).from(shiftLogEntries).where(where),
    ]);

    return {
      data,
      pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) },
    };
  }

  async createLogEntry(tenantId: string, data: any) {
    let machineName = data.machineName;
    let plantName = data.plantName;
    let sectionName = data.sectionName;

    // Auto-denormalize machine name from asset
    if (data.assetId && !machineName) {
      const [asset] = await db.select({ name: assets.name }).from(assets)
        .where(and(eq(assets.id, data.assetId), eq(assets.tenantId, tenantId)));
      if (asset) machineName = asset.name;
    }

    // Auto-denormalize plant/section name from location
    if (data.functionalLocationId) {
      const [loc] = await db.select().from(functionalLocations)
        .where(and(eq(functionalLocations.id, data.functionalLocationId), eq(functionalLocations.tenantId, tenantId)));
      if (loc) {
        if (loc.locationType === 'SITE') plantName = plantName || loc.name;
        else sectionName = sectionName || loc.name;
      }
    }

    const [entry] = await db.insert(shiftLogEntries).values({
      ...data, tenantId, machineName, plantName, sectionName,
    }).returning();
    return entry;
  }

  async updateLogEntry(tenantId: string, id: string, data: any) {
    const [entry] = await db.update(shiftLogEntries)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(shiftLogEntries.id, id), eq(shiftLogEntries.tenantId, tenantId)))
      .returning();
    return entry || null;
  }

  async getShiftSummary(tenantId: string, date?: string, shiftType?: string) {
    const conditions: any[] = [eq(shiftLogEntries.tenantId, tenantId)];
    if (date) conditions.push(eq(shiftLogEntries.shiftDate, date));
    if (shiftType) conditions.push(eq(shiftLogEntries.shiftType, shiftType as any));

    const [totalRes, byTypeRes, avgDowntimeRes] = await Promise.all([
      db.select({ total: count() }).from(shiftLogEntries).where(and(...conditions)),
      db.select({ type: shiftLogEntries.logEntryType, cnt: count() })
        .from(shiftLogEntries).where(and(...conditions)).groupBy(shiftLogEntries.logEntryType),
      db.select({ avg: sql<string>`COALESCE(AVG(${shiftLogEntries.downtimeMinutes}), 0)` })
        .from(shiftLogEntries).where(and(...conditions)),
    ]);

    const byType: Record<string, number> = {};
    for (const r of byTypeRes) byType[r.type] = Number(r.cnt);

    return {
      total: Number(totalRes[0]?.total || 0),
      byType,
      avgDowntime: Math.round(Number(avgDowntimeRes[0]?.avg || 0)),
    };
  }

  async getBreakdownSummary(tenantId: string, dateFrom?: string, dateTo?: string) {
    const conditions: any[] = [
      eq(shiftLogEntries.tenantId, tenantId),
      eq(shiftLogEntries.logEntryType, 'BREAKDOWN' as any),
    ];
    if (dateFrom) conditions.push(gte(shiftLogEntries.shiftDate, dateFrom));
    if (dateTo) conditions.push(lte(shiftLogEntries.shiftDate, dateTo));

    return db.select({
      sectionName: shiftLogEntries.sectionName,
      total: count(),
      totalDowntime: sql<string>`COALESCE(SUM(${shiftLogEntries.downtimeMinutes}), 0)`,
    }).from(shiftLogEntries).where(and(...conditions)).groupBy(shiftLogEntries.sectionName);
  }

  async getPreventiveSummary(tenantId: string, dateFrom?: string, dateTo?: string) {
    const conditions: any[] = [
      eq(shiftLogEntries.tenantId, tenantId),
      eq(shiftLogEntries.logEntryType, 'PREVENTIVE' as any),
    ];
    if (dateFrom) conditions.push(gte(shiftLogEntries.shiftDate, dateFrom));
    if (dateTo) conditions.push(lte(shiftLogEntries.shiftDate, dateTo));

    return db.select({
      sectionName: shiftLogEntries.sectionName,
      total: count(),
      totalDowntime: sql<string>`COALESCE(SUM(${shiftLogEntries.downtimeMinutes}), 0)`,
    }).from(shiftLogEntries).where(and(...conditions)).groupBy(shiftLogEntries.sectionName);
  }

  async getScheduledSummary(tenantId: string, dateFrom?: string, dateTo?: string) {
    const conditions: any[] = [
      eq(shiftLogEntries.tenantId, tenantId),
      eq(shiftLogEntries.logEntryType, 'SCHEDULED' as any),
    ];
    if (dateFrom) conditions.push(gte(shiftLogEntries.shiftDate, dateFrom));
    if (dateTo) conditions.push(lte(shiftLogEntries.shiftDate, dateTo));

    return db.select({
      sectionName: shiftLogEntries.sectionName,
      total: count(),
      totalDowntime: sql<string>`COALESCE(SUM(${shiftLogEntries.downtimeMinutes}), 0)`,
    }).from(shiftLogEntries).where(and(...conditions)).groupBy(shiftLogEntries.sectionName);
  }
}

export const shiftLogbookService = new ShiftLogbookService();
