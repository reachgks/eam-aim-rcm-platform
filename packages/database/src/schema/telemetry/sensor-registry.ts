import { pgTable, uuid, varchar, decimal, boolean, date, timestamp, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { tenants } from '../core/tenants';
import { assets } from '../asset-register/assets';

export const sensorTypeEnum = pgEnum('sensor_type', [
  'TEMPERATURE', 'PRESSURE', 'VIBRATION', 'FLOW', 'LEVEL',
  'SPEED', 'CURRENT', 'VOLTAGE', 'HUMIDITY', 'CUSTOM'
]);

export const sensorRegistry = pgTable('sensor_registry', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  sensorCode: varchar('sensor_code', { length: 50 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  sensorType: sensorTypeEnum('sensor_type').notNull(),
  unit: varchar('unit', { length: 20 }),
  minValue: decimal('min_value', { precision: 15, scale: 4 }),
  maxValue: decimal('max_value', { precision: 15, scale: 4 }),
  alarmLow: decimal('alarm_low', { precision: 15, scale: 4 }),
  alarmHigh: decimal('alarm_high', { precision: 15, scale: 4 }),
  warningLow: decimal('warning_low', { precision: 15, scale: 4 }),
  warningHigh: decimal('warning_high', { precision: 15, scale: 4 }),
  isActive: boolean('is_active').default(true),
  installedAt: date('installed_at'),
  calibrationDate: date('calibration_date'),
  nextCalibrationDate: date('next_calibration_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueSensorCode: uniqueIndex('sensor_tenant_code_idx').on(table.tenantId, table.sensorCode),
}));

export type SensorRegistryEntry = typeof sensorRegistry.$inferSelect;
