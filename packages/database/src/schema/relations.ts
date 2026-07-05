/**
 * Drizzle ORM Relations
 *
 * Defines all relationship mappings for the core, auth, and asset-register modules.
 * Import this file alongside your schema to enable Drizzle's relational query API.
 */
import { relations } from 'drizzle-orm';

// ── Core ───────────────────────────────────────────────────────────────────────
import { tenants } from './core/tenants';
import { users } from './core/users';
import { roles, roleAssignments } from './core/roles-permissions';
import { auditLog } from './core/audit-log';

// ── Auth ───────────────────────────────────────────────────────────────────────
import { sessions } from './auth/sessions';
import { ssoProviders, ssoUserMappings } from './auth/sso-providers';
import { apiKeys } from './auth/api-keys';
import { mfaTokens } from './auth/mfa-tokens';

// ── Asset Register ─────────────────────────────────────────────────────────────
import { assets } from './asset-register/assets';
import { assetTypes } from './asset-register/asset-types';
import { assetHierarchy } from './asset-register/asset-hierarchy';
import { functionalLocations } from './asset-register/functional-locations';
import { assetAttributes } from './asset-register/asset-attributes';
import { assetLifecycleEvents } from './asset-register/asset-lifecycle';
import { assetClassifications } from './asset-register/asset-classification';

// ═══════════════════════════════════════════════════════════════════════════════
//  CORE MODULE RELATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  roles: many(roles),
  roleAssignments: many(roleAssignments),
  auditLogs: many(auditLog),
  sessions: many(sessions),
  ssoProviders: many(ssoProviders),
  ssoUserMappings: many(ssoUserMappings),
  apiKeys: many(apiKeys),
  mfaTokens: many(mfaTokens),
  assets: many(assets),
  assetTypes: many(assetTypes),
  assetHierarchies: many(assetHierarchy),
  functionalLocations: many(functionalLocations),
  assetAttributes: many(assetAttributes),
  assetLifecycleEvents: many(assetLifecycleEvents),
  assetClassifications: many(assetClassifications),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  roleAssignments: many(roleAssignments),
  sessions: many(sessions),
  ssoMappings: many(ssoUserMappings),
  mfaTokens: many(mfaTokens),
  auditLogs: many(auditLog),
  createdApiKeys: many(apiKeys),
  performedLifecycleEvents: many(assetLifecycleEvents),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [roles.tenantId],
    references: [tenants.id],
  }),
  assignments: many(roleAssignments),
}));

export const roleAssignmentsRelations = relations(roleAssignments, ({ one }) => ({
  tenant: one(tenants, {
    fields: [roleAssignments.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [roleAssignments.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [roleAssignments.roleId],
    references: [roles.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  tenant: one(tenants, {
    fields: [auditLog.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}));

// ═══════════════════════════════════════════════════════════════════════════════
//  AUTH MODULE RELATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [sessions.tenantId],
    references: [tenants.id],
  }),
}));

export const ssoProvidersRelations = relations(ssoProviders, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [ssoProviders.tenantId],
    references: [tenants.id],
  }),
  userMappings: many(ssoUserMappings),
}));

export const ssoUserMappingsRelations = relations(ssoUserMappings, ({ one }) => ({
  tenant: one(tenants, {
    fields: [ssoUserMappings.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [ssoUserMappings.userId],
    references: [users.id],
  }),
  provider: one(ssoProviders, {
    fields: [ssoUserMappings.providerId],
    references: [ssoProviders.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  tenant: one(tenants, {
    fields: [apiKeys.tenantId],
    references: [tenants.id],
  }),
  createdBy: one(users, {
    fields: [apiKeys.createdBy],
    references: [users.id],
  }),
}));

export const mfaTokensRelations = relations(mfaTokens, ({ one }) => ({
  user: one(users, {
    fields: [mfaTokens.userId],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [mfaTokens.tenantId],
    references: [tenants.id],
  }),
}));

// ═══════════════════════════════════════════════════════════════════════════════
//  ASSET REGISTER MODULE RELATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const assetsRelations = relations(assets, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [assets.tenantId],
    references: [tenants.id],
  }),
  assetType: one(assetTypes, {
    fields: [assets.assetTypeId],
    references: [assetTypes.id],
  }),
  parentAsset: one(assets, {
    fields: [assets.parentAssetId],
    references: [assets.id],
    relationName: 'parentChild',
  }),
  childAssets: many(assets, { relationName: 'parentChild' }),
  functionalLocation: one(functionalLocations, {
    fields: [assets.functionalLocationId],
    references: [functionalLocations.id],
  }),
  attributes: many(assetAttributes),
  lifecycleEvents: many(assetLifecycleEvents),
  classifications: many(assetClassifications),
  parentHierarchies: many(assetHierarchy, { relationName: 'childInHierarchy' }),
  childHierarchies: many(assetHierarchy, { relationName: 'parentInHierarchy' }),
}));

export const assetTypesRelations = relations(assetTypes, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [assetTypes.tenantId],
    references: [tenants.id],
  }),
  parentType: one(assetTypes, {
    fields: [assetTypes.parentTypeId],
    references: [assetTypes.id],
    relationName: 'typeHierarchy',
  }),
  childTypes: many(assetTypes, { relationName: 'typeHierarchy' }),
  assets: many(assets),
}));

export const assetHierarchyRelations = relations(assetHierarchy, ({ one }) => ({
  tenant: one(tenants, {
    fields: [assetHierarchy.tenantId],
    references: [tenants.id],
  }),
  parentAsset: one(assets, {
    fields: [assetHierarchy.parentAssetId],
    references: [assets.id],
    relationName: 'parentInHierarchy',
  }),
  childAsset: one(assets, {
    fields: [assetHierarchy.childAssetId],
    references: [assets.id],
    relationName: 'childInHierarchy',
  }),
}));

export const functionalLocationsRelations = relations(functionalLocations, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [functionalLocations.tenantId],
    references: [tenants.id],
  }),
  parentLocation: one(functionalLocations, {
    fields: [functionalLocations.parentId],
    references: [functionalLocations.id],
    relationName: 'locationHierarchy',
  }),
  childLocations: many(functionalLocations, { relationName: 'locationHierarchy' }),
  assets: many(assets),
}));

export const assetAttributesRelations = relations(assetAttributes, ({ one }) => ({
  tenant: one(tenants, {
    fields: [assetAttributes.tenantId],
    references: [tenants.id],
  }),
  asset: one(assets, {
    fields: [assetAttributes.assetId],
    references: [assets.id],
  }),
}));

export const assetLifecycleEventsRelations = relations(assetLifecycleEvents, ({ one }) => ({
  tenant: one(tenants, {
    fields: [assetLifecycleEvents.tenantId],
    references: [tenants.id],
  }),
  asset: one(assets, {
    fields: [assetLifecycleEvents.assetId],
    references: [assets.id],
  }),
  performer: one(users, {
    fields: [assetLifecycleEvents.performedBy],
    references: [users.id],
  }),
}));

export const assetClassificationsRelations = relations(assetClassifications, ({ one }) => ({
  tenant: one(tenants, {
    fields: [assetClassifications.tenantId],
    references: [tenants.id],
  }),
  asset: one(assets, {
    fields: [assetClassifications.assetId],
    references: [assets.id],
  }),
}));
