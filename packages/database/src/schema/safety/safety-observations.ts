import { pgTable, uuid, varchar, text, integer, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const observationTypeEnum = pgEnum('safety_observation_type', [
  'NEAR_MISS',
  'UNSAFE_ACT',
  'UNSAFE_CONDITION',
  'POSITIVE',
]);

export const observationStatusEnum = pgEnum('safety_observation_status', [
  'OPEN',
  'INVESTIGATING',
  'RESOLVED',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const safetyObservations = pgTable(
  'safety_observations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    observationType: observationTypeEnum('observation_type').notNull(),
    locationId: uuid('location_id'),
    description: text('description').notNull(),
    reportedBy: uuid('reported_by').notNull(),
    reportedAt: timestamp('reported_at', { withTimezone: true }).defaultNow().notNull(),
    severity: integer('severity'),
    correctiveAction: text('corrective_action'),
    status: observationStatusEnum('status').default('OPEN').notNull(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  },
  (table) => [
    index('safety_observations_tenant_id_idx').on(table.tenantId),
    index('safety_observations_type_idx').on(table.tenantId, table.observationType),
    index('safety_observations_status_idx').on(table.tenantId, table.status),
    index('safety_observations_location_id_idx').on(table.tenantId, table.locationId),
    index('safety_observations_reported_by_idx').on(table.tenantId, table.reportedBy),
    index('safety_observations_reported_at_idx').on(table.tenantId, table.reportedAt),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type SafetyObservation = typeof safetyObservations.$inferSelect;
export type NewSafetyObservation = typeof safetyObservations.$inferInsert;
