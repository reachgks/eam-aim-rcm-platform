import { pgTable, uuid, varchar, text, timestamp, date, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';
import { informationContainers } from './information-containers';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const changeTypeEnum = pgEnum('change_type', [
  'MAJOR',
  'MINOR',
  'PATCH',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const revisionHistory = pgTable(
  'revision_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    containerId: uuid('container_id').notNull().references(() => informationContainers.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    revisionNumber: varchar('revision_number', { length: 50 }).notNull(),
    revisionDate: timestamp('revision_date', { withTimezone: true }).defaultNow().notNull(),
    description: text('description'),
    changedBy: uuid('changed_by').references(() => users.id),
    previousVersionId: uuid('previous_version_id'),
    changeType: changeTypeEnum('change_type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('rev_history_tenant_id_idx').on(table.tenantId),
    index('rev_history_container_id_idx').on(table.containerId),
    index('rev_history_revision_date_idx').on(table.containerId, table.revisionDate),
    index('rev_history_change_type_idx').on(table.tenantId, table.changeType),
    index('rev_history_prev_version_idx').on(table.previousVersionId),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type RevisionHistory = typeof revisionHistory.$inferSelect;
export type NewRevisionHistory = typeof revisionHistory.$inferInsert;
