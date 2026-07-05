import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { serviceRequests } from './service-requests';
import { users } from '../core/users';

export const requestComments = pgTable('request_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  serviceRequestId: uuid('service_request_id').notNull().references(() => serviceRequests.id),
  commentBy: uuid('comment_by').notNull().references(() => users.id),
  commentText: text('comment_text').notNull(),
  isInternal: boolean('is_internal').default(false),
  attachmentId: uuid('attachment_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type RequestComment = typeof requestComments.$inferSelect;
