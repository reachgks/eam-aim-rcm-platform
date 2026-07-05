import { z } from 'zod';

// AirCompliance Validators
export const createAirComplianceSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(200),
});

export const updateAirComplianceSchema = createAirComplianceSchema.partial();

export const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type CreateAirComplianceInput = z.infer<typeof createAirComplianceSchema>;
export type UpdateAirComplianceInput = z.infer<typeof updateAirComplianceSchema>;

