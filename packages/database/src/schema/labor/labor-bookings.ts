import { pgTable, uuid, varchar, text, decimal, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { crafts } from './crafts';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const laborBookingStatusEnum = pgEnum('labor_booking_status', [
  'PLANNED',
  'STARTED',
  'COMPLETED',
  'CANCELLED',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const laborBookings = pgTable(
  'labor_bookings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    workOrderId: uuid('work_order_id').notNull(),
    userId: uuid('user_id').notNull(),
    craftId: uuid('craft_id')
      .notNull()
      .references(() => crafts.id),
    startTime: timestamp('start_time', { withTimezone: true }).notNull(),
    endTime: timestamp('end_time', { withTimezone: true }),
    hoursRegular: decimal('hours_regular', { precision: 6, scale: 2 }),
    hoursOvertime: decimal('hours_overtime', { precision: 6, scale: 2 }),
    rateApplied: decimal('rate_applied', { precision: 10, scale: 2 }),
    totalCost: decimal('total_cost', { precision: 14, scale: 2 }),
    status: laborBookingStatusEnum('status').notNull().default('PLANNED'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_labor_bookings_tenant_wo').on(table.tenantId, table.workOrderId),
    index('idx_labor_bookings_tenant_user').on(table.tenantId, table.userId),
    index('idx_labor_bookings_tenant_craft').on(table.tenantId, table.craftId),
    index('idx_labor_bookings_start').on(table.tenantId, table.startTime),
    index('idx_labor_bookings_status').on(table.tenantId, table.status),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const laborBookingsRelations = relations(laborBookings, ({ one }) => ({
  craft: one(crafts, {
    fields: [laborBookings.craftId],
    references: [crafts.id],
  }),
}));
