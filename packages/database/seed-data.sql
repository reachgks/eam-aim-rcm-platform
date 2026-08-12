-- Corrected Seed data for EAM Platform
-- Tenant: ee744861-6863-4b86-a712-70a81a465553
-- User: 66f5f841-f10d-4658-afa8-a31c2e7944ae

-- Locations
INSERT INTO functional_locations (tenant_id, code, name, location_type) VALUES
  ('ee744861-6863-4b86-a712-70a81a465553', 'MAIN-001', 'Main Plant', 'SITE'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'BLDG-A', 'Building A - Production', 'BUILDING');

UPDATE functional_locations SET parent_id = (SELECT id FROM functional_locations WHERE code='MAIN-001' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553')
WHERE code='BLDG-A' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553';

-- Asset Types
INSERT INTO asset_types (tenant_id, name, code, category) VALUES
  ('ee744861-6863-4b86-a712-70a81a465553', 'Pump', 'PUMP', 'MECHANICAL'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'Motor', 'MOTOR', 'ELECTRICAL'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'Conveyor', 'CONV', 'MECHANICAL'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'HVAC Unit', 'HVAC', 'MECHANICAL'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'Transformer', 'XFMR', 'ELECTRICAL');

-- Assets
INSERT INTO assets (tenant_id, tag_number, name, asset_type_id, functional_location_id, status, criticality, install_date) VALUES
  ('ee744861-6863-4b86-a712-70a81a465553', 'AST-001', 'Centrifugal Pump P-101',
   (SELECT id FROM asset_types WHERE code='PUMP' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553' LIMIT 1),
   (SELECT id FROM functional_locations WHERE code='BLDG-A' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553' LIMIT 1),
   'ACTIVE', 'A', '2022-01-15'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'AST-002', 'Drive Motor M-201',
   (SELECT id FROM asset_types WHERE code='MOTOR' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553' LIMIT 1),
   (SELECT id FROM functional_locations WHERE code='BLDG-A' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553' LIMIT 1),
   'ACTIVE', 'B', '2021-06-20'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'AST-003', 'Main Conveyor CV-301',
   (SELECT id FROM asset_types WHERE code='CONV' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553' LIMIT 1),
   (SELECT id FROM functional_locations WHERE code='BLDG-A' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553' LIMIT 1),
   'ACTIVE', 'A', '2020-03-10'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'AST-004', 'Roof HVAC Unit AHU-01',
   (SELECT id FROM asset_types WHERE code='HVAC' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553' LIMIT 1),
   (SELECT id FROM functional_locations WHERE code='MAIN-001' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553' LIMIT 1),
   'ACTIVE', 'C', '2023-09-01'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'AST-005', 'Main Transformer TX-501',
   (SELECT id FROM asset_types WHERE code='XFMR' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553' LIMIT 1),
   (SELECT id FROM functional_locations WHERE code='MAIN-001' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553' LIMIT 1),
   'ACTIVE', 'A', '2019-11-30');

-- Work Orders
INSERT INTO work_orders (tenant_id, wo_number, description, asset_id, type, status, priority, assigned_to) VALUES
  ('ee744861-6863-4b86-a712-70a81a465553', 'WO-2024-001', 'Replace pump seals on P-101',
   (SELECT id FROM assets WHERE tag_number='AST-001' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553'),
   'CORRECTIVE', 'IN_PROGRESS', 'HIGH', '66f5f841-f10d-4658-afa8-a31c2e7944ae'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'WO-2024-002', 'Quarterly motor inspection',
   (SELECT id FROM assets WHERE tag_number='AST-002' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553'),
   'PREVENTIVE', 'PLANNED', 'MEDIUM', '66f5f841-f10d-4658-afa8-a31c2e7944ae'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'WO-2024-003', 'Belt replacement on conveyor',
   (SELECT id FROM assets WHERE tag_number='AST-003' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553'),
   'CORRECTIVE', 'IN_PROGRESS', 'CRITICAL', '66f5f841-f10d-4658-afa8-a31c2e7944ae'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'WO-2024-004', 'HVAC filter replacement',
   (SELECT id FROM assets WHERE tag_number='AST-004' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553'),
   'PREVENTIVE', 'COMPLETED', 'LOW', '66f5f841-f10d-4658-afa8-a31c2e7944ae'),
  ('ee744861-6863-4b86-a712-70a81a465553', 'WO-2024-005', 'Transformer oil analysis',
   (SELECT id FROM assets WHERE tag_number='AST-005' AND tenant_id='ee744861-6863-4b86-a712-70a81a465553'),
   'PREDICTIVE', 'PLANNED', 'MEDIUM', '66f5f841-f10d-4658-afa8-a31c2e7944ae');

-- Stock Items (correct columns: part_number, description, unit_of_issue)
INSERT INTO stock_items (tenant_id, part_number, description, category, unit_of_issue, is_critical_spare, lead_time_days) VALUES
  ('ee744861-6863-4b86-a712-70a81a465553', 'SP-001', 'Mechanical Seal Kit', 'Spare Parts', 'EA', true, 14),
  ('ee744861-6863-4b86-a712-70a81a465553', 'SP-002', 'V-Belt B68', 'Spare Parts', 'EA', false, 7),
  ('ee744861-6863-4b86-a712-70a81a465553', 'SP-003', 'Bearing 6205-2RS', 'Spare Parts', 'EA', true, 10),
  ('ee744861-6863-4b86-a712-70a81a465553', 'LB-001', 'Hydraulic Oil ISO 46', 'Consumables', 'L', false, 5);

-- Storerooms
INSERT INTO storerooms (tenant_id, code, name) VALUES
  ('ee744861-6863-4b86-a712-70a81a465553', 'WH-01', 'Main Warehouse');
