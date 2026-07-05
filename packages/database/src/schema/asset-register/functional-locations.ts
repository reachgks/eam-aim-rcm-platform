import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const locationTypeEnum = pgEnum('location_type', [
  'SITE',
  'BUILDING',
  'FLOOR',
  'ZONE',
  'ROOM',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const functionalLocations = pgTable(
  'functional_locations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    code: varchar('code', { length: 100 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    parentId: uuid('parent_id'), // self-referencing hierarchy
    locationType: locationTypeEnum('location_type').notNull(),
    address: text('address'),
    coordinates: jsonb('coordinates').$type<{ latitude: number; longitude: number; altitude?: number }>(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('functional_locations_tenant_code_idx').on(table.tenantId, table.code),
    index('functional_locations_tenant_id_idx').on(table.tenantId),
    index('functional_locations_parent_id_idx').on(table.parentId),
    index('functional_locations_location_type_idx').on(table.tenantId, table.locationType),
    index('functional_locations_is_active_idx').on(table.tenantId, table.isActive),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type FunctionalLocation = typeof functionalLocations.$inferSelect;
export type NewFunctionalLocation = typeof functionalLocations.$inferInsert;
