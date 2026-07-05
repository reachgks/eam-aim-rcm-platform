// TimescaleDB Continuous Aggregate SQL Definitions
// These are applied after hypertable creation in migrations

export const CONTINUOUS_AGGREGATES_SQL = {
  hourly: `
    CREATE MATERIALIZED VIEW IF NOT EXISTS sensor_readings_hourly
    WITH (timescaledb.continuous) AS
    SELECT
      time_bucket('1 hour', time) AS bucket,
      sensor_id,
      tenant_id,
      AVG(value) AS avg_value,
      MIN(value) AS min_value,
      MAX(value) AS max_value,
      STDDEV(value) AS std_dev,
      COUNT(*) AS sample_count
    FROM sensor_readings
    GROUP BY bucket, sensor_id, tenant_id
    WITH NO DATA;
  `,

  daily: `
    CREATE MATERIALIZED VIEW IF NOT EXISTS sensor_readings_daily
    WITH (timescaledb.continuous) AS
    SELECT
      time_bucket('1 day', time) AS bucket,
      sensor_id,
      tenant_id,
      AVG(value) AS avg_value,
      MIN(value) AS min_value,
      MAX(value) AS max_value,
      STDDEV(value) AS std_dev,
      COUNT(*) AS sample_count
    FROM sensor_readings
    GROUP BY bucket, sensor_id, tenant_id
    WITH NO DATA;
  `,

  weekly: `
    CREATE MATERIALIZED VIEW IF NOT EXISTS sensor_readings_weekly
    WITH (timescaledb.continuous) AS
    SELECT
      time_bucket('1 week', time) AS bucket,
      sensor_id,
      tenant_id,
      AVG(value) AS avg_value,
      MIN(value) AS min_value,
      MAX(value) AS max_value,
      COUNT(*) AS sample_count
    FROM sensor_readings
    GROUP BY bucket, sensor_id, tenant_id
    WITH NO DATA;
  `,

  refreshPolicies: `
    SELECT add_continuous_aggregate_policy('sensor_readings_hourly',
      start_offset => INTERVAL '3 hours',
      end_offset => INTERVAL '1 hour',
      schedule_interval => INTERVAL '1 hour',
      if_not_exists => TRUE);

    SELECT add_continuous_aggregate_policy('sensor_readings_daily',
      start_offset => INTERVAL '3 days',
      end_offset => INTERVAL '1 day',
      schedule_interval => INTERVAL '1 day',
      if_not_exists => TRUE);

    SELECT add_continuous_aggregate_policy('sensor_readings_weekly',
      start_offset => INTERVAL '3 weeks',
      end_offset => INTERVAL '1 week',
      schedule_interval => INTERVAL '1 week',
      if_not_exists => TRUE);
  `,

  retentionPolicies: `
    SELECT add_retention_policy('sensor_readings', INTERVAL '90 days', if_not_exists => TRUE);
    SELECT add_retention_policy('sensor_readings_hourly', INTERVAL '1 year', if_not_exists => TRUE);
    SELECT add_retention_policy('sensor_readings_daily', INTERVAL '5 years', if_not_exists => TRUE);
  `,
};
