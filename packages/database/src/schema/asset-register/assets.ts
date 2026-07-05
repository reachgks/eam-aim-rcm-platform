import { pgTable, uuid, varchar, text, boolean, timestamp, date, decimal, jsonb, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assetTypes } from './asset-types';
import { functionalLocations } from './functional-locations';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const assetStatusEnum = pgEnum('asset_status', [
  'PLANNED',
  'ACTIVE',
  'INACTIVE',
  'DECOMMISSIONED',
  'DISPOSED',
]);

export const assetCriticalityEnum = pgEnum('asset_criticality', [
  'A',
  'B',
  'C',
  'D',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const assets = pgTable(
  'assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    tagNumber: varchar('tag_number', { length: 100 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    assetTypeId: uuid('asset_type_id').references(() => assetTypes.id, { onDelete: 'set null' }),
    parentAssetId: uuid('parent_asset_id'), // self-ref added via relations
    functionalLocationId: uuid('functional_location_id').references(() => functionalLocations.id, { onDelete: 'set null' }),
    serialNumber: varchar('serial_number', { length: 255 }),
    manufacturer: varchar('manufacturer', { length: 255 }),
    model: varchar('model', { length: 255 }),
    installDate: date('install_date'),
    commissionDate: date('commission_date'),
    status: assetStatusEnum('status').default('PLANNED').notNull(),
    criticality: assetCriticalityEnum('criticality').default('C').notNull(),
    warrantyExpiry: date('warranty_expiry'),
    photoUrl: text('photo_url'),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('assets_tenant_tag_idx').on(table.tenantId, table.tagNumber),
    index('assets_tenant_id_idx').on(table.tenantId),
    index('assets_tenant_status_idx').on(table.tenantId, table.status),
    index('assets_tenant_criticality_idx').on(table.tenantId, table.criticality),
    index('assets_asset_type_id_idx').on(table.assetTypeId),
    index('assets_parent_asset_id_idx').on(table.parentAssetId),
    index('assets_functional_location_id_idx').on(table.functionalLocationId),
    index('assets_serial_number_idx').on(table.tenantId, table.serialNumber),
    index('assets_manufacturer_idx').on(table.tenantId, table.manufacturer),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
