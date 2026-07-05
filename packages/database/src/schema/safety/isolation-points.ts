import { pgTable, uuid, varchar, text, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const isolationPointTypeEnum = pgEnum('isolation_point_type', [
  'ELECTRICAL',
  'MECHANICAL',
  'HYDRAULIC',
  'PNEUMATIC',
  'PROCESS',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const isolationPoints = pgTable(
  'isolation_points',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assetId: uuid('asset_id').notNull(),
    pointNumber: varchar('point_number', { length: 50 }).notNull(),
    pointType: isolationPointTypeEnum('point_type').notNull(),
    description: text('description'),
    location: varchar('location', { length: 255 }),
    lockType: varchar('lock_type', { length: 100 }),
    normalState: varchar('normal_state', { length: 50 }),
    tagId: varchar('tag_id', { length: 100 }),
  },
  (table) => [
    index('isolation_points_tenant_id_idx').on(table.tenantId),
    index('isolation_points_asset_id_idx').on(table.tenantId, table.assetId),
    uniqueIndex('isolation_points_tenant_point_number_idx').on(table.tenantId, table.pointNumber),
    index('isolation_points_point_type_idx').on(table.tenantId, table.pointType),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type IsolationPoint = typeof isolationPoints.$inferSelect;
export type NewIsolationPoint = typeof isolationPoints.$inferInsert;
