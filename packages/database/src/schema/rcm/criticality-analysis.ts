import { pgTable, uuid, varchar, text, integer, decimal, timestamp, date, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const criticalityMethodologyEnum = pgEnum('criticality_methodology', [
  'QUALITATIVE',
  'SEMI_QUANTITATIVE',
  'QUANTITATIVE',
  'RISK_MATRIX',
]);

export const overallCriticalityEnum = pgEnum('overall_criticality', [
  'A',
  'B',
  'C',
  'D',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const criticalityAnalyses = pgTable(
  'criticality_analyses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull(),
    methodology: criticalityMethodologyEnum('methodology').notNull(),
    safetyImpact: integer('safety_impact'),
    environmentalImpact: integer('environmental_impact'),
    productionImpact: integer('production_impact'),
    qualityImpact: integer('quality_impact'),
    maintenanceCostImpact: integer('maintenance_cost_impact'),
    overallCriticality: overallCriticalityEnum('overall_criticality'),
    score: decimal('score', { precision: 8, scale: 2 }),
    assessedBy: uuid('assessed_by'),
    assessedAt: timestamp('assessed_at', { withTimezone: true }),
    nextReviewDate: date('next_review_date'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_criticality_tenant').on(table.tenantId),
    index('idx_criticality_asset').on(table.tenantId, table.assetId),
    index('idx_criticality_overall').on(table.tenantId, table.overallCriticality),
    index('idx_criticality_methodology').on(table.tenantId, table.methodology),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type CriticalityAnalysis = typeof criticalityAnalyses.$inferSelect;
export type NewCriticalityAnalysis = typeof criticalityAnalyses.$inferInsert;
