import { pgTable, uuid, varchar, text, jsonb } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { ifcModels } from './ifc-models';

export const ifcElements = pgTable('ifc_elements', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  modelId: uuid('model_id').notNull().references(() => ifcModels.id),
  ifcGlobalId: varchar('ifc_global_id', { length: 22 }),
  ifcClass: varchar('ifc_class', { length: 100 }).notNull(),
  name: varchar('name', { length: 200 }),
  description: text('description'),
  properties: jsonb('properties'),
  geometryBlobPath: text('geometry_blob_path'),
  parentElementId: uuid('parent_element_id'),
  storeyRef: varchar('storey_ref', { length: 100 }),
  spaceRef: varchar('space_ref', { length: 100 }),
});

export type IfcElement = typeof ifcElements.$inferSelect;
