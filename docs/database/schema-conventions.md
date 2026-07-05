# Database Schema Conventions

## Naming Standards

| Element | Convention | Example |
|---------|-----------|---------|
| Table | `snake_case`, plural | `work_orders` |
| Column | `snake_case` | `tenant_id`, `created_at` |
| Primary Key | `id` (UUID v4) | `uuid('id').primaryKey().defaultRandom()` |
| Foreign Key | `referenced_table_id` | `asset_id`, `user_id` |
| Enum | `pgEnum`, `snake_case` name | `pgEnum('wo_status', [...])` |
| Index | `table_column_idx` | `work_orders_asset_idx` |
| Unique | `table_columns_unique_idx` | `assets_tenant_tag_unique_idx` |

## Required Columns (Every Table)

```typescript
id: uuid('id').primaryKey().defaultRandom(),
tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
```

## Optional Standard Columns

```typescript
updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
isActive: boolean('is_active').default(true),
```

## Data Types

| Use Case | Drizzle Type |
|----------|-------------|
| Identifiers | `uuid` |
| Short text (<300 chars) | `varchar` with max length |
| Long text | `text` |
| Money/quantities | `decimal(15,2)` |
| Rates/percentages | `decimal(6,4)` |
| Booleans | `boolean` |
| Timestamps | `timestamp` with timezone |
| Dates (no time) | `date` |
| Semi-structured | `jsonb` |
| Enumerations | `pgEnum` |

## TimescaleDB Tables

Sensor readings use hypertables:
```sql
SELECT create_hypertable('sensor_readings', 'time', if_not_exists => TRUE);
```
