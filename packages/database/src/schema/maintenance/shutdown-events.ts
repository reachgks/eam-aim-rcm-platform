import { pgTable, uuid, varchar, text, timestamp, decimal, index, pgEnum } from 'drizzle-orm/pg-core';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const shutdownTypeEnum = pgEnum('shutdown_type', [
  'PLANNED_SHUTDOWN',
  'TURNAROUND',
  'OUTAGE',
]);

export const shutdownStatusEnum = pgEnum('shutdown_status', [
  'PLANNING',
  'APPROVED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const shutdownEvents = pgTable(
  'shutdown_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    name: varchar('name', { length: 200 }).notNull(),
    type: shutdownTypeEnum('type').notNull(),
    siteId: uuid('site_id'),
    status: shutdownStatusEnum('status').notNull().default('PLANNING'),
    plannedStart: timestamp('planned_start', { withTimezone: true }),
    plannedEnd: timestamp('planned_end', { withTimezone: true }),
    actualStart: timestamp('actual_start', { withTimezone: true }),
    actualEnd: timestamp('actual_end', { withTimezone: true }),
    budget: decimal('budget', { precision: 14, scale: 2 }),
    actualCost: decimal('actual_cost', { precision: 14, scale: 2 }),
    managerId: uuid('manager_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_shutdown_events_tenant_status').on(table.tenantId, table.status),
    index('idx_shutdown_events_tenant_site').on(table.tenantId, table.siteId),
    index('idx_shutdown_events_planned_start').on(table.tenantId, table.plannedStart),
  ],
);
