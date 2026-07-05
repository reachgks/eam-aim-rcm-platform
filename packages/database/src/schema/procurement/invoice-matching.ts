import { pgTable, uuid, varchar, decimal, timestamp, date, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { vendors } from './vendors';
import { purchaseOrders } from './purchase-orders';
import { users } from '../core/users';

export const invoiceStatusEnum = pgEnum('invoice_status', ['PENDING', 'MATCHED', 'PARTIAL_MATCH', 'DISPUTED', 'PAID']);

export const invoiceMatching = pgTable('invoice_matching', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
  vendorId: uuid('vendor_id').notNull().references(() => vendors.id),
  purchaseOrderId: uuid('purchase_order_id').references(() => purchaseOrders.id),
  invoiceDate: date('invoice_date').notNull(),
  dueDate: date('due_date'),
  totalAmount: decimal('total_amount', { precision: 15, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 15, scale: 2 }),
  status: invoiceStatusEnum('status').default('PENDING'),
  matchedBy: uuid('matched_by').references(() => users.id),
  matchedAt: timestamp('matched_at', { withTimezone: true }),
  paymentReference: varchar('payment_reference', { length: 100 }),
});

export type InvoiceMatching = typeof invoiceMatching.$inferSelect;
export type NewInvoiceMatching = typeof invoiceMatching.$inferInsert;
