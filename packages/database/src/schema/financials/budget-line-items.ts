import { pgTable, uuid, varchar, decimal } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { budgets } from './budgets';

export const budgetLineItems = pgTable('budget_line_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  budgetId: uuid('budget_id').notNull().references(() => budgets.id),
  category: varchar('category', { length: 50 }).notNull(),
  description: varchar('description', { length: 500 }),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  spentAmount: decimal('spent_amount', { precision: 15, scale: 2 }).default('0'),
});

export type BudgetLineItem = typeof budgetLineItems.$inferSelect;
export type NewBudgetLineItem = typeof budgetLineItems.$inferInsert;
