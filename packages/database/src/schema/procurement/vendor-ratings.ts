import { pgTable, uuid, varchar, text, decimal, timestamp, date } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { vendors } from './vendors';
import { users } from '../core/users';

export const vendorRatings = pgTable('vendor_ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  vendorId: uuid('vendor_id').notNull().references(() => vendors.id),
  ratingPeriod: date('rating_period').notNull(),
  qualityScore: decimal('quality_score', { precision: 3, scale: 2 }),
  deliveryScore: decimal('delivery_score', { precision: 3, scale: 2 }),
  priceScore: decimal('price_score', { precision: 3, scale: 2 }),
  serviceScore: decimal('service_score', { precision: 3, scale: 2 }),
  overallScore: decimal('overall_score', { precision: 3, scale: 2 }).notNull(),
  ratedBy: uuid('rated_by').references(() => users.id),
  ratedAt: timestamp('rated_at', { withTimezone: true }).defaultNow(),
  notes: text('notes'),
});

export type VendorRating = typeof vendorRatings.$inferSelect;
export type NewVendorRating = typeof vendorRatings.$inferInsert;
