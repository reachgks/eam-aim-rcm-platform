// Bim Types — Auto-generated type definitions
// These types mirror the Drizzle ORM schema for bim module

export interface BimBase {
  id: string;
  tenantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BimListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BimListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

