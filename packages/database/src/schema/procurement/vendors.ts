import { pgTable, uuid, varchar, text, boolean, timestamp, decimal, date, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

export const vendorTypeEnum = pgEnum('vendor_type', ['SUPPLIER', 'MANUFACTURER', 'SERVICE_PROVIDER']);

export const vendors = pgTable('vendors', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  code: varchar('code', { length: 20 }).notNull(),
  name: varchar('name', { length: 300 }).notNull(),
  type: vendorTypeEnum('type').default('SUPPLIER'),
  contactName: varchar('contact_name', { length: 200 }),
  email: varchar('email', { length: 200 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  taxId: varchar('tax_id', { length: 50 }),
  paymentTerms: varchar('payment_terms', { length: 50 }),
  currency: varchar('currency', { length: 3 }).default('USD'),
  isApproved: boolean('is_approved').default(false),
  approvalDate: date('approval_date'),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueCode: uniqueIndex('vendors_tenant_code_idx').on(table.tenantId, table.code),
}));

export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
