import { pgTable, uuid, decimal, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workOrders } from './work-orders';
import { maintenanceTasks } from './maintenance-tasks';

// ─── Table ────────────────────────────────────────────────────────────────────

export const sparePartsUsage = pgTable(
  'spare_parts_usage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    workOrderId: uuid('work_order_id')
      .notNull()
      .references(() => workOrders.id),
    taskId: uuid('task_id').references(() => maintenanceTasks.id),
    stockItemId: uuid('stock_item_id').notNull(),
    quantityUsed: decimal('quantity_used', { precision: 12, scale: 4 }).notNull(),
    unitCost: decimal('unit_cost', { precision: 14, scale: 2 }),
    totalCost: decimal('total_cost', { precision: 14, scale: 2 }),
    issuedBy: uuid('issued_by'),
    issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_spare_parts_tenant_wo').on(table.tenantId, table.workOrderId),
    index('idx_spare_parts_stock_item').on(table.tenantId, table.stockItemId),
    index('idx_spare_parts_issued_at').on(table.tenantId, table.issuedAt),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const sparePartsUsageRelations = relations(sparePartsUsage, ({ one }) => ({
  workOrder: one(workOrders, {
    fields: [sparePartsUsage.workOrderId],
    references: [workOrders.id],
  }),
  task: one(maintenanceTasks, {
    fields: [sparePartsUsage.taskId],
    references: [maintenanceTasks.id],
  }),
}));
