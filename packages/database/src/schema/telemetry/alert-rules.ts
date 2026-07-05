import { pgTable, uuid, varchar, integer, boolean, jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { sensorRegistry } from './sensor-registry';

export const alertRuleTypeEnum = pgEnum('alert_rule_type', ['THRESHOLD', 'RATE_OF_CHANGE', 'ANOMALY', 'PATTERN']);

export const alertRules = pgTable('alert_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  sensorId: uuid('sensor_id').notNull().references(() => sensorRegistry.id),
  name: varchar('name', { length: 200 }).notNull(),
  ruleType: alertRuleTypeEnum('rule_type').notNull(),
  condition: jsonb('condition').notNull(),
  severity: varchar('severity', { length: 20 }).notNull(),
  isActive: boolean('is_active').default(true),
  notificationChannels: jsonb('notification_channels'),
  cooldownMinutes: integer('cooldown_minutes').default(15),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type AlertRule = typeof alertRules.$inferSelect;
