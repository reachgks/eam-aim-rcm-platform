import { pgTable, uuid, varchar, text, decimal, date, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { projectPhases } from './project-phases';
import { users } from '../core/users';

export const taskStatusEnum = pgEnum('project_task_status', ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']);

export const projectTasks = pgTable('project_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  phaseId: uuid('phase_id').notNull().references(() => projectPhases.id),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  assignedTo: uuid('assigned_to').references(() => users.id),
  status: taskStatusEnum('project_task_status').default('TODO'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  estimatedHours: decimal('estimated_hours', { precision: 8, scale: 2 }),
  actualHours: decimal('actual_hours', { precision: 8, scale: 2 }).default('0'),
});

export type ProjectTask = typeof projectTasks.$inferSelect;
