import { pgTable, uuid, varchar, text, date, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assetInfoRequirements } from './asset-info-requirements';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const eirStatusEnum = pgEnum('eir_status', [
  'DRAFT',
  'ISSUED',
  'IN_PROGRESS',
  'DELIVERED',
  'ACCEPTED',
  'REJECTED',
]);

export const exchangeMethodEnum = pgEnum('exchange_method', [
  'CDE_UPLOAD',
  'API',
  'FILE_TRANSFER',
  'DIRECT_ENTRY',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const exchangeInfoRequirements = pgTable(
  'exchange_info_requirements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    airId: uuid('air_id').notNull().references(() => assetInfoRequirements.id, { onDelete: 'cascade' }),
    deliveryMilestone: varchar('delivery_milestone', { length: 255 }),
    responsibleParty: varchar('responsible_party', { length: 255 }),
    format: varchar('format', { length: 100 }),
    exchangeMethod: exchangeMethodEnum('exchange_method'),
    dueDate: date('due_date'),
    status: eirStatusEnum('status').default('DRAFT').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('eir_tenant_id_idx').on(table.tenantId),
    index('eir_air_id_idx').on(table.airId),
    index('eir_status_idx').on(table.tenantId, table.status),
    index('eir_due_date_idx').on(table.tenantId, table.dueDate),
    index('eir_responsible_party_idx').on(table.tenantId, table.responsibleParty),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type ExchangeInfoRequirement = typeof exchangeInfoRequirements.$inferSelect;
export type NewExchangeInfoRequirement = typeof exchangeInfoRequirements.$inferInsert;
