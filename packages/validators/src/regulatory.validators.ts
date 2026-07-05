import { z } from 'zod';

// Regulatory Validators
export const createRegulatorySchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(200),
});

export const updateRegulatorySchema = createRegulatorySchema.partial();

export const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type CreateRegulatoryInput = z.infer<typeof createRegulatorySchema>;
export type UpdateRegulatoryInput = z.infer<typeof updateRegulatorySchema>;

