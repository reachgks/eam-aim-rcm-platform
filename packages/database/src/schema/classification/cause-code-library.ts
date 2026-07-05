import { pgTable, uuid, varchar, text, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

export const causeCategoryEnum = pgEnum('cause_category', [
  'DESIGN', 'FABRICATION', 'INSTALLATION', 'OPERATION', 'MAINTENANCE', 'MANAGEMENT', 'MISCELLANEOUS'
]);

export const causeCodes = pgTable('cause_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  code: varchar('code', { length: 30 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  category: causeCategoryEnum('category'),
  parentId: uuid('parent_id'),
  isActive: boolean('is_active').default(true),
});

export type CauseCode = typeof causeCodes.$inferSelect;
