import { pgTable, uuid, varchar, text, boolean, integer, decimal, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const dqRuleTypeEnum = pgEnum('dq_rule_type', [
  'COMPLETENESS',
  'ACCURACY',
  'CONSISTENCY',
  'TIMELINESS',
  'UNIQUENESS',
  'FORMAT',
]);

export const dqSeverityEnum = pgEnum('dq_severity', [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);

export const dqIssueStatusEnum = pgEnum('dq_issue_status', [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'IGNORED',
]);

// ── Tables ─────────────────────────────────────────────────────────────────────

export const dataQualityRules = pgTable(
  'data_quality_rules',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    targetTable: varchar('target_table', { length: 255 }).notNull(),
    targetField: varchar('target_field', { length: 255 }),
    ruleType: dqRuleTypeEnum('rule_type').notNull(),
    ruleExpression: text('rule_expression').notNull(),
    severity: dqSeverityEnum('severity').default('MEDIUM').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('dq_rules_tenant_id_idx').on(table.tenantId),
    index('dq_rules_target_table_idx').on(table.tenantId, table.targetTable),
    index('dq_rules_rule_type_idx').on(table.tenantId, table.ruleType),
    index('dq_rules_is_active_idx').on(table.tenantId, table.isActive),
  ],
);

export const dataQualityScores = pgTable(
  'data_quality_scores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    scanDate: timestamp('scan_date', { withTimezone: true }).defaultNow().notNull(),
    targetTable: varchar('target_table', { length: 255 }).notNull(),
    totalRecords: integer('total_records').notNull(),
    recordsPassing: integer('records_passing').notNull(),
    recordsFailing: integer('records_failing').notNull(),
    completenessPercent: decimal('completeness_percent', { precision: 5, scale: 2 }),
    accuracyPercent: decimal('accuracy_percent', { precision: 5, scale: 2 }),
    overallScore: decimal('overall_score', { precision: 5, scale: 2 }),
  },
  (table) => [
    index('dq_scores_tenant_id_idx').on(table.tenantId),
    index('dq_scores_scan_date_idx').on(table.tenantId, table.scanDate),
    index('dq_scores_target_table_idx').on(table.tenantId, table.targetTable),
  ],
);

export const dataQualityIssues = pgTable(
  'data_quality_issues',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    ruleId: uuid('rule_id').notNull().references(() => dataQualityRules.id, { onDelete: 'cascade' }),
    recordTable: varchar('record_table', { length: 255 }).notNull(),
    recordId: uuid('record_id').notNull(),
    fieldName: varchar('field_name', { length: 255 }),
    currentValue: text('current_value'),
    expectedValue: text('expected_value'),
    status: dqIssueStatusEnum('status').default('OPEN').notNull(),
    assignedTo: uuid('assigned_to').references(() => users.id),
    detectedAt: timestamp('detected_at', { withTimezone: true }).defaultNow().notNull(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  },
  (table) => [
    index('dq_issues_tenant_id_idx').on(table.tenantId),
    index('dq_issues_rule_id_idx').on(table.ruleId),
    index('dq_issues_record_idx').on(table.recordTable, table.recordId),
    index('dq_issues_status_idx').on(table.tenantId, table.status),
    index('dq_issues_assigned_to_idx').on(table.assignedTo),
    index('dq_issues_detected_at_idx').on(table.tenantId, table.detectedAt),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type DataQualityRule = typeof dataQualityRules.$inferSelect;
export type NewDataQualityRule = typeof dataQualityRules.$inferInsert;

export type DataQualityScore = typeof dataQualityScores.$inferSelect;
export type NewDataQualityScore = typeof dataQualityScores.$inferInsert;

export type DataQualityIssue = typeof dataQualityIssues.$inferSelect;
export type NewDataQualityIssue = typeof dataQualityIssues.$inferInsert;
