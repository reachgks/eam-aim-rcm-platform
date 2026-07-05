import { pgTable, uuid, varchar, text, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';

export const packageTypeEnum = pgEnum('task_package_type', ['INTERVAL_BASED', 'TRADE_BASED', 'ROUTE_BASED', 'SHUTDOWN']);

export const taskPackages = pgTable('task_packages', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  packageType: packageTypeEnum('package_type').notNull(),
  intervalDays: integer('interval_days'),
  craftId: uuid('craft_id'),
  routeId: uuid('route_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const taskPackageItems = pgTable('task_package_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  packageId: uuid('package_id').notNull().references(() => taskPackages.id),
  maintenanceTaskId: uuid('maintenance_task_id'),
  rcmDecisionId: uuid('rcm_decision_id'),
  sequence: integer('sequence').notNull(),
  estimatedMinutes: integer('estimated_minutes'),
});

export type TaskPackage = typeof taskPackages.$inferSelect;
export type TaskPackageItem = typeof taskPackageItems.$inferSelect;
