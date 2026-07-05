import { z } from 'zod';

// WorkOrder Validators
export const createWorkOrderSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(200),
});

export const updateWorkOrderSchema = createWorkOrderSchema.partial();

export const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;
export type UpdateWorkOrderInput = z.infer<typeof updateWorkOrderSchema>;

