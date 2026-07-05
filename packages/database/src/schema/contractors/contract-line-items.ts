import { pgTable, uuid, integer, varchar, text, decimal, index } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { contracts } from './contracts';

// ── Table ──────────────────────────────────────────────────────────────────────
export const contractLineItems = pgTable(
  'contract_line_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    contractId: uuid('contract_id').notNull().references(() => contracts.id, { onDelete: 'cascade' }),
    lineNumber: integer('line_number').notNull(),
    description: text('description').notNull(),
    unitPrice: decimal('unit_price', { precision: 14, scale: 2 }).notNull(),
    quantity: decimal('quantity', { precision: 12, scale: 4 }).notNull(),
    totalPrice: decimal('total_price', { precision: 14, scale: 2 }).notNull(),
    category: varchar('category', { length: 100 }),
  },
  (table) => [
    index('contract_line_items_tenant_id_idx').on(table.tenantId),
    index('contract_line_items_contract_id_idx').on(table.tenantId, table.contractId),
    index('contract_line_items_category_idx').on(table.tenantId, table.category),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type ContractLineItem = typeof contractLineItems.$inferSelect;
export type NewContractLineItem = typeof contractLineItems.$inferInsert;
