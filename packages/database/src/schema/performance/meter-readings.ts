import { pgTable, uuid, decimal, date, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from '../asset-register/assets';
import { users } from '../core/users';

export const meterTypeEnum = pgEnum('meter_type', [
  'RUNTIME_HOURS', 'CYCLES', 'MILEAGE', 'PRODUCTION_COUNT', 'ENERGY'
]);

export const meterReadings = pgTable('meter_readings', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  meterType: meterTypeEnum('meter_type').notNull(),
  readingDate: date('reading_date').notNull(),
  readingValue: decimal('reading_value', { precision: 15, scale: 2 }).notNull(),
  previousValue: decimal('previous_value', { precision: 15, scale: 2 }),
  delta: decimal('delta', { precision: 15, scale: 2 }),
  isEstimated: boolean('is_estimated').default(false),
  recordedBy: uuid('recorded_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type MeterReading = typeof meterReadings.$inferSelect;
