import { pgTable, uuid, varchar, text, boolean, jsonb, timestamp, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const lotoApplicationStatusEnum = pgEnum('loto_application_status', [
  'APPLIED',
  'VERIFIED',
  'REMOVED',
]);

// ── LOTO Procedures ────────────────────────────────────────────────────────────
export const lotoProcedures = pgTable(
  'loto_procedures',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull(),
    procedureNumber: varchar('procedure_number', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    steps: jsonb('steps'),
    isolationPointIds: uuid('isolation_point_ids').array(),
    verifiedBy: uuid('verified_by'),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (table) => [
    uniqueIndex('loto_procedures_tenant_procedure_number_idx').on(table.tenantId, table.procedureNumber),
    index('loto_procedures_tenant_id_idx').on(table.tenantId),
    index('loto_procedures_asset_id_idx').on(table.tenantId, table.assetId),
    index('loto_procedures_is_active_idx').on(table.tenantId, table.isActive),
  ],
);

// ── LOTO Applications ──────────────────────────────────────────────────────────
export const lotoApplications = pgTable(
  'loto_applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    procedureId: uuid('procedure_id').notNull().references(() => lotoProcedures.id),
    workPermitId: uuid('work_permit_id'),
    appliedBy: uuid('applied_by').notNull(),
    appliedAt: timestamp('applied_at', { withTimezone: true }).notNull(),
    removedBy: uuid('removed_by'),
    removedAt: timestamp('removed_at', { withTimezone: true }),
    status: lotoApplicationStatusEnum('status').default('APPLIED').notNull(),
  },
  (table) => [
    index('loto_applications_tenant_id_idx').on(table.tenantId),
    index('loto_applications_procedure_id_idx').on(table.tenantId, table.procedureId),
    index('loto_applications_work_permit_id_idx').on(table.tenantId, table.workPermitId),
    index('loto_applications_status_idx').on(table.tenantId, table.status),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type LotoProcedure = typeof lotoProcedures.$inferSelect;
export type NewLotoProcedure = typeof lotoProcedures.$inferInsert;
export type LotoApplication = typeof lotoApplications.$inferSelect;
export type NewLotoApplication = typeof lotoApplications.$inferInsert;
