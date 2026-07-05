// Auth Types — Auto-generated type definitions
// These types mirror the Drizzle ORM schema for auth module

export interface AuthBase {
  id: string;
  tenantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuthListResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

