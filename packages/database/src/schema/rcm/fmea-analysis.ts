import { pgTable, uuid, varchar, text, integer, timestamp, date, decimal, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { tenants } from '../core/tenants';
import { failureModes } from './failure-modes';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const fmeaStatusEnum = pgEnum('fmea_status', [
  'DRAFT',
  'IN_PROGRESS',
  'REVIEW',
  'APPROVED',
]);

export const fmeaWorksheetStatusEnum = pgEnum('fmea_worksheet_status', [
  'OPEN',
  'IN_PROGRESS',
  'COMPLETED',
  'DEFERRED',
]);

// ── FMEA Analyses Table ────────────────────────────────────────────────────────
export const fmeaAnalyses = pgTable(
  'fmea_analyses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    assetId: uuid('asset_id').notNull(),
    status: fmeaStatusEnum('status').notNull().default('DRAFT'),
    facilitator: varchar('facilitator', { length: 255 }),
    analysisDate: date('analysis_date'),
    revision: integer('revision').default(1).notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_fmea_analyses_tenant').on(table.tenantId),
    index('idx_fmea_analyses_asset').on(table.tenantId, table.assetId),
    index('idx_fmea_analyses_status').on(table.tenantId, table.status),
  ],
);

// ── FMEA Worksheets Table ──────────────────────────────────────────────────────
export const fmeaWorksheets = pgTable(
  'fmea_worksheets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    analysisId: uuid('analysis_id').notNull().references(() => fmeaAnalyses.id, { onDelete: 'cascade' }),
    failureModeId: uuid('failure_mode_id').notNull().references(() => failureModes.id),
    localEffect: text('local_effect'),
    systemEffect: text('system_effect'),
    endEffect: text('end_effect'),
    severity: integer('severity').notNull(),
    occurrence: integer('occurrence').notNull(),
    detection: integer('detection').notNull(),
    rpn: integer('rpn').generatedAlwaysAs(sql`severity * occurrence * detection`),
    currentControls: text('current_controls'),
    recommendedAction: text('recommended_action'),
    actionPriority: varchar('action_priority', { length: 20 }),
    assignedTo: uuid('assigned_to'),
    dueDate: date('due_date'),
    status: fmeaWorksheetStatusEnum('status').default('OPEN').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_fmea_worksheets_analysis').on(table.analysisId),
    index('idx_fmea_worksheets_failure_mode').on(table.failureModeId),
    index('idx_fmea_worksheets_rpn').on(table.rpn),
    index('idx_fmea_worksheets_assigned').on(table.assignedTo),
    index('idx_fmea_worksheets_status').on(table.status),
  ],
);

// ── Relations ──────────────────────────────────────────────────────────────────
export const fmeaAnalysesRelations = relations(fmeaAnalyses, ({ many }) => ({
  worksheets: many(fmeaWorksheets),
}));

export const fmeaWorksheetsRelations = relations(fmeaWorksheets, ({ one }) => ({
  analysis: one(fmeaAnalyses, {
    fields: [fmeaWorksheets.analysisId],
    references: [fmeaAnalyses.id],
  }),
  failureMode: one(failureModes, {
    fields: [fmeaWorksheets.failureModeId],
    references: [failureModes.id],
  }),
}));

// ── Types ──────────────────────────────────────────────────────────────────────
export type FmeaAnalysis = typeof fmeaAnalyses.$inferSelect;
export type NewFmeaAnalysis = typeof fmeaAnalyses.$inferInsert;
export type FmeaWorksheet = typeof fmeaWorksheets.$inferSelect;
export type NewFmeaWorksheet = typeof fmeaWorksheets.$inferInsert;
