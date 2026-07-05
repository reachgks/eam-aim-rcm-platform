// Maintenance Types — Auto-generated type definitions
// These types mirror the Drizzle ORM schema for maintenance module

export interface MaintenanceBase {
  id: string;
  tenantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MaintenanceListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

