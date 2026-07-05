import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index';

// ── Connection Pool ──
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_MAX || '20', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || '5000', 10),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

// ── Drizzle ORM Instance ──
export const db = drizzle(pool, {
  schema,
  logger: process.env.DB_LOGGING === 'true',
});

// ── Pool Event Handlers ──
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

pool.on('connect', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📦 New database connection established');
  }
});

// ── Tenant RLS Context Helper ──
// Call this at the start of each request to enable Row Level Security
export async function setTenantContext(tenantId: string): Promise<void> {
  await pool.query(`SET app.current_tenant_id = '${tenantId}'`);
}

export async function clearTenantContext(): Promise<void> {
  await pool.query(`RESET app.current_tenant_id`);
}

// ── Health Check ──
export async function checkDatabaseHealth(): Promise<{ connected: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    await pool.query('SELECT 1');
    return { connected: true, latencyMs: Date.now() - start };
  } catch {
    return { connected: false, latencyMs: Date.now() - start };
  }
}

// ── Graceful Shutdown ──
export async function closeDatabaseConnection(): Promise<void> {
  await pool.end();
  console.log('Database connection pool closed');
}

// ── Re-export pool for raw queries (migrations, seeds, etc.) ──
export { pool };

// ── Types ──
export type Database = typeof db;
