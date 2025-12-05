import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { CreateUserDTO, UpdateUserDTO, UserQueryParams } from '../types/user';
import { ApiResponse } from '../types/common';
import { logger } from '../utils/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get all users with pagination and filtering
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    const queryParams: UserQueryParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      status: req.query.status as 'active' | 'inactive',
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc'
    };

    logger.info('Getting all users', { queryParams });

    const result = await this.userService.getAllUsers(queryParams);
    
    const response: ApiResponse = {
      success: true,
      data: result.users,
      meta: {
        page: queryParams.page,
        limit: queryParams.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / queryParams.limit)
      }
    };

    res.status(200).json(response);
  }

  /**
   * Get a single user by ID
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    logger.info('Getting user by ID', { userId: id });

    const user = await this.userService.getUserById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: user
    };

    res.status(200).json(response);
  }

  /**
   * Create a new user
   */
  async createUser(req: Request, res: Response): Promise<void> {
    const userData: CreateUserDTO = req.body;
    
    logger.info('Creating new user', { email: userData.email });

    const user = await this.userService.createUser(userData);

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User created successfully'
    };

    res.status(201).json(response);
  }

  /**
   * Update a user by ID
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updateData: UpdateUserDTO = req.body;
    
    logger.info('Updating user', { userId: id });

    const user = await this.userService.updateUser(id, updateData);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User updated successfully'
    };

    res.status(200).json(response);
  }

  /**
   * Delete a user by ID
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    logger.info('Deleting user', { userId: id });

    const deleted = await this.userService.deleteUser(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully'
    };

    res.status(200).json(response);
  }
}