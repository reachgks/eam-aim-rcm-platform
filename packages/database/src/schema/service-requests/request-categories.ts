import { pgTable, uuid, varchar, text, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

export const requestCategories = pgTable('request_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  code: varchar('code', { length: 20 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  parentId: uuid('parent_id'),
  defaultPriority: varchar('default_priority', { length: 20 }),
  slaId: uuid('sla_id'),
  isActive: boolean('is_active').default(true),
});

export type RequestCategory = typeof requestCategories.$inferSelect;
