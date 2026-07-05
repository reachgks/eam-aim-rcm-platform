/**
 * Row-Level Security (RLS) Policy Helpers
 *
 * These helpers generate raw SQL statements to enable tenant isolation
 * at the PostgreSQL level.  They are meant to be executed via Drizzle
 * `sql` template literals or during migration scripts.
 *
 * Usage in a migration:
 *   import { enableRlsForTable, RLS_SET_TENANT } from './rls-policies';
 *   await db.execute(sql.raw(enableRlsForTable('assets')));
 *   await db.execute(sql.raw(RLS_SET_TENANT));
 */

// ── Session variable used by application to set the current tenant ─────────
export const RLS_TENANT_VARIABLE = 'app.current_tenant_id';

/**
 * SQL to set the current tenant id for the session.
 * Call this at the start of every request / connection.
 *
 * @param tenantId – UUID of the tenant
 */
export const setTenantIdSQL = (tenantId: string): string =>
  `SET LOCAL app.current_tenant_id = '${tenantId}';`;

/**
 * SQL to retrieve the current tenant id from the session variable.
 */
export const GET_CURRENT_TENANT_SQL = `current_setting('app.current_tenant_id')::uuid`;

// ── RLS enable / disable helpers ───────────────────────────────────────────

/**
 * Enable RLS on a table.
 */
export const enableRlsForTable = (tableName: string): string =>
  `ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;`;

/**
 * Force RLS even for the table owner (recommended for multi-tenant).
 */
export const forceRlsForTable = (tableName: string): string =>
  `ALTER TABLE "${tableName}" FORCE ROW LEVEL SECURITY;`;

/**
 * Create a tenant isolation SELECT policy.
 */
export const createTenantSelectPolicy = (tableName: string): string =>
  `CREATE POLICY tenant_isolation_select_${tableName}
    ON "${tableName}"
    FOR SELECT
    USING (tenant_id = ${GET_CURRENT_TENANT_SQL});`;

/**
 * Create a tenant isolation INSERT policy.
 */
export const createTenantInsertPolicy = (tableName: string): string =>
  `CREATE POLICY tenant_isolation_insert_${tableName}
    ON "${tableName}"
    FOR INSERT
    WITH CHECK (tenant_id = ${GET_CURRENT_TENANT_SQL});`;

/**
 * Create a tenant isolation UPDATE policy.
 */
export const createTenantUpdatePolicy = (tableName: string): string =>
  `CREATE POLICY tenant_isolation_update_${tableName}
    ON "${tableName}"
    FOR UPDATE
    USING (tenant_id = ${GET_CURRENT_TENANT_SQL})
    WITH CHECK (tenant_id = ${GET_CURRENT_TENANT_SQL});`;

/**
 * Create a tenant isolation DELETE policy.
 */
export const createTenantDeletePolicy = (tableName: string): string =>
  `CREATE POLICY tenant_isolation_delete_${tableName}
    ON "${tableName}"
    FOR DELETE
    USING (tenant_id = ${GET_CURRENT_TENANT_SQL});`;

/**
 * Convenience: apply full tenant isolation (all four CRUD policies + enable + force).
 */
export const applyFullTenantIsolation = (tableName: string): string =>
  [
    enableRlsForTable(tableName),
    forceRlsForTable(tableName),
    createTenantSelectPolicy(tableName),
    createTenantInsertPolicy(tableName),
    createTenantUpdatePolicy(tableName),
    createTenantDeletePolicy(tableName),
  ].join('\n');

/**
 * List of all tables that require tenant isolation.
 * Extend this array as new modules are added.
 */
export const TENANT_ISOLATED_TABLES: string[] = [
  // core
  'users',
  'roles',
  'role_assignments',
  'audit_log',
  // auth
  'sessions',
  'sso_providers',
  'sso_user_mappings',
  'api_keys',
  'mfa_tokens',
  // asset-register
  'assets',
  'asset_types',
  'asset_hierarchy',
  'functional_locations',
  'asset_attributes',
  'asset_lifecycle_events',
  'asset_classifications',
];

/**
 * Generate the full migration SQL to apply RLS to all known tenant-isolated tables.
 */
export const generateFullRlsMigration = (): string =>
  TENANT_ISOLATED_TABLES.map(applyFullTenantIsolation).join('\n\n');
