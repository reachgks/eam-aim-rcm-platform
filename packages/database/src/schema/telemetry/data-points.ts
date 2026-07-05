import { pgTable, uuid, decimal, integer, timestamp } from 'drizzle-orm/pg-core';

// NOTE: This is a TimescaleDB continuous aggregate materialized from sensor_readings
export const dataPoints = pgTable('data_points', {
  time: timestamp('time', { withTimezone: true }).notNull(),
  tenantId: uuid('tenant_id').notNull(),
  sensorId: uuid('sensor_id').notNull(),
  avgValue: decimal('avg_value', { precision: 20, scale: 6 }),
  minValue: decimal('min_value', { precision: 20, scale: 6 }),
  maxValue: decimal('max_value', { precision: 20, scale: 6 }),
  stdDev: decimal('std_dev', { precision: 20, scale: 6 }),
  sampleCount: integer('sample_count'),
});

export type DataPoint = typeof dataPoints.$inferSelect;
