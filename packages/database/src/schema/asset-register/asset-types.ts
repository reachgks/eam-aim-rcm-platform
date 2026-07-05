import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Table ──────────────────────────────────────────────────────────────────────
export const assetTypes = pgTable(
  'asset_types',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    code: varchar('code', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    parentTypeId: uuid('parent_type_id'), // self-referencing hierarchy
    category: varchar('category', { length: 100 }),
    iconName: varchar('icon_name', { length: 100 }),
    defaultAttributes: jsonb('default_attributes').$type<Record<string, unknown>[]>().default([]),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('asset_types_tenant_code_idx').on(table.tenantId, table.code),
    index('asset_types_tenant_id_idx').on(table.tenantId),
    index('asset_types_parent_type_id_idx').on(table.parentTypeId),
    index('asset_types_category_idx').on(table.tenantId, table.category),
    index('asset_types_is_active_idx').on(table.tenantId, table.isActive),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type AssetType = typeof assetTypes.$inferSelect;
export type NewAssetType = typeof assetTypes.$inferInsert;
