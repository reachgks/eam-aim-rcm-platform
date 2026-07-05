import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, index, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';

// ── Enums ──────────────────────────────────────────────────────────────────────
export const ssoProviderTypeEnum = pgEnum('sso_provider_type', [
  'SAML',
  'OIDC',
  'LDAP',
]);

// ── SSO Providers ──────────────────────────────────────────────────────────────
export const ssoProviders = pgTable(
  'sso_providers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    providerType: ssoProviderTypeEnum('provider_type').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    config: jsonb('config').notNull().default({}),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('sso_providers_tenant_id_idx').on(table.tenantId),
    uniqueIndex('sso_providers_tenant_name_idx').on(table.tenantId, table.name),
  ],
);

// ── SSO User Mappings ──────────────────────────────────────────────────────────
export const ssoUserMappings = pgTable(
  'sso_user_mappings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    providerId: uuid('provider_id').notNull().references(() => ssoProviders.id, { onDelete: 'cascade' }),
    externalUserId: varchar('external_user_id', { length: 512 }).notNull(),
    externalEmail: varchar('external_email', { length: 320 }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('sso_user_mappings_provider_external_idx').on(table.providerId, table.externalUserId),
    index('sso_user_mappings_user_id_idx').on(table.userId),
    index('sso_user_mappings_tenant_id_idx').on(table.tenantId),
  ],
);

// ── Types ──────────────────────────────────────────────────────────────────────
export type SsoProvider = typeof ssoProviders.$inferSelect;
export type NewSsoProvider = typeof ssoProviders.$inferInsert;
export type SsoUserMapping = typeof ssoUserMappings.$inferSelect;
export type NewSsoUserMapping = typeof ssoUserMappings.$inferInsert;
