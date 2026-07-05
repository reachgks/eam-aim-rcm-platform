import { pgTable, uuid, varchar, text, boolean, date, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

export const regulations = pgTable('regulations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  code: varchar('code', { length: 50 }).notNull(),
  name: varchar('name', { length: 300 }).notNull(),
  description: text('description'),
  authority: varchar('authority', { length: 50 }).notNull(),
  jurisdiction: varchar('jurisdiction', { length: 100 }),
  effectiveDate: date('effective_date'),
  isActive: boolean('is_active').default(true),
  documentId: uuid('document_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type Regulation = typeof regulations.$inferSelect;
