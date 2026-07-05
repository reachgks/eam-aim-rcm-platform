import { pgTable, uuid, varchar, integer, timestamp, jsonb, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const twinStatusEnum = pgEnum('twin_status', [
  'DISCONNECTED',
  'CONNECTED',
  'LIVE',
  'STALE',
]);

// ── Tables ─────────────────────────────────────────────────────────────────────

export const digitalTwinInstances = pgTable(
  'digital_twin_instances',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull(),
    ifcElementId: varchar('ifc_element_id', { length: 255 }),
    twinStatus: twinStatusEnum('twin_status').default('DISCONNECTED').notNull(),
    lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
    syncFrequencySec: integer('sync_frequency_sec'),
    liveState: jsonb('live_state'),
    spatialCoordinates: jsonb('spatial_coordinates'),
    metadataHash: varchar('metadata_hash', { length: 128 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('dt_instances_tenant_id_idx').on(table.tenantId),
    index('dt_instances_asset_id_idx').on(table.assetId),
    index('dt_instances_ifc_element_idx').on(table.ifcElementId),
    index('dt_instances_twin_status_idx').on(table.tenantId, table.twinStatus),
    index('dt_instances_last_sync_idx').on(table.lastSyncAt),
  ],
);

/**
 * twin_state_history — designed as a TimescaleDB hypertable (partitioned by `time`).
 * The hypertable conversion must be done in a migration:
 *   SELECT create_hypertable('twin_state_history', 'time');
 */
export const twinStateHistory = pgTable(
  'twin_state_history',
  {
    time: timestamp('time', { withTimezone: true }).notNull().defaultNow(),
    twinId: uuid('twin_id').notNull().references(() => digitalTwinInstances.id, { onDelete: 'cascade' }),
    stateSnapshot: jsonb('state_snapshot'),
    changeSource: varchar('change_source', { length: 100 }),
  },
  (table) => [
    index('twin_state_hist_twin_id_idx').on(table.twinId),
    index('twin_state_hist_time_idx').on(table.time),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type DigitalTwinInstance = typeof digitalTwinInstances.$inferSelect;
export type NewDigitalTwinInstance = typeof digitalTwinInstances.$inferInsert;

export type TwinStateHistory = typeof twinStateHistory.$inferSelect;
export type NewTwinStateHistory = typeof twinStateHistory.$inferInsert;
