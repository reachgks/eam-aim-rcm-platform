import { pgTable, uuid, varchar, text, jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

export const mocTypeEnum = pgEnum('moc_type', ['EQUIPMENT', 'PROCESS', 'ORGANIZATIONAL', 'TEMPORARY']);
export const mocStatusEnum = pgEnum('moc_status', [
  'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'IMPLEMENTED', 'CLOSED'
]);

export const managementOfChange = pgTable('management_of_change', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  mocNumber: varchar('moc_number', { length: 30 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  type: mocTypeEnum('type').notNull(),
  status: mocStatusEnum('moc_status').default('DRAFT'),
  requestedBy: uuid('requested_by').notNull().references(() => users.id),
  riskAssessment: jsonb('risk_assessment'),
  impactedAssets: jsonb('impacted_assets'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type ManagementOfChange = typeof managementOfChange.$inferSelect;
