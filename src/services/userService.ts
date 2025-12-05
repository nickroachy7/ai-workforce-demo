import { CreateUserDTO, UpdateUserDTO, User, UserQueryParams } from '../types/user';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import crypto from 'crypto';

// In-memory storage for demo purposes
// In a real application, this would be replaced with a database
let users: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    status: 'active',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    status: 'active',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02')
  }
];

export class UserService {
  /**
   * Get all users with pagination and filtering
   */
  async getAllUsers(params: UserQueryParams): Promise<{ users: User[]; total: number }> {
    let filteredUsers = [...users];

    // Search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (params.status) {
      filteredUsers = filteredUsers.filter(user => user.status === params.status);
    }

    // Sorting
    filteredUsers.sort((a, b) => {
      const aValue = a[params.sortBy as keyof User];
      const bValue = b[params.sortBy as keyof User];
      
      if (aValue < bValue) return params.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return params.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = filteredUsers.length;
    const startIndex = (params.page - 1) * params.limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + params.limit);

    return {
      users: paginatedUsers,
      total
    };
  }

  /**
   * Get a single user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    const user = users.find(user => user.id === id);
    return user || null;
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserDTO): Promise<User> {
    // Check if email already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      ...userData,
      status: userData.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);
    logger.info('User created', { userId: newUser.id, email: newUser.email });

    return newUser;
  }

  /**
   * Update a user by ID
   */
  async updateUser(id: string, updateData: UpdateUserDTO): Promise<User | null> {
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    // Check if email already exists (excluding current user)
    if (updateData.email) {
      const existingUser = users.find(user => user.email === updateData.email && user.id !== id);
      if (existingUser) {
        throw new AppError('Email already exists', 409);
      }
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };

    users[userIndex] = updatedUser;
    logger.info('User updated', { userId: id });

    return updatedUser;
  }

  /**
   * Delete a user by ID
   */
  async deleteUser(id: string): Promise<boolean> {
    const initialLength = users.length;
    users = users.filter(user => user.id !== id);
    
    const deleted = users.length < initialLength;
    if (deleted) {
      logger.info('User deleted', { userId: id });
    }

    return deleted;
  }
}