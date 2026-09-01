import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  // Check users table columns
  const { rows: cols } = await pool.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position"
  );
  console.log('=== Users Table Columns ===');
  cols.forEach(c => console.log(`  ${c.column_name} : ${c.data_type}`));

  // Try the exact query the auth service runs
  console.log('\n=== Direct Login Query ===');
  try {
    const { rows } = await pool.query(
      `SELECT "id", "tenant_id", "email", "password_hash", "first_name", "last_name", "role", "is_active", "last_login_at", "created_at", "updated_at" FROM "users" WHERE "users"."email" = $1 AND "users"."is_active" = $2 LIMIT 1`,
      ['admin@acme.com', true]
    );
    console.log('Query result rows:', rows.length);
    if (rows.length > 0) console.log('User found:', rows[0].email, rows[0].role);
  } catch (e: any) {
    console.error('Query FAILED:', e.message);
  }

  await pool.end();
}

check().catch(e => { console.error(e); process.exit(1); });
