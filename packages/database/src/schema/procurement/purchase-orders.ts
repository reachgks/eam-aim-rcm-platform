import { pgTable, uuid, varchar, text, decimal, timestamp, date, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { vendors } from './vendors';
import { purchaseRequisitions } from './purchase-requisitions';
import { users } from '../core/users';

export const poStatusEnum = pgEnum('po_status', [
  'DRAFT', 'SUBMITTED', 'CONFIRMED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CLOSED', 'CANCELLED'
]);

export const purchaseOrders = pgTable('purchase_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  poNumber: varchar('po_number', { length: 30 }).notNull(),
  vendorId: uuid('vendor_id').notNull().references(() => vendors.id),
  status: poStatusEnum('status').default('DRAFT'),
  requisitionId: uuid('requisition_id').references(() => purchaseRequisitions.id),
  costCenterId: uuid('cost_center_id'),
  currency: varchar('currency', { length: 3 }).default('USD'),
  totalAmount: decimal('total_amount', { precision: 15, scale: 2 }),
  taxAmount: decimal('tax_amount', { precision: 15, scale: 2 }),
  shippingAddress: text('shipping_address'),
  terms: text('terms'),
  expectedDeliveryDate: date('expected_delivery_date'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type NewPurchaseOrder = typeof purchaseOrders.$inferInsert;
