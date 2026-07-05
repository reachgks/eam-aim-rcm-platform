import { pgTable, uuid, varchar, decimal, date, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { costCenters } from './cost-centers';
import { budgets } from './budgets';
import { assets } from '../asset-register/assets';

export const costSourceTypeEnum = pgEnum('cost_source_type', [
  'WORK_ORDER', 'PURCHASE_ORDER', 'LABOR', 'CONTRACT', 'DEPRECIATION'
]);
export const costCategoryEnum = pgEnum('cost_category', [
  'LABOR', 'MATERIAL', 'SERVICE', 'OVERHEAD', 'DEPRECIATION'
]);

export const costTransactions = pgTable('cost_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  costCenterId: uuid('cost_center_id').notNull().references(() => costCenters.id),
  budgetId: uuid('budget_id').references(() => budgets.id),
  sourceType: costSourceTypeEnum('source_type').notNull(),
  sourceId: uuid('source_id').notNull(),
  assetId: uuid('asset_id').references(() => assets.id),
  transactionDate: date('transaction_date').notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  costCategory: costCategoryEnum('cost_category').notNull(),
  description: varchar('description', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  assetIdx: index('cost_tx_asset_idx').on(table.assetId, table.transactionDate),
  tenantDateIdx: index('cost_tx_tenant_date_idx').on(table.tenantId, table.transactionDate),
}));

export type CostTransaction = typeof costTransactions.$inferSelect;
export type NewCostTransaction = typeof costTransactions.$inferInsert;
