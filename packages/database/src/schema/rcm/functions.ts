import { pgTable, uuid, varchar, text, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from '../core/tenants';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const functionTypeEnum = pgEnum('function_type', [
  'PRIMARY',
  'SECONDARY',
  'PROTECTIVE',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const assetFunctions = pgTable(
  'asset_functions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull(),
    functionNumber: varchar('function_number', { length: 20 }).notNull(),
    functionType: functionTypeEnum('function_type').notNull(),
    description: text('description').notNull(),
    performanceStandard: text('performance_standard'),
    operatingContext: text('operating_context'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_asset_functions_tenant').on(table.tenantId),
    index('idx_asset_functions_asset').on(table.tenantId, table.assetId),
    index('idx_asset_functions_type').on(table.tenantId, table.functionType),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type AssetFunction = typeof assetFunctions.$inferSelect;
export type NewAssetFunction = typeof assetFunctions.$inferInsert;
