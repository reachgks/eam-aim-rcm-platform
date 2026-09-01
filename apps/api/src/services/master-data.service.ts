import { eq, and, ilike, count, asc, desc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  assetTypes, functionalLocations, uniclassCodes, failureCodes, causeCodes,
  storerooms, stockItems, vendors, permitTypes, costCenters,
  slaDefinitions, regulations, kpiDefinitions, requestCategories,
  crafts, users,
} from '@eamaim/database/schema';

const TABLE_REGISTRY: Record<string, { table: any; label: string; columns: { key: string; dbCol: string; label: string; required?: boolean; type?: string }[] }> = {
  'asset-types': {
    table: assetTypes,
    label: 'Asset Types',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'description', dbCol: 'description', label: 'Description' },
      { key: 'category', dbCol: 'category', label: 'Category' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'functional-locations': {
    table: functionalLocations,
    label: 'Functional Locations',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'description', dbCol: 'description', label: 'Description' },
      { key: 'locationType', dbCol: 'location_type', label: 'Type', required: true },
      { key: 'address', dbCol: 'address', label: 'Address' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'failure-codes': {
    table: failureCodes,
    label: 'Failure Codes',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'description', dbCol: 'description', label: 'Description' },
      { key: 'category', dbCol: 'category', label: 'Category' },
      { key: 'iso14224Ref', dbCol: 'iso14224_ref', label: 'ISO 14224 Ref' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'cause-codes': {
    table: causeCodes,
    label: 'Cause Codes',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'description', dbCol: 'description', label: 'Description' },
      { key: 'category', dbCol: 'category', label: 'Category' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'storerooms': {
    table: storerooms,
    label: 'Storerooms / Warehouses',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'type', dbCol: 'type', label: 'Type' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'stock-items': {
    table: stockItems,
    label: 'Stock Items / Spare Parts',
    columns: [
      { key: 'partNumber', dbCol: 'part_number', label: 'Part Number', required: true },
      { key: 'description', dbCol: 'description', label: 'Description', required: true },
      { key: 'category', dbCol: 'category', label: 'Category' },
      { key: 'unitOfIssue', dbCol: 'unit_of_issue', label: 'UoI', required: true },
      { key: 'manufacturer', dbCol: 'manufacturer', label: 'Manufacturer' },
      { key: 'manufacturerPartNo', dbCol: 'manufacturer_part_no', label: 'MFR Part No' },
      { key: 'isCriticalSpare', dbCol: 'is_critical_spare', label: 'Critical Spare', type: 'boolean' },
      { key: 'leadTimeDays', dbCol: 'lead_time_days', label: 'Lead Time (days)', type: 'number' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'vendors': {
    table: vendors,
    label: 'Vendors / Suppliers',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'type', dbCol: 'type', label: 'Type' },
      { key: 'contactName', dbCol: 'contact_name', label: 'Contact' },
      { key: 'email', dbCol: 'email', label: 'Email' },
      { key: 'phone', dbCol: 'phone', label: 'Phone' },
      { key: 'address', dbCol: 'address', label: 'Address' },
      { key: 'currency', dbCol: 'currency', label: 'Currency' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'permit-types': {
    table: permitTypes,
    label: 'Permit Types',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'description', dbCol: 'description', label: 'Description' },
      { key: 'requiredApprovals', dbCol: 'required_approvals', label: 'Approvals Required', type: 'number' },
      { key: 'maxDurationHours', dbCol: 'max_duration_hours', label: 'Max Duration (hrs)', type: 'number' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'cost-centers': {
    table: costCenters,
    label: 'Cost Centers',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'sla-definitions': {
    table: slaDefinitions,
    label: 'SLA Definitions',
    columns: [
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'description', dbCol: 'description', label: 'Description' },
      { key: 'category', dbCol: 'category', label: 'Category' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'regulations': {
    table: regulations,
    label: 'Regulations',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'description', dbCol: 'description', label: 'Description' },
      { key: 'authority', dbCol: 'authority', label: 'Authority', required: true },
      { key: 'jurisdiction', dbCol: 'jurisdiction', label: 'Jurisdiction' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'kpi-definitions': {
    table: kpiDefinitions,
    label: 'KPI Definitions',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'description', dbCol: 'description', label: 'Description' },
      { key: 'category', dbCol: 'category', label: 'Category', required: true },
      { key: 'formula', dbCol: 'formula', label: 'Formula' },
      { key: 'unit', dbCol: 'unit', label: 'Unit' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'request-categories': {
    table: requestCategories,
    label: 'Request Categories',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'description', dbCol: 'description', label: 'Description' },
      { key: 'defaultPriority', dbCol: 'default_priority', label: 'Default Priority' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
  'crafts': {
    table: crafts,
    label: 'Labor Crafts',
    columns: [
      { key: 'code', dbCol: 'code', label: 'Code', required: true },
      { key: 'name', dbCol: 'name', label: 'Name', required: true },
      { key: 'description', dbCol: 'description', label: 'Description' },
      { key: 'isActive', dbCol: 'is_active', label: 'Active', type: 'boolean' },
    ],
  },
};

export class MasterDataService {
  getRegistry() {
    return Object.entries(TABLE_REGISTRY).map(([key, config]) => ({
      key,
      label: config.label,
      columns: config.columns,
    }));
  }

  async getRecords(tenantId: string, tableKey: string, query: { page?: number; limit?: number; search?: string }) {
    const config = TABLE_REGISTRY[tableKey];
    if (!config) throw new Error(`Table ${tableKey} not found`);

    const { table } = config;
    const page = query.page || 1;
    const limit = query.limit || 50;
    const offset = (page - 1) * limit;

    let whereClause = eq(table.tenantId, tenantId);
    if (query.search && table.name) {
      whereClause = and(whereClause, ilike(table.name, `%${query.search}%`)) as any;
    }

    const records = await db.select().from(table).where(whereClause).limit(limit).offset(offset);
    const [{ total }] = await db.select({ total: count() }).from(table).where(whereClause);

    return { data: records, total, page, limit };
  }

  async createRecord(tenantId: string, tableKey: string, data: any) {
    const config = TABLE_REGISTRY[tableKey];
    if (!config) throw new Error(`Table ${tableKey} not found`);

    const payload = { ...data, tenantId };
    const [inserted] = await db.insert(config.table).values(payload).returning();
    return inserted;
  }

  async updateRecord(tenantId: string, tableKey: string, id: string, data: any) {
    const config = TABLE_REGISTRY[tableKey];
    if (!config) throw new Error(`Table ${tableKey} not found`);

    const [updated] = await db
      .update(config.table)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(config.table.id, id), eq(config.table.tenantId, tenantId)))
      .returning();

    return updated;
  }

  async deleteRecord(tenantId: string, tableKey: string, id: string) {
    const config = TABLE_REGISTRY[tableKey];
    if (!config) throw new Error(`Table ${tableKey} not found`);

    const [deleted] = await db
      .delete(config.table)
      .where(and(eq(config.table.id, id), eq(config.table.tenantId, tenantId)))
      .returning();

    return deleted;
  }

  async importCsv(tenantId: string, tableKey: string, csvContent: string) {
    const config = TABLE_REGISTRY[tableKey];
    if (!config) throw new Error(`Table ${tableKey} not found`);

    const lines = csvContent.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) throw new Error('Empty CSV');

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    // Map headers to column keys
    const colMap: Record<string, string> = {};
    for (const col of config.columns) {
      if (headers.includes(col.key)) colMap[col.key] = col.key;
      else if (headers.includes(col.label)) colMap[col.label] = col.key;
      else if (headers.includes(col.dbCol)) colMap[col.dbCol] = col.key;
    }

    const recordsToInsert = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Basic CSV parsing for quoted fields
      const row = lines[i];
      let rowValues = [];
      let currentVal = '';
      let inQuotes = false;
      
      for (let j = 0; j < row.length; j++) {
        const char = row[j];
        if (char === '"' && row[j + 1] === '"') {
          currentVal += '"';
          j++;
        } else if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          rowValues.push(currentVal);
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      rowValues.push(currentVal);

      if (rowValues.length !== headers.length) {
        errors.push(`Row ${i + 1}: Invalid number of columns`);
        continue;
      }

      const parsedRecord: any = { tenantId };
      let hasError = false;

      headers.forEach((header, index) => {
        const colKey = colMap[header];
        if (colKey) {
          let val: any = rowValues[index].trim();
          
          const colDef = config.columns.find(c => c.key === colKey);
          if (colDef) {
            if (colDef.type === 'boolean') {
              val = val.toLowerCase() === 'true' || val === '1' || val.toLowerCase() === 'yes';
            } else if (colDef.type === 'number') {
              val = val === '' ? null : Number(val);
            } else if (val === '') {
              val = null;
            }

            if (colDef.required && (val === null || val === undefined)) {
              errors.push(`Row ${i + 1}: Missing required field ${colDef.label}`);
              hasError = true;
            }

            parsedRecord[colKey] = val;
          }
        }
      });

      if (!hasError) recordsToInsert.push(parsedRecord);
    }

    let inserted = 0;
    // Batch insert
    const BATCH_SIZE = 100;
    for (let i = 0; i < recordsToInsert.length; i += BATCH_SIZE) {
      const batch = recordsToInsert.slice(i, i + BATCH_SIZE);
      if (batch.length > 0) {
        await db.insert(config.table).values(batch);
        inserted += batch.length;
      }
    }

    return { inserted, errors };
  }

  async exportCsv(tenantId: string, tableKey: string): Promise<string> {
    const config = TABLE_REGISTRY[tableKey];
    if (!config) throw new Error(`Table ${tableKey} not found`);

    const records = await db.select().from(config.table).where(eq(config.table.tenantId, tenantId));
    
    if (records.length === 0) {
      return config.columns.map(c => c.label).join(',') + '\n';
    }

    const headers = config.columns.map(c => c.label).join(',');
    const rows = records.map(record => {
      return config.columns.map(col => {
        const val = record[col.key];
        if (val === null || val === undefined) return '';
        const valStr = String(val).replace(/"/g, '""');
        return `"${valStr}"`;
      }).join(',');
    });

    return [headers, ...rows].join('\n');
  }
}

export const masterDataService = new MasterDataService();
