import { pgTable, uuid, varchar, decimal, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { alertRules } from './alert-rules';
import { sensorRegistry } from './sensor-registry';
import { users } from '../core/users';

export const alertHistory = pgTable('alert_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  alertRuleId: uuid('alert_rule_id').notNull().references(() => alertRules.id),
  sensorId: uuid('sensor_id').notNull().references(() => sensorRegistry.id),
  triggeredAt: timestamp('triggered_at', { withTimezone: true }).defaultNow(),
  triggerValue: decimal('trigger_value', { precision: 20, scale: 6 }),
  severity: varchar('severity', { length: 20 }).notNull(),
  message: varchar('message', { length: 500 }),
  acknowledgedBy: uuid('acknowledged_by').references(() => users.id),
  acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  workOrderId: uuid('work_order_id'),
});

export type AlertHistoryEntry = typeof alertHistory.$inferSelect;
