import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, closeDatabaseConnection } from './client';

async function runMigrations() {
  console.log('🔄 Running database migrations...');

  try {
    await migrate(db, { migrationsFolder: '../drizzle' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await closeDatabaseConnection();
  }
}

runMigrations();
