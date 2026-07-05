import { pgTable, uuid, varchar, decimal, date, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { crafts } from './crafts';

// ─── Table ────────────────────────────────────────────────────────────────────

export const laborRates = pgTable(
  'labor_rates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    craftId: uuid('craft_id')
      .notNull()
      .references(() => crafts.id),
    effectiveDate: date('effective_date').notNull(),
    regularRate: decimal('regular_rate', { precision: 10, scale: 2 }).notNull(),
    overtimeRate: decimal('overtime_rate', { precision: 10, scale: 2 }),
    doubleTimeRate: decimal('double_time_rate', { precision: 10, scale: 2 }),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_labor_rates_tenant_craft').on(table.tenantId, table.craftId),
    index('idx_labor_rates_effective').on(table.tenantId, table.craftId, table.effectiveDate),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const laborRatesRelations = relations(laborRates, ({ one }) => ({
  craft: one(crafts, {
    fields: [laborRates.craftId],
    references: [crafts.id],
  }),
}));
