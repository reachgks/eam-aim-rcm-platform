import { pgTable, uuid, varchar, text, integer, decimal, date, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from '../asset-register/assets';
import { users } from '../core/users';

export const conditionAssessments = pgTable('condition_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  assessmentDate: date('assessment_date').notNull(),
  assessorId: uuid('assessor_id').notNull().references(() => users.id),
  methodology: varchar('methodology', { length: 100 }),
  overallScore: integer('overall_score').notNull(),
  structuralScore: integer('structural_score'),
  operationalScore: integer('operational_score'),
  aestheticScore: integer('aesthetic_score'),
  safetyScore: integer('safety_score'),
  findings: text('findings'),
  recommendations: text('recommendations'),
  nextAssessmentDate: date('next_assessment_date'),
  documentId: uuid('document_id'),
  photos: jsonb('photos'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type ConditionAssessment = typeof conditionAssessments.$inferSelect;
