import { pgTable, uuid, varchar, text, boolean, timestamp, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const mfaMethodEnum = pgEnum('mfa_method', [
  'TOTP',
  'SMS',
  'EMAIL',
]);

// ── Table ──────────────────────────────────────────────────────────────────────
export const mfaTokens = pgTable(
  'mfa_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    method: mfaMethodEnum('method').notNull(),
    secret: text('secret').notNull(),
    backupCodes: text('backup_codes'),
    isVerified: boolean('is_verified').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('mfa_tokens_user_method_idx').on(table.userId, table.method),
    index('mfa_tokens_user_id_idx').on(table.userId),
    index('mfa_tokens_tenant_id_idx').on(table.tenantId),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type MfaToken = typeof mfaTokens.$inferSelect;
export type NewMfaToken = typeof mfaTokens.$inferInsert;
