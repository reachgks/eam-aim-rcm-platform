import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, closeDatabaseConnection } from './client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const migrationsFolder = path.resolve(__dirname, '..', 'drizzle');
  console.log('🔄 Running database migrations...');
  console.log(`   Migrations folder: ${migrationsFolder}`);

  try {
    await migrate(db, { migrationsFolder });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await closeDatabaseConnection();
  }
}

runMigrations();
