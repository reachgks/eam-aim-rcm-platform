import { pgTable, uuid, varchar, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

export const ifcVersionEnum = pgEnum('ifc_version', ['IFC2X3', 'IFC4', 'IFC4X3']);
export const modelStatusEnum = pgEnum('model_status', ['UPLOADING', 'PROCESSING', 'READY', 'ERROR']);

export const ifcModels = pgTable('ifc_models', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  name: varchar('name', { length: 200 }).notNull(),
  version: varchar('version', { length: 30 }),
  ifcVersion: ifcVersionEnum('ifc_version').default('IFC4'),
  filePath: text('file_path'),
  fileSize: integer('file_size'),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow(),
  status: modelStatusEnum('model_status').default('UPLOADING'),
  containerId: uuid('container_id'),
  siteId: uuid('site_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type IfcModel = typeof ifcModels.$inferSelect;
