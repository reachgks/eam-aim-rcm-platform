import { pgTable, uuid, varchar, boolean, uniqueIndex, index, pgEnum } from 'drizzle-orm/pg-core';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const storeroomTypeEnum = pgEnum('storeroom_type', [
  'GENERAL',
  'HAZMAT',
  'COLD_STORE',
  'OUTDOOR',
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const storerooms = pgTable(
  'storerooms',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    code: varchar('code', { length: 30 }).notNull(),
    name: varchar('name', { length: 150 }).notNull(),
    locationId: uuid('location_id'),
    type: storeroomTypeEnum('type').notNull().default('GENERAL'),
    managerId: uuid('manager_id'),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    uniqueIndex('uq_storerooms_tenant_code').on(table.tenantId, table.code),
    index('idx_storerooms_tenant_active').on(table.tenantId, table.isActive),
    index('idx_storerooms_location').on(table.tenantId, table.locationId),
  ],
);
