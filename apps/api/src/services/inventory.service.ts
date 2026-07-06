import { eq, and, count, desc, asc, sql } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  stockItems, stockLevels, stockTransactions, storerooms,
  billOfMaterials, reorderRules,
} from '@eamaim/database/schema';

export class InventoryService {
  async findAllStockItems(tenantId: string, options: { page?: number; limit?: number; search?: string; storeroomId?: string } = {}) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100);
    const offset = (page - 1) * limit;
    const conditions = [eq(stockItems.tenantId, tenantId)];

    if (options.search) {
      conditions.push(sql`(${stockItems.itemCode} ILIKE ${'%' + options.search + '%'} OR ${stockItems.name} ILIKE ${'%' + options.search + '%'})`);
    }

    const where = and(...conditions);
    const [data, [{ total }]] = await Promise.all([
      db.select().from(stockItems).where(where).orderBy(asc(stockItems.itemCode)).limit(limit).offset(offset),
      db.select({ total: count() }).from(stockItems).where(where),
    ]);
    return { data, pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) } };
  }

  async findStockItemById(tenantId: string, id: string) {
    const [item] = await db.select().from(stockItems).where(and(eq(stockItems.id, id), eq(stockItems.tenantId, tenantId))).limit(1);
    if (!item) return null;
    const levels = await db.select().from(stockLevels).where(eq(stockLevels.stockItemId, id));
    return { ...item, levels };
  }

  async createStockItem(tenantId: string, data: any) {
    const [item] = await db.insert(stockItems).values({ ...data, tenantId }).returning();
    return item;
  }

  async updateStockItem(tenantId: string, id: string, data: any) {
    const [updated] = await db.update(stockItems).set(data).where(and(eq(stockItems.id, id), eq(stockItems.tenantId, tenantId))).returning();
    return updated || null;
  }

  async recordTransaction(tenantId: string, data: any) {
    const [tx] = await db.insert(stockTransactions).values({ ...data, tenantId }).returning();
    // Update stock level
    if (data.stockLevelId) {
      const delta = data.transactionType === 'ISSUE' ? -Number(data.quantity) : Number(data.quantity);
      await db.execute(sql`UPDATE stock_levels SET quantity_on_hand = quantity_on_hand + ${delta} WHERE id = ${data.stockLevelId}`);
    }
    return tx;
  }

  async getStorerooms(tenantId: string) {
    return db.select().from(storerooms).where(eq(storerooms.tenantId, tenantId)).orderBy(asc(storerooms.name));
  }

  async getBomForAsset(tenantId: string, assetId: string) {
    return db.select().from(billOfMaterials).where(and(eq(billOfMaterials.tenantId, tenantId), eq(billOfMaterials.assetId, assetId)));
  }

  async checkReorderPoints(tenantId: string) {
    const result = await db.execute(sql`
      SELECT sl.id, si.item_code, si.name, sl.quantity_on_hand, rr.reorder_point, rr.reorder_quantity, s.name as storeroom
      FROM stock_levels sl
      JOIN stock_items si ON sl.stock_item_id = si.id
      JOIN reorder_rules rr ON rr.stock_item_id = si.id
      LEFT JOIN storerooms s ON sl.storeroom_id = s.id
      WHERE si.tenant_id = ${tenantId}
        AND sl.quantity_on_hand <= rr.reorder_point
      ORDER BY sl.quantity_on_hand ASC
    `);
    return result.rows;
  }
}

export const inventoryService = new InventoryService();
