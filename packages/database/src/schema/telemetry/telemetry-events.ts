import { pgTable, uuid, varchar, decimal, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { sensorRegistry } from './sensor-registry';
import { users } from '../core/users';

export const telemetryEventTypeEnum = pgEnum('telemetry_event_type', [
  'ALARM', 'WARNING', 'RETURN_TO_NORMAL', 'COMMUNICATION_LOSS', 'CALIBRATION'
]);
export const telemetrySeverityEnum = pgEnum('telemetry_severity', ['INFO', 'WARNING', 'CRITICAL']);

export const telemetryEvents = pgTable('telemetry_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  sensorId: uuid('sensor_id').notNull().references(() => sensorRegistry.id),
  eventType: telemetryEventTypeEnum('event_type').notNull(),
  severity: telemetrySeverityEnum('severity').notNull(),
  value: decimal('value', { precision: 20, scale: 6 }),
  threshold: decimal('threshold', { precision: 20, scale: 6 }),
  message: varchar('message', { length: 500 }),
  acknowledgedBy: uuid('acknowledged_by').references(() => users.id),
  acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type TelemetryEvent = typeof telemetryEvents.$inferSelect;
