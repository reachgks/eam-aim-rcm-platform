import { pgTable, uuid, varchar, text, decimal, date, timestamp, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { contractors } from './contractors';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const contractTypeEnum = pgEnum('contract_type', [
  'FIXED_PRICE',
  'TIME_MATERIAL',
  'UNIT_RATE',
  'BLANKET',
]);

export const contractStatusEnum = pgEnum('contract_status', [
  'DRAFT',
  'ACTIVE',
  'EXPIRED',
  'TERMINATED',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const contracts = pgTable(
  'contracts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    contractorId: uuid('contractor_id').notNull().references(() => contractors.id),
    contractNumber: varchar('contract_number', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    type: contractTypeEnum('type').notNull(),
    status: contractStatusEnum('status').default('DRAFT').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    totalValue: decimal('total_value', { precision: 14, scale: 2 }),
    currency: varchar('currency', { length: 3 }).default('USD'),
    terms: text('terms'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('contracts_tenant_contract_number_idx').on(table.tenantId, table.contractNumber),
    index('contracts_tenant_id_idx').on(table.tenantId),
    index('contracts_contractor_id_idx').on(table.tenantId, table.contractorId),
    index('contracts_status_idx').on(table.tenantId, table.status),
    index('contracts_type_idx').on(table.tenantId, table.type),
    index('contracts_end_date_idx').on(table.tenantId, table.endDate),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
