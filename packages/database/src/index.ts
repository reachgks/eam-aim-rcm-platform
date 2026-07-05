// ══════════════════════════════════════════════
// @eamaim/database — Public API
// ══════════════════════════════════════════════

// Database client & connection
export {
  db,
  pool,
  setTenantContext,
  clearTenantContext,
  checkDatabaseHealth,
  closeDatabaseConnection,
} from './client';
export type { Database } from './client';

// All schema tables & types
export * from './schema/index';
