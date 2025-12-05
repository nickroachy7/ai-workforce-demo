/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Query parameters for pagination
 */
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

/**
 * Sort parameters
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter parameters
 */
export interface FilterParams {
  search?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Combined query parameters
 */
export interface QueryParams extends PaginationQuery, SortParams, FilterParams {}

/**
 * Database query result with pagination
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}