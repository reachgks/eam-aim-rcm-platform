import { pgTable, uuid, boolean, decimal, timestamp, text, jsonb, index } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';
import { assetInfoRequirements } from './asset-info-requirements';

// ── Table ──────────────────────────────────────────────────────────────────────
export const airComplianceChecks = pgTable(
  'air_compliance_checks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull(),
    airId: uuid('air_id').notNull().references(() => assetInfoRequirements.id, { onDelete: 'cascade' }),
    checkDate: timestamp('check_date', { withTimezone: true }).defaultNow().notNull(),
    isPassing: boolean('is_passing').notNull(),
    score: decimal('score', { precision: 5, scale: 2 }),
    missingFields: jsonb('missing_fields'),
    checkedBy: uuid('checked_by').references(() => users.id),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('air_compliance_tenant_id_idx').on(table.tenantId),
    index('air_compliance_asset_id_idx').on(table.assetId),
    index('air_compliance_air_id_idx').on(table.airId),
    index('air_compliance_check_date_idx').on(table.tenantId, table.checkDate),
    index('air_compliance_is_passing_idx').on(table.tenantId, table.isPassing),
    index('air_compliance_checked_by_idx').on(table.checkedBy),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type AirComplianceCheck = typeof airComplianceChecks.$inferSelect;
export type NewAirComplianceCheck = typeof airComplianceChecks.$inferInsert;
