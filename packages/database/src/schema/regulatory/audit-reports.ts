import { pgTable, uuid, varchar, text, integer, date, jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

export const auditTypeEnum = pgEnum('audit_type', ['INTERNAL', 'EXTERNAL', 'REGULATORY', 'CERTIFICATION']);
export const auditResultEnum = pgEnum('audit_result', ['PASS', 'CONDITIONAL', 'FAIL']);

export const auditReports = pgTable('audit_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  auditType: auditTypeEnum('audit_type').notNull(),
  auditDate: date('audit_date').notNull(),
  auditor: varchar('auditor', { length: 200 }),
  scope: text('scope'),
  findings: jsonb('findings'),
  nonConformances: integer('non_conformances').default(0),
  observations: integer('observations').default(0),
  recommendations: text('recommendations'),
  overallResult: auditResultEnum('overall_result'),
  nextAuditDate: date('next_audit_date'),
  documentId: uuid('document_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type AuditReport = typeof auditReports.$inferSelect;
