import { pgTable, uuid, varchar, text, boolean, timestamp, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const oirPriorityEnum = pgEnum('oir_priority', [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);

export const lifecycleStageEnum = pgEnum('lifecycle_stage', [
  'BRIEF',
  'DESIGN',
  'BUILD',
  'COMMISSION',
  'HANDOVER',
  'OPERATE',
  'MAINTAIN',
  'DECOMMISSION',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const organizationalInfoRequirements = pgTable(
  'organizational_info_requirements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    code: varchar('code', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }),
    priority: oirPriorityEnum('priority').default('MEDIUM').notNull(),
    lifecycleStage: lifecycleStageEnum('lifecycle_stage'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('oir_tenant_code_idx').on(table.tenantId, table.code),
    index('oir_tenant_id_idx').on(table.tenantId),
    index('oir_category_idx').on(table.tenantId, table.category),
    index('oir_priority_idx').on(table.tenantId, table.priority),
    index('oir_lifecycle_stage_idx').on(table.tenantId, table.lifecycleStage),
    index('oir_is_active_idx').on(table.tenantId, table.isActive),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type OrganizationalInfoRequirement = typeof organizationalInfoRequirements.$inferSelect;
export type NewOrganizationalInfoRequirement = typeof organizationalInfoRequirements.$inferInsert;
