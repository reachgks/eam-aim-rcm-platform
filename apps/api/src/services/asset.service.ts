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

// ── Valid Status Transitions ──
// Defines which status transitions are allowed and what approval is needed
const STATUS_TRANSITIONS: Record<string, { next: string[]; approverRole: string; label: string }[]> = {
  'PLANNED':          [{ next: ['INSTALLED'], approverRole: 'ENGINEER', label: 'Install' }],
  'INSTALLED':        [{ next: ['ACTIVE'], approverRole: 'MANAGER', label: 'Activate' }],
  'ACTIVE':           [
    { next: ['INACTIVE'], approverRole: 'MANAGER', label: 'Deactivate' },
    { next: ['DECOMMISSIONED'], approverRole: 'MANAGER', label: 'Decommission' },
  ],
  'INACTIVE':         [
    { next: ['ACTIVE'], approverRole: 'MANAGER', label: 'Re-activate' },
    { next: ['DECOMMISSIONED'], approverRole: 'MANAGER', label: 'Decommission' },
  ],
  'DECOMMISSIONED':   [{ next: ['DISPOSED'], approverRole: 'TENANT_ADMIN', label: 'Dispose' }],
  'PENDING_APPROVAL': [],
  'DISPOSED':         [],
};

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

      db.execute(sql`
        SELECT id, tenant_id as "tenantId", asset_id as "assetId", approval_type as "approvalType",
               approval_step as "approvalStep", approver_role as "approverRole", approver_id as "approverId",
               status, requested_status as "requestedStatus", previous_status as "previousStatus",
               requested_by as "requestedBy", comments, decided_at as "decidedAt", created_at as "createdAt"
        FROM asset_approvals
        WHERE asset_id = ${id} AND tenant_id = ${tenantId}
        ORDER BY created_at DESC LIMIT 20
      `).then(r => r.rows),

      db.select().from(sensorRegistry)
        .where(and(eq(sensorRegistry.assetId, id), eq(sensorRegistry.tenantId, tenantId))),
    ]);

    // Get allowed transitions for current status
    const transitions = this.getAllowedTransitions(asset.status);

    return { ...asset, attributes, children, lifecycleEvents, approvals, sensors, allowedTransitions: transitions };
  }

  // ── Get Allowed Transitions for a Status ──
  getAllowedTransitions(currentStatus: string) {
    const rules = STATUS_TRANSITIONS[currentStatus] || [];
    return rules.map(r => ({
      targetStatus: r.next[0],
      label: r.label,
      approverRole: r.approverRole,
    }));
  }

  // ── Request Status Transition (creates approval record) ──
  async requestStatusTransition(tenantId: string, assetId: string, requestedStatus: string, requestedBy: string, comments?: string) {
    // Fetch current asset
    const [asset] = await db.select()
      .from(assets)
      .where(and(eq(assets.id, assetId), eq(assets.tenantId, tenantId)))
      .limit(1);

    if (!asset) return { error: 'Asset not found' };

    // Validate transition
    const rules = STATUS_TRANSITIONS[asset.status] || [];
    const rule = rules.find(r => r.next.includes(requestedStatus));
    if (!rule) return { error: `Invalid transition from ${asset.status} to ${requestedStatus}` };

    // Check if there's already a pending transition
    const pendingTransitions = await db.select({ total: count() })
      .from(assetApprovals)
      .where(and(
        eq(assetApprovals.assetId, assetId),
        eq(assetApprovals.tenantId, tenantId),
        sql`approval_type = 'STATUS_CHANGE'`,
        eq(assetApprovals.status, 'PENDING'),
      ));

    if (Number(pendingTransitions[0].total) > 0) {
      return { error: 'There is already a pending status change request for this asset' };
    }

    // Determine approval steps based on criticality
    const approvalSteps: { step: number; role: string }[] = [];
    if (asset.criticality === 'A') {
      // Critical assets: 2-step approval
      approvalSteps.push({ step: 1, role: rule.approverRole });
      if (rule.approverRole !== 'TENANT_ADMIN') {
        approvalSteps.push({ step: 2, role: 'TENANT_ADMIN' });
      }
    } else if (asset.criticality === 'B') {
      // Important assets: 1-step by MANAGER+
      approvalSteps.push({ step: 1, role: rule.approverRole });
    } else {
      // Standard/Non-critical: 1-step by ENGINEER
      approvalSteps.push({ step: 1, role: 'ENGINEER' });
    }

    // Create approval records using raw SQL to include dynamically-added columns
    const inserted = [];
    const reqBy = requestedBy || null;
    const commentText = comments || `Request to change status from ${asset.status} to ${requestedStatus}`;
    for (const s of approvalSteps) {
      const result = await db.execute(sql`
        INSERT INTO asset_approvals (tenant_id, asset_id, approval_type, approval_step, approver_role, status, requested_status, previous_status, requested_by, comments)
        VALUES (${tenantId}, ${assetId}, 'STATUS_CHANGE', ${s.step}, ${s.role}, 'PENDING', ${requestedStatus}, ${asset.status}, ${reqBy}, ${commentText})
        RETURNING *
      `);
      inserted.push(result.rows[0]);
    }

    // Update asset status to PENDING_APPROVAL
    await db.update(assets)
      .set({ status: 'PENDING_APPROVAL', updatedAt: new Date() })
      .where(eq(assets.id, assetId));

    // Record lifecycle event
    const eventTypeMap: Record<string, string> = {
      'INSTALLED': 'INSTALLATION',
      'ACTIVE': 'COMMISSIONING',
      'INACTIVE': 'MAINTENANCE',
      'DECOMMISSIONED': 'DECOMMISSION',
      'DISPOSED': 'DISPOSAL',
    };

    await db.insert(assetLifecycleEvents).values({
      tenantId,
      assetId,
      eventType: (eventTypeMap[requestedStatus] || 'MODIFICATION') as any,
      eventDate: new Date().toISOString().split('T')[0],
      description: `Status change requested: ${asset.status} → ${requestedStatus}`,
      performedBy: requestedBy,
    });

    return {
      success: true,
      approvals: inserted,
      message: `Status change to ${requestedStatus} submitted for approval (${approvalSteps.length} step${approvalSteps.length > 1 ? 's' : ''})`,
    };
  }

  // ── Process Status Transition Approval ──
  async processStatusApproval(tenantId: string, assetId: string, approvalId: string, approverId: string, decision: 'APPROVED' | 'REJECTED', comments?: string) {
    // Get the approval record using raw SQL to read dynamically-added columns
    const approvalResult = await db.execute(sql`
      SELECT id, status, requested_status, previous_status, approval_type
      FROM asset_approvals
      WHERE id = ${approvalId} AND tenant_id = ${tenantId} AND approval_type = 'STATUS_CHANGE'
      LIMIT 1
    `);

    if (!approvalResult.rows || approvalResult.rows.length === 0) return null;
    const approval = approvalResult.rows[0] as any;
    if (approval.status !== 'PENDING') return { error: 'Approval already processed' };

    // Update the approval record
    const [updated] = await db.update(assetApprovals)
      .set({ status: decision, approverId, comments, decidedAt: new Date() })
      .where(eq(assetApprovals.id, approvalId))
      .returning();

    if (decision === 'REJECTED') {
      // Cancel all pending approvals for this transition
      await db.update(assetApprovals)
        .set({ status: 'REJECTED', comments: 'Auto-rejected: previous step was rejected' })
        .where(and(
          eq(assetApprovals.assetId, assetId),
          eq(assetApprovals.tenantId, tenantId),
          sql`approval_type = 'STATUS_CHANGE'`,
          eq(assetApprovals.status, 'PENDING'),
        ));

      // Revert asset to previous status
      const revertStatus = approval.previous_status || 'PLANNED';
      await db.update(assets)
        .set({ status: revertStatus as any, updatedAt: new Date() })
        .where(eq(assets.id, assetId));

      // Record lifecycle event
      await db.insert(assetLifecycleEvents).values({
        tenantId,
        assetId,
        eventType: 'MODIFICATION' as any,
        eventDate: new Date().toISOString().split('T')[0],
        description: `Status change to ${approval.requested_status} was rejected. Reverted to ${revertStatus}.`,
        performedBy: approverId,
      });

      return { ...updated, assetStatus: revertStatus, outcome: 'REJECTED' };
    }

    // Check remaining pending steps for this transition batch
    const remainingPending = await db.select({ total: count() })
      .from(assetApprovals)
      .where(and(
        eq(assetApprovals.assetId, assetId),
        eq(assetApprovals.tenantId, tenantId),
        sql`approval_type = 'STATUS_CHANGE'`,
        eq(assetApprovals.status, 'PENDING'),
      ));

    if (Number(remainingPending[0].total) === 0) {
      // All steps approved — apply the status transition
      const newStatus = approval.requested_status || 'ACTIVE';
      await db.update(assets)
        .set({ status: newStatus as any, updatedAt: new Date() })
        .where(eq(assets.id, assetId));

      // Record lifecycle event
      const eventTypeMap: Record<string, string> = {
        'INSTALLED': 'INSTALLATION',
        'ACTIVE': 'COMMISSIONING',
        'INACTIVE': 'MAINTENANCE',
        'DECOMMISSIONED': 'DECOMMISSION',
        'DISPOSED': 'DISPOSAL',
      };

      await db.insert(assetLifecycleEvents).values({
        tenantId,
        assetId,
        eventType: (eventTypeMap[newStatus] || 'MODIFICATION') as any,
        eventDate: new Date().toISOString().split('T')[0],
        description: `Status changed to ${newStatus} (all approvals completed)`,
        performedBy: approverId,
      });

      return { ...updated, assetStatus: newStatus, outcome: 'COMPLETED' };
    }

    return { ...updated, assetStatus: 'PENDING_APPROVAL', outcome: 'PARTIALLY_APPROVED' };
  }

  // ── Get Pending Approvals (for approvers) ──
  async getPendingApprovals(tenantId: string, approverRole?: string) {
    const roleFilter = approverRole ? sql`AND aa.approver_role = ${approverRole}` : sql``;
    const result = await db.execute(sql`
      SELECT aa.id, aa.asset_id as "assetId", aa.approval_type as "approvalType",
             aa.approval_step as "approvalStep", aa.approver_role as "approverRole",
             aa.requested_status as "requestedStatus", aa.previous_status as "previousStatus",
             aa.comments, aa.created_at as "createdAt",
             a.name as "assetName", a.tag_number as "assetTag", a.status as "assetCurrentStatus"
      FROM asset_approvals aa
      LEFT JOIN assets a ON aa.asset_id = a.id
      WHERE aa.tenant_id = ${tenantId} AND aa.status = 'PENDING' ${roleFilter}
      ORDER BY aa.created_at ASC
    `);
    return result.rows;
  }

  // ── Get Status Transition History for an Asset ──
  async getStatusHistory(tenantId: string, assetId: string) {
    const result = await db.execute(sql`
      SELECT id, approval_type as "approvalType", approval_step as "approvalStep",
             approver_role as "approverRole", approver_id as "approverId", status,
             requested_status as "requestedStatus", previous_status as "previousStatus",
             comments, decided_at as "decidedAt", created_at as "createdAt"
      FROM asset_approvals
      WHERE asset_id = ${assetId} AND tenant_id = ${tenantId} AND approval_type = 'STATUS_CHANGE'
      ORDER BY created_at DESC LIMIT 50
    `);
    return result.rows;
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
        { tenantId, assetId: asset.id, approvalType: 'CREATION' as const, approvalStep: 1, approverRole: 'ENGINEER', status: 'PENDING' as const },
        { tenantId, assetId: asset.id, approvalType: 'CREATION' as const, approvalStep: 2, approverRole: 'MANAGER', status: 'PENDING' as const },
      ]);
      await db.update(assets).set({ status: 'PENDING_APPROVAL' }).where(eq(assets.id, asset.id));
      asset.status = 'PENDING_APPROVAL';
    } else if (criticality === 'B') {
      // 1-step approval: Manager
      await db.insert(assetApprovals).values([
        { tenantId, assetId: asset.id, approvalType: 'CREATION' as const, approvalStep: 1, approverRole: 'MANAGER', status: 'PENDING' as const },
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
    const result = await db.execute(sql`
      SELECT id, approval_type as "approvalType", approval_step as "approvalStep",
             approver_role as "approverRole", approver_id as "approverId", status,
             requested_status as "requestedStatus", previous_status as "previousStatus",
             comments, decided_at as "decidedAt", created_at as "createdAt"
      FROM asset_approvals
      WHERE tenant_id = ${tenantId} AND asset_id = ${assetId}
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  // ── Process Approval Decision (original creation approval flow) ──
  async processApproval(tenantId: string, assetId: string, approvalId: string, approverId: string, decision: 'APPROVED' | 'REJECTED', comments?: string) {
    // Check the approval type using raw SQL to reliably read the approval_type column
    const typeCheck = await db.execute(sql`SELECT approval_type FROM asset_approvals WHERE id = ${approvalId} AND tenant_id = ${tenantId} LIMIT 1`);
    if (!typeCheck.rows || typeCheck.rows.length === 0) return null;

    const approvalType = (typeCheck.rows[0] as any).approval_type;

    // Delegate to status transition handler if it's a status change
    if (approvalType === 'STATUS_CHANGE') {
      return this.processStatusApproval(tenantId, assetId, approvalId, approverId, decision, comments);
    }

    // Original creation approval flow
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
        sql`approval_type = 'CREATION'`,
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
