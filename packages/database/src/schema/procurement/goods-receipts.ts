import { pgTable, uuid, varchar, text, decimal, integer, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { purchaseOrders } from './purchase-orders';
import { poLineItems } from './po-line-items';
import { users } from '../core/users';

export const goodsReceipts = pgTable('goods_receipts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  receiptNumber: varchar('receipt_number', { length: 30 }).notNull(),
  purchaseOrderId: uuid('purchase_order_id').notNull().references(() => purchaseOrders.id),
  receivedBy: uuid('received_by').notNull().references(() => users.id),
  receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow(),
  storeroomId: uuid('storeroom_id'),
  notes: text('notes'),
});

export const goodsReceiptItems = pgTable('goods_receipt_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  receiptId: uuid('receipt_id').notNull().references(() => goodsReceipts.id),
  poLineId: uuid('po_line_id').notNull().references(() => poLineItems.id),
  stockItemId: uuid('stock_item_id'),
  quantityReceived: decimal('quantity_received', { precision: 12, scale: 3 }).notNull(),
  quantityAccepted: decimal('quantity_accepted', { precision: 12, scale: 3 }).notNull(),
  quantityRejected: decimal('quantity_rejected', { precision: 12, scale: 3 }).default('0'),
  notes: text('notes'),
});

export type GoodsReceipt = typeof goodsReceipts.$inferSelect;
export type GoodsReceiptItem = typeof goodsReceiptItems.$inferSelect;
