import { pgTable, uuid, varchar, text, integer, timestamp, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const warrantyCoverageTypeEnum = pgEnum('warranty_coverage_type', [
  'FULL',
  'LIMITED',
  'LABOR_ONLY',
  'PARTS_ONLY',
  'EXTENDED',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const warrantyTerms = pgTable(
  'warranty_terms',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    durationMonths: integer('duration_months').notNull(),
    coverageType: warrantyCoverageTypeEnum('coverage_type').notNull(),
    terms: text('terms'),
    vendorId: uuid('vendor_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('warranty_terms_tenant_id_idx').on(table.tenantId),
    index('warranty_terms_vendor_id_idx').on(table.tenantId, table.vendorId),
    index('warranty_terms_coverage_type_idx').on(table.tenantId, table.coverageType),
    uniqueIndex('warranty_terms_tenant_name_idx').on(table.tenantId, table.name),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type WarrantyTerm = typeof warrantyTerms.$inferSelect;
export type NewWarrantyTerm = typeof warrantyTerms.$inferInsert;
