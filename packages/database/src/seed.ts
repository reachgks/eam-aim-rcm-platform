import { sql } from 'drizzle-orm';
import { db, pool, closeDatabaseConnection } from './client';
import { tenants } from './schema/core/tenants';
import { users } from './schema/core/users';
import { roles } from './schema/core/roles-permissions';
import { assetTypes } from './schema/asset-register/asset-types';
import { functionalLocations } from './schema/asset-register/functional-locations';
import { assets } from './schema/asset-register/assets';
import { crafts } from './schema/labor/crafts';
import { storerooms } from './schema/inventory/storerooms';
import { slaDefinitions } from './schema/sla/sla-definitions';
import { kpiDefinitions } from './schema/performance/kpi-definitions';

async function seed() {
  console.log('🌱 Seeding database...\n');

  // ── 1. Demo Tenant ──
  console.log('  → Creating demo tenant...');
  const [tenant] = await db.insert(tenants).values({
    name: 'Acme Industrial Corp',
    slug: 'acme-industrial',
    domain: 'acme.eam-platform.local',
    plan: 'enterprise',
    settings: { timezone: 'UTC', currency: 'USD', dateFormat: 'YYYY-MM-DD' },
    isActive: true,
  }).returning();
  const tenantId = tenant.id;

  // ── 2. Admin Role ──
  console.log('  → Creating roles...');
  const [adminRole] = await db.insert(roles).values({
    tenantId,
    name: 'Administrator',
    description: 'Full system access',
    permissions: {
      assets: ['create', 'read', 'update', 'delete'],
      maintenance: ['create', 'read', 'update', 'delete', 'approve'],
      admin: ['manage_users', 'manage_roles', 'manage_tenants'],
    },
  }).returning();

  const [techRole] = await db.insert(roles).values({
    tenantId,
    name: 'Maintenance Technician',
    description: 'Work order execution and asset inspection',
    permissions: {
      assets: ['read'],
      maintenance: ['read', 'update'],
      inventory: ['read', 'issue'],
    },
  }).returning();

  const [plannerRole] = await db.insert(roles).values({
    tenantId,
    name: 'Maintenance Planner',
    description: 'Work order planning and scheduling',
    permissions: {
      assets: ['read', 'update'],
      maintenance: ['create', 'read', 'update', 'approve'],
      inventory: ['read', 'create'],
      procurement: ['create', 'read'],
    },
  }).returning();

  // ── 3. Admin User ──
  console.log('  → Creating admin user...');
  const [admin] = await db.insert(users).values({
    tenantId,
    email: 'admin@acme-industrial.com',
    passwordHash: '$2b$10$placeholder_hash_replace_in_production',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'admin',
    isActive: true,
  }).returning();

  // ── 4. Asset Type Hierarchy ──
  console.log('  → Creating asset type hierarchy...');
  const [rotatingEquip] = await db.insert(assetTypes).values({
    tenantId, code: 'ROT', name: 'Rotating Equipment',
    description: 'Pumps, compressors, turbines, motors',
    category: 'MECHANICAL',
    defaultAttributes: { vibration_monitoring: true, lubrication_required: true },
  }).returning();

  const [staticEquip] = await db.insert(assetTypes).values({
    tenantId, code: 'STA', name: 'Static Equipment',
    description: 'Vessels, tanks, heat exchangers, piping',
    category: 'MECHANICAL',
    defaultAttributes: { pressure_rated: true, corrosion_monitoring: true },
  }).returning();

  const [electrical] = await db.insert(assetTypes).values({
    tenantId, code: 'ELE', name: 'Electrical Equipment',
    description: 'Switchgear, transformers, panels, cables',
    category: 'ELECTRICAL',
    defaultAttributes: { voltage_class: 'LV', insulation_class: 'F' },
  }).returning();

  const [instrControl] = await db.insert(assetTypes).values({
    tenantId, code: 'INS', name: 'Instrumentation & Control',
    description: 'Sensors, transmitters, PLCs, control valves',
    category: 'INSTRUMENTATION',
    defaultAttributes: { calibration_required: true },
  }).returning();

  // Sub-types
  for (const subType of [
    { code: 'PMP', name: 'Centrifugal Pump', parentTypeId: rotatingEquip.id },
    { code: 'CMP', name: 'Compressor', parentTypeId: rotatingEquip.id },
    { code: 'MOT', name: 'Electric Motor', parentTypeId: rotatingEquip.id },
    { code: 'HEX', name: 'Heat Exchanger', parentTypeId: staticEquip.id },
    { code: 'VSL', name: 'Pressure Vessel', parentTypeId: staticEquip.id },
    { code: 'TNK', name: 'Storage Tank', parentTypeId: staticEquip.id },
    { code: 'TRF', name: 'Transformer', parentTypeId: electrical.id },
    { code: 'SWG', name: 'Switchgear', parentTypeId: electrical.id },
    { code: 'PLC', name: 'PLC Controller', parentTypeId: instrControl.id },
    { code: 'TRN', name: 'Transmitter', parentTypeId: instrControl.id },
  ]) {
    await db.insert(assetTypes).values({ tenantId, ...subType, category: 'SUB_TYPE' });
  }

  // ── 5. Functional Location Hierarchy ──
  console.log('  → Creating functional locations...');
  const [site] = await db.insert(functionalLocations).values({
    tenantId, code: 'SITE-001', name: 'Main Manufacturing Plant',
    locationType: 'SITE',
    address: '100 Industrial Blvd, Houston, TX 77001',
    coordinates: { lat: 29.7604, lng: -95.3698 },
  }).returning();

  const [utilityBldg] = await db.insert(functionalLocations).values({
    tenantId, code: 'BLD-UTL', name: 'Utilities Building',
    parentId: site.id, locationType: 'BUILDING',
  }).returning();

  const [productionBldg] = await db.insert(functionalLocations).values({
    tenantId, code: 'BLD-PRD', name: 'Production Hall A',
    parentId: site.id, locationType: 'BUILDING',
  }).returning();

  const [coolingZone] = await db.insert(functionalLocations).values({
    tenantId, code: 'ZN-COOL', name: 'Cooling Water System',
    parentId: utilityBldg.id, locationType: 'ZONE',
  }).returning();

  const [compressorRoom] = await db.insert(functionalLocations).values({
    tenantId, code: 'RM-COMP', name: 'Compressor Room',
    parentId: utilityBldg.id, locationType: 'ROOM',
  }).returning();

  // ── 6. Sample Assets ──
  console.log('  → Creating sample assets...');
  const [pumpA] = await db.insert(assets).values({
    tenantId, tagNumber: 'PMP-CW-001A', name: 'Cooling Water Pump A',
    description: 'Primary cooling water circulation pump — duty service',
    assetTypeId: rotatingEquip.id,
    functionalLocationId: coolingZone.id,
    serialNumber: 'SN-2021-PMP-44821',
    manufacturer: 'Sulzer', model: 'CPE 150-400',
    installDate: '2021-06-15', commissionDate: '2021-07-01',
    status: 'ACTIVE', criticality: 'A',
    metadata: { flowRate: '500 m³/h', head: '45m', power: '132kW', speed: '1480 RPM' },
  }).returning();

  await db.insert(assets).values({
    tenantId, tagNumber: 'PMP-CW-001B', name: 'Cooling Water Pump B',
    description: 'Standby cooling water circulation pump',
    assetTypeId: rotatingEquip.id,
    functionalLocationId: coolingZone.id,
    parentAssetId: null,
    serialNumber: 'SN-2021-PMP-44822',
    manufacturer: 'Sulzer', model: 'CPE 150-400',
    installDate: '2021-06-15', commissionDate: '2021-07-01',
    status: 'ACTIVE', criticality: 'B',
    metadata: { flowRate: '500 m³/h', head: '45m', power: '132kW', speed: '1480 RPM' },
  });

  await db.insert(assets).values({
    tenantId, tagNumber: 'CMP-AIR-001', name: 'Plant Air Compressor #1',
    description: 'Screw-type air compressor for plant air supply',
    assetTypeId: rotatingEquip.id,
    functionalLocationId: compressorRoom.id,
    serialNumber: 'SN-2019-CMP-33100',
    manufacturer: 'Atlas Copco', model: 'GA 315',
    installDate: '2019-03-10', commissionDate: '2019-04-01',
    status: 'ACTIVE', criticality: 'A',
    metadata: { pressure: '7.5 bar', flowRate: '850 l/s', power: '315kW' },
  });

  await db.insert(assets).values({
    tenantId, tagNumber: 'TRF-MV-001', name: 'Main Distribution Transformer',
    description: '11kV/415V step-down transformer',
    assetTypeId: electrical.id,
    functionalLocationId: productionBldg.id,
    serialNumber: 'SN-2018-TRF-10042',
    manufacturer: 'ABB', model: 'RESIBLOC 2000kVA',
    installDate: '2018-01-20', commissionDate: '2018-02-15',
    status: 'ACTIVE', criticality: 'A',
    metadata: { primaryVoltage: '11kV', secondaryVoltage: '415V', rating: '2000kVA' },
  });

  // ── 7. Crafts ──
  console.log('  → Creating labor crafts...');
  for (const craft of [
    { code: 'MECH', name: 'Mechanical Technician', hourlyRate: '65.00' },
    { code: 'ELEC', name: 'Electrician', hourlyRate: '70.00' },
    { code: 'INST', name: 'Instrument Technician', hourlyRate: '75.00' },
    { code: 'WELD', name: 'Welder/Fitter', hourlyRate: '68.00' },
    { code: 'OPER', name: 'Operator', hourlyRate: '55.00' },
  ]) {
    await db.insert(crafts).values({ tenantId, ...craft });
  }

  // ── 8. Storerooms ──
  console.log('  → Creating storerooms...');
  await db.insert(storerooms).values([
    { tenantId, code: 'MAIN-WH', name: 'Main Warehouse', siteId: site.id, isActive: true },
    { tenantId, code: 'MECH-CR', name: 'Mechanical Crib', siteId: site.id, isActive: true },
    { tenantId, code: 'ELEC-CR', name: 'Electrical Crib', siteId: site.id, isActive: true },
  ]);

  // ── 9. KPI Definitions ──
  console.log('  → Creating KPI definitions...');
  for (const kpi of [
    { code: 'OEE', name: 'Overall Equipment Effectiveness', category: 'PERFORMANCE' as const, unit: '%', targetValue: '85.0000', formula: '(Availability × Performance × Quality) × 100' },
    { code: 'MTBF', name: 'Mean Time Between Failures', category: 'RELIABILITY' as const, unit: 'hours', targetValue: '720.0000', formula: 'Total Operating Hours / Number of Failures' },
    { code: 'MTTR', name: 'Mean Time To Repair', category: 'RELIABILITY' as const, unit: 'hours', targetValue: '4.0000', formula: 'Total Repair Hours / Number of Repairs' },
    { code: 'AVAIL', name: 'Asset Availability', category: 'AVAILABILITY' as const, unit: '%', targetValue: '95.0000', formula: 'MTBF / (MTBF + MTTR) × 100' },
    { code: 'PM-COMP', name: 'PM Compliance Rate', category: 'PERFORMANCE' as const, unit: '%', targetValue: '90.0000', formula: 'Completed PMs / Scheduled PMs × 100' },
    { code: 'MAINT-COST', name: 'Maintenance Cost per RAV', category: 'COST' as const, unit: '%', targetValue: '3.0000', formula: 'Annual Maint Cost / Replacement Asset Value × 100' },
    { code: 'SAFETY-IR', name: 'Incident Rate', category: 'SAFETY' as const, unit: 'per 200k hrs', targetValue: '1.0000', formula: '(Incidents × 200000) / Total Hours Worked' },
  ]) {
    await db.insert(kpiDefinitions).values({ tenantId, ...kpi, calculationFrequency: 'MONTHLY' });
  }

  console.log('\n✅ Seed completed successfully!');
  console.log(`   Tenant: ${tenant.name} (${tenantId})`);
  console.log(`   Admin:  admin@acme-industrial.com`);
}

seed()
  .then(() => closeDatabaseConnection())
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
