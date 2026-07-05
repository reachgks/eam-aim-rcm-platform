import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';
import { informationContainers } from './information-containers';
import { cdeStateEnum } from './cde-states';

// ── Tables ─────────────────────────────────────────────────────────────────────

export const cdeWorkflowDefinitions = pgTable(
  'cde_workflow_definitions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    fromState: cdeStateEnum('from_state').notNull(),
    toState: cdeStateEnum('to_state').notNull(),
    requiredRole: varchar('required_role', { length: 100 }),
    autoTransition: boolean('auto_transition').default(false).notNull(),
    conditions: jsonb('conditions'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('cde_wf_defs_tenant_id_idx').on(table.tenantId),
    uniqueIndex('cde_wf_defs_tenant_name_idx').on(table.tenantId, table.name),
    index('cde_wf_defs_from_state_idx').on(table.tenantId, table.fromState),
    index('cde_wf_defs_to_state_idx').on(table.tenantId, table.toState),
  ],
);

export const cdeWorkflowTransitions = pgTable(
  'cde_workflow_transitions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    containerId: uuid('container_id').notNull().references(() => informationContainers.id, { onDelete: 'cascade' }),
    workflowId: uuid('workflow_id').notNull().references(() => cdeWorkflowDefinitions.id),
    fromState: cdeStateEnum('from_state').notNull(),
    toState: cdeStateEnum('to_state').notNull(),
    triggeredBy: uuid('triggered_by').references(() => users.id),
    notes: text('notes'),
    transitionedAt: timestamp('transitioned_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('cde_wf_trans_container_id_idx').on(table.containerId),
    index('cde_wf_trans_workflow_id_idx').on(table.workflowId),
    index('cde_wf_trans_transitioned_at_idx').on(table.containerId, table.transitionedAt),
    index('cde_wf_trans_triggered_by_idx').on(table.triggeredBy),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type CdeWorkflowDefinition = typeof cdeWorkflowDefinitions.$inferSelect;
export type NewCdeWorkflowDefinition = typeof cdeWorkflowDefinitions.$inferInsert;

export type CdeWorkflowTransition = typeof cdeWorkflowTransitions.$inferSelect;
export type NewCdeWorkflowTransition = typeof cdeWorkflowTransitions.$inferInsert;
