import { pgTable, uuid, varchar, integer, decimal, date, timestamp, uniqueIndex, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from '../asset-register/assets';

export const periodTypeEnum = pgEnum('period_type', ['MONTH', 'QUARTER', 'YEAR', 'CUSTOM']);

export const assetCostRollup = pgTable('asset_cost_rollup', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  periodType: periodTypeEnum('period_type').notNull(),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),

  // Cost breakdown by category
  laborCost: decimal('labor_cost', { precision: 15, scale: 2 }).default('0'),
  materialCost: decimal('material_cost', { precision: 15, scale: 2 }).default('0'),
  serviceCost: decimal('service_cost', { precision: 15, scale: 2 }).default('0'),
  overheadCost: decimal('overhead_cost', { precision: 15, scale: 2 }).default('0'),
  depreciationCost: decimal('depreciation_cost', { precision: 15, scale: 2 }).default('0'),

  // Cost breakdown by maintenance type
  preventiveCost: decimal('preventive_cost', { precision: 15, scale: 2 }).default('0'),
  correctiveCost: decimal('corrective_cost', { precision: 15, scale: 2 }).default('0'),
  predictiveCost: decimal('predictive_cost', { precision: 15, scale: 2 }).default('0'),
  emergencyCost: decimal('emergency_cost', { precision: 15, scale: 2 }).default('0'),
  projectCost: decimal('project_cost', { precision: 15, scale: 2 }).default('0'),

  // Operational metrics
  workOrderCount: integer('work_order_count').default(0),
  failureCount: integer('failure_count').default(0),
  downtimeHours: decimal('downtime_hours', { precision: 10, scale: 2 }).default('0'),
  laborHours: decimal('labor_hours', { precision: 10, scale: 2 }).default('0'),

  // Budget comparison
  budgetedAmount: decimal('budgeted_amount', { precision: 15, scale: 2 }),

  calculatedAt: timestamp('calculated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueAssetPeriod: uniqueIndex('cost_rollup_asset_period_idx').on(table.assetId, table.periodType, table.periodStart),
  tenantPeriodIdx: index('cost_rollup_tenant_period_idx').on(table.tenantId, table.periodType, table.periodStart),
  assetPeriodIdx: index('cost_rollup_asset_type_idx').on(table.assetId, table.periodType, table.periodStart),
}));

export type AssetCostRollup = typeof assetCostRollup.$inferSelect;
export type NewAssetCostRollup = typeof assetCostRollup.$inferInsert;
