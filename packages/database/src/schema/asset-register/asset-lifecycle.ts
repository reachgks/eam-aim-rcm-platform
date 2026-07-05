import { pgTable, uuid, varchar, text, timestamp, date, decimal, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from './assets';
import { users } from '../core/users';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const lifecycleEventTypeEnum = pgEnum('lifecycle_event_type', [
  'ACQUISITION',
  'INSTALLATION',
  'COMMISSIONING',
  'MAINTENANCE',
  'MODIFICATION',
  'DECOMMISSION',
  'DISPOSAL',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const assetLifecycleEvents = pgTable(
  'asset_lifecycle_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
    eventType: lifecycleEventTypeEnum('event_type').notNull(),
    eventDate: date('event_date').notNull(),
    description: text('description'),
    cost: decimal('cost', { precision: 15, scale: 2 }),
    performedBy: uuid('performed_by').references(() => users.id, { onDelete: 'set null' }),
    documentId: uuid('document_id'), // FK to CDE documents module (added later)
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('asset_lifecycle_tenant_id_idx').on(table.tenantId),
    index('asset_lifecycle_asset_id_idx').on(table.assetId),
    index('asset_lifecycle_event_type_idx').on(table.tenantId, table.eventType),
    index('asset_lifecycle_event_date_idx').on(table.tenantId, table.eventDate),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type AssetLifecycleEvent = typeof assetLifecycleEvents.$inferSelect;
export type NewAssetLifecycleEvent = typeof assetLifecycleEvents.$inferInsert;
