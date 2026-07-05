import { pgTable, uuid, varchar, text, timestamp, jsonb, index, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { users } from './users';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const auditActionEnum = pgEnum('audit_action', [
  'CREATE',
  'UPDATE',
  'DELETE',
  'ARCHIVE',
  'RESTORE',
  'LOGIN',
  'LOGOUT',
  'EXPORT',
  'IMPORT',
  'APPROVE',
  'REJECT',
  'STATUS_CHANGE',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: auditActionEnum('action').notNull(),
    entityType: varchar('entity_type', { length: 100 }).notNull(),
    entityId: uuid('entity_id'),
    oldValues: jsonb('old_values'),
    newValues: jsonb('new_values'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('audit_log_tenant_id_idx').on(table.tenantId),
    index('audit_log_tenant_entity_idx').on(table.tenantId, table.entityType, table.entityId),
    index('audit_log_tenant_user_idx').on(table.tenantId, table.userId),
    index('audit_log_tenant_action_idx').on(table.tenantId, table.action),
    index('audit_log_created_at_idx').on(table.tenantId, table.createdAt),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
