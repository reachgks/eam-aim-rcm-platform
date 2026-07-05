import { pgTable, uuid, varchar, text, boolean, timestamp, decimal, integer, date, jsonb, uniqueIndex, index, pgEnum } from 'drizzle-orm/pg-core';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const maintenancePlanTypeEnum = pgEnum('maintenance_plan_type', [
  'TIME_BASED',
  'METER_BASED',
  'CONDITION_BASED',
  'EVENT_BASED',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const maintenancePlans = pgTable(
  'maintenance_plans',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    planCode: varchar('plan_code', { length: 50 }).notNull(),
    name: varchar('name', { length: 200 }).notNull(),
    description: text('description'),
    assetId: uuid('asset_id'),
    assetTypeId: uuid('asset_type_id'),
    planType: maintenancePlanTypeEnum('plan_type').notNull(),
    frequencyDays: integer('frequency_days'),
    frequencyMeterId: uuid('frequency_meter_id'),
    triggerValue: decimal('trigger_value', { precision: 14, scale: 4 }),
    triggerOperator: varchar('trigger_operator', { length: 10 }),
    isActive: boolean('is_active').notNull().default(true),
    lastGeneratedDate: date('last_generated_date'),
    nextDueDate: date('next_due_date'),
    leadTimeDays: integer('lead_time_days'),
    estimatedDuration: decimal('estimated_duration', { precision: 8, scale: 2 }),
    estimatedCost: decimal('estimated_cost', { precision: 14, scale: 2 }),
    woTemplate: jsonb('wo_template'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_maint_plans_tenant_code').on(table.tenantId, table.planCode),
    index('idx_maint_plans_tenant_active').on(table.tenantId, table.isActive),
    index('idx_maint_plans_tenant_asset').on(table.tenantId, table.assetId),
    index('idx_maint_plans_next_due').on(table.tenantId, table.nextDueDate),
    index('idx_maint_plans_plan_type').on(table.tenantId, table.planType),
  ],
);
