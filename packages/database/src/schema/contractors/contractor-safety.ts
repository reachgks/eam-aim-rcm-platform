import { pgTable, uuid, text, date, varchar, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { contractors } from './contractors';
import { contractorPersonnel } from './contractor-personnel';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const contractorSafetyRecordTypeEnum = pgEnum('contractor_safety_record_type', [
  'INDUCTION',
  'INCIDENT',
  'VIOLATION',
  'DRUG_TEST',
  'SAFETY_TRAINING',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const contractorSafetyRecords = pgTable(
  'contractor_safety_records',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    contractorId: uuid('contractor_id').notNull().references(() => contractors.id),
    personnelId: uuid('personnel_id').references(() => contractorPersonnel.id),
    recordType: contractorSafetyRecordTypeEnum('record_type').notNull(),
    recordDate: date('record_date').notNull(),
    description: text('description'),
    outcome: varchar('outcome', { length: 255 }),
    documentId: uuid('document_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('contractor_safety_records_tenant_id_idx').on(table.tenantId),
    index('contractor_safety_records_contractor_id_idx').on(table.tenantId, table.contractorId),
    index('contractor_safety_records_personnel_id_idx').on(table.tenantId, table.personnelId),
    index('contractor_safety_records_record_type_idx').on(table.tenantId, table.recordType),
    index('contractor_safety_records_record_date_idx').on(table.tenantId, table.recordDate),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type ContractorSafetyRecord = typeof contractorSafetyRecords.$inferSelect;
export type NewContractorSafetyRecord = typeof contractorSafetyRecords.$inferInsert;
