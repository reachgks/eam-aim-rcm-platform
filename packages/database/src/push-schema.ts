import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import * as schema from './schema/index';

async function pushSchema() {
  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://eam_user:eam_secret@localhost:5432/eam_platform';
  console.log('🔄 Connecting to database...');
  
  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    // Test connection
    const result = await pool.query('SELECT current_database(), version()');
    console.log(`✅ Connected to: ${result.rows[0].current_database}`);
    console.log(`   PostgreSQL: ${result.rows[0].version.split(',')[0]}`);

    // Enable required extensions
    console.log('🔧 Enabling extensions...');
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    
    // Try to run drizzle-kit push programmatically via shell
    console.log('📦 Pushing schema via drizzle-kit...');
    
    const { execSync } = require('child_process');
    const drizzleKitBin = require.resolve('drizzle-kit/bin.cjs');
    
    execSync(
      `node "${drizzleKitBin}" push --force`,
      { 
        cwd: process.cwd(),
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL }
      }
    );

    console.log('✅ Schema pushed successfully!');
    
    // Show table count
    const tables = await pool.query(`
      SELECT count(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    console.log(`📊 Total tables in database: ${tables.rows[0].count}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    
    // Fallback: just check if we can at least connect
    try {
      const tables = await pool.query(`
        SELECT count(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      `);
      console.log(`📊 Current tables in database: ${tables.rows[0].count}`);
    } catch(e) {}
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

pushSchema();
