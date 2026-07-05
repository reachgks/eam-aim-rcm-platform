import { pgTable, uuid, varchar, boolean, date, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { contractors } from './contractors';

// ── Table ──────────────────────────────────────────────────────────────────────
export const contractorPersonnel = pgTable(
  'contractor_personnel',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    contractorId: uuid('contractor_id').notNull().references(() => contractors.id),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 320 }),
    phone: varchar('phone', { length: 30 }),
    role: varchar('role', { length: 100 }),
    badgeNumber: varchar('badge_number', { length: 50 }),
    siteAccessExpiry: date('site_access_expiry'),
    safetyInductionDate: date('safety_induction_date'),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (table) => [
    index('contractor_personnel_tenant_id_idx').on(table.tenantId),
    index('contractor_personnel_contractor_id_idx').on(table.tenantId, table.contractorId),
    index('contractor_personnel_badge_number_idx').on(table.tenantId, table.badgeNumber),
    index('contractor_personnel_is_active_idx').on(table.tenantId, table.isActive),
    index('contractor_personnel_site_access_expiry_idx').on(table.tenantId, table.siteAccessExpiry),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type ContractorPersonnel = typeof contractorPersonnel.$inferSelect;
export type NewContractorPersonnel = typeof contractorPersonnel.$inferInsert;
