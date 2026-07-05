import { pgTable, uuid, varchar, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { users } from '../core/users';
import { assets } from '../asset-register/assets';

export const srPriorityEnum = pgEnum('sr_priority', ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
export const srStatusEnum = pgEnum('sr_status', [
  'NEW', 'TRIAGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'
]);

export const serviceRequests = pgTable('service_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  requestNumber: varchar('request_number', { length: 30 }).notNull(),
  requestedBy: uuid('requested_by').notNull().references(() => users.id),
  assetId: uuid('asset_id').references(() => assets.id),
  locationId: uuid('location_id'),
  categoryId: uuid('category_id'),
  priority: srPriorityEnum('sr_priority').default('MEDIUM'),
  status: srStatusEnum('sr_status').default('NEW'),
  subject: varchar('subject', { length: 200 }).notNull(),
  description: text('description'),
  workOrderId: uuid('work_order_id'),
  assignedTo: uuid('assigned_to').references(() => users.id),
  respondedAt: timestamp('responded_at', { withTimezone: true }),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  rating: integer('rating'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type NewServiceRequest = typeof serviceRequests.$inferInsert;
