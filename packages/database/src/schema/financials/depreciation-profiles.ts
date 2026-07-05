import { pgTable, uuid, varchar, text, decimal, date, timestamp, boolean, check, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { tenants } from '../core/tenants';
import { assets } from '../asset-register/assets';
import { assetTypes } from '../asset-register/asset-types';

export const depreciationMethodEnum = pgEnum('depreciation_method', [
  'STRAIGHT_LINE', 'DECLINING_BALANCE', 'DOUBLE_DECLINING',
  'UNITS_OF_PRODUCTION', 'SUM_OF_YEARS_DIGITS'
]);

export const depreciationStatusEnum = pgEnum('depreciation_status', [
  'ACTIVE', 'FULLY_DEPRECIATED', 'SUSPENDED', 'DISPOSED'
]);

export const depreciationProfiles = pgTable('depreciation_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  assetId: uuid('asset_id').references(() => assets.id),
  assetTypeId: uuid('asset_type_id').references(() => assetTypes.id),
  method: depreciationMethodEnum('method').notNull(),
  acquisitionCost: decimal('acquisition_cost', { precision: 15, scale: 2 }).notNull(),
  salvageValue: decimal('salvage_value', { precision: 15, scale: 2 }).notNull().default('0'),
  usefulLifeYears: decimal('useful_life_years', { precision: 5, scale: 1 }),
  usefulLifeUnits: decimal('useful_life_units', { precision: 15, scale: 2 }),
  decliningRate: decimal('declining_rate', { precision: 5, scale: 4 }),
  depreciationStartDate: date('depreciation_start_date').notNull(),
  currency: varchar('currency', { length: 3 }).default('USD'),
  status: depreciationStatusEnum('status').default('ACTIVE'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  assetOrTypeCheck: check('asset_or_type_check', sql`${table.assetId} IS NOT NULL OR ${table.assetTypeId} IS NOT NULL`),
}));

export type DepreciationProfile = typeof depreciationProfiles.$inferSelect;
export type NewDepreciationProfile = typeof depreciationProfiles.$inferInsert;
