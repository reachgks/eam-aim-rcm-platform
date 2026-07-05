import { pgTable, uuid, varchar, decimal, integer, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { slaDefinitions } from './sla-definitions';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const slaMetricNameEnum = pgEnum('sla_metric_name', [
  'RESPONSE_TIME',
  'RESOLUTION_TIME',
  'UPTIME',
  'FIRST_FIX_RATE',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const slaTargets = pgTable(
  'sla_targets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    slaId: uuid('sla_id').notNull().references(() => slaDefinitions.id),
    metricName: slaMetricNameEnum('metric_name').notNull(),
    targetValue: decimal('target_value', { precision: 12, scale: 4 }).notNull(),
    unitOfMeasure: varchar('unit_of_measure', { length: 50 }).notNull(),
    priority: integer('priority'),
    warningThreshold: decimal('warning_threshold', { precision: 12, scale: 4 }),
    criticalThreshold: decimal('critical_threshold', { precision: 12, scale: 4 }),
  },
  (table) => [
    index('sla_targets_tenant_id_idx').on(table.tenantId),
    index('sla_targets_sla_id_idx').on(table.tenantId, table.slaId),
    index('sla_targets_metric_name_idx').on(table.tenantId, table.metricName),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type SlaTarget = typeof slaTargets.$inferSelect;
export type NewSlaTarget = typeof slaTargets.$inferInsert;
