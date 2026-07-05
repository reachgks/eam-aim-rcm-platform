---
name: 🗄️ Schema Change Request
about: Propose a database schema change for the EAM/AIM platform
title: '[SCHEMA] '
labels: database, schema-change
assignees: ''
---

## Description

<!-- Describe the schema change and why it is needed. -->

## Motivation

<!-- What problem does this schema change solve? Link to related issues or feature requests. -->

Related Issues: #

## Affected Tables

<!-- List all tables that will be created, modified, or dropped. -->

| Table Name | Action | Description |
|------------|--------|-------------|
| `schema.table_name` | CREATE / ALTER / DROP | Brief description |

## Proposed Schema Changes

<!-- Provide the SQL or Drizzle/Prisma schema for the proposed changes. -->

```sql
-- Example: New table
CREATE TABLE asset_management.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES core.tenants(id),
    -- ... columns ...
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Example: RLS Policy
ALTER TABLE asset_management.example ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON asset_management.example
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

## Migration Strategy

<!-- Describe the migration approach -->

- [ ] **Forward Migration**: Schema changes can be applied without downtime
- [ ] **Backward Compatible**: Existing queries will continue to work
- [ ] **Data Migration Required**: Existing data needs transformation
- [ ] **Backfill Required**: New columns need to be populated for existing rows

### Migration Steps

1. Step 1
2. Step 2
3. Step 3

### Rollback Plan

<!-- How to revert this migration if something goes wrong -->

```sql
-- Rollback SQL
```

## Breaking Changes Assessment

<!-- Evaluate the impact of this change -->

- [ ] **No Breaking Changes** - Additive only (new tables/columns)
- [ ] **Minor Breaking Changes** - Column type changes, nullable → not-null
- [ ] **Major Breaking Changes** - Table drops, column removals, constraint changes

### Affected API Endpoints

<!-- List any API endpoints that will need updates -->

| Endpoint | Impact |
|----------|--------|
| `GET /api/v1/...` | Description of impact |

### Affected Queries

<!-- List any known queries or views that will be affected -->

## TimescaleDB Considerations

<!-- Address TimescaleDB-specific impacts -->

- [ ] **Hypertable Changes**: Does this affect any hypertables?
- [ ] **Continuous Aggregates**: Will any continuous aggregates need updating?
- [ ] **Compression Policies**: Do compression policies need modification?
- [ ] **Retention Policies**: Do retention policies need modification?
- [ ] **Chunk Interval**: Does the chunk interval need adjustment?
- [ ] **Not Applicable**: No TimescaleDB-specific impact

### Details

<!-- Provide details on any checked items above -->

## Multi-Tenant Impact

<!-- Assess the impact on multi-tenancy -->

- [ ] **RLS Policies**: New tables have Row Level Security policies
- [ ] **Tenant Isolation**: Data is properly isolated per tenant
- [ ] **Cross-Tenant Queries**: No cross-tenant data leakage possible
- [ ] **Tenant Migration**: Change affects tenant onboarding/offboarding
- [ ] **Shared Tables**: Change affects shared/global tables

### RLS Policy Details

<!-- Describe the RLS policies for new or modified tables -->

```sql
-- RLS policies
```

## Performance Impact

<!-- Assess performance implications -->

- [ ] **Indexes**: Required indexes are defined
- [ ] **Query Performance**: Tested with representative data volumes
- [ ] **Migration Duration**: Estimated time for migration on production data
- [ ] **Lock Duration**: Assessed table lock duration during migration

### Index Definitions

```sql
-- Indexes
```

### Estimated Migration Duration

<!-- How long will this migration take on production? -->

- Estimated rows affected: 
- Estimated duration: 
- Requires maintenance window: Yes / No

## Checklist

- [ ] Schema follows naming conventions (`snake_case`, proper prefixes)
- [ ] All new tables have `tenant_id` column (if tenant-scoped)
- [ ] RLS policies are defined for all new tenant-scoped tables
- [ ] Forward and rollback migrations are tested locally
- [ ] TypeScript types/interfaces are updated
- [ ] API schema (Zod/OpenAPI) is updated
- [ ] Documentation is updated
- [ ] Migration has been tested against a copy of production data
- [ ] Database team has reviewed the change

## Additional Context

<!-- Any other relevant information, diagrams, or references. -->
