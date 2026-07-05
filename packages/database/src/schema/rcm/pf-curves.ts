import { pgTable, uuid, varchar, text, decimal, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

export const pfCurveDefinitions = pgTable('pf_curve_definitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  failureModeId: uuid('failure_mode_id').notNull(),
  pfIntervalDays: decimal('pf_interval_days', { precision: 8, scale: 2 }).notNull(),
  detectionMethod: varchar('detection_method', { length: 100 }).notNull(),
  detectionParameter: varchar('detection_parameter', { length: 100 }),
  pThreshold: decimal('p_threshold', { precision: 15, scale: 4 }),
  fThreshold: decimal('f_threshold', { precision: 15, scale: 4 }),
  monitoringIntervalDays: decimal('monitoring_interval_days', { precision: 8, scale: 2 }),
  conditionIndicator: varchar('condition_indicator', { length: 100 }),
  sensorId: uuid('sensor_id'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type PfCurveDefinition = typeof pfCurveDefinitions.$inferSelect;
