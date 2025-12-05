import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateUser, validateUserUpdate } from '../middleware/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const userController = new UserController();

/**
 * @route GET /api/users
 * @description Get all users with optional pagination and filtering
 * @access Public
 */
router.get('/', asyncHandler(userController.getAllUsers.bind(userController)));

/**
 * @route GET /api/users/:id
 * @description Get a single user by ID
 * @access Public
 */
router.get('/:id', asyncHandler(userController.getUserById.bind(userController)));

/**
 * @route POST /api/users
 * @description Create a new user
 * @access Public
 */
router.post('/', validateUser, asyncHandler(userController.createUser.bind(userController)));

/**
 * @route PUT /api/users/:id
 * @description Update a user by ID
 * @access Public
 */
router.put('/:id', validateUserUpdate, asyncHandler(userController.updateUser.bind(userController)));

/**
 * @route DELETE /api/users/:id
 * @description Delete a user by ID
 * @access Public
 */
router.delete('/:id', asyncHandler(userController.deleteUser.bind(userController)));

export { router as userRoutes };