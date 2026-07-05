import { pgTable, uuid, varchar, text, decimal, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

export const projectStatusEnum = pgEnum('project_status', [
  'PROPOSED', 'APPROVED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'
]);
export const projectTypeEnum = pgEnum('project_type', [
  'NEW_INSTALL', 'REPLACEMENT', 'UPGRADE', 'EXPANSION'
]);

export const capitalProjects = pgTable('capital_projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  projectCode: varchar('project_code', { length: 30 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  status: projectStatusEnum('status').default('PROPOSED'),
  type: projectTypeEnum('type'),
  siteId: uuid('site_id'),
  projectManagerId: uuid('project_manager_id').references(() => users.id),
  startDate: date('start_date'),
  endDate: date('end_date'),
  budget: decimal('budget', { precision: 15, scale: 2 }),
  actualCost: decimal('actual_cost', { precision: 15, scale: 2 }).default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type CapitalProject = typeof capitalProjects.$inferSelect;
export type NewCapitalProject = typeof capitalProjects.$inferInsert;
