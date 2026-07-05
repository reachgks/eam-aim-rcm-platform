import { pgTable, uuid, varchar, text, boolean, integer, jsonb, timestamp, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const workPermitTypeEnum = pgEnum('work_permit_type', [
  'HOT_WORK',
  'CONFINED_SPACE',
  'ELECTRICAL',
  'EXCAVATION',
  'WORKING_AT_HEIGHT',
  'COLD_WORK',
  'GENERAL',
]);

export const workPermitStatusEnum = pgEnum('work_permit_status', [
  'REQUESTED',
  'ISSUED',
  'ACTIVE',
  'SUSPENDED',
  'CLOSED',
  'CANCELLED',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const workPermits = pgTable(
  'work_permits',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    permitNumber: varchar('permit_number', { length: 50 }).notNull(),
    type: workPermitTypeEnum('type').notNull(),
    workOrderId: uuid('work_order_id'),
    assetId: uuid('asset_id'),
    locationId: uuid('location_id'),
    status: workPermitStatusEnum('status').default('REQUESTED').notNull(),
    requestedBy: uuid('requested_by').notNull(),
    issuedBy: uuid('issued_by'),
    issuedAt: timestamp('issued_at', { withTimezone: true }),
    validFrom: timestamp('valid_from', { withTimezone: true }),
    validTo: timestamp('valid_to', { withTimezone: true }),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    hazards: jsonb('hazards'),
    precautions: jsonb('precautions'),
    ppeRequired: jsonb('ppe_required'),
    emergencyProcedure: text('emergency_procedure'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('work_permits_tenant_permit_number_idx').on(table.tenantId, table.permitNumber),
    index('work_permits_tenant_id_idx').on(table.tenantId),
    index('work_permits_status_idx').on(table.tenantId, table.status),
    index('work_permits_type_idx').on(table.tenantId, table.type),
    index('work_permits_work_order_id_idx').on(table.tenantId, table.workOrderId),
    index('work_permits_asset_id_idx').on(table.tenantId, table.assetId),
    index('work_permits_location_id_idx').on(table.tenantId, table.locationId),
    index('work_permits_valid_to_idx').on(table.tenantId, table.validTo),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type WorkPermit = typeof workPermits.$inferSelect;
export type NewWorkPermit = typeof workPermits.$inferInsert;
