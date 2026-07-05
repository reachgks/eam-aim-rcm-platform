import { pgTable, uuid, varchar, text, boolean, integer, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';

// ─── Table ────────────────────────────────────────────────────────────────────

export const maintenanceRoutes = pgTable(
  'maintenance_routes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    routeCode: varchar('route_code', { length: 50 }).notNull(),
    name: varchar('name', { length: 200 }).notNull(),
    description: text('description'),
    siteId: uuid('site_id'),
    estimatedDurationMin: integer('estimated_duration_min'),
    frequencyDays: integer('frequency_days'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_maint_routes_tenant_code').on(table.tenantId, table.routeCode),
    index('idx_maint_routes_tenant_active').on(table.tenantId, table.isActive),
    index('idx_maint_routes_site').on(table.tenantId, table.siteId),
  ],
);
