import { z } from 'zod';

// Telemetry Validators
export const createTelemetrySchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(200),
});

export const updateTelemetrySchema = createTelemetrySchema.partial();

export const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type CreateTelemetryInput = z.infer<typeof createTelemetrySchema>;
export type UpdateTelemetryInput = z.infer<typeof updateTelemetrySchema>;

