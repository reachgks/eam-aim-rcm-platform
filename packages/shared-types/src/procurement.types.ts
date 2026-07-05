// Procurement Types — Auto-generated type definitions
// These types mirror the Drizzle ORM schema for procurement module

export interface ProcurementBase {
  id: string;
  tenantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProcurementListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProcurementListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

