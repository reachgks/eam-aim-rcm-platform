import { pgTable, uuid, varchar, text, date, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { warrantyTerms } from './warranty-terms';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const warrantyCoverageStatusEnum = pgEnum('warranty_coverage_status', [
  'ACTIVE',
  'EXPIRED',
  'VOIDED',
  'CLAIMED',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const warrantyCoverage = pgTable(
  'warranty_coverage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull(),
    warrantyTermId: uuid('warranty_term_id').notNull().references(() => warrantyTerms.id),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    status: warrantyCoverageStatusEnum('status').default('ACTIVE').notNull(),
    purchaseOrderId: uuid('purchase_order_id'),
    serialNumber: varchar('serial_number', { length: 100 }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('warranty_coverage_tenant_id_idx').on(table.tenantId),
    index('warranty_coverage_asset_id_idx').on(table.tenantId, table.assetId),
    index('warranty_coverage_status_idx').on(table.tenantId, table.status),
    index('warranty_coverage_end_date_idx').on(table.tenantId, table.endDate),
    index('warranty_coverage_warranty_term_id_idx').on(table.tenantId, table.warrantyTermId),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type WarrantyCoverage = typeof warrantyCoverage.$inferSelect;
export type NewWarrantyCoverage = typeof warrantyCoverage.$inferInsert;
