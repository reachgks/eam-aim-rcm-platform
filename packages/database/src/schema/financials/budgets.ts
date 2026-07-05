import { pgTable, uuid, integer, decimal, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { costCenters } from './cost-centers';

export const budgetTypeEnum = pgEnum('budget_type', ['OPEX', 'CAPEX']);
export const budgetStatusEnum = pgEnum('budget_status', ['DRAFT', 'APPROVED', 'FROZEN']);

export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  costCenterId: uuid('cost_center_id').notNull().references(() => costCenters.id),
  fiscalYear: integer('fiscal_year').notNull(),
  budgetType: budgetTypeEnum('budget_type').notNull(),
  totalAmount: decimal('total_amount', { precision: 15, scale: 2 }).notNull(),
  spentAmount: decimal('spent_amount', { precision: 15, scale: 2 }).default('0'),
  committedAmount: decimal('committed_amount', { precision: 15, scale: 2 }).default('0'),
  status: budgetStatusEnum('status').default('DRAFT'),
}, (table) => ({
  uniqueBudget: uniqueIndex('budgets_cc_year_type_idx').on(table.costCenterId, table.fiscalYear, table.budgetType),
}));

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
