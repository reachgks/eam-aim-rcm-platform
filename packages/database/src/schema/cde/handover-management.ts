import { pgTable, uuid, varchar, text, decimal, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';
import { informationContainers } from './information-containers';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const handoverTypeEnum = pgEnum('handover_type', [
  'PIM_TO_AIM',
  'PARTIAL',
  'STAGED',
]);

export const handoverStatusEnum = pgEnum('handover_status', [
  'PREPARING',
  'SUBMITTED',
  'UNDER_REVIEW',
  'ACCEPTED',
  'REJECTED',
]);

export const handoverItemStatusEnum = pgEnum('handover_item_status', [
  'PENDING',
  'VALIDATED',
  'FAILED',
  'SKIPPED',
]);

// ── Tables ─────────────────────────────────────────────────────────────────────

export const handoverPackages = pgTable(
  'handover_packages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    projectId: uuid('project_id'),
    type: handoverTypeEnum('type').notNull(),
    status: handoverStatusEnum('status').default('PREPARING').notNull(),
    submittedBy: uuid('submitted_by').references(() => users.id),
    submittedAt: timestamp('submitted_at', { withTimezone: true }),
    reviewedBy: uuid('reviewed_by').references(() => users.id),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    acceptanceCriteria: text('acceptance_criteria'),
    rejectionReason: text('rejection_reason'),
    completenessScore: decimal('completeness_score', { precision: 5, scale: 2 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('handover_pkg_tenant_id_idx').on(table.tenantId),
    index('handover_pkg_project_id_idx').on(table.projectId),
    index('handover_pkg_status_idx').on(table.tenantId, table.status),
    index('handover_pkg_type_idx').on(table.tenantId, table.type),
    index('handover_pkg_submitted_by_idx').on(table.submittedBy),
  ],
);

export const handoverItems = pgTable(
  'handover_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    packageId: uuid('package_id').notNull().references(() => handoverPackages.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id'),
    infoContainerId: uuid('info_container_id').references(() => informationContainers.id),
    airRequirementId: uuid('air_requirement_id'),
    itemType: varchar('item_type', { length: 100 }),
    status: handoverItemStatusEnum('status').default('PENDING').notNull(),
    validationNotes: text('validation_notes'),
    validatedBy: uuid('validated_by').references(() => users.id),
    validatedAt: timestamp('validated_at', { withTimezone: true }),
  },
  (table) => [
    index('handover_items_package_id_idx').on(table.packageId),
    index('handover_items_asset_id_idx').on(table.assetId),
    index('handover_items_container_id_idx').on(table.infoContainerId),
    index('handover_items_air_req_id_idx').on(table.airRequirementId),
    index('handover_items_status_idx').on(table.packageId, table.status),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type HandoverPackage = typeof handoverPackages.$inferSelect;
export type NewHandoverPackage = typeof handoverPackages.$inferInsert;

export type HandoverItem = typeof handoverItems.$inferSelect;
export type NewHandoverItem = typeof handoverItems.$inferInsert;
