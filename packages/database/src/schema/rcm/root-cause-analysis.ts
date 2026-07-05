import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

export const rcaMethodEnum = pgEnum('rca_methodology', ['FIVE_WHY', 'FISHBONE', 'FAULT_TREE', 'TAPROOT', 'HYBRID']);
export const rcaStatusEnum = pgEnum('rca_status', ['IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CLOSED']);

export const rootCauseAnalyses = pgTable('root_cause_analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  failureEventId: uuid('failure_event_id').notNull(),
  rcaNumber: varchar('rca_number', { length: 30 }).notNull(),
  methodology: rcaMethodEnum('methodology').notNull(),
  status: rcaStatusEnum('rca_status').default('IN_PROGRESS'),
  summary: text('summary'),
  rootCauseStatement: text('root_cause_statement'),
  immediateCause: text('immediate_cause'),
  ledBy: uuid('led_by').notNull().references(() => users.id),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  documentId: uuid('document_id'),
});

export type RootCauseAnalysis = typeof rootCauseAnalyses.$inferSelect;
