import { pgTable, uuid, varchar, text, date, decimal, timestamp, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { warrantyCoverage } from './warranty-coverage';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const warrantyClaimStatusEnum = pgEnum('warranty_claim_status', [
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'PAID',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const warrantyClaims = pgTable(
  'warranty_claims',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    coverageId: uuid('coverage_id').notNull().references(() => warrantyCoverage.id),
    claimNumber: varchar('claim_number', { length: 50 }).notNull(),
    workOrderId: uuid('work_order_id'),
    claimDate: date('claim_date').notNull(),
    description: text('description'),
    claimAmount: decimal('claim_amount', { precision: 14, scale: 2 }),
    approvedAmount: decimal('approved_amount', { precision: 14, scale: 2 }),
    status: warrantyClaimStatusEnum('status').default('SUBMITTED').notNull(),
    vendorResponse: text('vendor_response'),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('warranty_claims_tenant_id_idx').on(table.tenantId),
    uniqueIndex('warranty_claims_tenant_claim_number_idx').on(table.tenantId, table.claimNumber),
    index('warranty_claims_coverage_id_idx').on(table.tenantId, table.coverageId),
    index('warranty_claims_status_idx').on(table.tenantId, table.status),
    index('warranty_claims_work_order_id_idx').on(table.tenantId, table.workOrderId),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type WarrantyClaim = typeof warrantyClaims.$inferSelect;
export type NewWarrantyClaim = typeof warrantyClaims.$inferInsert;
