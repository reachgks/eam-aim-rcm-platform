import { pgTable, uuid, varchar, text, integer, decimal, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

export const failurePatternEnum = pgEnum('failure_pattern', ['INFANT_MORTALITY', 'RANDOM', 'WEAR_OUT']);

export const weibullAnalyses = pgTable('weibull_analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  assetTypeId: uuid('asset_type_id'),
  failureModeId: uuid('failure_mode_id'),
  analysisName: varchar('analysis_name', { length: 200 }).notNull(),
  dataPoints: integer('data_points').notNull(),
  beta: decimal('beta', { precision: 10, scale: 4 }).notNull(),
  eta: decimal('eta', { precision: 15, scale: 4 }).notNull(),
  gamma: decimal('gamma', { precision: 15, scale: 4 }).default('0'),
  rSquared: decimal('r_squared', { precision: 6, scale: 4 }),
  meanLife: decimal('mean_life', { precision: 15, scale: 4 }),
  b10Life: decimal('b10_life', { precision: 15, scale: 4 }),
  b50Life: decimal('b50_life', { precision: 15, scale: 4 }),
  failurePattern: failurePatternEnum('failure_pattern'),
  recommendedInterval: decimal('recommended_interval', { precision: 10, scale: 2 }),
  analysisDate: timestamp('analysis_date', { withTimezone: true }).defaultNow(),
  performedBy: uuid('performed_by').references(() => users.id),
  notes: text('notes'),
});

export type WeibullAnalysis = typeof weibullAnalyses.$inferSelect;
