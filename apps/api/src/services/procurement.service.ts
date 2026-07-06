import { eq, and, count, desc, asc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  vendors, vendorRatings, purchaseRequisitions, purchaseOrders,
  poLineItems, goodsReceipts, goodsReceiptItems, invoiceMatching,
} from '@eamaim/database/schema';

export class ProcurementService {
  // ── Vendors ──
  async findAllVendors(tenantId: string, options: { page?: number; limit?: number; search?: string } = {}) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100);
    const conditions = [eq(vendors.tenantId, tenantId)];
    if (options.search) conditions.push(sql`${vendors.name} ILIKE ${'%' + options.search + '%'}`);
    const where = and(...conditions);
    const [data, [{ total }]] = await Promise.all([
      db.select().from(vendors).where(where).orderBy(asc(vendors.name)).limit(limit).offset((page - 1) * limit),
      db.select({ total: count() }).from(vendors).where(where),
    ]);
    return { data, pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) } };
  }

  async createVendor(tenantId: string, data: any) {
    const [vendor] = await db.insert(vendors).values({ ...data, tenantId }).returning();
    return vendor;
  }

  async updateVendor(tenantId: string, id: string, data: any) {
    const [updated] = await db.update(vendors).set(data).where(and(eq(vendors.id, id), eq(vendors.tenantId, tenantId))).returning();
    return updated || null;
  }

  // ── Purchase Requisitions ──
  async createRequisition(tenantId: string, data: any) {
    const [{ total }] = await db.select({ total: count() }).from(purchaseRequisitions).where(eq(purchaseRequisitions.tenantId, tenantId));
    const reqNumber = `PR-${String(Number(total) + 1).padStart(6, '0')}`;
    const [pr] = await db.insert(purchaseRequisitions).values({ ...data, tenantId, reqNumber }).returning();
    return pr;
  }

  // ── Purchase Orders ──
  async findAllPOs(tenantId: string, options: { page?: number; limit?: number; status?: string } = {}) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100);
    const conditions = [eq(purchaseOrders.tenantId, tenantId)];
    if (options.status) conditions.push(eq(purchaseOrders.status, options.status as any));
    const where = and(...conditions);
    const [data, [{ total }]] = await Promise.all([
      db.select().from(purchaseOrders).where(where).orderBy(desc(purchaseOrders.createdAt)).limit(limit).offset((page - 1) * limit),
      db.select({ total: count() }).from(purchaseOrders).where(where),
    ]);
    return { data, pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) } };
  }

  async createPO(tenantId: string, data: any) {
    const [{ total }] = await db.select({ total: count() }).from(purchaseOrders).where(eq(purchaseOrders.tenantId, tenantId));
    const poNumber = `PO-${String(Number(total) + 1).padStart(6, '0')}`;
    const [po] = await db.insert(purchaseOrders).values({ ...data, tenantId, poNumber }).returning();
    return po;
  }

  async findPOById(tenantId: string, id: string) {
    const [po] = await db.select().from(purchaseOrders).where(and(eq(purchaseOrders.id, id), eq(purchaseOrders.tenantId, tenantId))).limit(1);
    if (!po) return null;
    const lines = await db.select().from(poLineItems).where(eq(poLineItems.purchaseOrderId, id));
    return { ...po, lineItems: lines };
  }

  // ── Goods Receipt ──
  async receiveGoods(tenantId: string, data: any) {
    const [{ total }] = await db.select({ total: count() }).from(goodsReceipts).where(eq(goodsReceipts.tenantId, tenantId));
    const receiptNumber = `GR-${String(Number(total) + 1).padStart(6, '0')}`;
    const [receipt] = await db.insert(goodsReceipts).values({ ...data, tenantId, receiptNumber }).returning();
    return receipt;
  }
}

export const procurementService = new ProcurementService();
