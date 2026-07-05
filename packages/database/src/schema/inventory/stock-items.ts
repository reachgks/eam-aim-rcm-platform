import { pgTable, uuid, varchar, text, boolean, integer, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';

// ─── Table ────────────────────────────────────────────────────────────────────

export const stockItems = pgTable(
  'stock_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    partNumber: varchar('part_number', { length: 80 }).notNull(),
    description: text('description').notNull(),
    category: varchar('category', { length: 100 }),
    unitOfIssue: varchar('unit_of_issue', { length: 30 }).notNull(),
    manufacturer: varchar('manufacturer', { length: 150 }),
    manufacturerPartNo: varchar('manufacturer_part_no', { length: 80 }),
    isCriticalSpare: boolean('is_critical_spare').notNull().default(false),
    isRotable: boolean('is_rotable').notNull().default(false),
    leadTimeDays: integer('lead_time_days'),
    shelfLifeDays: integer('shelf_life_days'),
    hazmatClass: varchar('hazmat_class', { length: 30 }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_stock_items_tenant_part').on(table.tenantId, table.partNumber),
    index('idx_stock_items_tenant_active').on(table.tenantId, table.isActive),
    index('idx_stock_items_category').on(table.tenantId, table.category),
    index('idx_stock_items_critical').on(table.tenantId, table.isCriticalSpare),
    index('idx_stock_items_manufacturer').on(table.tenantId, table.manufacturer),
  ],
);
