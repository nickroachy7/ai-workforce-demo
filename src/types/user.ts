/**
 * User entity interface
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data Transfer Object for creating a user
 */
export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status?: 'active' | 'inactive';
}

/**
 * Data Transfer Object for updating a user
 */
export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive';
}

/**
 * Query parameters for user listing
 */
export interface UserQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: 'active' | 'inactive';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * User response with computed fields
 */
export interface UserResponse extends Omit<User, 'createdAt' | 'updatedAt'> {
  fullName: string;
  createdAt: string;
  updatedAt: string;
}