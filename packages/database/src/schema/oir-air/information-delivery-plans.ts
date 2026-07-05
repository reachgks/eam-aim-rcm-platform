import { pgTable, uuid, varchar, date, timestamp, jsonb, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';
import { informationContainers } from '../cde/information-containers';
import { exchangeInfoRequirements } from './exchange-info-requirements';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const idpTypeEnum = pgEnum('idp_type', [
  'MIDP',
  'TIDP',
]);

export const idpStatusEnum = pgEnum('idp_status', [
  'DRAFT',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
]);

export const idpDeliverableStatusEnum = pgEnum('idp_deliverable_status', [
  'PENDING',
  'IN_PROGRESS',
  'DELIVERED',
  'ACCEPTED',
  'REJECTED',
  'OVERDUE',
]);

// ── Tables ─────────────────────────────────────────────────────────────────────

export const informationDeliveryPlans = pgTable(
  'information_delivery_plans',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    projectId: uuid('project_id'),
    type: idpTypeEnum('type').notNull(),
    status: idpStatusEnum('status').default('DRAFT').notNull(),
    milestones: jsonb('milestones'),
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idp_tenant_id_idx').on(table.tenantId),
    index('idp_project_id_idx').on(table.projectId),
    index('idp_type_idx').on(table.tenantId, table.type),
    index('idp_status_idx').on(table.tenantId, table.status),
    index('idp_created_by_idx').on(table.createdBy),
  ],
);

export const idpDeliverables = pgTable(
  'idp_deliverables',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    planId: uuid('plan_id').notNull().references(() => informationDeliveryPlans.id, { onDelete: 'cascade' }),
    eirId: uuid('eir_id').notNull().references(() => exchangeInfoRequirements.id),
    containerId: uuid('container_id').references(() => informationContainers.id),
    status: idpDeliverableStatusEnum('status').default('PENDING').notNull(),
    dueDate: date('due_date'),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  },
  (table) => [
    index('idp_deliv_plan_id_idx').on(table.planId),
    index('idp_deliv_eir_id_idx').on(table.eirId),
    index('idp_deliv_container_id_idx').on(table.containerId),
    index('idp_deliv_status_idx').on(table.planId, table.status),
    index('idp_deliv_due_date_idx').on(table.dueDate),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type InformationDeliveryPlan = typeof informationDeliveryPlans.$inferSelect;
export type NewInformationDeliveryPlan = typeof informationDeliveryPlans.$inferInsert;

export type IdpDeliverable = typeof idpDeliverables.$inferSelect;
export type NewIdpDeliverable = typeof idpDeliverables.$inferInsert;
