import { eq, and, count, desc, asc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  regulations, complianceRequirements, inspections, violations,
  correctiveActions, auditReports, requirementAssetMap,
} from '@eamaim/database/schema';

export class RegulatoryService {
  async findAllRegulations(tenantId: string) {
    return db.select().from(regulations).where(eq(regulations.tenantId, tenantId)).orderBy(asc(regulations.code));
  }

  async getRequirements(tenantId: string, regulationId?: string) {
    const conditions = [eq(complianceRequirements.tenantId, tenantId)];
    if (regulationId) conditions.push(eq(complianceRequirements.regulationId, regulationId));
    return db.select().from(complianceRequirements).where(and(...conditions));
  }

  async findAllInspections(tenantId: string, options: { assetId?: string; result?: string; page?: number; limit?: number } = {}) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100);
    const conditions = [eq(inspections.tenantId, tenantId)];
    if (options.assetId) conditions.push(eq(inspections.assetId, options.assetId));
    if (options.result) conditions.push(eq(inspections.result, options.result as any));
    const where = and(...conditions);
    const [data, [{ total }]] = await Promise.all([
      db.select().from(inspections).where(where).orderBy(desc(inspections.inspectionDate)).limit(limit).offset((page - 1) * limit),
      db.select({ total: count() }).from(inspections).where(where),
    ]);
    return { data, pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) } };
  }

  async createInspection(tenantId: string, data: any) {
    const [inspection] = await db.insert(inspections).values({ ...data, tenantId }).returning();
    return inspection;
  }

  async findAllViolations(tenantId: string, options: { status?: string } = {}) {
    const conditions = [eq(violations.tenantId, tenantId)];
    if (options.status) conditions.push(eq(violations.status, options.status as any));
    return db.select().from(violations).where(and(...conditions)).orderBy(desc(violations.violationDate));
  }

  async createViolation(tenantId: string, data: any) {
    const [violation] = await db.insert(violations).values({ ...data, tenantId }).returning();
    return violation;
  }

  async findAllCorrectiveActions(tenantId: string, options: { status?: string } = {}) {
    const conditions = [eq(correctiveActions.tenantId, tenantId)];
    if (options.status) conditions.push(eq(correctiveActions.status, options.status as any));
    return db.select().from(correctiveActions).where(and(...conditions));
  }

  async createCorrectiveAction(tenantId: string, data: any) {
    const [ca] = await db.insert(correctiveActions).values({ ...data, tenantId }).returning();
    return ca;
  }

  async getAuditReports(tenantId: string) {
    return db.select().from(auditReports).where(eq(auditReports.tenantId, tenantId)).orderBy(desc(auditReports.auditDate));
  }

  async getComplianceDashboard(tenantId: string) {
    const [totalReqs, passedInspections, openViolations, openCAs] = await Promise.all([
      db.select({ total: count() }).from(complianceRequirements).where(eq(complianceRequirements.tenantId, tenantId)),
      db.select({ total: count() }).from(inspections).where(and(eq(inspections.tenantId, tenantId), eq(inspections.result, 'PASS'))),
      db.select({ total: count() }).from(violations).where(and(eq(violations.tenantId, tenantId), eq(violations.status, 'OPEN'))),
      db.select({ total: count() }).from(correctiveActions).where(and(eq(correctiveActions.tenantId, tenantId), eq(correctiveActions.status, 'OPEN'))),
    ]);
    return {
      totalRequirements: Number(totalReqs[0].total),
      passedInspections: Number(passedInspections[0].total),
      openViolations: Number(openViolations[0].total),
      openCorrectiveActions: Number(openCAs[0].total),
    };
  }
}

export const regulatoryService = new RegulatoryService();
