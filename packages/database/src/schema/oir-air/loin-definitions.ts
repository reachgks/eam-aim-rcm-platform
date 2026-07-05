import { pgTable, uuid, varchar, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assetInfoRequirements } from './asset-info-requirements';
import { lifecycleStageEnum } from './organizational-info-requirements';

// ── Table ──────────────────────────────────────────────────────────────────────
export const loinDefinitions = pgTable(
  'loin_definitions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    airId: uuid('air_id').notNull().references(() => assetInfoRequirements.id, { onDelete: 'cascade' }),
    assetTypeId: uuid('asset_type_id'),
    lifecycleStage: lifecycleStageEnum('lifecycle_stage'),
    purpose: text('purpose'),
    geometryDetailLevel: varchar('geometry_detail_level', { length: 50 }),
    geometryDimensionality: varchar('geometry_dimensionality', { length: 10 }),
    geometryAppearance: varchar('geometry_appearance', { length: 100 }),
    geometryParametric: varchar('geometry_parametric', { length: 100 }),
    alphanumericProperties: jsonb('alphanumeric_properties'),
    alphanumericIdentification: jsonb('alphanumeric_identification'),
    documentationRequired: jsonb('documentation_required'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('loin_tenant_id_idx').on(table.tenantId),
    index('loin_air_id_idx').on(table.airId),
    index('loin_asset_type_id_idx').on(table.assetTypeId),
    index('loin_lifecycle_stage_idx').on(table.tenantId, table.lifecycleStage),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type LoinDefinition = typeof loinDefinitions.$inferSelect;
export type NewLoinDefinition = typeof loinDefinitions.$inferInsert;
