import { pgTable, uuid, varchar, text, boolean, decimal, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';

// ─── Table ────────────────────────────────────────────────────────────────────

export const crafts = pgTable(
  'crafts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    code: varchar('code', { length: 30 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    standardRate: decimal('standard_rate', { precision: 10, scale: 2 }),
    overtimeRate: decimal('overtime_rate', { precision: 10, scale: 2 }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_crafts_tenant_code').on(table.tenantId, table.code),
    index('idx_crafts_tenant_active').on(table.tenantId, table.isActive),
  ],
);
