import { pgTable, uuid, varchar, text, boolean, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { organizationalInfoRequirements, lifecycleStageEnum } from './organizational-info-requirements';

// ── Table ──────────────────────────────────────────────────────────────────────
export const assetInfoRequirements = pgTable(
  'asset_info_requirements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    oirId: uuid('oir_id').notNull().references(() => organizationalInfoRequirements.id, { onDelete: 'cascade' }),
    assetTypeId: uuid('asset_type_id'),
    requirementName: varchar('requirement_name', { length: 255 }).notNull(),
    description: text('description'),
    dataField: varchar('data_field', { length: 255 }).notNull(),
    dataType: varchar('data_type', { length: 50 }).notNull(),
    isMandatory: boolean('is_mandatory').default(false).notNull(),
    validationRule: text('validation_rule'),
    lifecycleStage: lifecycleStageEnum('lifecycle_stage'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('air_tenant_oir_field_idx').on(table.tenantId, table.oirId, table.dataField),
    index('air_tenant_id_idx').on(table.tenantId),
    index('air_oir_id_idx').on(table.oirId),
    index('air_asset_type_id_idx').on(table.assetTypeId),
    index('air_lifecycle_stage_idx').on(table.tenantId, table.lifecycleStage),
    index('air_is_mandatory_idx').on(table.tenantId, table.isMandatory),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type AssetInfoRequirement = typeof assetInfoRequirements.$inferSelect;
export type NewAssetInfoRequirement = typeof assetInfoRequirements.$inferInsert;
