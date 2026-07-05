import { pgTable, uuid, varchar, decimal, date, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { stockItems } from './stock-items';
import { storerooms } from './storerooms';

// ─── Table ────────────────────────────────────────────────────────────────────

export const stockLevels = pgTable(
  'stock_levels',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    stockItemId: uuid('stock_item_id')
      .notNull()
      .references(() => stockItems.id),
    storeroomId: uuid('storeroom_id')
      .notNull()
      .references(() => storerooms.id),
    binLocation: varchar('bin_location', { length: 50 }),
    qtyOnHand: decimal('qty_on_hand', { precision: 14, scale: 4 }).notNull().default('0'),
    qtyReserved: decimal('qty_reserved', { precision: 14, scale: 4 }).notNull().default('0'),
    qtyOnOrder: decimal('qty_on_order', { precision: 14, scale: 4 }).notNull().default('0'),
    reorderPoint: decimal('reorder_point', { precision: 14, scale: 4 }),
    reorderQty: decimal('reorder_qty', { precision: 14, scale: 4 }),
    maxQty: decimal('max_qty', { precision: 14, scale: 4 }),
    unitCost: decimal('unit_cost', { precision: 14, scale: 4 }),
    lastReceiptDate: date('last_receipt_date'),
    lastIssueDate: date('last_issue_date'),
  },
  (table) => [
    uniqueIndex('uq_stock_levels_item_storeroom').on(table.tenantId, table.stockItemId, table.storeroomId),
    index('idx_stock_levels_storeroom').on(table.tenantId, table.storeroomId),
    index('idx_stock_levels_low_stock').on(table.tenantId, table.qtyOnHand),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const stockLevelsRelations = relations(stockLevels, ({ one }) => ({
  stockItem: one(stockItems, {
    fields: [stockLevels.stockItemId],
    references: [stockItems.id],
  }),
  storeroom: one(storerooms, {
    fields: [stockLevels.storeroomId],
    references: [storerooms.id],
  }),
}));
