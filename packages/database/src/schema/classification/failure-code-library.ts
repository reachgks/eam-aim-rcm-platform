import { pgTable, uuid, varchar, text, boolean } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

export const failureCodes = pgTable('failure_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  code: varchar('code', { length: 30 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  parentId: uuid('parent_id'),
  iso14224Ref: varchar('iso14224_ref', { length: 50 }),
  isActive: boolean('is_active').default(true),
});

export type FailureCode = typeof failureCodes.$inferSelect;
