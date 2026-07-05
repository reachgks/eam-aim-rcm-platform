import { pgTable, uuid, varchar, text, boolean, decimal, date, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Table ──────────────────────────────────────────────────────────────────────
export const contractors = pgTable(
  'contractors',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    code: varchar('code', { length: 50 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    contactName: varchar('contact_name', { length: 200 }),
    email: varchar('email', { length: 320 }),
    phone: varchar('phone', { length: 30 }),
    address: text('address'),
    taxId: varchar('tax_id', { length: 50 }),
    insuranceExpiry: date('insurance_expiry'),
    safetyRating: decimal('safety_rating', { precision: 3, scale: 1 }),
    isApproved: boolean('is_approved').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('contractors_tenant_code_idx').on(table.tenantId, table.code),
    index('contractors_tenant_id_idx').on(table.tenantId),
    index('contractors_name_idx').on(table.tenantId, table.name),
    index('contractors_is_approved_idx').on(table.tenantId, table.isApproved),
    index('contractors_is_active_idx').on(table.tenantId, table.isActive),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type Contractor = typeof contractors.$inferSelect;
export type NewContractor = typeof contractors.$inferInsert;
