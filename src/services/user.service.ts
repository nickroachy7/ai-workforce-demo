import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserRequest, UpdateUserRequest, UserResponse } from '../types/user.types';
import { NotFoundError, ConflictError } from '../utils/errors';

class UserService {
  private users: Map<string, User> = new Map();

  constructor() {
    // Initialize with some sample data
    this.createSampleUsers();
  }

  private createSampleUsers(): void {
    const sampleUsers = [
      {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe'
      },
      {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith'
      }
    ];

    sampleUsers.forEach(userData => {
      const user: User = {
        id: uuidv4(),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(user.id, user);
    });
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = Array.from(this.users.values());
    return users.map(this.toUserResponse);
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    return this.toUserResponse(user);
  }

  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    // Check if user with email already exists
    const existingUser = Array.from(this.users.values())
      .find(user => user.email === userData.email);
    
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const user: User = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(user.id, user);
    return this.toUserResponse(user);
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<UserResponse> {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    // Check if email is being updated and already exists
    if (userData.email && userData.email !== user.email) {
      const existingUser = Array.from(this.users.values())
        .find(u => u.email === userData.email && u.id !== id);
      
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }
    }

    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return this.toUserResponse(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    this.users.delete(id);
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }
}

export const userService = new UserService();