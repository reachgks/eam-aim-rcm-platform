import { pgTable, uuid, varchar, text, boolean, timestamp, decimal, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workOrders } from './work-orders';

// ─── Table ────────────────────────────────────────────────────────────────────

export const maintenanceHistory = pgTable(
  'maintenance_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    assetId: uuid('asset_id').notNull(),
    workOrderId: uuid('work_order_id').references(() => workOrders.id),
    eventType: varchar('event_type', { length: 50 }).notNull(),
    completionDate: timestamp('completion_date', { withTimezone: true }).notNull(),
    summary: text('summary'),
    laborHours: decimal('labor_hours', { precision: 8, scale: 2 }),
    laborCost: decimal('labor_cost', { precision: 14, scale: 2 }),
    materialCost: decimal('material_cost', { precision: 14, scale: 2 }),
    totalCost: decimal('total_cost', { precision: 14, scale: 2 }),
    downtimeHours: decimal('downtime_hours', { precision: 8, scale: 2 }),
    isPlanned: boolean('is_planned').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_maint_history_tenant_asset').on(table.tenantId, table.assetId),
    index('idx_maint_history_completion').on(table.tenantId, table.completionDate),
    index('idx_maint_history_event_type').on(table.tenantId, table.eventType),
    index('idx_maint_history_wo').on(table.tenantId, table.workOrderId),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const maintenanceHistoryRelations = relations(maintenanceHistory, ({ one }) => ({
  workOrder: one(workOrders, {
    fields: [maintenanceHistory.workOrderId],
    references: [workOrders.id],
  }),
}));
