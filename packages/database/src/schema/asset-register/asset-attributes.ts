import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from './assets';

// ── Table ──────────────────────────────────────────────────────────────────────
export const assetAttributes = pgTable(
  'asset_attributes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
    attributeName: varchar('attribute_name', { length: 255 }).notNull(),
    attributeValue: text('attribute_value'),
    dataType: varchar('data_type', { length: 50 }).notNull().default('STRING'),
    unitOfMeasure: varchar('unit_of_measure', { length: 50 }),
    source: varchar('source', { length: 100 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('asset_attributes_tenant_id_idx').on(table.tenantId),
    index('asset_attributes_asset_id_idx').on(table.assetId),
    index('asset_attributes_asset_attr_name_idx').on(table.assetId, table.attributeName),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type AssetAttribute = typeof assetAttributes.$inferSelect;
export type NewAssetAttribute = typeof assetAttributes.$inferInsert;
