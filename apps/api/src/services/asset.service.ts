import { eq, and, ilike, sql, desc, asc, count } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  assets, type Asset, type NewAsset,
  assetTypes,
  functionalLocations,
  assetHierarchy,
  assetAttributes,
  assetLifecycleEvents,
} from '@eamaim/database/schema';

export class AssetService {
  // ── List Assets with Pagination & Filtering ──
  async findAll(tenantId: string, options: {
    page?: number; limit?: number; search?: string;
    status?: string; criticality?: string; assetTypeId?: string;
    locationId?: string; sortBy?: string; sortOrder?: 'asc' | 'desc';
  } = {}) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100);
    const offset = (page - 1) * limit;

    const conditions = [eq(assets.tenantId, tenantId)];

    if (options.status) conditions.push(eq(assets.status, options.status as any));
    if (options.criticality) conditions.push(eq(assets.criticality, options.criticality as any));
    if (options.assetTypeId) conditions.push(eq(assets.assetTypeId, options.assetTypeId));
    if (options.locationId) conditions.push(eq(assets.functionalLocationId, options.locationId));
    if (options.search) {
      conditions.push(
        sql`(${assets.tagNumber} ILIKE ${'%' + options.search + '%'} OR ${assets.name} ILIKE ${'%' + options.search + '%'})`
      );
    }

    const where = and(...conditions);

    const [data, [{ total }]] = await Promise.all([
      db.select({
        id: assets.id,
        tagNumber: assets.tagNumber,
        name: assets.name,
        status: assets.status,
        criticality: assets.criticality,
        manufacturer: assets.manufacturer,
        model: assets.model,
        installDate: assets.installDate,
        assetTypeId: assets.assetTypeId,
        functionalLocationId: assets.functionalLocationId,
        createdAt: assets.createdAt,
      })
        .from(assets)
        .where(where)
        .orderBy(options.sortOrder === 'desc' ? desc(assets.createdAt) : asc(assets.tagNumber))
        .limit(limit)
        .offset(offset),

      db.select({ total: count() }).from(assets).where(where),
    ]);

    return {
      data,
      pagination: { page, limit, total: Number(total), totalPages: Math.ceil(Number(total) / limit) },
    };
  }

  // ── Get Single Asset with Related Data ──
  async findById(tenantId: string, id: string) {
    const [asset] = await db.select()
      .from(assets)
      .where(and(eq(assets.id, id), eq(assets.tenantId, tenantId)))
      .limit(1);

    if (!asset) return null;

    const [attributes, children, lifecycleEvents] = await Promise.all([
      db.select().from(assetAttributes)
        .where(and(eq(assetAttributes.assetId, id), eq(assetAttributes.tenantId, tenantId))),

      db.select({ id: assets.id, tagNumber: assets.tagNumber, name: assets.name, status: assets.status })
        .from(assets)
        .where(and(eq(assets.parentAssetId, id), eq(assets.tenantId, tenantId))),

      db.select().from(assetLifecycleEvents)
        .where(and(eq(assetLifecycleEvents.assetId, id), eq(assetLifecycleEvents.tenantId, tenantId)))
        .orderBy(desc(assetLifecycleEvents.eventDate))
        .limit(20),
    ]);

    return { ...asset, attributes, children, lifecycleEvents };
  }

  // ── Create Asset ──
  async create(tenantId: string, data: Omit<NewAsset, 'id' | 'tenantId' | 'createdAt'>) {
    const [asset] = await db.insert(assets)
      .values({ ...data, tenantId })
      .returning();
    return asset;
  }

  // ── Update Asset ──
  async update(tenantId: string, id: string, data: Partial<NewAsset>) {
    const [updated] = await db.update(assets)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(assets.id, id), eq(assets.tenantId, tenantId)))
      .returning();
    return updated || null;
  }

  // ── Soft Delete (set status to DISPOSED) ──
  async delete(tenantId: string, id: string) {
    const [updated] = await db.update(assets)
      .set({ status: 'DISPOSED', updatedAt: new Date() })
      .where(and(eq(assets.id, id), eq(assets.tenantId, tenantId)))
      .returning({ id: assets.id });
    return !!updated;
  }

  // ── Get Asset Hierarchy Tree ──
  async getHierarchy(tenantId: string, rootAssetId: string) {
    // Recursive CTE to build full tree
    const result = await db.execute(sql`
      WITH RECURSIVE asset_tree AS (
        SELECT id, tag_number, name, parent_asset_id, status, criticality, 0 AS depth
        FROM assets
        WHERE id = ${rootAssetId} AND tenant_id = ${tenantId}
        UNION ALL
        SELECT a.id, a.tag_number, a.name, a.parent_asset_id, a.status, a.criticality, t.depth + 1
        FROM assets a
        INNER JOIN asset_tree t ON a.parent_asset_id = t.id
        WHERE a.tenant_id = ${tenantId}
      )
      SELECT * FROM asset_tree ORDER BY depth, tag_number
    `);
    return result.rows;
  }

  // ── Asset Count by Status ──
  async getStatusSummary(tenantId: string) {
    const result = await db.select({
      status: assets.status,
      count: count(),
    })
      .from(assets)
      .where(eq(assets.tenantId, tenantId))
      .groupBy(assets.status);
    return result;
  }

  // ── Asset Count by Criticality ──
  async getCriticalitySummary(tenantId: string) {
    const result = await db.select({
      criticality: assets.criticality,
      count: count(),
    })
      .from(assets)
      .where(eq(assets.tenantId, tenantId))
      .groupBy(assets.criticality);
    return result;
  }
}

export const assetService = new AssetService();
