import { z } from 'zod';

// Procurement Validators
export const createProcurementSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(200),
});

export const updateProcurementSchema = createProcurementSchema.partial();

export const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type CreateProcurementInput = z.infer<typeof createProcurementSchema>;
export type UpdateProcurementInput = z.infer<typeof updateProcurementSchema>;

