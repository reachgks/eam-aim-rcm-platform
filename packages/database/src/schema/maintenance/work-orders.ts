import { pgTable, uuid, varchar, text, boolean, timestamp, decimal, integer, jsonb, uniqueIndex, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const workOrderTypeEnum = pgEnum('work_order_type', [
  'PREVENTIVE',
  'CORRECTIVE',
  'PREDICTIVE',
  'EMERGENCY',
  'INSPECTION',
  'PROJECT',
]);

export const workOrderStatusEnum = pgEnum('work_order_status', [
  'DRAFT',
  'PLANNED',
  'SCHEDULED',
  'IN_PROGRESS',
  'ON_HOLD',
  'COMPLETED',
  'CLOSED',
  'CANCELLED',
]);

export const workOrderPriorityEnum = pgEnum('work_order_priority', [
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const workOrders = pgTable(
  'work_orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    woNumber: varchar('wo_number', { length: 50 }).notNull(),
    assetId: uuid('asset_id'),
    type: workOrderTypeEnum('type').notNull(),
    status: workOrderStatusEnum('status').notNull().default('DRAFT'),
    priority: workOrderPriorityEnum('priority').notNull().default('MEDIUM'),
    description: varchar('description', { length: 500 }).notNull(),
    longDescription: text('long_description'),
    reportedBy: uuid('reported_by'),
    assignedTo: uuid('assigned_to'),
    crewId: uuid('crew_id'),
    maintenancePlanId: uuid('maintenance_plan_id'),
    serviceRequestId: uuid('service_request_id'),
    estimatedHours: decimal('estimated_hours', { precision: 8, scale: 2 }),
    actualHours: decimal('actual_hours', { precision: 8, scale: 2 }),
    estimatedCost: decimal('estimated_cost', { precision: 14, scale: 2 }),
    actualCost: decimal('actual_cost', { precision: 14, scale: 2 }),
    scheduledStart: timestamp('scheduled_start', { withTimezone: true }),
    scheduledEnd: timestamp('scheduled_end', { withTimezone: true }),
    actualStart: timestamp('actual_start', { withTimezone: true }),
    actualEnd: timestamp('actual_end', { withTimezone: true }),
    completionNotes: text('completion_notes'),
    failureModeId: uuid('failure_mode_id'),
    failureCodeId: uuid('failure_code_id'),
    causeCodeId: uuid('cause_code_id'),
    parentWoId: uuid('parent_wo_id'),
    safetyRequirements: text('safety_requirements'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_work_orders_tenant_wo_number').on(table.tenantId, table.woNumber),
    index('idx_work_orders_tenant_status').on(table.tenantId, table.status),
    index('idx_work_orders_tenant_asset').on(table.tenantId, table.assetId),
    index('idx_work_orders_tenant_type').on(table.tenantId, table.type),
    index('idx_work_orders_tenant_priority').on(table.tenantId, table.priority),
    index('idx_work_orders_assigned_to').on(table.tenantId, table.assignedTo),
    index('idx_work_orders_crew').on(table.tenantId, table.crewId),
    index('idx_work_orders_scheduled_start').on(table.tenantId, table.scheduledStart),
    index('idx_work_orders_parent').on(table.parentWoId),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const workOrdersRelations = relations(workOrders, ({ one, many }) => ({
  parentWo: one(workOrders, {
    fields: [workOrders.parentWoId],
    references: [workOrders.id],
    relationName: 'parentChild',
  }),
  childWos: many(workOrders, { relationName: 'parentChild' }),
}));
