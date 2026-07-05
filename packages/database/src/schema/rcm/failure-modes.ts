import { pgTable, uuid, varchar, text, boolean, integer, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from '../core/tenants';
import { functionalFailures } from './functional-failures';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const failureModeCategoryEnum = pgEnum('failure_mode_category', [
  'MECHANICAL',
  'ELECTRICAL',
  'INSTRUMENTATION',
  'PROCESS',
  'STRUCTURAL',
  'HUMAN_ERROR',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const failureModes = pgTable(
  'failure_modes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    functionalFailureId: uuid('functional_failure_id').notNull().references(() => functionalFailures.id, { onDelete: 'cascade' }),
    assetTypeId: uuid('asset_type_id'),
    modeCode: varchar('mode_code', { length: 30 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    category: failureModeCategoryEnum('category').notNull(),
    mechanism: text('mechanism'),
    detectable: boolean('detectable').default(true),
    detectability: integer('detectability'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_failure_modes_tenant').on(table.tenantId),
    index('idx_failure_modes_func_failure').on(table.tenantId, table.functionalFailureId),
    index('idx_failure_modes_category').on(table.tenantId, table.category),
    index('idx_failure_modes_asset_type').on(table.tenantId, table.assetTypeId),
    index('idx_failure_modes_code').on(table.tenantId, table.modeCode),
  ],
);

// ── Relations ──────────────────────────────────────────────────────────────────
export const failureModesRelations = relations(failureModes, ({ one }) => ({
  functionalFailure: one(functionalFailures, {
    fields: [failureModes.functionalFailureId],
    references: [functionalFailures.id],
  }),
}));

// ── Types ──────────────────────────────────────────────────────────────────────
export type FailureMode = typeof failureModes.$inferSelect;
export type NewFailureMode = typeof failureModes.$inferInsert;
