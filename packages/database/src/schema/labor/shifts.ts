import { pgTable, uuid, varchar, time, integer, boolean, smallint, index } from 'drizzle-orm/pg-core';

// ─── Table ────────────────────────────────────────────────────────────────────

export const shifts = pgTable(
  'shifts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    breakDurationMin: integer('break_duration_min').default(0),
    daysOfWeek: smallint('days_of_week').array().notNull(),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    index('idx_shifts_tenant_active').on(table.tenantId, table.isActive),
  ],
);
