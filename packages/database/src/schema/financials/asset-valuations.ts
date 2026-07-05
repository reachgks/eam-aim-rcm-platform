import { pgTable, uuid, varchar, text, decimal, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from '../asset-register/assets';
import { users } from '../core/users';

export const valuationTypeEnum = pgEnum('valuation_type', [
  'ACQUISITION', 'REVALUATION', 'IMPAIRMENT', 'WRITE_UP', 'DISPOSAL', 'INSURANCE'
]);

export const assetValuations = pgTable('asset_valuations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  valuationDate: date('valuation_date').notNull(),
  valuationType: valuationTypeEnum('valuation_type').notNull(),
  previousValue: decimal('previous_value', { precision: 15, scale: 2 }),
  newValue: decimal('new_value', { precision: 15, scale: 2 }).notNull(),
  reason: text('reason').notNull(),
  appraiser: varchar('appraiser', { length: 200 }),
  documentId: uuid('document_id'),
  approvedBy: uuid('approved_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type AssetValuation = typeof assetValuations.$inferSelect;
export type NewAssetValuation = typeof assetValuations.$inferInsert;
