import { pgTable, uuid, varchar, text, decimal, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { shutdownEvents } from './shutdown-events';
import { workOrders } from './work-orders';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const shutdownScopeTypeEnum = pgEnum('shutdown_scope_type', [
  'INSPECTION',
  'REPAIR',
  'REPLACEMENT',
  'MODIFICATION',
]);

export const shutdownScopeStatusEnum = pgEnum('shutdown_scope_status', [
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'DEFERRED',
]);

export const shutdownScopePriorityEnum = pgEnum('shutdown_scope_priority', [
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const shutdownScopeItems = pgTable(
  'shutdown_scope_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    shutdownId: uuid('shutdown_id')
      .notNull()
      .references(() => shutdownEvents.id),
    assetId: uuid('asset_id').notNull(),
    workOrderId: uuid('work_order_id').references(() => workOrders.id),
    scopeType: shutdownScopeTypeEnum('scope_type').notNull(),
    priority: shutdownScopePriorityEnum('priority').notNull().default('MEDIUM'),
    estimatedHours: decimal('estimated_hours', { precision: 8, scale: 2 }),
    status: shutdownScopeStatusEnum('status').notNull().default('PENDING'),
    notes: text('notes'),
  },
  (table) => [
    index('idx_scope_items_tenant_shutdown').on(table.tenantId, table.shutdownId),
    index('idx_scope_items_asset').on(table.tenantId, table.assetId),
    index('idx_scope_items_wo').on(table.tenantId, table.workOrderId),
    index('idx_scope_items_status').on(table.tenantId, table.status),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const shutdownScopeItemsRelations = relations(shutdownScopeItems, ({ one }) => ({
  shutdown: one(shutdownEvents, {
    fields: [shutdownScopeItems.shutdownId],
    references: [shutdownEvents.id],
  }),
  workOrder: one(workOrders, {
    fields: [shutdownScopeItems.workOrderId],
    references: [workOrders.id],
  }),
}));
