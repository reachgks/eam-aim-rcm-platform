import { pgTable, uuid, text, boolean } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { complianceRequirements } from './compliance-requirements';
import { assets } from '../asset-register/assets';

export const requirementAssetMap = pgTable('requirement_asset_map', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  requirementId: uuid('requirement_id').notNull().references(() => complianceRequirements.id),
  assetId: uuid('asset_id').references(() => assets.id),
  assetTypeId: uuid('asset_type_id'),
  applicabilityNotes: text('applicability_notes'),
  isActive: boolean('is_active').default(true),
});

export type RequirementAssetMap = typeof requirementAssetMap.$inferSelect;
