import { pgTable, uuid, varchar, text, integer, boolean, jsonb, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Table ──────────────────────────────────────────────────────────────────────
export const permitTypes = pgTable(
  'permit_types',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    code: varchar('code', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    requiredApprovals: integer('required_approvals').default(1).notNull(),
    maxDurationHours: integer('max_duration_hours'),
    renewalAllowed: boolean('renewal_allowed').default(false).notNull(),
    checklist: jsonb('checklist'),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (table) => [
    uniqueIndex('permit_types_tenant_code_idx').on(table.tenantId, table.code),
    index('permit_types_tenant_id_idx').on(table.tenantId),
    index('permit_types_is_active_idx').on(table.tenantId, table.isActive),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type PermitType = typeof permitTypes.$inferSelect;
export type NewPermitType = typeof permitTypes.$inferInsert;
