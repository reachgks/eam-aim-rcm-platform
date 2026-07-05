import { pgTable, uuid, varchar, text, decimal, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { inspections } from './inspections';
import { regulations } from './regulations';
import { assets } from '../asset-register/assets';

export const violationSeverityEnum = pgEnum('violation_severity', ['MINOR', 'MAJOR', 'CRITICAL', 'WILLFUL']);
export const violationStatusEnum = pgEnum('violation_status', ['OPEN', 'UNDER_REVIEW', 'CORRECTIVE_ACTION', 'CLOSED', 'APPEALED']);

export const violations = pgTable('violations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  inspectionId: uuid('inspection_id').references(() => inspections.id),
  regulationId: uuid('regulation_id').notNull().references(() => regulations.id),
  assetId: uuid('asset_id').references(() => assets.id),
  violationDate: date('violation_date').notNull(),
  severity: violationSeverityEnum('severity').notNull(),
  description: text('description'),
  citationNumber: varchar('citation_number', { length: 50 }),
  fineAmount: decimal('fine_amount', { precision: 15, scale: 2 }),
  status: violationStatusEnum('violation_status').default('OPEN'),
  closedAt: timestamp('closed_at', { withTimezone: true }),
});

export type Violation = typeof violations.$inferSelect;
