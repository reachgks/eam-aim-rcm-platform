import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';

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

// ── Worker Processors ──
const concurrency = parseInt(process.env.WORKER_CONCURRENCY || '5', 10);

function createWorker(name: string, processor: (job: any) => Promise<void>) {
  const worker = new Worker(name, processor, { connection, concurrency });
  worker.on('completed', (job) => console.log(`✅ [${name}] Job ${job.id} completed`));
  worker.on('failed', (job, err) => console.error(`❌ [${name}] Job ${job?.id} failed:`, err.message));
  return worker;
}

// Register all workers
createWorker('maintenance-scheduler', async (job) => {
  console.log('Running maintenance scheduler...', job.data);
  // TODO: Generate work orders from active maintenance plans
});

createWorker('reliability-calculator', async (job) => {
  console.log('Calculating reliability metrics...', job.data);
  // TODO: Calculate MTBF, MTTR, availability per asset
});

createWorker('air-compliance-check', async (job) => {
  console.log('Checking AIR compliance...', job.data);
  // TODO: Validate asset data against AIR requirements
});

createWorker('sla-breach-check', async (job) => {
  console.log('Checking SLA breaches...', job.data);
  // TODO: Check open work orders against SLA targets
});

createWorker('data-quality-scan', async (job) => {
  console.log('Running data quality scan...', job.data);
  // TODO: Execute data quality rules and generate issues
});

createWorker('telemetry-aggregation', async (job) => {
  console.log('Aggregating telemetry data...', job.data);
  // TODO: Refresh continuous aggregates
});

createWorker('regulatory-deadline-check', async (job) => {
  console.log('Checking regulatory deadlines...', job.data);
  // TODO: Alert on upcoming inspection/compliance deadlines
});

createWorker('reorder-point-check', async (job) => {
  console.log('Checking reorder points...', job.data);
  // TODO: Generate PRs for items below reorder point
});

createWorker('weibull-recalculation', async (job) => {
  console.log('Recalculating Weibull parameters...', job.data);
  // TODO: Re-fit Weibull distribution with new failure data
});

createWorker('permit-expiry-check', async (job) => {
  console.log('Checking permit expiries...', job.data);
  // TODO: Alert on expiring work permits and certifications
});

createWorker('warranty-expiry-check', async (job) => {
  console.log('Checking warranty expiries...', job.data);
  // TODO: Alert on assets with expiring warranties
});

createWorker('depreciation-posting', async (job) => {
  console.log('Posting depreciation entries...', job.data);
  // TODO: Generate and post monthly depreciation schedule entries
});

createWorker('cost-rollup-calculation', async (job) => {
  console.log('Calculating cost rollups...', job.data);
  // TODO: Aggregate cost_transactions into asset_cost_rollup
});

createWorker('cde-notification', async (job) => {
  console.log('Sending CDE notification...', job.data);
  // TODO: Notify stakeholders of CDE state transitions
});

createWorker('ifc-parser', async (job) => {
  console.log('Parsing IFC model...', job.data);
  // TODO: Parse uploaded IFC file and extract elements
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
  await queues.weibull.add('monthly-weibull', {}, { repeat: { pattern: '0 4 1 * *' } });

  // Monthly jobs
  await queues.depreciation.add('monthly-depreciation', {}, { repeat: { pattern: '0 1 1 * *' } });
  await queues.costRollup.add('monthly-cost-rollup', {}, { repeat: { pattern: '0 2 1 * *' } });
  await queues.airCompliance.add('monthly-air-check', {}, { repeat: { pattern: '0 5 1 * *' } });

  console.log('📅 Scheduled jobs registered');
}

setupScheduledJobs().catch(console.error);

console.log(`🔧 EAM Worker started with concurrency=${concurrency}`);
console.log(`📋 Registered ${Object.keys(queues).length} job queues`);
