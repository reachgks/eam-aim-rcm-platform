import { pgTable, uuid, varchar, integer, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { purchaseOrders } from './purchase-orders';

export const poLineStatusEnum = pgEnum('po_line_status', ['OPEN', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CLOSED', 'CANCELLED']);

export const poLineItems = pgTable('po_line_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  purchaseOrderId: uuid('purchase_order_id').notNull().references(() => purchaseOrders.id),
  lineNumber: integer('line_number').notNull(),
  stockItemId: uuid('stock_item_id'),
  description: varchar('description', { length: 500 }).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 3 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 4 }).notNull(),
  totalPrice: decimal('total_price', { precision: 15, scale: 2 }).notNull(),
  quantityReceived: decimal('quantity_received', { precision: 12, scale: 3 }).default('0'),
  status: poLineStatusEnum('status').default('OPEN'),
});

export type PoLineItem = typeof poLineItems.$inferSelect;
export type NewPoLineItem = typeof poLineItems.$inferInsert;
