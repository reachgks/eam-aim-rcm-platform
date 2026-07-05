import { pgTable, uuid, varchar, text, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { informationContainers } from './information-containers';

// ── Table ──────────────────────────────────────────────────────────────────────
export const documentRegistry = pgTable(
  'document_registry',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    containerId: uuid('container_id').notNull().references(() => informationContainers.id, { onDelete: 'cascade' }),
    documentNumber: varchar('document_number', { length: 100 }).notNull(),
    documentTitle: varchar('document_title', { length: 500 }).notNull(),
    documentType: varchar('document_type', { length: 100 }),
    discipline: varchar('discipline', { length: 100 }),
    revision: varchar('revision', { length: 50 }),
    assetId: uuid('asset_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('doc_reg_tenant_doc_number_idx').on(table.tenantId, table.documentNumber),
    index('doc_reg_tenant_id_idx').on(table.tenantId),
    index('doc_reg_container_id_idx').on(table.containerId),
    index('doc_reg_asset_id_idx').on(table.assetId),
    index('doc_reg_doc_type_idx').on(table.tenantId, table.documentType),
    index('doc_reg_discipline_idx').on(table.tenantId, table.discipline),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type DocumentRegistryEntry = typeof documentRegistry.$inferSelect;
export type NewDocumentRegistryEntry = typeof documentRegistry.$inferInsert;
