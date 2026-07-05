import { pgTable, uuid, varchar, text, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from '../core/tenants';
import { assetFunctions } from './functions';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const failureTypeEnum = pgEnum('failure_type', [
  'TOTAL_LOSS',
  'PARTIAL_LOSS',
  'INTERMITTENT',
  'OVER_PERFORMANCE',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const functionalFailures = pgTable(
  'functional_failures',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    functionId: uuid('function_id').notNull().references(() => assetFunctions.id, { onDelete: 'cascade' }),
    ffNumber: varchar('ff_number', { length: 20 }).notNull(),
    failureType: failureTypeEnum('failure_type').notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_func_failures_tenant').on(table.tenantId),
    index('idx_func_failures_function').on(table.tenantId, table.functionId),
    index('idx_func_failures_type').on(table.tenantId, table.failureType),
  ],
);

// ── Relations ──────────────────────────────────────────────────────────────────
export const functionalFailuresRelations = relations(functionalFailures, ({ one }) => ({
  function: one(assetFunctions, {
    fields: [functionalFailures.functionId],
    references: [assetFunctions.id],
  }),
}));

// ── Types ──────────────────────────────────────────────────────────────────────
export type FunctionalFailure = typeof functionalFailures.$inferSelect;
export type NewFunctionalFailure = typeof functionalFailures.$inferInsert;
