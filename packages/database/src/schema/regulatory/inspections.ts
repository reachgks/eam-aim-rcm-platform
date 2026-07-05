import { pgTable, uuid, varchar, text, decimal, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { complianceRequirements } from './compliance-requirements';
import { assets } from '../asset-register/assets';
import { users } from '../core/users';

export const inspectionResultEnum = pgEnum('inspection_result', ['PASS', 'FAIL', 'CONDITIONAL', 'NOT_APPLICABLE']);

export const inspections = pgTable('inspections', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  requirementId: uuid('requirement_id').notNull().references(() => complianceRequirements.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  inspectorId: uuid('inspector_id').notNull().references(() => users.id),
  inspectionDate: date('inspection_date').notNull(),
  nextDueDate: date('next_due_date'),
  result: inspectionResultEnum('result').notNull(),
  score: decimal('score', { precision: 5, scale: 2 }),
  findings: text('findings'),
  documentId: uuid('document_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type Inspection = typeof inspections.$inferSelect;
