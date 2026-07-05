// Sla Types — Auto-generated type definitions
// These types mirror the Drizzle ORM schema for sla module

export interface SlaBase {
  id: string;
  tenantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SlaListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SlaListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

