import { pgTable, uuid, varchar, text, timestamp, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from './assets';

// ── Table ──────────────────────────────────────────────────────────────────────
export const assetClassifications = pgTable(
  'asset_classifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
    classificationSystem: varchar('classification_system', { length: 50 }).notNull(),
    classCode: varchar('class_code', { length: 100 }).notNull(),
    className: varchar('class_name', { length: 255 }),
    level: integer('level').default(1).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('asset_class_asset_system_idx').on(table.assetId, table.classificationSystem),
    index('asset_classifications_tenant_id_idx').on(table.tenantId),
    index('asset_classifications_asset_id_idx').on(table.assetId),
    index('asset_classifications_system_code_idx').on(table.tenantId, table.classificationSystem, table.classCode),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type AssetClassification = typeof assetClassifications.$inferSelect;
export type NewAssetClassification = typeof assetClassifications.$inferInsert;
