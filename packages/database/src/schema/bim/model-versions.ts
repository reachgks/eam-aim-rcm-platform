import { pgTable, uuid, varchar, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { ifcModels } from './ifc-models';
import { users } from '../core/users';

export const modelVersions = pgTable('model_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  modelId: uuid('model_id').notNull().references(() => ifcModels.id),
  versionNumber: integer('version_number').notNull(),
  changeDescription: text('change_description'),
  filePath: text('file_path'),
  fileSize: integer('file_size'),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow(),
  diffSummary: jsonb('diff_summary'),
});

export type ModelVersion = typeof modelVersions.$inferSelect;
