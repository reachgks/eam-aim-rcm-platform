import { pgTable, uuid, varchar, boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

export const costCenters = pgTable('cost_centers', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  code: varchar('code', { length: 30 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  parentId: uuid('parent_id'),
  managerId: uuid('manager_id').references(() => users.id),
  isActive: boolean('is_active').default(true),
}, (table) => ({
  uniqueCode: uniqueIndex('cost_centers_tenant_code_idx').on(table.tenantId, table.code),
}));

export type CostCenter = typeof costCenters.$inferSelect;
export type NewCostCenter = typeof costCenters.$inferInsert;
