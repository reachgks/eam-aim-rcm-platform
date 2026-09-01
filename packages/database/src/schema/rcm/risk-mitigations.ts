import { pgTable, uuid, varchar, text, integer, date, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from '../asset-register/assets';
import { users } from '../core/users';
import { riskAssessments } from './risk-assessments';

export const mitigationTypeEnum = pgEnum('mitigation_type', ['PREVENTIVE', 'DETECTIVE', 'CORRECTIVE', 'REDESIGN']);
export const mitigationStatusEnum = pgEnum('mitigation_status', ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);

export const riskMitigations = pgTable('risk_mitigations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  riskAssessmentId: uuid('risk_assessment_id').references(() => riskAssessments.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  mitigationType: mitigationTypeEnum('mitigation_type').notNull(),
  description: text('description').notNull(),
  status: mitigationStatusEnum('mitigation_status').notNull().default('PLANNED'),
  assignedTo: uuid('assigned_to').references(() => users.id),
  dueDate: date('due_date'),
  completedDate: date('completed_date'),
  effectivenessRating: integer('effectiveness_rating'),
  linkedWorkOrderId: uuid('linked_work_order_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_risk_mitigations_tenant').on(table.tenantId),
  index('idx_risk_mitigations_asset').on(table.tenantId, table.assetId),
  index('idx_risk_mitigations_assessment').on(table.riskAssessmentId),
  index('idx_risk_mitigations_status').on(table.tenantId, table.status),
]);

export type RiskMitigation = typeof riskMitigations.$inferSelect;
export type NewRiskMitigation = typeof riskMitigations.$inferInsert;
