import { pgTable, uuid, decimal, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from '../asset-register/assets';

export const reliabilityMetrics = pgTable('reliability_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  calculationDate: timestamp('calculation_date', { withTimezone: true }).defaultNow(),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
  totalFailures: decimal('total_failures', { precision: 10, scale: 0 }).default('0'),
  totalOperatingHours: decimal('total_operating_hours', { precision: 12, scale: 2 }),
  totalDowntimeHours: decimal('total_downtime_hours', { precision: 12, scale: 2 }),
  totalRepairHours: decimal('total_repair_hours', { precision: 12, scale: 2 }),
  mtbf: decimal('mtbf', { precision: 12, scale: 2 }),
  mttr: decimal('mttr', { precision: 12, scale: 2 }),
  mttf: decimal('mttf', { precision: 12, scale: 2 }),
  availability: decimal('availability', { precision: 6, scale: 4 }),
  reliabilityAtMissionTime: decimal('reliability_at_mission_time', { precision: 6, scale: 4 }),
  missionTimeHours: decimal('mission_time_hours', { precision: 10, scale: 2 }),
  failureRate: decimal('failure_rate', { precision: 15, scale: 8 }),
  repairRate: decimal('repair_rate', { precision: 15, scale: 8 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  assetDateIdx: index('reliability_asset_date_idx').on(table.assetId, table.calculationDate),
}));

export type ReliabilityMetric = typeof reliabilityMetrics.$inferSelect;
