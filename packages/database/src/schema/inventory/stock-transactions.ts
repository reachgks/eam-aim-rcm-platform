import { pgTable, uuid, varchar, text, decimal, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { stockItems } from './stock-items';
import { storerooms } from './storerooms';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const stockTransactionTypeEnum = pgEnum('stock_transaction_type', [
  'ISSUE',
  'RECEIVE',
  'RETURN',
  'TRANSFER',
  'ADJUST',
  'SCRAP',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const stockTransactions = pgTable(
  'stock_transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    stockItemId: uuid('stock_item_id')
      .notNull()
      .references(() => stockItems.id),
    storeroomId: uuid('storeroom_id')
      .notNull()
      .references(() => storerooms.id),
    transactionType: stockTransactionTypeEnum('transaction_type').notNull(),
    quantity: decimal('quantity', { precision: 14, scale: 4 }).notNull(),
    unitCost: decimal('unit_cost', { precision: 14, scale: 4 }),
    workOrderId: uuid('work_order_id'),
    poLineId: uuid('po_line_id'),
    destStoreroomId: uuid('dest_storeroom_id').references(() => storerooms.id),
    referenceNumber: varchar('reference_number', { length: 50 }),
    performedBy: uuid('performed_by').notNull(),
    performedAt: timestamp('performed_at', { withTimezone: true }).defaultNow(),
    notes: text('notes'),
  },
  (table) => [
    index('idx_stock_txn_tenant_item').on(table.tenantId, table.stockItemId),
    index('idx_stock_txn_tenant_storeroom').on(table.tenantId, table.storeroomId),
    index('idx_stock_txn_type').on(table.tenantId, table.transactionType),
    index('idx_stock_txn_performed').on(table.tenantId, table.performedAt),
    index('idx_stock_txn_wo').on(table.tenantId, table.workOrderId),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const stockTransactionsRelations = relations(stockTransactions, ({ one }) => ({
  stockItem: one(stockItems, {
    fields: [stockTransactions.stockItemId],
    references: [stockItems.id],
  }),
  storeroom: one(storerooms, {
    fields: [stockTransactions.storeroomId],
    references: [storerooms.id],
  }),
  destStoreroom: one(storerooms, {
    fields: [stockTransactions.destStoreroomId],
    references: [storerooms.id],
  }),
}));
