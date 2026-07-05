import { pgTable, uuid, text, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';
import { informationContainers } from './information-containers';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const cdeStateEnum = pgEnum('cde_state', [
  'WORK_IN_PROGRESS',
  'SHARED',
  'PUBLISHED',
  'ARCHIVED',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const cdeStates = pgTable(
  'cde_states',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    containerId: uuid('container_id').notNull().references(() => informationContainers.id, { onDelete: 'cascade' }),
    state: cdeStateEnum('state').notNull(),
    previousState: cdeStateEnum('previous_state'),
    changedBy: uuid('changed_by').references(() => users.id),
    reason: text('reason'),
    changedAt: timestamp('changed_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('cde_states_tenant_id_idx').on(table.tenantId),
    index('cde_states_container_id_idx').on(table.containerId),
    index('cde_states_state_idx').on(table.tenantId, table.state),
    index('cde_states_changed_at_idx').on(table.containerId, table.changedAt),
    index('cde_states_changed_by_idx').on(table.changedBy),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type CdeState = typeof cdeStates.$inferSelect;
export type NewCdeState = typeof cdeStates.$inferInsert;
