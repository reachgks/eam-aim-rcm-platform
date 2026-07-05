import { pgTable, uuid, varchar, text, timestamp, decimal, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from '../core/tenants';
import { failureModes } from './failure-modes';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const discoveryMethodEnum = pgEnum('discovery_method', [
  'OPERATOR',
  'ALARM',
  'INSPECTION',
  'PREDICTIVE',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const failureEvents = pgTable(
  'failure_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull(),
    failureModeId: uuid('failure_mode_id').references(() => failureModes.id),
    workOrderId: uuid('work_order_id'),
    eventDate: timestamp('event_date', { withTimezone: true }).notNull(),
    discoveryMethod: discoveryMethodEnum('discovery_method'),
    description: text('description').notNull(),
    impactDescription: text('impact_description'),
    downtimeHours: decimal('downtime_hours', { precision: 10, scale: 2 }),
    productionLoss: decimal('production_loss', { precision: 14, scale: 2 }),
    rootCauseId: uuid('root_cause_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_failure_events_tenant').on(table.tenantId),
    index('idx_failure_events_asset').on(table.tenantId, table.assetId),
    index('idx_failure_events_mode').on(table.tenantId, table.failureModeId),
    index('idx_failure_events_date').on(table.tenantId, table.eventDate),
    index('idx_failure_events_work_order').on(table.workOrderId),
  ],
);

// ── Relations ──────────────────────────────────────────────────────────────────
export const failureEventsRelations = relations(failureEvents, ({ one }) => ({
  failureMode: one(failureModes, {
    fields: [failureEvents.failureModeId],
    references: [failureModes.id],
  }),
}));

// ── Types ──────────────────────────────────────────────────────────────────────
export type FailureEvent = typeof failureEvents.$inferSelect;
export type NewFailureEvent = typeof failureEvents.$inferInsert;
