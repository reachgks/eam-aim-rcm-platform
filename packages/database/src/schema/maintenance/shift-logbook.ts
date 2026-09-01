import { pgTable, uuid, varchar, text, integer, date, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workOrders } from './work-orders';

export const shiftTypeEnum = pgEnum('shift_type', ['MORNING', 'AFTERNOON', 'NIGHT']);
export const logEntryTypeEnum = pgEnum('log_entry_type', ['BREAKDOWN', 'PREVENTIVE', 'SCHEDULED', 'INSPECTION', 'EMERGENCY']);
export const logEntryStatusEnum = pgEnum('log_entry_status', ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'DEFERRED']);

export const shiftLogEntries = pgTable('shift_log_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  shiftDate: date('shift_date').notNull(),
  shiftType: shiftTypeEnum('shift_type').notNull(),
  logEntryType: logEntryTypeEnum('log_entry_type').notNull(),
  assetId: uuid('asset_id'),
  functionalLocationId: uuid('functional_location_id'),
  workOrderId: uuid('work_order_id').references(() => workOrders.id),
  machineName: varchar('machine_name', { length: 255 }),
  sectionName: varchar('section_name', { length: 255 }),
  plantName: varchar('plant_name', { length: 255 }),
  description: text('description').notNull(),
  actionTaken: text('action_taken'),
  partsUsed: text('parts_used'),
  downtimeMinutes: integer('downtime_minutes'),
  reportedBy: uuid('reported_by'),
  attendedBy: varchar('attended_by', { length: 255 }),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  status: logEntryStatusEnum('log_entry_status').notNull().default('OPEN'),
  remarks: text('remarks'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_shift_log_tenant_date').on(table.tenantId, table.shiftDate),
  index('idx_shift_log_tenant_type').on(table.tenantId, table.logEntryType),
  index('idx_shift_log_tenant_asset').on(table.tenantId, table.assetId),
  index('idx_shift_log_tenant_location').on(table.tenantId, table.functionalLocationId),
  index('idx_shift_log_tenant_section').on(table.tenantId, table.sectionName),
  index('idx_shift_log_tenant_plant').on(table.tenantId, table.plantName),
  index('idx_shift_log_tenant_shift').on(table.tenantId, table.shiftType),
  index('idx_shift_log_tenant_status').on(table.tenantId, table.status),
]);

export const shiftLogEntriesRelations = relations(shiftLogEntries, ({ one }) => ({
  workOrder: one(workOrders, { fields: [shiftLogEntries.workOrderId], references: [workOrders.id] }),
}));

export type ShiftLogEntry = typeof shiftLogEntries.$inferSelect;
export type NewShiftLogEntry = typeof shiftLogEntries.$inferInsert;
