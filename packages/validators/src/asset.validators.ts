import { z } from 'zod';

// Asset Validators
export const createAssetSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(1).max(200),
});

export const updateAssetSchema = createAssetSchema.partial();

export const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;

