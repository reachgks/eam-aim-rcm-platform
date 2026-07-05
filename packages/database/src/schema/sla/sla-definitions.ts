import { pgTable, uuid, varchar, text, boolean, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Table ──────────────────────────────────────────────────────────────────────
export const slaDefinitions = pgTable(
  'sla_definitions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('sla_definitions_tenant_id_idx').on(table.tenantId),
    uniqueIndex('sla_definitions_tenant_name_idx').on(table.tenantId, table.name),
    index('sla_definitions_category_idx').on(table.tenantId, table.category),
    index('sla_definitions_is_active_idx').on(table.tenantId, table.isActive),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type SlaDefinition = typeof slaDefinitions.$inferSelect;
export type NewSlaDefinition = typeof slaDefinitions.$inferInsert;
