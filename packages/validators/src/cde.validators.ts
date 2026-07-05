import { z } from 'zod';

// Cde Validators
export const createCdeSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(200),
});

export const updateCdeSchema = createCdeSchema.partial();

export const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type CreateCdeInput = z.infer<typeof createCdeSchema>;
export type UpdateCdeInput = z.infer<typeof updateCdeSchema>;

