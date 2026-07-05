import { pgTable, uuid, varchar, text, smallint, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { rootCauseAnalyses } from './root-cause-analysis';

export const factorCategoryEnum = pgEnum('factor_category', [
  'MAN', 'MACHINE', 'METHOD', 'MATERIAL', 'ENVIRONMENT', 'MANAGEMENT'
]);

export const rcaContributingFactors = pgTable('rca_contributing_factors', {
  id: uuid('id').primaryKey().defaultRandom(),
  rcaId: uuid('rca_id').notNull().references(() => rootCauseAnalyses.id),
  factorCategory: factorCategoryEnum('factor_category').notNull(),
  level: smallint('level'),
  parentFactorId: uuid('parent_factor_id'),
  description: text('description').notNull(),
  isRootCause: boolean('is_root_cause').default(false),
  evidence: text('evidence'),
  correctiveActionId: uuid('corrective_action_id'),
});

export type RcaContributingFactor = typeof rcaContributingFactors.$inferSelect;
