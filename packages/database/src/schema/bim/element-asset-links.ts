import { pgTable, uuid, varchar, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { ifcElements } from './ifc-elements';
import { assets } from '../asset-register/assets';
import { users } from '../core/users';

export const linkTypeEnum = pgEnum('element_link_type', ['PRIMARY', 'SECONDARY', 'REFERENCE']);

export const elementAssetLinks = pgTable('element_asset_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  ifcElementId: uuid('ifc_element_id').notNull().references(() => ifcElements.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  linkType: linkTypeEnum('link_type').default('PRIMARY'),
  linkedBy: uuid('linked_by').references(() => users.id),
  linkedAt: timestamp('linked_at', { withTimezone: true }).defaultNow(),
  isActive: boolean('is_active').default(true),
});

export type ElementAssetLink = typeof elementAssetLinks.$inferSelect;
