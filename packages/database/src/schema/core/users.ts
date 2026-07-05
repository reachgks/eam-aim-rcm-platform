import { pgTable, uuid, varchar, text, boolean, timestamp, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum('user_role', [
  'SUPER_ADMIN',
  'TENANT_ADMIN',
  'MANAGER',
  'ENGINEER',
  'TECHNICIAN',
  'OPERATOR',
  'VIEWER',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 320 }).notNull(),
    passwordHash: text('password_hash'),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    role: userRoleEnum('role').default('VIEWER').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('users_tenant_email_idx').on(table.tenantId, table.email),
    index('users_tenant_id_idx').on(table.tenantId),
    index('users_role_idx').on(table.tenantId, table.role),
    index('users_is_active_idx').on(table.tenantId, table.isActive),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
