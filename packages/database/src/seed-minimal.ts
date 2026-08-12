import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://eam_user:eam_secret@localhost:5432/eam_platform';

async function seed() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool, { schema });
  
  console.log('🌱 Seeding database...');

  try {
    // 1. Create a tenant
    const [tenant] = await db.insert(schema.tenants).values({
      name: 'Acme Industries',
      slug: 'acme',
      plan: 'PROFESSIONAL',
      settings: {},
      isActive: true,
    }).returning();
    console.log(`  ✅ Tenant: ${tenant.name} (${tenant.id})`);

    // 2. Create an admin user (password: admin123)
    const bcryptHash = '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Fz4PmXKq7B1Gl1Vz.vHSi'; // "admin123"
    const [user] = await db.insert(schema.users).values({
      tenantId: tenant.id,
      email: 'admin@acme.com',
      passwordHash: bcryptHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'TENANT_ADMIN',
      isActive: true,
    }).returning();
    console.log(`  ✅ User: ${user.email} (pw: admin123)`);

    // 3. Locations
    const [site] = await db.insert(schema.locations).values({
      tenantId: tenant.id,
      name: 'Main Plant',
      code: 'MAIN-001',
      locationType: 'SITE',
    }).returning();

    const [building] = await db.insert(schema.locations).values({
      tenantId: tenant.id,
      name: 'Building A - Production',
      code: 'BLDG-A',
      locationType: 'BUILDING',
      parentId: site.id,
    }).returning();
    console.log(`  ✅ Locations: ${site.name}, ${building.name}`);

    // 4. Asset types
    const assetTypes = await db.insert(schema.assetTypes).values([
      { tenantId: tenant.id, name: 'Pump', code: 'PUMP', category: 'MECHANICAL' },
      { tenantId: tenant.id, name: 'Motor', code: 'MOTOR', category: 'ELECTRICAL' },
      { tenantId: tenant.id, name: 'Conveyor', code: 'CONV', category: 'MECHANICAL' },
      { tenantId: tenant.id, name: 'HVAC Unit', code: 'HVAC', category: 'MECHANICAL' },
      { tenantId: tenant.id, name: 'Transformer', code: 'XFMR', category: 'ELECTRICAL' },
    ]).returning();
    console.log(`  ✅ Asset Types: ${assetTypes.length}`);

    // 5. Assets
    const assets = await db.insert(schema.assets).values([
      { tenantId: tenant.id, assetTag: 'AST-001', name: 'Centrifugal Pump P-101', assetTypeId: assetTypes[0].id, locationId: building.id, status: 'OPERATIONAL', criticality: 'HIGH', installDate: new Date('2022-01-15') },
      { tenantId: tenant.id, assetTag: 'AST-002', name: 'Drive Motor M-201', assetTypeId: assetTypes[1].id, locationId: building.id, status: 'OPERATIONAL', criticality: 'MEDIUM', installDate: new Date('2021-06-20') },
      { tenantId: tenant.id, assetTag: 'AST-003', name: 'Main Conveyor CV-301', assetTypeId: assetTypes[2].id, locationId: building.id, status: 'UNDER_MAINTENANCE', criticality: 'HIGH', installDate: new Date('2020-03-10') },
      { tenantId: tenant.id, assetTag: 'AST-004', name: 'Roof HVAC Unit AHU-01', assetTypeId: assetTypes[3].id, locationId: site.id, status: 'OPERATIONAL', criticality: 'LOW', installDate: new Date('2023-09-01') },
      { tenantId: tenant.id, assetTag: 'AST-005', name: 'Main Transformer TX-501', assetTypeId: assetTypes[4].id, locationId: site.id, status: 'OPERATIONAL', criticality: 'CRITICAL', installDate: new Date('2019-11-30') },
    ]).returning();
    console.log(`  ✅ Assets: ${assets.length}`);

    // 6. Work Orders
    const workOrders = await db.insert(schema.workOrders).values([
      { tenantId: tenant.id, woNumber: 'WO-2024-001', title: 'Replace pump seals on P-101', assetId: assets[0].id, priority: 'HIGH', status: 'IN_PROGRESS', woType: 'CORRECTIVE', assignedTo: user.id },
      { tenantId: tenant.id, woNumber: 'WO-2024-002', title: 'Quarterly motor inspection', assetId: assets[1].id, priority: 'MEDIUM', status: 'PLANNED', woType: 'PREVENTIVE', assignedTo: user.id },
      { tenantId: tenant.id, woNumber: 'WO-2024-003', title: 'Belt replacement on conveyor', assetId: assets[2].id, priority: 'URGENT', status: 'IN_PROGRESS', woType: 'CORRECTIVE', assignedTo: user.id },
      { tenantId: tenant.id, woNumber: 'WO-2024-004', title: 'HVAC filter replacement', assetId: assets[3].id, priority: 'LOW', status: 'COMPLETED', woType: 'PREVENTIVE', assignedTo: user.id },
      { tenantId: tenant.id, woNumber: 'WO-2024-005', title: 'Transformer oil analysis', assetId: assets[4].id, priority: 'MEDIUM', status: 'PLANNED', woType: 'PREDICTIVE', assignedTo: user.id },
    ]).returning();
    console.log(`  ✅ Work Orders: ${workOrders.length}`);

    // 7. Inventory / Storerooms
    const [storeroom] = await db.insert(schema.storerooms).values({
      tenantId: tenant.id, name: 'Main Warehouse', code: 'WH-01', locationId: site.id,
    }).returning();

    const stockItems = await db.insert(schema.stockItems).values([
      { tenantId: tenant.id, itemCode: 'SP-001', name: 'Mechanical Seal Kit', category: 'SPARE_PART', unitOfMeasure: 'EA', reorderPoint: 5, reorderQuantity: 20, unitCost: '125.00' },
      { tenantId: tenant.id, itemCode: 'SP-002', name: 'V-Belt B68', category: 'SPARE_PART', unitOfMeasure: 'EA', reorderPoint: 10, reorderQuantity: 50, unitCost: '18.50' },
      { tenantId: tenant.id, itemCode: 'SP-003', name: 'Bearing 6205-2RS', category: 'SPARE_PART', unitOfMeasure: 'EA', reorderPoint: 8, reorderQuantity: 30, unitCost: '22.75' },
      { tenantId: tenant.id, itemCode: 'LB-001', name: 'Hydraulic Oil ISO 46', category: 'CONSUMABLE', unitOfMeasure: 'L', reorderPoint: 50, reorderQuantity: 200, unitCost: '4.50' },
    ]).returning();
    console.log(`  ✅ Stock Items: ${stockItems.length}, Storeroom: ${storeroom.name}`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('   Login: admin@acme.com / admin123');
    console.log(`   Tenant ID: ${tenant.id}`);
  } catch (error: any) {
    console.error('❌ Seed error:', error.message);
    if (error.detail) console.error('   Detail:', error.detail);
  } finally {
    await pool.end();
  }
}

seed();
