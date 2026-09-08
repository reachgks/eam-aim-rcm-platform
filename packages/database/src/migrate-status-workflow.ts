import pg from 'pg';

const client = new pg.Client('postgresql://eam_user:eam_secret@localhost:5432/eam_platform');

async function migrate() {
  await client.connect();
  console.log('Connected to database');

  try {
    // Add INSTALLED to asset_status enum
    try {
      await client.query("ALTER TYPE asset_status ADD VALUE IF NOT EXISTS 'INSTALLED' BEFORE 'ACTIVE'");
      console.log('✅ Added INSTALLED to asset_status enum');
    } catch (e: any) {
      console.log('ℹ️  INSTALLED already exists or:', e.message);
    }

    // Add approval_type column
    await client.query(`
      ALTER TABLE asset_approvals ADD COLUMN IF NOT EXISTS approval_type varchar(50) DEFAULT 'CREATION'
    `);
    console.log('✅ Added approval_type column');

    // Add requested_status column
    await client.query(`
      ALTER TABLE asset_approvals ADD COLUMN IF NOT EXISTS requested_status varchar(50)
    `);
    console.log('✅ Added requested_status column');

    // Add previous_status column
    await client.query(`
      ALTER TABLE asset_approvals ADD COLUMN IF NOT EXISTS previous_status varchar(50)
    `);
    console.log('✅ Added previous_status column');

    // Add requested_by column
    await client.query(`
      ALTER TABLE asset_approvals ADD COLUMN IF NOT EXISTS requested_by uuid
    `);
    console.log('✅ Added requested_by column');

    // Create index on approval_type
    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_asset_approvals_type ON asset_approvals(tenant_id, approval_type)
      `);
      console.log('✅ Created approval_type index');
    } catch (e: any) {
      console.log('ℹ️  Index already exists:', e.message);
    }

    console.log('\n✅ Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
