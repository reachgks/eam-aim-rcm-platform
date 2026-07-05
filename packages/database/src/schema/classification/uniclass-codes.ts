import { pgTable, uuid, varchar, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

export const uniclassTableEnum = pgEnum('uniclass_table', [
  'ENTITIES', 'ACTIVITIES', 'SPACES', 'ELEMENTS', 'SYSTEMS', 'PRODUCTS', 'ROLES'
]);

export const uniclassCodes = pgTable('uniclass_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  table: uniclassTableEnum('table').notNull(),
  code: varchar('code', { length: 30 }).notNull(),
  title: varchar('title', { length: 300 }).notNull(),
  parentCode: varchar('parent_code', { length: 30 }),
  level: integer('level').notNull(),
  isActive: boolean('is_active').default(true),
});

export type UniclassCode = typeof uniclassCodes.$inferSelect;
