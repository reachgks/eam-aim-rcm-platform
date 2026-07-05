import { z } from 'zod';

// SafetyPermit Validators
export const createSafetyPermitSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(200),
});

export const updateSafetyPermitSchema = createSafetyPermitSchema.partial();

export const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type CreateSafetyPermitInput = z.infer<typeof createSafetyPermitSchema>;
export type UpdateSafetyPermitInput = z.infer<typeof updateSafetyPermitSchema>;

