import { pgTable, uuid, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { slaTargets } from './sla-targets';

// ── Table ──────────────────────────────────────────────────────────────────────
export const slaTracking = pgTable(
  'sla_tracking',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    slaTargetId: uuid('sla_target_id').notNull().references(() => slaTargets.id),
    workOrderId: uuid('work_order_id'),
    assetId: uuid('asset_id'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    actualValue: decimal('actual_value', { precision: 12, scale: 4 }),
    targetValue: decimal('target_value', { precision: 12, scale: 4 }).notNull(),
    isPassing: boolean('is_passing'),
    breachAt: timestamp('breach_at', { withTimezone: true }),
  },
  (table) => [
    index('sla_tracking_tenant_id_idx').on(table.tenantId),
    index('sla_tracking_sla_target_id_idx').on(table.tenantId, table.slaTargetId),
    index('sla_tracking_work_order_id_idx').on(table.tenantId, table.workOrderId),
    index('sla_tracking_asset_id_idx').on(table.tenantId, table.assetId),
    index('sla_tracking_is_passing_idx').on(table.tenantId, table.isPassing),
    index('sla_tracking_breach_at_idx').on(table.tenantId, table.breachAt),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type SlaTracking = typeof slaTracking.$inferSelect;
export type NewSlaTracking = typeof slaTracking.$inferInsert;
