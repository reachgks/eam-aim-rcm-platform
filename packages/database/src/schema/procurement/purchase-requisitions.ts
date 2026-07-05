import { pgTable, uuid, varchar, text, decimal, timestamp, date, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

export const prStatusEnum = pgEnum('pr_status', ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CONVERTED']);

export const purchaseRequisitions = pgTable('purchase_requisitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  reqNumber: varchar('req_number', { length: 30 }).notNull(),
  status: prStatusEnum('status').default('DRAFT'),
  requestedBy: uuid('requested_by').notNull().references(() => users.id),
  approvedBy: uuid('approved_by').references(() => users.id),
  workOrderId: uuid('work_order_id'),
  costCenterId: uuid('cost_center_id'),
  totalEstimated: decimal('total_estimated', { precision: 15, scale: 2 }),
  justification: text('justification'),
  neededByDate: date('needed_by_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type PurchaseRequisition = typeof purchaseRequisitions.$inferSelect;
export type NewPurchaseRequisition = typeof purchaseRequisitions.$inferInsert;
