import { pgTable, uuid, varchar, text, decimal, timestamp, date, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from '../asset-register/assets';
import { users } from '../core/users';

export const riskLevelEnum = pgEnum('risk_level', ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);

export const riskAssessments = pgTable('risk_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  riskScore: decimal('risk_score', { precision: 6, scale: 2 }),
  riskLevel: riskLevelEnum('risk_level'),
  criticalityComponent: decimal('criticality_component', { precision: 6, scale: 2 }),
  failureComponent: decimal('failure_component', { precision: 6, scale: 2 }),
  fmeaComponent: decimal('fmea_component', { precision: 6, scale: 2 }),
  maintenanceComponent: decimal('maintenance_component', { precision: 6, scale: 2 }),
  sensorComponent: decimal('sensor_component', { precision: 6, scale: 2 }),
  assessedAt: timestamp('assessed_at', { withTimezone: true }).defaultNow(),
  assessedBy: uuid('assessed_by').references(() => users.id),
  nextReviewDate: date('next_review_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_risk_assessments_tenant').on(table.tenantId),
  index('idx_risk_assessments_asset').on(table.tenantId, table.assetId),
  index('idx_risk_assessments_level').on(table.tenantId, table.riskLevel),
  index('idx_risk_assessments_date').on(table.tenantId, table.assessedAt),
]);

export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type NewRiskAssessment = typeof riskAssessments.$inferInsert;
