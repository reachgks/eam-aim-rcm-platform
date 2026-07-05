import { pgTable, uuid, varchar, text, decimal, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from '../asset-register/assets';
import { users } from '../core/users';

export const analysisStatusEnum = pgEnum('replacement_analysis_status', ['DRAFT', 'REVIEWED', 'APPROVED']);
export const recommendationEnum = pgEnum('replacement_recommendation', ['MAINTAIN', 'REPLACE', 'REFURBISH', 'MONITOR']);
export const costTrendEnum = pgEnum('cost_trend', ['INCREASING', 'STABLE', 'DECREASING']);

export const replacementAnalyses = pgTable('replacement_analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  analysisDate: date('analysis_date').notNull(),
  performedBy: uuid('performed_by').notNull().references(() => users.id),
  status: analysisStatusEnum('status').default('DRAFT'),

  // Current asset economics
  currentBookValue: decimal('current_book_value', { precision: 15, scale: 2 }).notNull(),
  currentMarketValue: decimal('current_market_value', { precision: 15, scale: 2 }),
  ageYears: decimal('age_years', { precision: 5, scale: 1 }).notNull(),
  remainingUsefulLifeYears: decimal('remaining_useful_life_years', { precision: 5, scale: 1 }),
  annualMaintenanceCostAvg: decimal('annual_maintenance_cost_avg', { precision: 15, scale: 2 }).notNull(),
  annualMaintenanceCostTrend: costTrendEnum('annual_maintenance_cost_trend'),
  annualDowntimeHours: decimal('annual_downtime_hours', { precision: 10, scale: 2 }),
  mtbfCurrent: decimal('mtbf_current', { precision: 10, scale: 2 }),

  // Replacement option
  replacementCost: decimal('replacement_cost', { precision: 15, scale: 2 }).notNull(),
  replacementUsefulLife: decimal('replacement_useful_life', { precision: 5, scale: 1 }).notNull(),
  estimatedNewAnnualMaint: decimal('estimated_new_annual_maint', { precision: 15, scale: 2 }),
  installationCost: decimal('installation_cost', { precision: 15, scale: 2 }).default('0'),
  removalDisposalCost: decimal('removal_disposal_cost', { precision: 15, scale: 2 }).default('0'),

  // Analysis results
  cumulativeMaintCost: decimal('cumulative_maint_cost', { precision: 15, scale: 2 }),
  projected5yrMaintCost: decimal('projected_5yr_maint_cost', { precision: 15, scale: 2 }),
  projected5yrReplaceCost: decimal('projected_5yr_replace_cost', { precision: 15, scale: 2 }),
  breakEvenYear: decimal('break_even_year', { precision: 5, scale: 1 }),
  recommendation: recommendationEnum('recommendation'),
  justification: text('justification'),
  approvedBy: uuid('approved_by').references(() => users.id),
  documentId: uuid('document_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type ReplacementAnalysis = typeof replacementAnalyses.$inferSelect;
export type NewReplacementAnalysis = typeof replacementAnalyses.$inferInsert;
