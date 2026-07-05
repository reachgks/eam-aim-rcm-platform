import { pgTable, uuid, decimal, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';

// NOTE: This table is a TimescaleDB hypertable.
// After migration, run: SELECT create_hypertable('sensor_readings', 'time', if_not_exists => TRUE);
export const qualityEnum = pgEnum('reading_quality', ['GOOD', 'BAD', 'UNCERTAIN', 'SUBSTITUTED']);

export const sensorReadings = pgTable('sensor_readings', {
  time: timestamp('time', { withTimezone: true }).notNull(),
  sensorId: uuid('sensor_id').notNull(),
  tenantId: uuid('tenant_id').notNull(),
  value: decimal('value', { precision: 20, scale: 6 }).notNull(),
  quality: qualityEnum('quality').default('GOOD'),
  rawValue: decimal('raw_value', { precision: 20, scale: 6 }),
});

export type SensorReading = typeof sensorReadings.$inferSelect;
