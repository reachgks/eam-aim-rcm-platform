import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    // Get tenant
    const { rows: tenants } = await client.query('SELECT id FROM tenants LIMIT 1');
    if (tenants.length === 0) { console.log('No tenant found'); return; }
    const tenantId = tenants[0].id;
    console.log('Tenant:', tenantId);

    // Get assets
    const { rows: assets } = await client.query(
      `SELECT id, name, tag_number, functional_location_id FROM assets WHERE tenant_id = $1 LIMIT 10`, [tenantId]
    );
    console.log('Assets found:', assets.length);

    // Get locations
    const { rows: locations } = await client.query(
      `SELECT id, name, location_type FROM functional_locations WHERE tenant_id = $1 LIMIT 10`, [tenantId]
    );
    console.log('Locations found:', locations.length);

    // Get user
    const { rows: users } = await client.query(
      `SELECT id FROM users WHERE tenant_id = $1 LIMIT 1`, [tenantId]
    );
    const userId = users.length > 0 ? users[0].id : null;

    if (assets.length === 0) {
      console.log('No assets found - skipping seed');
      return;
    }

    const plants = locations.filter(l => l.location_type === 'SITE');
    const sections = locations.filter(l => ['BUILDING', 'ZONE', 'FLOOR', 'ROOM'].includes(l.location_type));
    const plantName = plants.length > 0 ? plants[0].name : 'Main Plant';
    const sectionNames = sections.length > 0 ? sections.map(s => s.name) : ['Section A', 'Section B', 'Section C'];

    // --- Seed Risk Assessments ---
    console.log('\n--- Seeding Risk Assessments ---');
    const riskLevels = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    for (let i = 0; i < Math.min(assets.length, 8); i++) {
      const asset = assets[i];
      const score = Math.round(Math.random() * 100);
      const level = score > 80 ? 'CRITICAL' : score > 60 ? 'HIGH' : score > 40 ? 'MEDIUM' : 'LOW';
      const crit = Math.round(Math.random() * 100);
      const fail = Math.round(Math.random() * 100);
      const fmea = Math.round(Math.random() * 100);
      const maint = Math.round(Math.random() * 100);
      const sensor = Math.round(Math.random() * 100);

      await client.query(
        `INSERT INTO risk_assessments (tenant_id, asset_id, risk_score, risk_level, criticality_component, failure_component, fmea_component, maintenance_component, sensor_component, assessed_by, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT DO NOTHING`,
        [tenantId, asset.id, score, level, crit, fail, fmea, maint, sensor, userId,
         `Auto-generated risk assessment for ${asset.name}`]
      );
      console.log(`  Risk: ${asset.name} → ${level} (${score})`);
    }

    // --- Seed Risk Mitigations ---
    console.log('\n--- Seeding Risk Mitigations ---');
    const mitigTypes = ['PREVENTIVE', 'DETECTIVE', 'CORRECTIVE', 'REDESIGN'];
    const mitigStatuses = ['PLANNED', 'IN_PROGRESS', 'COMPLETED'];
    for (let i = 0; i < Math.min(assets.length, 5); i++) {
      const asset = assets[i];
      const mType = mitigTypes[i % mitigTypes.length];
      const mStatus = mitigStatuses[i % mitigStatuses.length];
      await client.query(
        `INSERT INTO risk_mitigations (tenant_id, asset_id, mitigation_type, description, mitigation_status, assigned_to)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [tenantId, asset.id, mType,
         `${mType} mitigation for ${asset.name}: Replace worn components and implement condition monitoring`,
         mStatus, userId]
      );
      console.log(`  Mitigation: ${asset.name} → ${mType} (${mStatus})`);
    }

    // --- Seed Shift Log Entries ---
    console.log('\n--- Seeding Shift Log Entries ---');
    const shifts = ['MORNING', 'AFTERNOON', 'NIGHT'];
    const logTypes = ['BREAKDOWN', 'PREVENTIVE', 'SCHEDULED', 'INSPECTION', 'EMERGENCY'];
    const logStatuses = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'DEFERRED'];
    const techNames = ['Rajesh Kumar', 'Amit Singh', 'Priya Sharma', 'Sunil Verma', 'Deepak Joshi'];
    const descriptions = {
      BREAKDOWN: [
        'Motor bearing failure causing excessive vibration',
        'Conveyor belt snapped during operation',
        'Hydraulic pump seal leak detected',
        'Electrical panel tripped due to overload',
        'Gearbox noise and overheating reported',
      ],
      PREVENTIVE: [
        'Scheduled lubrication of all bearings',
        'Filter replacement and cleaning',
        'Belt tension adjustment and alignment check',
        'Oil level check and top-up',
        'Electrical connections tightened',
      ],
      SCHEDULED: [
        'Annual overhaul of compressor unit',
        'Planned replacement of wear plates',
        'Calibration of pressure gauges',
        'Foundation bolt torquing',
        'Complete cleaning and inspection',
      ],
      INSPECTION: [
        'Visual inspection of structural integrity',
        'Thermography scan completed',
        'Vibration analysis reading taken',
        'Ultrasonic thickness measurement',
        'Safety guard inspection',
      ],
      EMERGENCY: [
        'Steam leak causing safety hazard - isolated and repaired',
        'Fire alarm triggered - investigated and reset',
        'Chemical spill containment and cleanup',
      ],
    };

    // Generate entries for past 14 days
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      const shiftDate = date.toISOString().split('T')[0];

      // 2-4 entries per day
      const entriesPerDay = 2 + Math.floor(Math.random() * 3);
      for (let j = 0; j < entriesPerDay; j++) {
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const shift = shifts[Math.floor(Math.random() * shifts.length)];
        const logType = logTypes[Math.floor(Math.random() * logTypes.length)];
        const status = logStatuses[Math.floor(Math.random() * logStatuses.length)];
        const tech = techNames[Math.floor(Math.random() * techNames.length)];
        const section = sectionNames[Math.floor(Math.random() * sectionNames.length)];
        const descList = descriptions[logType] || descriptions.INSPECTION;
        const desc = descList[Math.floor(Math.random() * descList.length)];
        const downtime = logType === 'BREAKDOWN' || logType === 'EMERGENCY'
          ? Math.floor(Math.random() * 240) + 15
          : logType === 'PREVENTIVE' ? Math.floor(Math.random() * 60) + 10 : null;

        await client.query(
          `INSERT INTO shift_log_entries
           (tenant_id, shift_date, shift_type, log_entry_type, asset_id, functional_location_id,
            machine_name, section_name, plant_name, description, action_taken, downtime_minutes,
            attended_by, log_entry_status, remarks)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [tenantId, shiftDate, shift, logType, asset.id,
           asset.functional_location_id || null,
           asset.name, section, plantName, desc,
           status === 'COMPLETED' ? 'Issue resolved and machine restored to operation' : null,
           downtime, tech, status,
           dayOffset === 0 ? 'Today\'s entry' : null]
        );
      }
      if (dayOffset % 3 === 0) console.log(`  Logbook: ${shiftDate} → ${entriesPerDay} entries`);
    }

    // Final counts
    const { rows: riskCount } = await client.query('SELECT count(*) FROM risk_assessments WHERE tenant_id = $1', [tenantId]);
    const { rows: mitigCount } = await client.query('SELECT count(*) FROM risk_mitigations WHERE tenant_id = $1', [tenantId]);
    const { rows: logCount } = await client.query('SELECT count(*) FROM shift_log_entries WHERE tenant_id = $1', [tenantId]);

    console.log('\n=== Seed Complete ===');
    console.log(`Risk Assessments: ${riskCount[0].count}`);
    console.log(`Risk Mitigations: ${mitigCount[0].count}`);
    console.log(`Shift Log Entries: ${logCount[0].count}`);

  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(e => { console.error(e); process.exit(1); });
