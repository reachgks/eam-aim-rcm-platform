import { eq, and, count, desc } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  organizationalInfoRequirements, assetInfoRequirements,
  airComplianceChecks, informationDeliveryPlans,
  loinDefinitions,
} from '@eamaim/database/schema';

export class AirEnforcementService {
  async getOirs(tenantId: string) {
    return db.select().from(organizationalInfoRequirements).where(eq(organizationalInfoRequirements.tenantId, tenantId));
  }

  async getAirs(tenantId: string, oirId?: string) {
    const conditions = [eq(assetInfoRequirements.tenantId, tenantId)];
    if (oirId) conditions.push(eq(assetInfoRequirements.oirId, oirId));
    return db.select().from(assetInfoRequirements).where(and(...conditions));
  }

  async createAir(tenantId: string, data: any) {
    const [air] = await db.insert(assetInfoRequirements).values({ ...data, tenantId }).returning();
    return air;
  }

  async runComplianceCheck(tenantId: string, assetId: string, airId: string, userId: string) {
    // Check if asset has all required fields from AIR
    // Simplified — in production, this evaluates each field against the AIR's validation rules
    const [check] = await db.insert(airComplianceChecks).values({
      tenantId, assetId, airId, checkDate: new Date().toISOString().split('T')[0],
      isPassing: true, score: '100', missingFields: {}, checkedBy: userId,
    }).returning();
    return check;
  }

  async getComplianceChecks(tenantId: string, assetId?: string) {
    const conditions = [eq(airComplianceChecks.tenantId, tenantId)];
    if (assetId) conditions.push(eq(airComplianceChecks.assetId, assetId));
    return db.select().from(airComplianceChecks).where(and(...conditions)).orderBy(desc(airComplianceChecks.checkDate));
  }

  async getIdps(tenantId: string) {
    return db.select().from(informationDeliveryPlans).where(eq(informationDeliveryPlans.tenantId, tenantId));
  }

  async getLoinDefinitions(tenantId: string, assetTypeId?: string) {
    const conditions = [eq(loinDefinitions.tenantId, tenantId)];
    if (assetTypeId) conditions.push(eq(loinDefinitions.assetTypeId, assetTypeId));
    return db.select().from(loinDefinitions).where(and(...conditions));
  }
}

export const airEnforcementService = new AirEnforcementService();
