# Data Flow Architecture

## Request Flow

```
Client Request
    │
    ▼
┌─────────────────┐
│ CORS Middleware  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ JWT Auth Verify  │──→ 401 Unauthorized
└────────┬────────┘
         ▼
┌─────────────────┐
│ Tenant Context   │──→ Sets app.current_tenant_id
└────────┬────────┘
         ▼
┌─────────────────┐
│ RBAC Check       │──→ 403 Forbidden
└────────┬────────┘
         ▼
┌─────────────────┐
│ Zod Validation   │──→ 400 Bad Request
└────────┬────────┘
         ▼
┌─────────────────┐
│ Route Handler    │
│  → Service Layer │
│  → Drizzle ORM   │
│  → PostgreSQL    │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Audit Trail Hook │──→ audit_log table
└────────┬────────┘
         ▼
    API Response
```

## Telemetry Data Flow

```
IoT Sensor → MQTT Broker (Mosquitto)
                  │
                  ▼
          Telemetry Ingestion Service
                  │
          ┌───────┴───────┐
          ▼               ▼
    HTTP Batch       MQTT Subscribe
    Endpoint         (topics/+/sensors/+)
          │               │
          └───────┬───────┘
                  ▼
            Buffer Pool
          (in-memory batch)
                  │
        ┌─────── │ ────────┐
        ▼        ▼         ▼
   size >= N   timer    flush()
   threshold   fires
        │        │         │
        └────────┼─────────┘
                 ▼
          Batch INSERT
          sensor_readings (hypertable)
                 │
          ┌──────┴──────┐
          ▼              ▼
    Continuous       Alert Engine
    Aggregates       (threshold check)
    (hourly/daily)        │
                          ▼
                   telemetry_events
                   + Notification
```

## CDE State Machine

```
   WORK_IN_PROGRESS ──→ SHARED ──→ PUBLISHED ──→ ARCHIVED
          │                │             │
          ▼                ▼             ▼
       (Reject)        (Reject)     (Withdraw)
          │                │             │
          └────────────────┴─────────────┘
                           │
                    WORK_IN_PROGRESS
```

## Cost Rollup Flow

```
work_orders (actual_cost)
labor_bookings (hours × rate)      ──→  cost_transactions
spare_parts_usage (qty × unit_cost)          │
contract_line_items (amount)                 ▼
depreciation_schedule (period_amount) → asset_cost_rollup
                                        (per asset, per period)
                                             │
                                             ▼
                                    Hierarchy rollup
                                    (child → parent)
```
