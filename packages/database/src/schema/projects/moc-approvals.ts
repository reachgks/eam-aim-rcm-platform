import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { managementOfChange } from './management-of-change';
import { users } from '../core/users';

export const mocApprovalStatusEnum = pgEnum('moc_approval_status', ['PENDING', 'APPROVED', 'REJECTED', 'DEFERRED']);

export const mocApprovals = pgTable('moc_approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  mocId: uuid('moc_id').notNull().references(() => managementOfChange.id),
  approverRole: varchar('approver_role', { length: 50 }).notNull(),
  approverId: uuid('approver_id').references(() => users.id),
  status: mocApprovalStatusEnum('moc_approval_status').default('PENDING'),
  comments: text('comments'),
  decidedAt: timestamp('decided_at', { withTimezone: true }),
});

export type MocApproval = typeof mocApprovals.$inferSelect;
