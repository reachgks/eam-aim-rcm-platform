import { pgTable, uuid, varchar, integer, decimal, date, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { capitalProjects } from './capital-projects';

export const phaseStatusEnum = pgEnum('phase_status', ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']);

export const projectPhases = pgTable('project_phases', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  projectId: uuid('project_id').notNull().references(() => capitalProjects.id),
  name: varchar('name', { length: 200 }).notNull(),
  sequenceNumber: integer('sequence_number').notNull(),
  status: phaseStatusEnum('phase_status').default('NOT_STARTED'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  budget: decimal('budget', { precision: 15, scale: 2 }),
  actualCost: decimal('actual_cost', { precision: 15, scale: 2 }).default('0'),
});

export type ProjectPhase = typeof projectPhases.$inferSelect;
