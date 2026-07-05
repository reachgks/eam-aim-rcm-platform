import { pgTable, uuid, varchar, text, integer, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workOrders } from './work-orders';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const approvalStatusEnum = pgEnum('approval_status', [
  'PENDING',
  'APPROVED',
  'REJECTED',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const workOrderApprovals = pgTable(
  'work_order_approvals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    workOrderId: uuid('work_order_id')
      .notNull()
      .references(() => workOrders.id),
    approvalStep: integer('approval_step').notNull(),
    approverRole: varchar('approver_role', { length: 100 }).notNull(),
    approverId: uuid('approver_id'),
    status: approvalStatusEnum('status').notNull().default('PENDING'),
    comments: text('comments'),
    decidedAt: timestamp('decided_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_wo_approvals_tenant_wo').on(table.tenantId, table.workOrderId),
    index('idx_wo_approvals_approver').on(table.tenantId, table.approverId),
    index('idx_wo_approvals_status').on(table.tenantId, table.status),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const workOrderApprovalsRelations = relations(workOrderApprovals, ({ one }) => ({
  workOrder: one(workOrders, {
    fields: [workOrderApprovals.workOrderId],
    references: [workOrders.id],
  }),
}));
