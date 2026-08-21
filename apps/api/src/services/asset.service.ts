import { eq, and, ilike, sql, desc, asc, count } from 'drizzle-orm';
import { db } from '@eamaim/database';
import {
  assets, type Asset, type NewAsset,
  assetTypes,
  functionalLocations,
  assetHierarchy,
  assetAttributes,
  assetLifecycleEvents,
  sensorRegistry,
  assetApprovals,
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
        parentAssetId: assets.parentAssetId,
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

    const [attributes, children, lifecycleEvents, approvals, sensors] = await Promise.all([
      db.select().from(assetAttributes)
        .where(and(eq(assetAttributes.assetId, id), eq(assetAttributes.tenantId, tenantId))),

      db.select({ id: assets.id, tagNumber: assets.tagNumber, name: assets.name, status: assets.status })
        .from(assets)
        .where(and(eq(assets.parentAssetId, id), eq(assets.tenantId, tenantId))),

      db.select().from(assetLifecycleEvents)
        .where(and(eq(assetLifecycleEvents.assetId, id), eq(assetLifecycleEvents.tenantId, tenantId)))
        .orderBy(desc(assetLifecycleEvents.eventDate))
        .limit(20),

      db.select().from(assetApprovals)
        .where(and(eq(assetApprovals.assetId, id), eq(assetApprovals.tenantId, tenantId)))
        .orderBy(asc(assetApprovals.approvalStep)),

      db.select().from(sensorRegistry)
        .where(and(eq(sensorRegistry.assetId, id), eq(sensorRegistry.tenantId, tenantId))),
    ]);

    return { ...asset, attributes, children, lifecycleEvents, approvals, sensors };
  }

  // ── Create Asset (with approval workflow) ──
  async create(tenantId: string, data: any) {
    const { sensors, ...assetData } = data;

    // Insert the asset
    const [asset] = await db.insert(assets)
      .values({ ...assetData, tenantId })
      .returning();

    // Approval workflow based on criticality
    const criticality = asset.criticality;
    if (criticality === 'A') {
      // 2-step approval: Engineer then Manager
      await db.insert(assetApprovals).values([
        { tenantId, assetId: asset.id, approvalStep: 1, approverRole: 'ENGINEER', status: 'PENDING' },
        { tenantId, assetId: asset.id, approvalStep: 2, approverRole: 'MANAGER', status: 'PENDING' },
      ]);
      await db.update(assets).set({ status: 'PENDING_APPROVAL' }).where(eq(assets.id, asset.id));
      asset.status = 'PENDING_APPROVAL';
    } else if (criticality === 'B') {
      // 1-step approval: Manager
      await db.insert(assetApprovals).values([
        { tenantId, assetId: asset.id, approvalStep: 1, approverRole: 'MANAGER', status: 'PENDING' },
      ]);
      await db.update(assets).set({ status: 'PENDING_APPROVAL' }).where(eq(assets.id, asset.id));
      asset.status = 'PENDING_APPROVAL';
    }
    // C and D: no approval needed, stays in PLANNED

    // Register sensors if provided
    if (sensors && Array.isArray(sensors) && sensors.length > 0) {
      await db.insert(sensorRegistry).values(
        sensors.map((s: any) => ({ ...s, tenantId, assetId: asset.id }))
      );
    }

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
    return db.select({ status: assets.status, count: count() })
      .from(assets)
      .where(eq(assets.tenantId, tenantId))
      .groupBy(assets.status);
  }

  // ── Asset Count by Criticality ──
  async getCriticalitySummary(tenantId: string) {
    return db.select({ criticality: assets.criticality, count: count() })
      .from(assets)
      .where(eq(assets.tenantId, tenantId))
      .groupBy(assets.criticality);
  }

  // ── Get Functional Locations ──
  async getLocations(tenantId: string) {
    return db.select({
      id: functionalLocations.id,
      code: functionalLocations.code,
      name: functionalLocations.name,
      locationType: functionalLocations.locationType,
      parentId: functionalLocations.parentId,
    })
      .from(functionalLocations)
      .where(and(eq(functionalLocations.tenantId, tenantId), eq(functionalLocations.isActive, true)))
      .orderBy(asc(functionalLocations.code));
  }

  // ── Get Asset Types ──
  async getAssetTypes(tenantId: string) {
    return db.select({
      id: assetTypes.id,
      code: assetTypes.code,
      name: assetTypes.name,
      category: assetTypes.category,
    })
      .from(assetTypes)
      .where(and(eq(assetTypes.tenantId, tenantId), eq(assetTypes.isActive, true)))
      .orderBy(asc(assetTypes.name));
  }

  // ── Simple Asset List (for parent picker) ──
  async getSimpleList(tenantId: string) {
    return db.select({
      id: assets.id,
      tagNumber: assets.tagNumber,
      name: assets.name,
      parentAssetId: assets.parentAssetId,
    })
      .from(assets)
      .where(and(eq(assets.tenantId, tenantId), sql`${assets.status} != 'DISPOSED'`))
      .orderBy(asc(assets.tagNumber));
  }

  // ── Get Approvals for Asset ──
  async getApprovals(tenantId: string, assetId: string) {
    return db.select().from(assetApprovals)
      .where(and(eq(assetApprovals.tenantId, tenantId), eq(assetApprovals.assetId, assetId)))
      .orderBy(asc(assetApprovals.approvalStep));
  }

  // ── Process Approval Decision ──
  async processApproval(tenantId: string, assetId: string, approvalId: string, approverId: string, decision: 'APPROVED' | 'REJECTED', comments?: string) {
    // Update the approval record
    const [updated] = await db.update(assetApprovals)
      .set({ status: decision, approverId, comments, decidedAt: new Date() })
      .where(and(eq(assetApprovals.id, approvalId), eq(assetApprovals.tenantId, tenantId)))
      .returning();

    if (!updated) return null;

    if (decision === 'REJECTED') {
      // If rejected, set asset status back to PLANNED
      await db.update(assets).set({ status: 'PLANNED', updatedAt: new Date() }).where(eq(assets.id, assetId));
      return { ...updated, assetStatus: 'PLANNED' };
    }

    // Check if all approval steps are now approved
    const remainingPending = await db.select({ total: count() }).from(assetApprovals)
      .where(and(
        eq(assetApprovals.assetId, assetId),
        eq(assetApprovals.tenantId, tenantId),
        eq(assetApprovals.status, 'PENDING'),
      ));

    if (Number(remainingPending[0].total) === 0) {
      // All steps approved — activate the asset
      await db.update(assets).set({ status: 'ACTIVE', updatedAt: new Date() }).where(eq(assets.id, assetId));
      return { ...updated, assetStatus: 'ACTIVE' };
    }

    return { ...updated, assetStatus: 'PENDING_APPROVAL' };
  }
}

export const assetService = new AssetService();
