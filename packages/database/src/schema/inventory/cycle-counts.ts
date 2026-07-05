import { pgTable, uuid, text, decimal, date, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { storerooms } from './storerooms';
import { stockItems } from './stock-items';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const cycleCountStatusEnum = pgEnum('cycle_count_status', [
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'RECONCILED',
]);

// ─── Cycle Counts ─────────────────────────────────────────────────────────────

export const cycleCounts = pgTable(
  'cycle_counts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    storeroomId: uuid('storeroom_id')
      .notNull()
      .references(() => storerooms.id),
    countDate: date('count_date').notNull(),
    status: cycleCountStatusEnum('status').notNull().default('PLANNED'),
    countedBy: uuid('counted_by'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_cycle_counts_tenant_storeroom').on(table.tenantId, table.storeroomId),
    index('idx_cycle_counts_status').on(table.tenantId, table.status),
    index('idx_cycle_counts_date').on(table.tenantId, table.countDate),
  ],
);

// ─── Cycle Count Items ────────────────────────────────────────────────────────

export const cycleCountItems = pgTable(
  'cycle_count_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    countId: uuid('count_id')
      .notNull()
      .references(() => cycleCounts.id),
    stockItemId: uuid('stock_item_id')
      .notNull()
      .references(() => stockItems.id),
    systemQty: decimal('system_qty', { precision: 14, scale: 4 }).notNull(),
    countedQty: decimal('counted_qty', { precision: 14, scale: 4 }),
    variance: decimal('variance', { precision: 14, scale: 4 }),
    notes: text('notes'),
  },
  (table) => [
    index('idx_cc_items_count').on(table.countId),
    index('idx_cc_items_stock_item').on(table.stockItemId),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const cycleCountsRelations = relations(cycleCounts, ({ one, many }) => ({
  storeroom: one(storerooms, {
    fields: [cycleCounts.storeroomId],
    references: [storerooms.id],
  }),
  items: many(cycleCountItems),
}));

export const cycleCountItemsRelations = relations(cycleCountItems, ({ one }) => ({
  count: one(cycleCounts, {
    fields: [cycleCountItems.countId],
    references: [cycleCounts.id],
  }),
  stockItem: one(stockItems, {
    fields: [cycleCountItems.stockItemId],
    references: [stockItems.id],
  }),
}));
