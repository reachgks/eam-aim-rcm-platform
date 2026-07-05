import { pgTable, uuid, varchar, text, integer, timestamp, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const containerTypeEnum = pgEnum('container_type', [
  'DOCUMENT',
  'MODEL',
  'DATASET',
  'DRAWING',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const informationContainers = pgTable(
  'information_containers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    containerCode: varchar('container_code', { length: 100 }).notNull(),
    title: varchar('title', { length: 500 }).notNull(),
    description: text('description'),
    containerType: containerTypeEnum('container_type').notNull(),
    format: varchar('format', { length: 50 }),
    version: varchar('version', { length: 50 }),
    fileSize: integer('file_size'),
    filePath: text('file_path'),
    mimeType: varchar('mime_type', { length: 255 }),
    status: varchar('status', { length: 50 }).default('ACTIVE').notNull(),
    cdeStateId: uuid('cde_state_id'),
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('info_containers_tenant_code_idx').on(table.tenantId, table.containerCode),
    index('info_containers_tenant_id_idx').on(table.tenantId),
    index('info_containers_type_idx').on(table.tenantId, table.containerType),
    index('info_containers_status_idx').on(table.tenantId, table.status),
    index('info_containers_cde_state_idx').on(table.cdeStateId),
    index('info_containers_created_by_idx').on(table.createdBy),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type InformationContainer = typeof informationContainers.$inferSelect;
export type NewInformationContainer = typeof informationContainers.$inferInsert;
