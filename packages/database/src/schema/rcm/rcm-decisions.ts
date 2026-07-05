import { pgTable, uuid, varchar, text, boolean, integer, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from '../core/tenants';
import { failureModes } from './failure-modes';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const rcmDecisionTypeEnum = pgEnum('rcm_decision_type', [
  'ON_CONDITION',
  'SCHEDULED_RESTORATION',
  'SCHEDULED_DISCARD',
  'FAILURE_FINDING',
  'REDESIGN',
  'RUN_TO_FAILURE',
]);

export const consequenceTypeEnum = pgEnum('consequence_type', [
  'HIDDEN',
  'SAFETY',
  'ENVIRONMENTAL',
  'OPERATIONAL',
  'NON_OPERATIONAL',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const rcmDecisions = pgTable(
  'rcm_decisions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    failureModeId: uuid('failure_mode_id').notNull().references(() => failureModes.id),
    decisionType: rcmDecisionTypeEnum('decision_type').notNull(),
    taskDescription: text('task_description'),
    intervalDays: integer('interval_days'),
    intervalUnits: varchar('interval_units', { length: 50 }),
    taskFrequency: varchar('task_frequency', { length: 100 }),
    isApplicable: boolean('is_applicable').default(true),
    isEffective: boolean('is_effective').default(true),
    consequenceType: consequenceTypeEnum('consequence_type'),
    justification: text('justification'),
    maintenancePlanId: uuid('maintenance_plan_id'),
    approvedBy: uuid('approved_by'),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_rcm_decisions_tenant').on(table.tenantId),
    index('idx_rcm_decisions_failure_mode').on(table.tenantId, table.failureModeId),
    index('idx_rcm_decisions_type').on(table.tenantId, table.decisionType),
    index('idx_rcm_decisions_consequence').on(table.tenantId, table.consequenceType),
    index('idx_rcm_decisions_plan').on(table.maintenancePlanId),
  ],
);

// ── Relations ──────────────────────────────────────────────────────────────────
export const rcmDecisionsRelations = relations(rcmDecisions, ({ one }) => ({
  failureMode: one(failureModes, {
    fields: [rcmDecisions.failureModeId],
    references: [failureModes.id],
  }),
}));

// ── Types ──────────────────────────────────────────────────────────────────────
export type RcmDecision = typeof rcmDecisions.$inferSelect;
export type NewRcmDecision = typeof rcmDecisions.$inferInsert;
