import { pgTable, uuid, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';

// ─── Table ────────────────────────────────────────────────────────────────────

export const crews = pgTable(
  'crews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    supervisorId: uuid('supervisor_id'),
    siteId: uuid('site_id'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_crews_tenant_active').on(table.tenantId, table.isActive),
    index('idx_crews_supervisor').on(table.tenantId, table.supervisorId),
    index('idx_crews_site').on(table.tenantId, table.siteId),
  ],
);
