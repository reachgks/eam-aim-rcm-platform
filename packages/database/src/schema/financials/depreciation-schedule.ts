import { pgTable, uuid, integer, decimal, date, boolean, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { depreciationProfiles } from './depreciation-profiles';
import { assets } from '../asset-register/assets';

export const depreciationSchedule = pgTable('depreciation_schedule', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  profileId: uuid('profile_id').notNull().references(() => depreciationProfiles.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  periodNumber: integer('period_number').notNull(),
  openingBookValue: decimal('opening_book_value', { precision: 15, scale: 2 }).notNull(),
  depreciationAmount: decimal('depreciation_amount', { precision: 15, scale: 2 }).notNull(),
  accumulatedDepreciation: decimal('accumulated_depreciation', { precision: 15, scale: 2 }).notNull(),
  closingBookValue: decimal('closing_book_value', { precision: 15, scale: 2 }).notNull(),
  unitsThisPeriod: decimal('units_this_period', { precision: 15, scale: 2 }),
  isPosted: boolean('is_posted').default(false),
  postedAt: timestamp('posted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniquePeriod: uniqueIndex('depr_schedule_profile_period_idx').on(table.profileId, table.periodNumber),
  assetPeriodIdx: index('depr_schedule_asset_period_idx').on(table.assetId, table.periodStart, table.periodEnd),
}));

export type DepreciationScheduleEntry = typeof depreciationSchedule.$inferSelect;
export type NewDepreciationScheduleEntry = typeof depreciationSchedule.$inferInsert;
