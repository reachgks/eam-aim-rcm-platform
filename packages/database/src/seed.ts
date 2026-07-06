import { sql } from 'drizzle-orm';
import { db, closeDatabaseConnection } from './client';

// ── Core ──
import { tenants } from './schema/core/tenants';
import { users } from './schema/core/users';
import { roles } from './schema/core/roles-permissions';
// ── Asset Register ──
import { assetTypes } from './schema/asset-register/asset-types';
import { functionalLocations } from './schema/asset-register/functional-locations';
import { assets } from './schema/asset-register/assets';
// ── Maintenance ──
import { workOrders } from './schema/maintenance/work-orders';
import { maintenancePlans } from './schema/maintenance/maintenance-plans';
import { maintenanceTasks } from './schema/maintenance/maintenance-tasks';
// ── Labor ──
import { crafts } from './schema/labor/crafts';
import { crews } from './schema/labor/crews';
import { crewMembers } from './schema/labor/crew-members';
import { shifts } from './schema/labor/shifts';
// ── Inventory ──
import { storerooms } from './schema/inventory/storerooms';
import { stockItems } from './schema/inventory/stock-items';
import { stockLevels } from './schema/inventory/stock-levels';
import { reorderRules } from './schema/inventory/reorder-rules';
// ── Procurement ──
import { vendors } from './schema/procurement/vendors';
import { purchaseOrders } from './schema/procurement/purchase-orders';
// ── Warranty ──
import { warrantyTerms } from './schema/warranty/warranty-terms';
import { warrantyCoverage } from './schema/warranty/warranty-coverage';
// ── SLA ──
import { slaDefinitions } from './schema/sla/sla-definitions';
import { slaTargets } from './schema/sla/sla-targets';
// ── Safety ──
import { permitTypes } from './schema/safety/permit-types';
// ── Financials ──
import { costCenters } from './schema/financials/cost-centers';
import { budgets } from './schema/financials/budgets';
import { depreciationProfiles } from './schema/financials/depreciation-profiles';
// ── Regulatory ──
import { regulations } from './schema/regulatory/regulations';
import { complianceRequirements } from './schema/regulatory/compliance-requirements';
// ── Classification ──
import { uniclassCodes } from './schema/classification/uniclass-codes';
import { failureCodeLibrary } from './schema/classification/failure-code-library';
import { causeCodeLibrary } from './schema/classification/cause-code-library';
// ── Performance ──
import { kpiDefinitions } from './schema/performance/kpi-definitions';
// ── Service Requests ──
import { requestCategories } from './schema/service-requests/request-categories';
import { serviceRequests } from './schema/service-requests/service-requests';

async function seed() {
  console.log('🌱 Seeding EAM/AIM/RCM platform...\n');

  // ════════════════════════════════════════════
  // 1. TENANT
  // ════════════════════════════════════════════
  console.log('  [1/20] Creating demo tenant...');
  const [tenant] = await db.insert(tenants).values({
    name: 'Acme Industrial Corp',
    slug: 'acme-industrial',
    domain: 'acme.eam-platform.local',
    plan: 'enterprise',
    settings: { timezone: 'UTC', currency: 'USD', dateFormat: 'YYYY-MM-DD', locale: 'en-US' },
    isActive: true,
  }).returning();
  const T = tenant.id;

  // ════════════════════════════════════════════
  // 2. ROLES
  // ════════════════════════════════════════════
  console.log('  [2/20] Creating roles...');
  const [adminRole] = await db.insert(roles).values({
    tenantId: T, name: 'Administrator', description: 'Full system access',
    permissions: { assets: ['*'], maintenance: ['*'], admin: ['*'], inventory: ['*'], procurement: ['*'], safety: ['*'], regulatory: ['*'], financials: ['*'] },
  }).returning();

  const [plannerRole] = await db.insert(roles).values({
    tenantId: T, name: 'Maintenance Planner', description: 'Work order planning, scheduling, procurement',
    permissions: { assets: ['read', 'update'], maintenance: ['create', 'read', 'update', 'approve'], inventory: ['read', 'create'], procurement: ['create', 'read'] },
  }).returning();

  const [techRole] = await db.insert(roles).values({
    tenantId: T, name: 'Maintenance Technician', description: 'Work order execution and asset inspection',
    permissions: { assets: ['read'], maintenance: ['read', 'update'], inventory: ['read', 'issue'] },
  }).returning();

  const [reliabilityRole] = await db.insert(roles).values({
    tenantId: T, name: 'Reliability Engineer', description: 'RCM analysis, FMEA, failure analysis',
    permissions: { assets: ['read', 'update'], maintenance: ['read'], rcm: ['*'], telemetry: ['read'] },
  }).returning();

  const [safetyRole] = await db.insert(roles).values({
    tenantId: T, name: 'Safety Officer', description: 'Work permits, safety observations, LOTO',
    permissions: { safety: ['*'], regulatory: ['read'], assets: ['read'] },
  }).returning();

  // ════════════════════════════════════════════
  // 3. USERS
  // ════════════════════════════════════════════
  console.log('  [3/20] Creating users...');
  const hash = '$2b$10$placeholder_hash_replace_in_production';
  const [adminUser] = await db.insert(users).values({ tenantId: T, email: 'admin@acme-industrial.com', passwordHash: hash, firstName: 'Sarah', lastName: 'Chen', role: 'admin', isActive: true }).returning();
  const [plannerUser] = await db.insert(users).values({ tenantId: T, email: 'john.planner@acme-industrial.com', passwordHash: hash, firstName: 'John', lastName: 'Mitchell', role: 'user', isActive: true }).returning();
  const [techUser1] = await db.insert(users).values({ tenantId: T, email: 'mike.tech@acme-industrial.com', passwordHash: hash, firstName: 'Mike', lastName: 'Rodriguez', role: 'user', isActive: true }).returning();
  const [techUser2] = await db.insert(users).values({ tenantId: T, email: 'emma.tech@acme-industrial.com', passwordHash: hash, firstName: 'Emma', lastName: 'Williams', role: 'user', isActive: true }).returning();
  const [reliabilityUser] = await db.insert(users).values({ tenantId: T, email: 'raj.reliability@acme-industrial.com', passwordHash: hash, firstName: 'Raj', lastName: 'Patel', role: 'user', isActive: true }).returning();
  const [safetyUser] = await db.insert(users).values({ tenantId: T, email: 'lisa.safety@acme-industrial.com', passwordHash: hash, firstName: 'Lisa', lastName: 'Thompson', role: 'user', isActive: true }).returning();

  // ════════════════════════════════════════════
  // 4. ASSET TYPE HIERARCHY
  // ════════════════════════════════════════════
  console.log('  [4/20] Creating asset type hierarchy...');
  const [rotatingEquip] = await db.insert(assetTypes).values({ tenantId: T, code: 'ROT', name: 'Rotating Equipment', description: 'Pumps, compressors, turbines, motors', category: 'MECHANICAL', defaultAttributes: { vibration_monitoring: true, lubrication_required: true } }).returning();
  const [staticEquip] = await db.insert(assetTypes).values({ tenantId: T, code: 'STA', name: 'Static Equipment', description: 'Vessels, tanks, heat exchangers, piping', category: 'MECHANICAL', defaultAttributes: { pressure_rated: true, corrosion_monitoring: true } }).returning();
  const [electrical] = await db.insert(assetTypes).values({ tenantId: T, code: 'ELE', name: 'Electrical Equipment', description: 'Switchgear, transformers, panels', category: 'ELECTRICAL', defaultAttributes: { voltage_class: 'LV', insulation_class: 'F' } }).returning();
  const [instrControl] = await db.insert(assetTypes).values({ tenantId: T, code: 'INS', name: 'Instrumentation & Control', description: 'Sensors, transmitters, PLCs', category: 'INSTRUMENTATION', defaultAttributes: { calibration_required: true } }).returning();
  const [civilStruct] = await db.insert(assetTypes).values({ tenantId: T, code: 'CIV', name: 'Civil & Structural', description: 'Buildings, roads, foundations', category: 'CIVIL', defaultAttributes: {} }).returning();

  for (const st of [
    { code: 'PMP', name: 'Centrifugal Pump', parentTypeId: rotatingEquip.id }, { code: 'CMP', name: 'Compressor', parentTypeId: rotatingEquip.id },
    { code: 'MOT', name: 'Electric Motor', parentTypeId: rotatingEquip.id }, { code: 'FAN', name: 'Fan/Blower', parentTypeId: rotatingEquip.id },
    { code: 'HEX', name: 'Heat Exchanger', parentTypeId: staticEquip.id }, { code: 'VSL', name: 'Pressure Vessel', parentTypeId: staticEquip.id },
    { code: 'TNK', name: 'Storage Tank', parentTypeId: staticEquip.id }, { code: 'PIP', name: 'Piping System', parentTypeId: staticEquip.id },
    { code: 'TRF', name: 'Transformer', parentTypeId: electrical.id }, { code: 'SWG', name: 'Switchgear', parentTypeId: electrical.id },
    { code: 'MCC', name: 'Motor Control Center', parentTypeId: electrical.id }, { code: 'PLC', name: 'PLC Controller', parentTypeId: instrControl.id },
    { code: 'TRN', name: 'Transmitter', parentTypeId: instrControl.id }, { code: 'CVL', name: 'Control Valve', parentTypeId: instrControl.id },
  ]) { await db.insert(assetTypes).values({ tenantId: T, ...st, category: 'SUB_TYPE' }); }

  // ════════════════════════════════════════════
  // 5. FUNCTIONAL LOCATIONS
  // ════════════════════════════════════════════
  console.log('  [5/20] Creating functional locations...');
  const [site] = await db.insert(functionalLocations).values({ tenantId: T, code: 'SITE-001', name: 'Main Manufacturing Plant', locationType: 'SITE', address: '100 Industrial Blvd, Houston, TX 77001', coordinates: { lat: 29.7604, lng: -95.3698 } }).returning();
  const [utilityBldg] = await db.insert(functionalLocations).values({ tenantId: T, code: 'BLD-UTL', name: 'Utilities Building', parentId: site.id, locationType: 'BUILDING' }).returning();
  const [productionBldg] = await db.insert(functionalLocations).values({ tenantId: T, code: 'BLD-PRD', name: 'Production Hall A', parentId: site.id, locationType: 'BUILDING' }).returning();
  const [warehouseBldg] = await db.insert(functionalLocations).values({ tenantId: T, code: 'BLD-WHS', name: 'Warehouse & Stores', parentId: site.id, locationType: 'BUILDING' }).returning();
  const [substationBldg] = await db.insert(functionalLocations).values({ tenantId: T, code: 'BLD-SUB', name: 'Electrical Substation', parentId: site.id, locationType: 'BUILDING' }).returning();
  const [coolingZone] = await db.insert(functionalLocations).values({ tenantId: T, code: 'ZN-COOL', name: 'Cooling Water System', parentId: utilityBldg.id, locationType: 'ZONE' }).returning();
  const [compressorRoom] = await db.insert(functionalLocations).values({ tenantId: T, code: 'RM-COMP', name: 'Compressor Room', parentId: utilityBldg.id, locationType: 'ROOM' }).returning();
  const [boilerRoom] = await db.insert(functionalLocations).values({ tenantId: T, code: 'RM-BOIL', name: 'Boiler Room', parentId: utilityBldg.id, locationType: 'ROOM' }).returning();
  const [prodLine1] = await db.insert(functionalLocations).values({ tenantId: T, code: 'LN-PRD1', name: 'Production Line 1', parentId: productionBldg.id, locationType: 'ZONE' }).returning();

  // ════════════════════════════════════════════
  // 6. ASSETS (12 assets)
  // ════════════════════════════════════════════
  console.log('  [6/20] Creating 12 sample assets...');
  const [pumpA] = await db.insert(assets).values({ tenantId: T, tagNumber: 'PMP-CW-001A', name: 'Cooling Water Pump A', description: 'Primary cooling water circulation pump — duty', assetTypeId: rotatingEquip.id, functionalLocationId: coolingZone.id, serialNumber: 'SN-2021-PMP-44821', manufacturer: 'Sulzer', model: 'CPE 150-400', installDate: '2021-06-15', commissionDate: '2021-07-01', status: 'ACTIVE', criticality: 'A', metadata: { flowRate: '500 m³/h', head: '45m', power: '132kW', speed: '1480 RPM' } }).returning();
  const [pumpB] = await db.insert(assets).values({ tenantId: T, tagNumber: 'PMP-CW-001B', name: 'Cooling Water Pump B', description: 'Standby cooling water pump', assetTypeId: rotatingEquip.id, functionalLocationId: coolingZone.id, serialNumber: 'SN-2021-PMP-44822', manufacturer: 'Sulzer', model: 'CPE 150-400', installDate: '2021-06-15', commissionDate: '2021-07-01', status: 'STANDBY', criticality: 'B', metadata: { flowRate: '500 m³/h', head: '45m', power: '132kW' } }).returning();
  const [compressor1] = await db.insert(assets).values({ tenantId: T, tagNumber: 'CMP-AIR-001', name: 'Plant Air Compressor #1', description: 'Screw-type air compressor for plant air', assetTypeId: rotatingEquip.id, functionalLocationId: compressorRoom.id, serialNumber: 'SN-2019-CMP-33100', manufacturer: 'Atlas Copco', model: 'GA 315', installDate: '2019-03-10', commissionDate: '2019-04-01', status: 'ACTIVE', criticality: 'A', metadata: { pressure: '7.5 bar', flowRate: '850 l/s', power: '315kW' } }).returning();
  const [compressor2] = await db.insert(assets).values({ tenantId: T, tagNumber: 'CMP-AIR-002', name: 'Plant Air Compressor #2', description: 'Backup air compressor', assetTypeId: rotatingEquip.id, functionalLocationId: compressorRoom.id, serialNumber: 'SN-2020-CMP-33200', manufacturer: 'Atlas Copco', model: 'GA 250', installDate: '2020-08-20', commissionDate: '2020-09-01', status: 'ACTIVE', criticality: 'B', metadata: { pressure: '7.5 bar', power: '250kW' } }).returning();
  const [transformer] = await db.insert(assets).values({ tenantId: T, tagNumber: 'TRF-MV-001', name: 'Main Distribution Transformer', description: '11kV/415V step-down transformer', assetTypeId: electrical.id, functionalLocationId: substationBldg.id, serialNumber: 'SN-2018-TRF-10042', manufacturer: 'ABB', model: 'RESIBLOC 2000kVA', installDate: '2018-01-20', commissionDate: '2018-02-15', status: 'ACTIVE', criticality: 'A', metadata: { primaryVoltage: '11kV', secondaryVoltage: '415V', rating: '2000kVA' } }).returning();
  const [heatExchanger] = await db.insert(assets).values({ tenantId: T, tagNumber: 'HEX-CW-001', name: 'Cooling Water Heat Exchanger', description: 'Plate & frame cooler for process cooling', assetTypeId: staticEquip.id, functionalLocationId: coolingZone.id, serialNumber: 'SN-2020-HEX-22010', manufacturer: 'Alfa Laval', model: 'M15-BWFD', installDate: '2020-05-10', commissionDate: '2020-06-01', status: 'ACTIVE', criticality: 'B', metadata: { duty: '2.5MW', area: '120 m²' } }).returning();
  const [boiler] = await db.insert(assets).values({ tenantId: T, tagNumber: 'BLR-STM-001', name: 'Steam Boiler #1', description: 'Fire-tube steam boiler for process heating', assetTypeId: staticEquip.id, functionalLocationId: boilerRoom.id, serialNumber: 'SN-2017-BLR-88001', manufacturer: 'Cleaver-Brooks', model: 'CBE-700', installDate: '2017-11-01', commissionDate: '2017-12-15', status: 'ACTIVE', criticality: 'A', metadata: { capacity: '30,000 lbs/hr', pressure: '150 psi' } }).returning();
  const [conveyor] = await db.insert(assets).values({ tenantId: T, tagNumber: 'CNV-PRD-001', name: 'Production Line Conveyor', description: 'Main belt conveyor for product transfer', assetTypeId: rotatingEquip.id, functionalLocationId: prodLine1.id, serialNumber: 'SN-2022-CNV-55001', manufacturer: 'Hytrol', model: 'ProSort SC', installDate: '2022-01-15', commissionDate: '2022-02-01', status: 'ACTIVE', criticality: 'B', metadata: { length: '50m', speed: '2 m/s', width: '900mm' } }).returning();
  const [motorPump] = await db.insert(assets).values({ tenantId: T, tagNumber: 'MOT-CW-001A', name: 'Pump A Drive Motor', description: 'Motor for cooling water pump A', assetTypeId: rotatingEquip.id, functionalLocationId: coolingZone.id, parentAssetId: pumpA.id, serialNumber: 'SN-2021-MOT-66001', manufacturer: 'WEG', model: 'W22 132kW', installDate: '2021-06-15', commissionDate: '2021-07-01', status: 'ACTIVE', criticality: 'A', metadata: { power: '132kW', voltage: '415V', speed: '1480 RPM' } }).returning();
  const [switchgear] = await db.insert(assets).values({ tenantId: T, tagNumber: 'SWG-MV-001', name: 'Main MV Switchgear', description: '11kV main switchgear panel', assetTypeId: electrical.id, functionalLocationId: substationBldg.id, serialNumber: 'SN-2018-SWG-77001', manufacturer: 'Schneider', model: 'PIX 12kV', installDate: '2018-01-20', commissionDate: '2018-02-15', status: 'ACTIVE', criticality: 'A', metadata: { ratedVoltage: '12kV', ratedCurrent: '2500A' } }).returning();
  const [tank] = await db.insert(assets).values({ tenantId: T, tagNumber: 'TNK-CW-001', name: 'Cooling Water Tank', description: 'FRP cooling water storage tank', assetTypeId: staticEquip.id, functionalLocationId: coolingZone.id, serialNumber: 'SN-2020-TNK-44001', manufacturer: 'Enduro', model: 'FRP-50K', installDate: '2020-04-01', commissionDate: '2020-05-01', status: 'ACTIVE', criticality: 'C', metadata: { capacity: '50,000 liters', material: 'FRP' } }).returning();
  const [plc] = await db.insert(assets).values({ tenantId: T, tagNumber: 'PLC-PRD-001', name: 'Production Line PLC', description: 'Siemens S7-1500 production line controller', assetTypeId: instrControl.id, functionalLocationId: prodLine1.id, serialNumber: 'SN-2022-PLC-99001', manufacturer: 'Siemens', model: 'S7-1516F', installDate: '2022-01-10', commissionDate: '2022-02-01', status: 'ACTIVE', criticality: 'A', metadata: { firmware: 'V3.0', protocol: 'PROFINET' } }).returning();

  // ════════════════════════════════════════════
  // 7. CRAFTS, CREWS & SHIFTS
  // ════════════════════════════════════════════
  console.log('  [7/20] Creating crafts, crews & shifts...');
  const [mechCraft] = await db.insert(crafts).values({ tenantId: T, code: 'MECH', name: 'Mechanical Technician', hourlyRate: '65.00' }).returning();
  const [elecCraft] = await db.insert(crafts).values({ tenantId: T, code: 'ELEC', name: 'Electrician', hourlyRate: '70.00' }).returning();
  await db.insert(crafts).values([
    { tenantId: T, code: 'INST', name: 'Instrument Technician', hourlyRate: '75.00' },
    { tenantId: T, code: 'WELD', name: 'Welder/Fitter', hourlyRate: '68.00' },
    { tenantId: T, code: 'OPER', name: 'Operator', hourlyRate: '55.00' },
    { tenantId: T, code: 'HELP', name: 'General Helper', hourlyRate: '40.00' },
  ]);

  const [crewA] = await db.insert(crews).values({ tenantId: T, name: 'Day Shift Mech Team', craftId: mechCraft.id, supervisorId: plannerUser.id }).returning();
  const [crewB] = await db.insert(crews).values({ tenantId: T, name: 'Day Shift Elec Team', craftId: elecCraft.id, supervisorId: plannerUser.id }).returning();
  await db.insert(crewMembers).values([
    { crewId: crewA.id, userId: techUser1.id, role: 'LEAD' },
    { crewId: crewB.id, userId: techUser2.id, role: 'LEAD' },
  ]);

  await db.insert(shifts).values([
    { tenantId: T, name: 'Day Shift', startTime: '06:00', endTime: '14:00', daysOfWeek: ['MON','TUE','WED','THU','FRI'] },
    { tenantId: T, name: 'Swing Shift', startTime: '14:00', endTime: '22:00', daysOfWeek: ['MON','TUE','WED','THU','FRI'] },
    { tenantId: T, name: 'Night Shift', startTime: '22:00', endTime: '06:00', daysOfWeek: ['MON','TUE','WED','THU','FRI'] },
  ]);

  // ════════════════════════════════════════════
  // 8. STOREROOMS & INVENTORY
  // ════════════════════════════════════════════
  console.log('  [8/20] Creating storerooms & stock items...');
  const [mainWH] = await db.insert(storerooms).values({ tenantId: T, code: 'MAIN-WH', name: 'Main Warehouse', siteId: site.id, isActive: true }).returning();
  const [mechCrib] = await db.insert(storerooms).values({ tenantId: T, code: 'MECH-CR', name: 'Mechanical Crib', siteId: site.id, isActive: true }).returning();
  const [elecCrib] = await db.insert(storerooms).values({ tenantId: T, code: 'ELEC-CR', name: 'Electrical Crib', siteId: site.id, isActive: true }).returning();

  const stockData = [
    { code: 'BRG-6310', name: 'Bearing SKF 6310-2RS', category: 'BEARINGS', unitCost: '45.00', unitOfMeasure: 'EACH', qtyMain: 24, qtyMech: 8, reorder: 10, reorderQty: 20 },
    { code: 'BRG-6212', name: 'Bearing SKF 6212-2Z', category: 'BEARINGS', unitCost: '38.00', unitOfMeasure: 'EACH', qtyMain: 16, qtyMech: 4, reorder: 8, reorderQty: 16 },
    { code: 'SEAL-100', name: 'Mechanical Seal 100mm', category: 'SEALS', unitCost: '320.00', unitOfMeasure: 'EACH', qtyMain: 6, qtyMech: 2, reorder: 3, reorderQty: 4 },
    { code: 'FLT-OIL-001', name: 'Oil Filter Element 10μ', category: 'FILTERS', unitCost: '85.00', unitOfMeasure: 'EACH', qtyMain: 30, qtyMech: 0, reorder: 10, reorderQty: 24 },
    { code: 'VBT-A68', name: 'V-Belt A68', category: 'BELTS', unitCost: '22.00', unitOfMeasure: 'EACH', qtyMain: 20, qtyMech: 6, reorder: 8, reorderQty: 12 },
    { code: 'LUB-MOBIL-SHC', name: 'Mobil SHC 630 Gear Oil', category: 'LUBRICANTS', unitCost: '180.00', unitOfMeasure: 'DRUM', qtyMain: 5, qtyMech: 0, reorder: 2, reorderQty: 4 },
    { code: 'GSK-SPIRAL', name: 'Spiral Wound Gasket 150#', category: 'GASKETS', unitCost: '55.00', unitOfMeasure: 'EACH', qtyMain: 40, qtyMech: 10, reorder: 15, reorderQty: 30 },
    { code: 'CBR-12AWG', name: 'Cable 12AWG THHN 600V', category: 'ELECTRICAL', unitCost: '1.20', unitOfMeasure: 'METER', qtyMain: 500, qtyMech: 0, reorder: 200, reorderQty: 500 },
    { code: 'FUSE-HRC-100', name: 'HRC Fuse 100A', category: 'ELECTRICAL', unitCost: '25.00', unitOfMeasure: 'EACH', qtyMain: 20, qtyMech: 0, reorder: 5, reorderQty: 10 },
    { code: 'CONT-3P-100', name: 'Contactor 3P 100A', category: 'ELECTRICAL', unitCost: '280.00', unitOfMeasure: 'EACH', qtyMain: 4, qtyMech: 0, reorder: 2, reorderQty: 4 },
  ];
  for (const item of stockData) {
    const [si] = await db.insert(stockItems).values({ tenantId: T, itemCode: item.code, name: item.name, category: item.category, unitCost: item.unitCost, unitOfMeasure: item.unitOfMeasure }).returning();
    await db.insert(stockLevels).values({ tenantId: T, stockItemId: si.id, storeroomId: mainWH.id, quantityOnHand: item.qtyMain, minimumQuantity: item.reorder });
    if (item.qtyMech > 0) {
      await db.insert(stockLevels).values({ tenantId: T, stockItemId: si.id, storeroomId: mechCrib.id, quantityOnHand: item.qtyMech, minimumQuantity: 2 });
    }
    await db.insert(reorderRules).values({ tenantId: T, stockItemId: si.id, reorderPoint: item.reorder, reorderQuantity: item.reorderQty, leadTimeDays: 7 });
  }

  // ════════════════════════════════════════════
  // 9. VENDORS
  // ════════════════════════════════════════════
  console.log('  [9/20] Creating vendors...');
  const [vendorSulzer] = await db.insert(vendors).values({ tenantId: T, code: 'VND-SULZER', name: 'Sulzer Pumps Inc.', category: 'OEM', contactName: 'David Chen', contactEmail: 'sales@sulzer.com', contactPhone: '+1-713-555-0101', address: '200 Pump Dr, Houston TX', isActive: true }).returning();
  await db.insert(vendors).values([
    { tenantId: T, code: 'VND-ATLAS', name: 'Atlas Copco US', category: 'OEM', contactName: 'Maria Santos', contactEmail: 'service@atlascopco.com', contactPhone: '+1-800-732-6762', isActive: true },
    { tenantId: T, code: 'VND-SKF', name: 'SKF USA Inc.', category: 'PARTS_SUPPLIER', contactName: 'Tom Baker', contactEmail: 'orders@skf.com', contactPhone: '+1-267-436-6000', isActive: true },
    { tenantId: T, code: 'VND-ABB', name: 'ABB Inc.', category: 'OEM', contactName: 'James Wilson', contactEmail: 'support@abb.com', isActive: true },
    { tenantId: T, code: 'VND-GRAINGER', name: 'W.W. Grainger', category: 'MRO_DISTRIBUTOR', contactName: 'Ordering Dept', contactEmail: 'orders@grainger.com', isActive: true },
    { tenantId: T, code: 'VND-TURNAROUND', name: 'Gulf Coast Turnaround Services', category: 'CONTRACTOR', contactName: 'Robert Jackson', contactEmail: 'bids@gulfcoastts.com', isActive: true },
  ]);

  // ════════════════════════════════════════════
  // 10. WORK ORDERS (8 with various statuses)
  // ════════════════════════════════════════════
  console.log('  [10/20] Creating work orders...');
  const [wo1] = await db.insert(workOrders).values({ tenantId: T, woNumber: 'WO-000001', type: 'PREVENTIVE', priority: 'MEDIUM', status: 'COMPLETED', assetId: pumpA.id, description: 'Quarterly vibration analysis and bearing inspection', scheduledStart: new Date('2026-06-01'), scheduledEnd: new Date('2026-06-01'), actualStart: new Date('2026-06-01T08:00:00'), actualEnd: new Date('2026-06-01T11:30:00'), assignedTo: techUser1.id, plannerUserId: plannerUser.id, actualHours: '3.5', actualCost: '527.50' }).returning();
  const [wo2] = await db.insert(workOrders).values({ tenantId: T, woNumber: 'WO-000002', type: 'CORRECTIVE', priority: 'HIGH', status: 'IN_PROGRESS', assetId: compressor1.id, description: 'High discharge temperature — inspect intercooler and valves', scheduledStart: new Date('2026-07-05'), assignedTo: techUser1.id, plannerUserId: plannerUser.id, actualStart: new Date('2026-07-05T07:00:00') }).returning();
  await db.insert(workOrders).values({ tenantId: T, woNumber: 'WO-000003', type: 'PREVENTIVE', priority: 'MEDIUM', status: 'PLANNED', assetId: transformer.id, description: 'Annual transformer oil sampling and DGA analysis', scheduledStart: new Date('2026-07-15'), scheduledEnd: new Date('2026-07-15'), assignedTo: techUser2.id, plannerUserId: plannerUser.id });
  await db.insert(workOrders).values({ tenantId: T, woNumber: 'WO-000004', type: 'PREDICTIVE', priority: 'MEDIUM', status: 'PLANNED', assetId: heatExchanger.id, description: 'Plate cleaning and gasket inspection — performance degraded', scheduledStart: new Date('2026-07-20'), assignedTo: techUser1.id, plannerUserId: plannerUser.id });
  await db.insert(workOrders).values({ tenantId: T, woNumber: 'WO-000005', type: 'CORRECTIVE', priority: 'CRITICAL', status: 'APPROVED', assetId: boiler.id, description: 'Safety valve replacement — failed ASME inspection', scheduledStart: new Date('2026-07-08'), assignedTo: techUser1.id, plannerUserId: plannerUser.id });
  await db.insert(workOrders).values({ tenantId: T, woNumber: 'WO-000006', type: 'PREVENTIVE', priority: 'LOW', status: 'COMPLETED', assetId: conveyor.id, description: 'Belt tracking and tension adjustment', scheduledStart: new Date('2026-05-20'), actualStart: new Date('2026-05-20T09:00:00'), actualEnd: new Date('2026-05-20T10:30:00'), assignedTo: techUser1.id, actualHours: '1.5', actualCost: '97.50' });
  await db.insert(workOrders).values({ tenantId: T, woNumber: 'WO-000007', type: 'EMERGENCY', priority: 'CRITICAL', status: 'COMPLETED', assetId: switchgear.id, description: 'Emergency breaker replacement after trip on overload', scheduledStart: new Date('2026-06-18'), actualStart: new Date('2026-06-18T02:30:00'), actualEnd: new Date('2026-06-18T06:15:00'), assignedTo: techUser2.id, actualHours: '3.75', actualCost: '1850.00' });
  await db.insert(workOrders).values({ tenantId: T, woNumber: 'WO-000008', type: 'PREVENTIVE', priority: 'MEDIUM', status: 'DRAFT', assetId: plc.id, description: 'PLC firmware update and I/O module diagnostics', scheduledStart: new Date('2026-08-01'), plannerUserId: plannerUser.id });

  // ── Tasks for WO-000001 ──
  await db.insert(maintenanceTasks).values([
    { tenantId: T, workOrderId: wo1.id, sequence: 1, description: 'Mount vibration sensors on DE and NDE bearings', estimatedHours: '0.5', status: 'COMPLETED' },
    { tenantId: T, workOrderId: wo1.id, sequence: 2, description: 'Collect vibration data at 1x, 2x, and 3x frequencies', estimatedHours: '1.0', status: 'COMPLETED' },
    { tenantId: T, workOrderId: wo1.id, sequence: 3, description: 'Analyze spectrum — check for imbalance, misalignment, bearing defects', estimatedHours: '1.0', status: 'COMPLETED' },
    { tenantId: T, workOrderId: wo1.id, sequence: 4, description: 'Grease bearing housings with Mobil SHC 100', estimatedHours: '0.5', status: 'COMPLETED' },
    { tenantId: T, workOrderId: wo1.id, sequence: 5, description: 'Record findings and update condition monitoring database', estimatedHours: '0.5', status: 'COMPLETED' },
  ]);
  await db.insert(maintenanceTasks).values([
    { tenantId: T, workOrderId: wo2.id, sequence: 1, description: 'Isolate and lock out compressor per LOTO procedure', estimatedHours: '0.5', status: 'COMPLETED' },
    { tenantId: T, workOrderId: wo2.id, sequence: 2, description: 'Inspect intercooler tubes for fouling', estimatedHours: '2.0', status: 'IN_PROGRESS' },
    { tenantId: T, workOrderId: wo2.id, sequence: 3, description: 'Check intake/discharge valve plates and springs', estimatedHours: '2.0', status: 'PENDING' },
    { tenantId: T, workOrderId: wo2.id, sequence: 4, description: 'Clean intercooler if fouled, replace gaskets', estimatedHours: '3.0', status: 'PENDING' },
  ]);

  // ════════════════════════════════════════════
  // 11. MAINTENANCE PLANS
  // ════════════════════════════════════════════
  console.log('  [11/20] Creating maintenance plans...');
  await db.insert(maintenancePlans).values([
    { tenantId: T, planCode: 'PM-PMP-Q', name: 'Pump Quarterly PM', description: 'Quarterly vibration analysis, bearing check, lubrication', assetId: pumpA.id, planType: 'PREVENTIVE', frequencyValue: 90, frequencyUnit: 'DAYS', isActive: true },
    { tenantId: T, planCode: 'PM-CMP-M', name: 'Compressor Monthly PM', description: 'Monthly oil analysis, filter check, vibration', assetId: compressor1.id, planType: 'PREVENTIVE', frequencyValue: 30, frequencyUnit: 'DAYS', isActive: true },
    { tenantId: T, planCode: 'PM-TRF-Y', name: 'Transformer Annual Inspection', description: 'Annual oil analysis, DGA, IR thermography, visual', assetId: transformer.id, planType: 'PREVENTIVE', frequencyValue: 365, frequencyUnit: 'DAYS', isActive: true },
    { tenantId: T, planCode: 'PM-BLR-M', name: 'Boiler Monthly Inspection', description: 'Monthly safety valve test, water treatment, flame inspection', assetId: boiler.id, planType: 'PREVENTIVE', frequencyValue: 30, frequencyUnit: 'DAYS', isActive: true },
    { tenantId: T, planCode: 'PDM-VIB', name: 'Rotating Equipment Vibration Program', description: 'Monthly vibration route for all critical rotating equipment', planType: 'PREDICTIVE', frequencyValue: 30, frequencyUnit: 'DAYS', isActive: true },
    { tenantId: T, planCode: 'PDM-THERM', name: 'Infrared Thermography Route', description: 'Quarterly IR scan of switchgear, MCC, transformers', planType: 'PREDICTIVE', frequencyValue: 90, frequencyUnit: 'DAYS', isActive: true },
  ]);

  // ════════════════════════════════════════════
  // 12. COST CENTERS & BUDGETS
  // ════════════════════════════════════════════
  console.log('  [12/20] Creating cost centers & budgets...');
  const [ccMaint] = await db.insert(costCenters).values({ tenantId: T, code: 'CC-MAINT', name: 'Maintenance Department', parentId: null, isActive: true }).returning();
  const [ccUtil] = await db.insert(costCenters).values({ tenantId: T, code: 'CC-UTIL', name: 'Utilities', parentId: ccMaint.id, isActive: true }).returning();
  const [ccProd] = await db.insert(costCenters).values({ tenantId: T, code: 'CC-PROD', name: 'Production', parentId: null, isActive: true }).returning();
  const [ccCapex] = await db.insert(costCenters).values({ tenantId: T, code: 'CC-CAPEX', name: 'Capital Projects', parentId: null, isActive: true }).returning();

  await db.insert(budgets).values([
    { tenantId: T, costCenterId: ccMaint.id, fiscalYear: 2026, totalBudget: '2500000.00', approvedBy: adminUser.id, status: 'APPROVED' },
    { tenantId: T, costCenterId: ccUtil.id, fiscalYear: 2026, totalBudget: '800000.00', approvedBy: adminUser.id, status: 'APPROVED' },
    { tenantId: T, costCenterId: ccCapex.id, fiscalYear: 2026, totalBudget: '5000000.00', approvedBy: adminUser.id, status: 'APPROVED' },
  ]);

  // ════════════════════════════════════════════
  // 13. DEPRECIATION PROFILES
  // ════════════════════════════════════════════
  console.log('  [13/20] Creating depreciation profiles...');
  await db.insert(depreciationProfiles).values([
    { tenantId: T, assetId: pumpA.id, method: 'STRAIGHT_LINE', originalCost: '85000.00', salvageValue: '5000.00', usefulLifeMonths: 180, startDate: '2021-07-01', costCenterId: ccMaint.id },
    { tenantId: T, assetId: compressor1.id, method: 'STRAIGHT_LINE', originalCost: '450000.00', salvageValue: '25000.00', usefulLifeMonths: 240, startDate: '2019-04-01', costCenterId: ccUtil.id },
    { tenantId: T, assetId: transformer.id, method: 'STRAIGHT_LINE', originalCost: '320000.00', salvageValue: '15000.00', usefulLifeMonths: 360, startDate: '2018-02-15', costCenterId: ccMaint.id },
    { tenantId: T, assetId: boiler.id, method: 'DECLINING_BALANCE', originalCost: '750000.00', salvageValue: '30000.00', usefulLifeMonths: 300, startDate: '2017-12-15', costCenterId: ccUtil.id },
  ]);

  // ════════════════════════════════════════════
  // 14. SLA DEFINITIONS & TARGETS
  // ════════════════════════════════════════════
  console.log('  [14/20] Creating SLA definitions...');
  const [slaEmergency] = await db.insert(slaDefinitions).values({ tenantId: T, name: 'Emergency Response SLA', description: 'Response and resolution targets for emergency work orders', isActive: true }).returning();
  const [slaUrgent] = await db.insert(slaDefinitions).values({ tenantId: T, name: 'Urgent Response SLA', description: 'Targets for urgent/high priority work', isActive: true }).returning();
  const [slaRoutine] = await db.insert(slaDefinitions).values({ tenantId: T, name: 'Routine Maintenance SLA', description: 'Targets for planned/routine work', isActive: true }).returning();

  await db.insert(slaTargets).values([
    { tenantId: T, slaId: slaEmergency.id, metricName: 'Response Time', targetValue: '30', unit: 'minutes', priority: 'CRITICAL' },
    { tenantId: T, slaId: slaEmergency.id, metricName: 'Resolution Time', targetValue: '4', unit: 'hours', priority: 'CRITICAL' },
    { tenantId: T, slaId: slaUrgent.id, metricName: 'Response Time', targetValue: '2', unit: 'hours', priority: 'HIGH' },
    { tenantId: T, slaId: slaUrgent.id, metricName: 'Resolution Time', targetValue: '24', unit: 'hours', priority: 'HIGH' },
    { tenantId: T, slaId: slaRoutine.id, metricName: 'Completion', targetValue: '5', unit: 'days', priority: 'MEDIUM' },
  ]);

  // ════════════════════════════════════════════
  // 15. WARRANTY
  // ════════════════════════════════════════════
  console.log('  [15/20] Creating warranty data...');
  const [wtSulzer] = await db.insert(warrantyTerms).values({ tenantId: T, name: 'Sulzer Standard Warranty', vendorId: vendorSulzer.id, durationMonths: 24, description: '2-year parts and labor warranty for pumps' }).returning();

  await db.insert(warrantyCoverage).values([
    { tenantId: T, warrantyTermId: wtSulzer.id, assetId: pumpA.id, startDate: '2021-07-01', endDate: '2023-07-01', status: 'EXPIRED' },
    { tenantId: T, warrantyTermId: wtSulzer.id, assetId: pumpB.id, startDate: '2021-07-01', endDate: '2023-07-01', status: 'EXPIRED' },
  ]);

  // ════════════════════════════════════════════
  // 16. SAFETY PERMIT TYPES
  // ════════════════════════════════════════════
  console.log('  [16/20] Creating safety permit types...');
  await db.insert(permitTypes).values([
    { tenantId: T, code: 'HW', name: 'Hot Work Permit', description: 'Welding, cutting, grinding — fire hazard areas', requiresGasTest: true, maxDurationHours: 12 },
    { tenantId: T, code: 'CS', name: 'Confined Space Entry', description: 'Entry into tanks, vessels, pits', requiresGasTest: true, maxDurationHours: 8 },
    { tenantId: T, code: 'EL', name: 'Electrical Isolation', description: 'Work on live or isolated electrical systems', requiresGasTest: false, maxDurationHours: 12 },
    { tenantId: T, code: 'EX', name: 'Excavation Permit', description: 'Ground breaking and excavation work', requiresGasTest: false, maxDurationHours: 24 },
    { tenantId: T, code: 'WH', name: 'Working at Height', description: 'Work above 2 meters from ground level', requiresGasTest: false, maxDurationHours: 12 },
  ]);

  // ════════════════════════════════════════════
  // 17. REGULATORY
  // ════════════════════════════════════════════
  console.log('  [17/20] Creating regulatory data...');
  const [regOsha] = await db.insert(regulations).values({ tenantId: T, code: 'OSHA-1910', name: 'OSHA General Industry Standards', description: '29 CFR 1910 — Occupational Safety and Health Standards', authority: 'OSHA', jurisdiction: 'Federal - USA', isActive: true }).returning();
  const [regAsme] = await db.insert(regulations).values({ tenantId: T, code: 'ASME-BPVC', name: 'ASME Boiler & Pressure Vessel Code', description: 'Rules for construction and inspection of boilers and pressure vessels', authority: 'ASME', jurisdiction: 'National - USA', isActive: true }).returning();
  const [regNfpa] = await db.insert(regulations).values({ tenantId: T, code: 'NFPA-70E', name: 'NFPA 70E Electrical Safety', description: 'Standard for Electrical Safety in the Workplace', authority: 'NFPA', jurisdiction: 'National - USA', isActive: true }).returning();
  const [regEpa] = await db.insert(regulations).values({ tenantId: T, code: 'EPA-SPCC', name: 'EPA SPCC Plan', description: 'Spill Prevention, Control, and Countermeasure', authority: 'EPA', jurisdiction: 'Federal - USA', isActive: true }).returning();

  await db.insert(complianceRequirements).values([
    { tenantId: T, regulationId: regOsha.id, code: 'OSHA-LOTO', name: 'Lockout/Tagout Procedures', requirementType: 'PROCEDURAL', frequencyDays: 365, isActive: true },
    { tenantId: T, regulationId: regOsha.id, code: 'OSHA-PERMIT', name: 'Permit-Required Confined Spaces', requirementType: 'PROCEDURAL', frequencyDays: 365, isActive: true },
    { tenantId: T, regulationId: regAsme.id, code: 'ASME-NBI', name: 'National Board Inspection — Boilers', requirementType: 'INSPECTION', frequencyDays: 365, isActive: true },
    { tenantId: T, regulationId: regAsme.id, code: 'ASME-PSV', name: 'Pressure Safety Valve Testing', requirementType: 'INSPECTION', frequencyDays: 365, isActive: true },
    { tenantId: T, regulationId: regNfpa.id, code: 'NFPA-ARC', name: 'Arc Flash Study', requirementType: 'STUDY', frequencyDays: 1825, isActive: true },
    { tenantId: T, regulationId: regEpa.id, code: 'EPA-TANK', name: 'Tank Integrity Inspection', requirementType: 'INSPECTION', frequencyDays: 1825, isActive: true },
  ]);

  // ════════════════════════════════════════════
  // 18. CLASSIFICATION & FAILURE CODES
  // ════════════════════════════════════════════
  console.log('  [18/20] Creating classification & failure codes...');
  await db.insert(uniclassCodes).values([
    { tenantId: T, code: 'Ss_25', name: 'Heating, cooling and refrigeration systems', table: 'Systems', isActive: true },
    { tenantId: T, code: 'Ss_55', name: 'Piped supply systems', table: 'Systems', isActive: true },
    { tenantId: T, code: 'Pr_65', name: 'Pumps and compressors', table: 'Products', isActive: true },
    { tenantId: T, code: 'Pr_70', name: 'General plant and accessories', table: 'Products', isActive: true },
    { tenantId: T, code: 'Pr_75', name: 'Electrical distribution and generation', table: 'Products', isActive: true },
  ]);

  await db.insert(failureCodeLibrary).values([
    { tenantId: T, code: 'FM-BRG', name: 'Bearing Failure', category: 'MECHANICAL', description: 'Bearing wear, seizure, overheating' },
    { tenantId: T, code: 'FM-SEAL', name: 'Seal Failure', category: 'MECHANICAL', description: 'Mechanical seal leak, wear, damage' },
    { tenantId: T, code: 'FM-VIB', name: 'Excessive Vibration', category: 'MECHANICAL', description: 'Imbalance, misalignment, looseness' },
    { tenantId: T, code: 'FM-CORR', name: 'Corrosion', category: 'MATERIAL', description: 'General, pitting, galvanic, stress corrosion' },
    { tenantId: T, code: 'FM-ELEC', name: 'Electrical Fault', category: 'ELECTRICAL', description: 'Insulation failure, short circuit, overload' },
    { tenantId: T, code: 'FM-INST', name: 'Instrument Drift', category: 'INSTRUMENTATION', description: 'Calibration drift, signal loss, false reading' },
    { tenantId: T, code: 'FM-FOUL', name: 'Fouling/Plugging', category: 'PROCESS', description: 'Tube fouling, strainer plugging, blockage' },
    { tenantId: T, code: 'FM-LEAK', name: 'External Leak', category: 'MECHANICAL', description: 'Flange, fitting, valve packing leaks' },
  ]);

  await db.insert(causeCodeLibrary).values([
    { tenantId: T, code: 'CC-WEAR', name: 'Normal Wear', category: 'DEGRADATION' },
    { tenantId: T, code: 'CC-OVER', name: 'Operating Beyond Limits', category: 'OPERATIONAL' },
    { tenantId: T, code: 'CC-MAINT', name: 'Inadequate Maintenance', category: 'MAINTENANCE' },
    { tenantId: T, code: 'CC-DESIGN', name: 'Design Deficiency', category: 'DESIGN' },
    { tenantId: T, code: 'CC-INSTALL', name: 'Incorrect Installation', category: 'INSTALLATION' },
    { tenantId: T, code: 'CC-CONTAM', name: 'Contamination', category: 'ENVIRONMENTAL' },
    { tenantId: T, code: 'CC-HUMAN', name: 'Human Error', category: 'OPERATIONAL' },
  ]);

  // ════════════════════════════════════════════
  // 19. KPI DEFINITIONS
  // ════════════════════════════════════════════
  console.log('  [19/20] Creating KPI definitions...');
  for (const kpi of [
    { code: 'OEE', name: 'Overall Equipment Effectiveness', category: 'PERFORMANCE' as const, unit: '%', targetValue: '85.0000', warningThreshold: '75.0000', criticalThreshold: '60.0000', formula: '(Availability × Performance × Quality) × 100' },
    { code: 'MTBF', name: 'Mean Time Between Failures', category: 'RELIABILITY' as const, unit: 'hours', targetValue: '720.0000', warningThreshold: '500.0000', criticalThreshold: '200.0000', formula: 'Total Operating Hours / Number of Failures' },
    { code: 'MTTR', name: 'Mean Time To Repair', category: 'RELIABILITY' as const, unit: 'hours', targetValue: '4.0000', warningThreshold: '8.0000', criticalThreshold: '16.0000', formula: 'Total Repair Hours / Number of Repairs' },
    { code: 'AVAIL', name: 'Asset Availability', category: 'AVAILABILITY' as const, unit: '%', targetValue: '95.0000', warningThreshold: '90.0000', criticalThreshold: '80.0000', formula: 'MTBF / (MTBF + MTTR) × 100' },
    { code: 'PM-COMP', name: 'PM Compliance Rate', category: 'PERFORMANCE' as const, unit: '%', targetValue: '90.0000', warningThreshold: '80.0000', criticalThreshold: '70.0000', formula: 'Completed PMs / Scheduled PMs × 100' },
    { code: 'MAINT-COST', name: 'Maintenance Cost per RAV', category: 'COST' as const, unit: '%', targetValue: '3.0000', warningThreshold: '4.0000', criticalThreshold: '5.0000', formula: 'Annual Maint Cost / Replacement Asset Value × 100' },
    { code: 'SAFETY-IR', name: 'Incident Rate', category: 'SAFETY' as const, unit: 'per 200k hrs', targetValue: '1.0000', warningThreshold: '2.0000', criticalThreshold: '3.0000', formula: '(Incidents × 200000) / Total Hours Worked' },
    { code: 'WO-BKLG', name: 'Work Order Backlog', category: 'PERFORMANCE' as const, unit: 'weeks', targetValue: '3.0000', warningThreshold: '5.0000', criticalThreshold: '8.0000', formula: 'Ready Backlog Hours / Weekly Capacity Hours' },
    { code: 'COMPL', name: 'Regulatory Compliance Rate', category: 'COMPLIANCE' as const, unit: '%', targetValue: '100.0000', warningThreshold: '95.0000', criticalThreshold: '90.0000', formula: 'Passed Inspections / Total Inspections × 100' },
  ]) {
    await db.insert(kpiDefinitions).values({ tenantId: T, ...kpi, calculationFrequency: 'MONTHLY' });
  }

  // ════════════════════════════════════════════
  // 20. SERVICE REQUEST CATEGORIES & SAMPLE
  // ════════════════════════════════════════════
  console.log('  [20/20] Creating service request categories...');
  await db.insert(requestCategories).values([
    { tenantId: T, name: 'Equipment Malfunction', description: 'Report a broken or malfunctioning asset' },
    { tenantId: T, name: 'Facility Issue', description: 'Building, HVAC, plumbing, lighting' },
    { tenantId: T, name: 'Safety Concern', description: 'Report a safety hazard or near-miss' },
    { tenantId: T, name: 'General Maintenance', description: 'Routine maintenance request' },
    { tenantId: T, name: 'IT / Controls', description: 'PLC, network, SCADA issues' },
  ]);

  await db.insert(serviceRequests).values([
    { tenantId: T, requestNumber: 'SR-000001', subject: 'Pump A making unusual noise', description: 'Cooling water pump A has been making a high-pitched whining noise since yesterday morning. Getting louder.', status: 'IN_PROGRESS', priority: 'HIGH', requestedBy: adminUser.id, assetId: pumpA.id },
    { tenantId: T, requestNumber: 'SR-000002', subject: 'Warehouse overhead light out', description: 'Section C3 overhead LED light is flickering and needs replacement.', status: 'OPEN', priority: 'LOW', requestedBy: techUser2.id },
    { tenantId: T, requestNumber: 'SR-000003', subject: 'Oil leak near compressor #2', description: 'Small oil puddle forming under compressor #2. Appears to be from a drain valve.', status: 'OPEN', priority: 'MEDIUM', requestedBy: techUser1.id, assetId: compressor2.id },
  ]);

  // ════════════════════════════════════════════
  // DONE
  // ════════════════════════════════════════════
  console.log('\n══════════════════════════════════════════');
  console.log('✅ Seed completed successfully!');
  console.log('══════════════════════════════════════════');
  console.log(`  Tenant:     ${tenant.name} (${T})`);
  console.log(`  Users:      6 (admin + 5 staff)`);
  console.log(`  Roles:      5`);
  console.log(`  Assets:     12 (4 types, 9 locations)`);
  console.log(`  Asset Types: 19 (5 parent + 14 sub)`);
  console.log(`  Work Orders: 8 (various statuses)`);
  console.log(`  Maint Plans: 6 (PM + PdM)`);
  console.log(`  Stock Items: 10 (3 storerooms)`);
  console.log(`  Vendors:     6`);
  console.log(`  KPIs:        9`);
  console.log(`  SLAs:        3 with 5 targets`);
  console.log(`  Regulations: 4 with 6 requirements`);
  console.log(`  Failure Codes: 8, Cause Codes: 7`);
  console.log(`\n  Login: admin@acme-industrial.com`);
  console.log(`  (password hash is placeholder — accept any in dev mode)`);
}

seed()
  .then(() => closeDatabaseConnection())
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
