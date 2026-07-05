import { pgTable, uuid, varchar, decimal, integer, boolean, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { stockItems } from './stock-items';
import { storerooms } from './storerooms';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const reorderRuleTypeEnum = pgEnum('reorder_rule_type', [
  'MIN_MAX',
  'EOQ',
  'KANBAN',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const reorderRules = pgTable(
  'reorder_rules',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    stockItemId: uuid('stock_item_id')
      .notNull()
      .references(() => stockItems.id),
    storeroomId: uuid('storeroom_id')
      .notNull()
      .references(() => storerooms.id),
    ruleType: reorderRuleTypeEnum('rule_type').notNull(),
    minQty: decimal('min_qty', { precision: 14, scale: 4 }),
    maxQty: decimal('max_qty', { precision: 14, scale: 4 }),
    reorderPoint: decimal('reorder_point', { precision: 14, scale: 4 }),
    reorderQty: decimal('reorder_qty', { precision: 14, scale: 4 }),
    autoReorder: boolean('auto_reorder').notNull().default(false),
    preferredVendorId: uuid('preferred_vendor_id'),
    leadTimeDays: integer('lead_time_days'),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    index('idx_reorder_rules_tenant_item').on(table.tenantId, table.stockItemId),
    index('idx_reorder_rules_tenant_storeroom').on(table.tenantId, table.storeroomId),
    index('idx_reorder_rules_active').on(table.tenantId, table.isActive),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const reorderRulesRelations = relations(reorderRules, ({ one }) => ({
  stockItem: one(stockItems, {
    fields: [reorderRules.stockItemId],
    references: [stockItems.id],
  }),
  storeroom: one(storerooms, {
    fields: [reorderRules.storeroomId],
    references: [storerooms.id],
  }),
}));
