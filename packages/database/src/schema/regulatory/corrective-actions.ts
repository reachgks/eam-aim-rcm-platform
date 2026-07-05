import { pgTable, uuid, varchar, text, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

export const caSourceEnum = pgEnum('ca_source_type', ['VIOLATION', 'INSPECTION', 'RCA', 'AUDIT', 'OBSERVATION']);
export const caStatusEnum = pgEnum('ca_status', ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'OVERDUE']);

export const correctiveActions = pgTable('corrective_actions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  sourceType: caSourceEnum('source_type').notNull(),
  sourceId: uuid('source_id').notNull(),
  description: text('description').notNull(),
  assignedTo: uuid('assigned_to').references(() => users.id),
  priority: varchar('priority', { length: 20 }),
  status: caStatusEnum('ca_status').default('OPEN'),
  dueDate: date('due_date'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  effectivenessRating: varchar('effectiveness_rating', { length: 20 }),
});

export type CorrectiveAction = typeof correctiveActions.$inferSelect;
