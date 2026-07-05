import { pgTable, uuid, text, date, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { shifts } from './shifts';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const availabilityTypeEnum = pgEnum('availability_type', [
  'AVAILABLE',
  'LEAVE',
  'TRAINING',
  'ON_CALL',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const laborAvailability = pgTable(
  'labor_availability',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    userId: uuid('user_id').notNull(),
    shiftId: uuid('shift_id').references(() => shifts.id),
    date: date('date').notNull(),
    availabilityType: availabilityTypeEnum('availability_type').notNull().default('AVAILABLE'),
    notes: text('notes'),
  },
  (table) => [
    index('idx_labor_avail_tenant_user_date').on(table.tenantId, table.userId, table.date),
    index('idx_labor_avail_tenant_date').on(table.tenantId, table.date),
    index('idx_labor_avail_type').on(table.tenantId, table.availabilityType),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const laborAvailabilityRelations = relations(laborAvailability, ({ one }) => ({
  shift: one(shifts, {
    fields: [laborAvailability.shiftId],
    references: [shifts.id],
  }),
}));
