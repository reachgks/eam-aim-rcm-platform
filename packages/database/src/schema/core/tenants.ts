import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, uniqueIndex, index, pgEnum } from 'drizzle-orm/pg-core';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const tenantPlanEnum = pgEnum('tenant_plan', [
  'FREE',
  'STARTER',
  'PROFESSIONAL',
  'ENTERPRISE',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const tenants = pgTable(
  'tenants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    domain: varchar('domain', { length: 255 }),
    plan: tenantPlanEnum('plan').default('FREE').notNull(),
    settings: jsonb('settings').default({}),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('tenants_slug_idx').on(table.slug),
    uniqueIndex('tenants_domain_idx').on(table.domain),
    index('tenants_is_active_idx').on(table.isActive),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
