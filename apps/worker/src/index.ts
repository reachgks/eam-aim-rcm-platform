import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';
import { db, closeDatabaseConnection } from '@eamaim/database';
import { sql, eq, and, lt, lte, gte, count, desc, asc } from 'drizzle-orm';
import {
  maintenancePlans, workOrders, assets, reliabilityMetrics,
  slaDefinitions, slaTargets, slaBreaches, slaTracking,
  complianceRequirements, inspections,
  workPermits, warrantyCoverage,
  stockLevels, stockItems, reorderRules, purchaseRequisitions,
  depreciationProfiles, depreciationSchedule, costTransactions,
  assetCostRollup,
  dataQualityRules, dataQualityScores,
  assetInfoRequirements, airComplianceChecks,
  weibullAnalyses, failureEvents,
} from '@eamaim/database/schema';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// ── Job Queues ──
const queues = {
  maintenance: new Queue('maintenance-scheduler', { connection }),
  reliability: new Queue('reliability-calculator', { connection }),
  airCompliance: new Queue('air-compliance-check', { connection }),
  sla: new Queue('sla-breach-check', { connection }),
  dataQuality: new Queue('data-quality-scan', { connection }),
  telemetry: new Queue('telemetry-aggregation', { connection }),
  regulatory: new Queue('regulatory-deadline-check', { connection }),
  reorder: new Queue('reorder-point-check', { connection }),
  weibull: new Queue('weibull-recalculation', { connection }),
  permitExpiry: new Queue('permit-expiry-check', { connection }),
  warrantyExpiry: new Queue('warranty-expiry-check', { connection }),
  depreciation: new Queue('depreciation-posting', { connection }),
  costRollup: new Queue('cost-rollup-calculation', { connection }),
  cdeNotification: new Queue('cde-notification', { connection }),
  ifcParser: new Queue('ifc-parser', { connection }),
};

const concurrency = parseInt(process.env.WORKER_CONCURRENCY || '5', 10);

function createWorker(name: string, processor: (job: any) => Promise<void>) {
  const worker = new Worker(name, processor, { connection, concurrency });
  worker.on('completed', (job) => console.log(`✅ [${name}] Job ${job.id} completed`));
  worker.on('failed', (job, err) => console.error(`❌ [${name}] Job ${job?.id} failed:`, err.message));
  return worker;
}

// ════════════════════════════════════════════
// 1. MAINTENANCE SCHEDULER
//    Scans active plans → generates work orders when due
// ════════════════════════════════════════════
createWorker('maintenance-scheduler', async (job) => {
  const now = new Date();
  console.log(`[maintenance-scheduler] Running at ${now.toISOString()}`);

  // Get all active maintenance plans
  const plans = await db.select().from(maintenancePlans).where(eq(maintenancePlans.isActive, true));

  for (const plan of plans) {
    // Check if a WO already exists for the current cycle
    const [existing] = await db.select({ total: count() })
      .from(workOrders)
      .where(and(
        eq(workOrders.tenantId, plan.tenantId),
        eq(workOrders.maintenancePlanId, plan.id),
        gte(workOrders.scheduledStart, new Date(now.getTime() - (plan.frequencyValue || 30) * 24 * 60 * 60 * 1000)),
      ));

    if (Number(existing.total) > 0) continue;

    // Check if plan is due
    const lastWo = await db.select({ scheduledStart: workOrders.scheduledStart })
      .from(workOrders)
      .where(and(eq(workOrders.maintenancePlanId, plan.id), eq(workOrders.tenantId, plan.tenantId)))
      .orderBy(desc(workOrders.scheduledStart)).limit(1);

    const lastDate = lastWo[0]?.scheduledStart || new Date(0);
    const daysSinceLast = (now.getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceLast >= (plan.frequencyValue || 30)) {
      // Generate WO
      const [{ total }] = await db.select({ total: count() })
        .from(workOrders).where(eq(workOrders.tenantId, plan.tenantId));
      const woNumber = `WO-${String(Number(total) + 1).padStart(6, '0')}`;

      await db.insert(workOrders).values({
        tenantId: plan.tenantId,
        woNumber,
        type: plan.planType === 'PREDICTIVE' ? 'PREDICTIVE' : 'PREVENTIVE',
        priority: 'MEDIUM',
        status: 'PLANNED',
        assetId: plan.assetId,
        maintenancePlanId: plan.id,
        description: `Auto-generated from plan ${plan.planCode}: ${plan.name}`,
        scheduledStart: now,
        scheduledEnd: new Date(now.getTime() + 8 * 60 * 60 * 1000), // +8h
      });
      console.log(`  → Generated ${woNumber} from plan ${plan.planCode}`);
    }
  }
});

// ════════════════════════════════════════════
// 2. RELIABILITY CALCULATOR
//    Calculates MTBF, MTTR, Availability per asset
// ════════════════════════════════════════════
createWorker('reliability-calculator', async (job) => {
  const tenantId = job.data.tenantId;
  console.log(`[reliability-calculator] Calculating for tenant ${tenantId || 'all'}`);

  const assetList = tenantId
    ? await db.select({ id: assets.id, tenantId: assets.tenantId }).from(assets).where(and(eq(assets.tenantId, tenantId), eq(assets.status, 'ACTIVE')))
    : await db.select({ id: assets.id, tenantId: assets.tenantId }).from(assets).where(eq(assets.status, 'ACTIVE'));

  for (const asset of assetList) {
    const result = await db.execute(sql`
      SELECT
        COUNT(*) FILTER (WHERE type IN ('CORRECTIVE', 'EMERGENCY')) as failure_count,
        COALESCE(SUM(actual_hours)::numeric, 0) as total_repair_hours,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_wos
      FROM work_orders
      WHERE asset_id = ${asset.id} AND tenant_id = ${asset.tenantId}
        AND created_at >= NOW() - INTERVAL '12 months'
    `);

    const row = result.rows[0] as any;
    const failureCount = Number(row.failure_count) || 0;
    const totalRepairHours = Number(row.total_repair_hours) || 0;
    const operatingHours = 8760; // Assume 1 year for now

    const mtbf = failureCount > 0 ? Math.round(operatingHours / failureCount) : operatingHours;
    const mttr = failureCount > 0 ? Math.round((totalRepairHours / failureCount) * 10) / 10 : 0;
    const availability = mtbf > 0 ? Math.round((mtbf / (mtbf + mttr)) * 10000) / 100 : 100;

    await db.insert(reliabilityMetrics).values({
      tenantId: asset.tenantId,
      assetId: asset.id,
      calculationDate: new Date().toISOString().split('T')[0],
      periodMonths: 12,
      mtbf: String(mtbf),
      mttr: String(mttr),
      availability: String(availability),
      failureCount,
    }).onConflictDoNothing();
  }
  console.log(`  → Calculated reliability for ${assetList.length} assets`);
});

// ════════════════════════════════════════════
// 3. AIR COMPLIANCE CHECK
// ════════════════════════════════════════════
createWorker('air-compliance-check', async (job) => {
  const tenantId = job.data.tenantId;
  console.log(`[air-compliance-check] Running for tenant ${tenantId || 'all'}`);

  const airs = tenantId
    ? await db.select().from(assetInfoRequirements).where(eq(assetInfoRequirements.tenantId, tenantId))
    : await db.select().from(assetInfoRequirements);

  let checkedCount = 0;
  for (const air of airs) {
    // Basic compliance check — verify required fields exist on asset
    const [asset] = await db.select().from(assets)
      .where(and(eq(assets.id, air.assetTypeId || ''), eq(assets.tenantId, air.tenantId))).limit(1);

    const isPassing = !!asset; // Simplified check
    await db.insert(airComplianceChecks).values({
      tenantId: air.tenantId,
      assetId: air.assetTypeId || '',
      airId: air.id,
      checkDate: new Date().toISOString().split('T')[0],
      isPassing,
      score: isPassing ? '100' : '0',
      missingFields: isPassing ? {} : { reason: 'Asset not found or data incomplete' },
      checkedBy: 'system',
    });
    checkedCount++;
  }
  console.log(`  → Checked ${checkedCount} AIR requirements`);
});

// ════════════════════════════════════════════
// 4. SLA BREACH CHECK
//    Checks open WOs against SLA response/resolution targets
// ════════════════════════════════════════════
createWorker('sla-breach-check', async (job) => {
  console.log('[sla-breach-check] Scanning for SLA breaches...');

  const openWOs = await db.select()
    .from(workOrders)
    .where(and(
      sql`${workOrders.status} NOT IN ('COMPLETED', 'CANCELLED', 'CLOSED')`,
    ));

  let breachCount = 0;
  for (const wo of openWOs) {
    // Get SLA targets for this WO's priority
    const targets = await db.select().from(slaTargets)
      .where(and(eq(slaTargets.tenantId, wo.tenantId), eq(slaTargets.priority, wo.priority)));

    for (const target of targets) {
      const createdTime = new Date(wo.createdAt).getTime();
      const now = Date.now();
      const elapsedMinutes = (now - createdTime) / (1000 * 60);

      let targetMinutes = Number(target.targetValue);
      if (target.unit === 'hours') targetMinutes *= 60;
      if (target.unit === 'days') targetMinutes *= 60 * 24;

      if (elapsedMinutes > targetMinutes) {
        // Check if breach already recorded
        const [existing] = await db.select({ total: count() })
          .from(slaBreaches)
          .where(and(
            eq(slaBreaches.tenantId, wo.tenantId),
            eq(slaBreaches.workOrderId, wo.id),
            eq(slaBreaches.slaId, target.slaId),
          ));

        if (Number(existing.total) === 0) {
          await db.insert(slaBreaches).values({
            tenantId: wo.tenantId,
            slaId: target.slaId,
            workOrderId: wo.id,
            targetId: target.id,
            breachedAt: new Date(),
            elapsedMinutes: Math.round(elapsedMinutes),
            targetMinutes: Math.round(targetMinutes),
          });
          breachCount++;
        }
      }
    }
  }
  console.log(`  → Found ${breachCount} new SLA breaches`);
});

// ════════════════════════════════════════════
// 5. DATA QUALITY SCAN
// ════════════════════════════════════════════
createWorker('data-quality-scan', async (job) => {
  console.log('[data-quality-scan] Running data quality scan...');

  // Check all assets for data completeness
  const assetList = await db.select({
    id: assets.id, tenantId: assets.tenantId, name: assets.name,
    manufacturer: assets.manufacturer, serialNumber: assets.serialNumber,
    installDate: assets.installDate, assetTypeId: assets.assetTypeId,
  }).from(assets);

  for (const asset of assetList) {
    const requiredFields = ['manufacturer', 'serialNumber', 'installDate', 'assetTypeId'];
    const presentFields = requiredFields.filter(f => !!(asset as any)[f]);
    const score = Math.round((presentFields.length / requiredFields.length) * 100);

    await db.insert(dataQualityScores).values({
      tenantId: asset.tenantId,
      entityType: 'ASSET',
      entityId: asset.id,
      score: String(score),
      missingFields: requiredFields.filter(f => !(asset as any)[f]),
      calculatedAt: new Date(),
    }).onConflictDoNothing();
  }
  console.log(`  → Scored ${assetList.length} assets for data quality`);
});

// ════════════════════════════════════════════
// 6. TELEMETRY AGGREGATION
//    Refreshes TimescaleDB continuous aggregates
// ════════════════════════════════════════════
createWorker('telemetry-aggregation', async (job) => {
  console.log('[telemetry-aggregation] Refreshing continuous aggregates...');
  try {
    await db.execute(sql`
      CALL refresh_continuous_aggregate('sensor_readings_hourly', NOW() - INTERVAL '2 days', NOW())
    `);
    console.log('  → Hourly aggregate refreshed');
  } catch (err: any) {
    // Continuous aggregate may not exist yet
    console.log(`  → Skipped: ${err.message?.substring(0, 80)}`);
  }
});

// ════════════════════════════════════════════
// 7. REGULATORY DEADLINE CHECK
//    Alerts on upcoming inspection/compliance deadlines
// ════════════════════════════════════════════
createWorker('regulatory-deadline-check', async (job) => {
  console.log('[regulatory-deadline-check] Checking deadlines...');

  const result = await db.execute(sql`
    SELECT cr.id, cr.tenant_id, cr.code, cr.name, cr.frequency_days,
      MAX(i.inspection_date) as last_inspection,
      MAX(i.inspection_date) + (cr.frequency_days || ' days')::interval as next_due
    FROM compliance_requirements cr
    LEFT JOIN inspections i ON i.requirement_id = cr.id
    WHERE cr.is_active = true
    GROUP BY cr.id, cr.tenant_id, cr.code, cr.name, cr.frequency_days
    HAVING MAX(i.inspection_date) + (cr.frequency_days || ' days')::interval <= NOW() + INTERVAL '30 days'
       OR MAX(i.inspection_date) IS NULL
  `);

  console.log(`  → Found ${result.rows.length} requirements due within 30 days`);
  for (const row of result.rows) {
    console.log(`    ⚠️ ${(row as any).code}: ${(row as any).name} — due ${(row as any).next_due || 'NEVER INSPECTED'}`);
  }
});

// ════════════════════════════════════════════
// 8. REORDER POINT CHECK
//    Generates alerts/PRs for items below reorder point
// ════════════════════════════════════════════
createWorker('reorder-point-check', async (job) => {
  console.log('[reorder-point-check] Checking stock levels...');

  const result = await db.execute(sql`
    SELECT sl.id, si.item_code, si.name, si.tenant_id, sl.quantity_on_hand,
           rr.reorder_point, rr.reorder_quantity, s.name as storeroom
    FROM stock_levels sl
    JOIN stock_items si ON sl.stock_item_id = si.id
    JOIN reorder_rules rr ON rr.stock_item_id = si.id
    LEFT JOIN storerooms s ON sl.storeroom_id = s.id
    WHERE sl.quantity_on_hand <= rr.reorder_point
    ORDER BY sl.quantity_on_hand ASC
  `);

  console.log(`  → Found ${result.rows.length} items below reorder point`);
  for (const row of result.rows as any[]) {
    console.log(`    📦 ${row.item_code}: ${row.quantity_on_hand} on hand (reorder @ ${row.reorder_point})`);
    // Auto-generate PR
    const [{ total }] = await db.select({ total: count() })
      .from(purchaseRequisitions).where(eq(purchaseRequisitions.tenantId, row.tenant_id));
    const reqNumber = `PR-AUTO-${String(Number(total) + 1).padStart(6, '0')}`;

    await db.insert(purchaseRequisitions).values({
      tenantId: row.tenant_id,
      reqNumber,
      status: 'DRAFT',
      requestedBy: 'system',
      description: `Auto-reorder: ${row.item_code} — ${row.name} (qty: ${row.reorder_quantity})`,
      priority: row.quantity_on_hand <= 0 ? 'CRITICAL' : 'MEDIUM',
    }).onConflictDoNothing();
  }
});

// ════════════════════════════════════════════
// 9. WEIBULL RECALCULATION
//    Re-fits Weibull distribution from failure history
// ════════════════════════════════════════════
createWorker('weibull-recalculation', async (job) => {
  console.log('[weibull-recalculation] Recalculating Weibull parameters...');

  // Get assets with enough failure data
  const result = await db.execute(sql`
    SELECT asset_id, tenant_id, COUNT(*) as failure_count,
      ARRAY_AGG(EXTRACT(EPOCH FROM failure_date - LAG(failure_date) OVER (PARTITION BY asset_id ORDER BY failure_date))/(3600*24)) as time_between_failures
    FROM failure_events
    GROUP BY asset_id, tenant_id
    HAVING COUNT(*) >= 3
  `);

  for (const row of result.rows as any[]) {
    // Simplified Weibull estimation using method of moments
    // β (shape) ≈ (σ/μ)^(-1.086) — Approximation
    // η (scale) ≈ μ / Γ(1 + 1/β)
    const tbfs = (row.time_between_failures || []).filter((t: any) => t > 0);
    if (tbfs.length < 2) continue;

    const mean = tbfs.reduce((a: number, b: number) => a + b, 0) / tbfs.length;
    const stddev = Math.sqrt(tbfs.reduce((s: number, v: number) => s + (v - mean) ** 2, 0) / tbfs.length);
    const cv = stddev / mean;

    const beta = Math.max(0.5, Math.pow(cv, -1.086)); // Shape parameter
    const eta = mean; // Simplified scale parameter

    await db.insert(weibullAnalyses).values({
      tenantId: row.tenant_id,
      assetId: row.asset_id,
      analysisDate: new Date().toISOString().split('T')[0],
      betaShape: String(Math.round(beta * 100) / 100),
      etaScale: String(Math.round(eta * 10) / 10),
      dataPoints: tbfs.length,
      method: 'METHOD_OF_MOMENTS',
    }).onConflictDoNothing();

    console.log(`  → Asset ${row.asset_id}: β=${beta.toFixed(2)}, η=${eta.toFixed(1)} days`);
  }
});

// ════════════════════════════════════════════
// 10. PERMIT EXPIRY CHECK
// ════════════════════════════════════════════
createWorker('permit-expiry-check', async (job) => {
  console.log('[permit-expiry-check] Checking permit expiries...');

  const result = await db.execute(sql`
    SELECT id, tenant_id, permit_number, expiry_date, status
    FROM work_permits
    WHERE status IN ('ISSUED', 'ACTIVE')
      AND expiry_date <= NOW() + INTERVAL '24 hours'
    ORDER BY expiry_date ASC
  `);

  for (const row of result.rows as any[]) {
    const isExpired = new Date(row.expiry_date) < new Date();
    console.log(`  ${isExpired ? '🔴' : '🟡'} Permit ${row.permit_number}: ${isExpired ? 'EXPIRED' : 'expiring within 24h'}`);

    if (isExpired) {
      await db.execute(sql`UPDATE work_permits SET status = 'EXPIRED' WHERE id = ${row.id}`);
    }
  }
  console.log(`  → ${result.rows.length} permits checked`);
});

// ════════════════════════════════════════════
// 11. WARRANTY EXPIRY CHECK
// ════════════════════════════════════════════
createWorker('warranty-expiry-check', async (job) => {
  console.log('[warranty-expiry-check] Checking warranty expiries...');

  const result = await db.execute(sql`
    SELECT wc.id, wc.tenant_id, wc.asset_id, wc.end_date, wc.status,
           a.tag_number, a.name as asset_name, wt.name as warranty_name
    FROM warranty_coverage wc
    JOIN assets a ON wc.asset_id = a.id
    JOIN warranty_terms wt ON wc.warranty_term_id = wt.id
    WHERE wc.status = 'ACTIVE'
      AND wc.end_date <= NOW() + INTERVAL '90 days'
    ORDER BY wc.end_date ASC
  `);

  for (const row of result.rows as any[]) {
    const daysLeft = Math.ceil((new Date(row.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) {
      await db.execute(sql`UPDATE warranty_coverage SET status = 'EXPIRED' WHERE id = ${row.id}`);
      console.log(`  🔴 ${row.tag_number}: ${row.warranty_name} EXPIRED`);
    } else {
      console.log(`  🟡 ${row.tag_number}: ${row.warranty_name} expires in ${daysLeft} days`);
    }
  }
});

// ════════════════════════════════════════════
// 12. DEPRECIATION POSTING
//    Generates monthly depreciation schedule entries
// ════════════════════════════════════════════
createWorker('depreciation-posting', async (job) => {
  console.log('[depreciation-posting] Posting monthly depreciation...');

  const profiles = await db.select().from(depreciationProfiles);
  let posted = 0;

  for (const profile of profiles) {
    // Check which period we're in
    const startDate = new Date(profile.startDate);
    const monthsElapsed = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    const usefulLife = profile.usefulLifeMonths || 120;

    if (monthsElapsed > usefulLife) continue;

    // Check if this period already posted
    const [existing] = await db.select({ total: count() })
      .from(depreciationSchedule)
      .where(and(
        eq(depreciationSchedule.profileId, profile.id),
        eq(depreciationSchedule.periodNumber, monthsElapsed),
      ));

    if (Number(existing.total) > 0) continue;

    const originalCost = Number(profile.originalCost);
    const salvage = Number(profile.salvageValue || 0);
    let depreciationAmount: number;

    if (profile.method === 'STRAIGHT_LINE') {
      depreciationAmount = (originalCost - salvage) / usefulLife;
    } else {
      // Declining balance
      const rate = 2 / usefulLife;
      const bookValue = originalCost * Math.pow(1 - rate, monthsElapsed - 1);
      depreciationAmount = Math.max(bookValue * rate, 0);
    }

    const accumulatedDep = depreciationAmount * monthsElapsed;
    const bookValue = originalCost - accumulatedDep;

    await db.insert(depreciationSchedule).values({
      tenantId: profile.tenantId,
      profileId: profile.id,
      periodNumber: monthsElapsed,
      periodStart: new Date(startDate.getTime() + (monthsElapsed - 1) * 30.44 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      periodEnd: new Date(startDate.getTime() + monthsElapsed * 30.44 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      depreciationAmount: String(Math.round(depreciationAmount * 100) / 100),
      accumulatedDepreciation: String(Math.round(accumulatedDep * 100) / 100),
      bookValue: String(Math.round(Math.max(bookValue, salvage) * 100) / 100),
      isPosted: true,
      postedAt: new Date(),
    });

    // Also create cost transaction
    await db.insert(costTransactions).values({
      tenantId: profile.tenantId,
      sourceType: 'DEPRECIATION',
      sourceId: profile.id,
      assetId: profile.assetId,
      costCenterId: profile.costCenterId,
      transactionDate: new Date().toISOString().split('T')[0],
      amount: String(Math.round(depreciationAmount * 100) / 100),
      costCategory: 'DEPRECIATION',
      description: `Monthly depreciation period ${monthsElapsed}`,
    });
    posted++;
  }
  console.log(`  → Posted ${posted} depreciation entries`);
});

// ════════════════════════════════════════════
// 13. COST ROLLUP CALCULATION
//    Aggregates cost_transactions → asset_cost_rollup
// ════════════════════════════════════════════
createWorker('cost-rollup-calculation', async (job) => {
  console.log('[cost-rollup-calculation] Aggregating costs...');

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const result = await db.execute(sql`
    SELECT asset_id, tenant_id,
      COALESCE(SUM(CASE WHEN cost_category = 'LABOR' THEN amount ELSE 0 END), 0) as labor_cost,
      COALESCE(SUM(CASE WHEN cost_category = 'MATERIAL' THEN amount ELSE 0 END), 0) as material_cost,
      COALESCE(SUM(CASE WHEN cost_category = 'SERVICE' THEN amount ELSE 0 END), 0) as service_cost,
      COALESCE(SUM(CASE WHEN cost_category = 'OVERHEAD' THEN amount ELSE 0 END), 0) as overhead_cost,
      COALESCE(SUM(CASE WHEN cost_category = 'DEPRECIATION' THEN amount ELSE 0 END), 0) as depreciation_cost,
      COALESCE(SUM(amount), 0) as total_cost
    FROM cost_transactions
    WHERE transaction_date >= ${monthStart.toISOString().split('T')[0]}
      AND transaction_date <= ${monthEnd.toISOString().split('T')[0]}
    GROUP BY asset_id, tenant_id
  `);

  for (const row of result.rows as any[]) {
    await db.insert(assetCostRollup).values({
      tenantId: row.tenant_id,
      assetId: row.asset_id,
      periodType: 'MONTHLY',
      periodStart: monthStart.toISOString().split('T')[0],
      periodEnd: monthEnd.toISOString().split('T')[0],
      laborCost: row.labor_cost,
      materialCost: row.material_cost,
      serviceCost: row.service_cost,
      overheadCost: row.overhead_cost,
      depreciationCost: row.depreciation_cost,
      totalCost: row.total_cost,
    }).onConflictDoNothing();
  }
  console.log(`  → Rolled up costs for ${result.rows.length} assets`);
});

// ════════════════════════════════════════════
// 14. CDE NOTIFICATION
//    Notifies stakeholders of CDE state transitions
// ════════════════════════════════════════════
createWorker('cde-notification', async (job) => {
  const { containerId, newState, changedBy, tenantId } = job.data;
  console.log(`[cde-notification] Container ${containerId} → ${newState}`);

  // In production: send email/Teams/Slack notifications
  // For now: log the notification
  const stateLabels: Record<string, string> = {
    WORK_IN_PROGRESS: '📝 Work in Progress',
    SHARED: '📤 Shared for Review',
    PUBLISHED: '✅ Published',
    ARCHIVED: '📦 Archived',
  };

  console.log(`  → Notification: Information container transitioned to ${stateLabels[newState] || newState}`);
  console.log(`    Changed by: ${changedBy}, Tenant: ${tenantId}`);
});

// ════════════════════════════════════════════
// 15. IFC PARSER
//    Parses uploaded IFC files and extracts building elements
// ════════════════════════════════════════════
createWorker('ifc-parser', async (job) => {
  const { modelId, filePath, tenantId } = job.data;
  console.log(`[ifc-parser] Parsing model ${modelId} from ${filePath}`);

  // In production: use web-ifc or IFC.js to parse .ifc files
  // For now: acknowledge the job and log
  console.log('  → IFC parsing requires web-ifc library (not included in base install)');
  console.log('  → To enable: npm install web-ifc, then implement element extraction');
  console.log(`  → Model ${modelId} queued for parsing`);
});

// ── Scheduled Jobs (Repeatable) ──
async function setupScheduledJobs() {
  // Daily jobs
  await queues.maintenance.add('daily-scheduler', {}, { repeat: { pattern: '0 6 * * *' } });
  await queues.sla.add('daily-sla-check', {}, { repeat: { pattern: '*/15 * * * *' } });
  await queues.regulatory.add('daily-deadline-check', {}, { repeat: { pattern: '0 7 * * *' } });
  await queues.permitExpiry.add('daily-permit-check', {}, { repeat: { pattern: '0 8 * * *' } });
  await queues.warrantyExpiry.add('daily-warranty-check', {}, { repeat: { pattern: '0 8 * * *' } });
  await queues.reorder.add('daily-reorder-check', {}, { repeat: { pattern: '0 9 * * *' } });

  // Weekly jobs
  await queues.reliability.add('weekly-reliability', {}, { repeat: { pattern: '0 2 * * 0' } });
  await queues.dataQuality.add('weekly-dq-scan', {}, { repeat: { pattern: '0 3 * * 0' } });

  // Monthly jobs
  await queues.depreciation.add('monthly-depreciation', {}, { repeat: { pattern: '0 1 1 * *' } });
  await queues.costRollup.add('monthly-cost-rollup', {}, { repeat: { pattern: '0 2 1 * *' } });
  await queues.airCompliance.add('monthly-air-check', {}, { repeat: { pattern: '0 5 1 * *' } });
  await queues.weibull.add('monthly-weibull', {}, { repeat: { pattern: '0 4 1 * *' } });

  console.log('📅 Scheduled jobs registered');
}

setupScheduledJobs().catch(console.error);

// ── Graceful Shutdown ──
async function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down workers...`);
  await closeDatabaseConnection();
  process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

console.log(`🔧 EAM Worker started with concurrency=${concurrency}`);
console.log(`📋 Registered ${Object.keys(queues).length} job queues`);
