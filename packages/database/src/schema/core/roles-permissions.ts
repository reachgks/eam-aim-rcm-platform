import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, index, uniqueIndex, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { users } from './users';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const permissionEnum = pgEnum('permission', [
  // Asset permissions
  'ASSET_CREATE',
  'ASSET_READ',
  'ASSET_UPDATE',
  'ASSET_DELETE',
  'ASSET_DECOMMISSION',
  // Work-order / maintenance permissions
  'WORK_ORDER_CREATE',
  'WORK_ORDER_READ',
  'WORK_ORDER_UPDATE',
  'WORK_ORDER_APPROVE',
  'WORK_ORDER_CLOSE',
  // Inventory permissions
  'INVENTORY_READ',
  'INVENTORY_UPDATE',
  'INVENTORY_ADJUST',
  // Procurement permissions
  'PROCUREMENT_REQUEST',
  'PROCUREMENT_APPROVE',
  'PROCUREMENT_READ',
  // Reports & analytics
  'REPORT_VIEW',
  'REPORT_CREATE',
  'REPORT_EXPORT',
  // Admin permissions
  'ADMIN_USERS',
  'ADMIN_ROLES',
  'ADMIN_SETTINGS',
  'ADMIN_BILLING',
  'ADMIN_INTEGRATIONS',
  // Safety & compliance
  'SAFETY_READ',
  'SAFETY_CREATE',
  'SAFETY_APPROVE',
  // Financial
  'FINANCIAL_READ',
  'FINANCIAL_APPROVE',
]);

// ── Roles ──────────────────────────────────────────────────────────────────────
export const roles = pgTable(
  'roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    permissions: jsonb('permissions').$type<string[]>().default([]).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('roles_tenant_name_idx').on(table.tenantId, table.name),
    index('roles_tenant_id_idx').on(table.tenantId),
  ],
);

// ── Role Assignments (junction) ────────────────────────────────────────────────
export const roleAssignments = pgTable(
  'role_assignments',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.roleId] }),
    index('role_assignments_tenant_id_idx').on(table.tenantId),
    index('role_assignments_user_id_idx').on(table.userId),
    index('role_assignments_role_id_idx').on(table.roleId),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type RoleAssignment = typeof roleAssignments.$inferSelect;
export type NewRoleAssignment = typeof roleAssignments.$inferInsert;
