import { pgTable, uuid, integer, text, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { slaTracking } from './sla-tracking';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const slaBreachTypeEnum = pgEnum('sla_breach_type', [
  'RESPONSE',
  'RESOLUTION',
  'UPTIME',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const slaBreaches = pgTable(
  'sla_breaches',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    trackingId: uuid('tracking_id').notNull().references(() => slaTracking.id),
    breachType: slaBreachTypeEnum('breach_type').notNull(),
    breachedAt: timestamp('breached_at', { withTimezone: true }).notNull(),
    escalatedTo: uuid('escalated_to'),
    escalationLevel: integer('escalation_level').default(0),
    acknowledgedBy: uuid('acknowledged_by'),
    acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }),
    rootCause: text('root_cause'),
    preventiveAction: text('preventive_action'),
  },
  (table) => [
    index('sla_breaches_tenant_id_idx').on(table.tenantId),
    index('sla_breaches_tracking_id_idx').on(table.tenantId, table.trackingId),
    index('sla_breaches_breach_type_idx').on(table.tenantId, table.breachType),
    index('sla_breaches_breached_at_idx').on(table.tenantId, table.breachedAt),
    index('sla_breaches_escalated_to_idx').on(table.tenantId, table.escalatedTo),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type SlaBreach = typeof slaBreaches.$inferSelect;
export type NewSlaBreach = typeof slaBreaches.$inferInsert;
