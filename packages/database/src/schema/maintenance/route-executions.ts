import { pgTable, uuid, varchar, text, timestamp, jsonb, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { maintenanceRoutes } from './maintenance-routes';
import { routeStops } from './route-stops';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const routeExecutionStatusEnum = pgEnum('route_execution_status', [
  'IN_PROGRESS',
  'COMPLETED',
  'INCOMPLETE',
]);

export const routeStopReadingStatusEnum = pgEnum('route_stop_reading_status', [
  'PENDING',
  'COMPLETED',
  'SKIPPED',
]);

// ─── Route Executions ─────────────────────────────────────────────────────────

export const routeExecutions = pgTable(
  'route_executions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    routeId: uuid('route_id')
      .notNull()
      .references(() => maintenanceRoutes.id),
    executedBy: uuid('executed_by').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    status: routeExecutionStatusEnum('status').notNull().default('IN_PROGRESS'),
    notes: text('notes'),
  },
  (table) => [
    index('idx_route_exec_tenant_route').on(table.tenantId, table.routeId),
    index('idx_route_exec_status').on(table.tenantId, table.status),
    index('idx_route_exec_started').on(table.tenantId, table.startedAt),
    index('idx_route_exec_executed_by').on(table.tenantId, table.executedBy),
  ],
);

// ─── Route Stop Readings ──────────────────────────────────────────────────────

export const routeStopReadings = pgTable(
  'route_stop_readings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    executionId: uuid('execution_id')
      .notNull()
      .references(() => routeExecutions.id),
    stopId: uuid('stop_id')
      .notNull()
      .references(() => routeStops.id),
    reading: jsonb('reading'),
    status: routeStopReadingStatusEnum('status').notNull().default('PENDING'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    notes: text('notes'),
  },
  (table) => [
    index('idx_stop_readings_execution').on(table.executionId),
    index('idx_stop_readings_stop').on(table.stopId),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const routeExecutionsRelations = relations(routeExecutions, ({ one, many }) => ({
  route: one(maintenanceRoutes, {
    fields: [routeExecutions.routeId],
    references: [maintenanceRoutes.id],
  }),
  stopReadings: many(routeStopReadings),
}));

export const routeStopReadingsRelations = relations(routeStopReadings, ({ one }) => ({
  execution: one(routeExecutions, {
    fields: [routeStopReadings.executionId],
    references: [routeExecutions.id],
  }),
  stop: one(routeStops, {
    fields: [routeStopReadings.stopId],
    references: [routeStops.id],
  }),
}));
