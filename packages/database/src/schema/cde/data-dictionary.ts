import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Table ──────────────────────────────────────────────────────────────────────
export const dataDictionaryEntries = pgTable(
  'data_dictionary_entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    propertyName: varchar('property_name', { length: 255 }).notNull(),
    displayName: varchar('display_name', { length: 255 }),
    definition: text('definition'),
    dataType: varchar('data_type', { length: 50 }).notNull(),
    unitOfMeasure: varchar('unit_of_measure', { length: 50 }),
    allowedValues: jsonb('allowed_values'),
    validationRegex: varchar('validation_regex', { length: 500 }),
    sourceStandard: varchar('source_standard', { length: 100 }),
    propertySet: varchar('property_set', { length: 255 }),
    applicableAssetTypes: uuid('applicable_asset_types').array(),
    isMandatory: boolean('is_mandatory').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('data_dict_tenant_prop_name_idx').on(table.tenantId, table.propertyName),
    index('data_dict_tenant_id_idx').on(table.tenantId),
    index('data_dict_data_type_idx').on(table.tenantId, table.dataType),
    index('data_dict_property_set_idx').on(table.tenantId, table.propertySet),
    index('data_dict_source_standard_idx').on(table.tenantId, table.sourceStandard),
    index('data_dict_is_active_idx').on(table.tenantId, table.isActive),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type DataDictionaryEntry = typeof dataDictionaryEntries.$inferSelect;
export type NewDataDictionaryEntry = typeof dataDictionaryEntries.$inferInsert;
