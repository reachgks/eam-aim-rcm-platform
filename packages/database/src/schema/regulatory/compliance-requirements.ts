import { pgTable, uuid, varchar, text, integer, boolean } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { regulations } from './regulations';

export const complianceRequirements = pgTable('compliance_requirements', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  regulationId: uuid('regulation_id').notNull().references(() => regulations.id),
  code: varchar('code', { length: 50 }).notNull(),
  name: varchar('name', { length: 300 }).notNull(),
  description: text('description'),
  requirementType: varchar('requirement_type', { length: 30 }).notNull(),
  frequencyDays: integer('frequency_days'),
  isActive: boolean('is_active').default(true),
});

export type ComplianceRequirement = typeof complianceRequirements.$inferSelect;
