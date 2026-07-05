import { pgTable, uuid, varchar, text, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

export const iso14224LevelEnum = pgEnum('iso14224_level', [
  'INDUSTRY', 'BUSINESS_CATEGORY', 'INSTALLATION', 'PLANT_SECTION', 'EQUIPMENT_CLASS', 'EQUIPMENT_TYPE'
]);

export const iso14224Taxonomy = pgTable('iso14224_taxonomy', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  level: iso14224LevelEnum('level').notNull(),
  code: varchar('code', { length: 30 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  parentId: uuid('parent_id'),
  isActive: boolean('is_active').default(true),
});

export type Iso14224TaxonomyEntry = typeof iso14224Taxonomy.$inferSelect;
