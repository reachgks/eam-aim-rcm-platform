import { pgTable, uuid, decimal, boolean, text, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { stockItems } from './stock-items';

// ─── Table ────────────────────────────────────────────────────────────────────

export const billOfMaterials = pgTable(
  'bill_of_materials',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    assetId: uuid('asset_id').notNull(),
    stockItemId: uuid('stock_item_id')
      .notNull()
      .references(() => stockItems.id),
    quantity: decimal('quantity', { precision: 12, scale: 4 }).notNull(),
    isCritical: boolean('is_critical').notNull().default(false),
    notes: text('notes'),
  },
  (table) => [
    index('idx_bom_tenant_asset').on(table.tenantId, table.assetId),
    index('idx_bom_stock_item').on(table.tenantId, table.stockItemId),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const billOfMaterialsRelations = relations(billOfMaterials, ({ one }) => ({
  stockItem: one(stockItems, {
    fields: [billOfMaterials.stockItemId],
    references: [stockItems.id],
  }),
}));
