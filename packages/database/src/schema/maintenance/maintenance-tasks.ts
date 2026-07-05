import { pgTable, uuid, varchar, text, integer, timestamp, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workOrders } from './work-orders';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const maintenanceTaskTypeEnum = pgEnum('maintenance_task_type', [
  'INSPECTION',
  'LUBRICATION',
  'ADJUSTMENT',
  'REPLACEMENT',
  'TESTING',
  'CLEANING',
]);

export const maintenanceTaskStatusEnum = pgEnum('maintenance_task_status', [
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'SKIPPED',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const maintenanceTasks = pgTable(
  'maintenance_tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    workOrderId: uuid('work_order_id')
      .notNull()
      .references(() => workOrders.id),
    taskNumber: integer('task_number').notNull(),
    description: text('description').notNull(),
    taskType: maintenanceTaskTypeEnum('task_type').notNull(),
    estimatedMinutes: integer('estimated_minutes'),
    actualMinutes: integer('actual_minutes'),
    status: maintenanceTaskStatusEnum('status').notNull().default('PENDING'),
    sequence: integer('sequence').notNull(),
    toolsRequired: text('tools_required'),
    safetyNotes: text('safety_notes'),
    completedBy: uuid('completed_by'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_maint_tasks_tenant_wo').on(table.tenantId, table.workOrderId),
    index('idx_maint_tasks_status').on(table.tenantId, table.status),
    index('idx_maint_tasks_sequence').on(table.workOrderId, table.sequence),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const maintenanceTasksRelations = relations(maintenanceTasks, ({ one }) => ({
  workOrder: one(workOrders, {
    fields: [maintenanceTasks.workOrderId],
    references: [workOrders.id],
  }),
}));
