import { pgTable, uuid, varchar, text, decimal, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

export const kpiCategoryEnum = pgEnum('kpi_category', [
  'RELIABILITY', 'AVAILABILITY', 'COST', 'SAFETY', 'COMPLIANCE', 'PERFORMANCE'
]);

export const kpiDefinitions = pgTable('kpi_definitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  code: varchar('code', { length: 30 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  category: kpiCategoryEnum('category').notNull(),
  formula: text('formula'),
  unit: varchar('unit', { length: 30 }),
  targetValue: decimal('target_value', { precision: 15, scale: 4 }),
  warningThreshold: decimal('warning_threshold', { precision: 15, scale: 4 }),
  criticalThreshold: decimal('critical_threshold', { precision: 15, scale: 4 }),
  calculationFrequency: varchar('calculation_frequency', { length: 20 }),
  isActive: boolean('is_active').default(true),
});

export type KpiDefinition = typeof kpiDefinitions.$inferSelect;
