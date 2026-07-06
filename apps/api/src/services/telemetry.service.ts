import { eq, and, count, desc, asc, sql, lte } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  sensorRegistry, sensorReadings, telemetryEvents,
  alertRules, alertHistory,
} from '@eamaim/database/schema';

export class TelemetryService {
  async findAllSensors(tenantId: string, options: { assetId?: string; page?: number; limit?: number } = {}) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100);
    const conditions = [eq(sensorRegistry.tenantId, tenantId)];
    if (options.assetId) conditions.push(eq(sensorRegistry.assetId, options.assetId));
    const where = and(...conditions);
    const [data, [{ total }]] = await Promise.all([
      db.select().from(sensorRegistry).where(where).orderBy(asc(sensorRegistry.sensorCode)).limit(limit).offset((page - 1) * limit),
      db.select({ total: count() }).from(sensorRegistry).where(where),
    ]);
    return { data, pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) } };
  }

  async createSensor(tenantId: string, data: any) {
    const [sensor] = await db.insert(sensorRegistry).values({ ...data, tenantId }).returning();
    return sensor;
  }

  async getLatestReadings(tenantId: string, sensorId: string, limit: number = 100) {
    return db.select().from(sensorReadings)
      .where(and(eq(sensorReadings.sensorId, sensorId), eq(sensorReadings.tenantId, tenantId)))
      .orderBy(desc(sensorReadings.time)).limit(limit);
  }

  async getActiveAlerts(tenantId: string) {
    return db.select().from(alertHistory)
      .where(and(eq(alertHistory.tenantId, tenantId), sql`${alertHistory.resolvedAt} IS NULL`))
      .orderBy(desc(alertHistory.triggeredAt));
  }

  async acknowledgeAlert(tenantId: string, alertId: string, userId: string) {
    const [updated] = await db.update(alertHistory)
      .set({ acknowledgedBy: userId, acknowledgedAt: new Date() })
      .where(and(eq(alertHistory.id, alertId), eq(alertHistory.tenantId, tenantId))).returning();
    return updated || null;
  }

  async getAlertRules(tenantId: string) {
    return db.select().from(alertRules).where(eq(alertRules.tenantId, tenantId));
  }

  async createAlertRule(tenantId: string, data: any) {
    const [rule] = await db.insert(alertRules).values({ ...data, tenantId }).returning();
    return rule;
  }

  async getEvents(tenantId: string, options: { sensorId?: string; severity?: string; limit?: number } = {}) {
    const conditions = [eq(telemetryEvents.tenantId, tenantId)];
    if (options.sensorId) conditions.push(eq(telemetryEvents.sensorId, options.sensorId));
    if (options.severity) conditions.push(eq(telemetryEvents.severity, options.severity as any));
    return db.select().from(telemetryEvents).where(and(...conditions))
      .orderBy(desc(telemetryEvents.createdAt)).limit(options.limit || 100);
  }

  // ── Aggregated readings (hourly/daily) from continuous aggregates ──
  async getAggregatedReadings(tenantId: string, sensorId: string, bucketSize: string = '1 hour', hoursBack: number = 24) {
    const result = await db.execute(sql`
      SELECT time_bucket(${bucketSize}::interval, time) AS bucket,
        AVG(value) AS avg_value, MIN(value) AS min_value, MAX(value) AS max_value, COUNT(*) AS samples
      FROM sensor_readings
      WHERE sensor_id = ${sensorId} AND tenant_id = ${tenantId}
        AND time >= NOW() - ${hoursBack + ' hours'}::interval
      GROUP BY bucket ORDER BY bucket DESC
    `);
    return result.rows;
  }
}

export const telemetryService = new TelemetryService();
