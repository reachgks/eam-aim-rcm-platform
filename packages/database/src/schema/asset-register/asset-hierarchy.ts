import { pgTable, uuid, varchar, boolean, timestamp, integer, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from './assets';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const hierarchyRelationshipTypeEnum = pgEnum('hierarchy_relationship_type', [
  'PHYSICAL',
  'FUNCTIONAL',
  'LOGICAL',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const assetHierarchy = pgTable(
  'asset_hierarchy',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    parentAssetId: uuid('parent_asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
    childAssetId: uuid('child_asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
    relationshipType: hierarchyRelationshipTypeEnum('relationship_type').default('PHYSICAL').notNull(),
    position: integer('position').default(0),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('asset_hierarchy_parent_child_type_idx').on(
      table.parentAssetId,
      table.childAssetId,
      table.relationshipType,
    ),
    index('asset_hierarchy_tenant_id_idx').on(table.tenantId),
    index('asset_hierarchy_parent_asset_id_idx').on(table.parentAssetId),
    index('asset_hierarchy_child_asset_id_idx').on(table.childAssetId),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type AssetHierarchy = typeof assetHierarchy.$inferSelect;
export type NewAssetHierarchy = typeof assetHierarchy.$inferInsert;
