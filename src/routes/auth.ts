import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { generateTokenPair, verifyRefreshToken, JWTPayload } from '../utils/jwt';
import { RefreshTokenService } from '../services/RefreshTokenService';
import { ApiError } from '../utils/ApiError';
import { authenticateToken } from '../middleware/auth';
import { config } from '../config';

const router = Router();

// Mock user service - replace with your actual user service/model
interface User {
  id: string;
  email: string;
  password: string;
  role: string;
}

// Mock users database - replace with your actual database
const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2b$10$hash', // Replace with actual hashed password
    role: 'admin'
  }
];

/**
 * POST /auth/login
 * Authenticate user and return tokens
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation failed', errors.array());
    }

    const { email, password } = req.body;

    // Find user by email (replace with your user service)
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate token pair
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const { accessToken, refreshToken } = generateTokenPair(payload);

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + (config.JWT_REFRESH_EXPIRES_IN_MS));
    await RefreshTokenService.store(user.id, refreshToken, expiresAt);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', [
  body('refreshToken').notEmpty()
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation failed', errors.array());
    }

    const { refreshToken } = req.body;

    // Verify refresh token
    const tokenData = await RefreshTokenService.verifyToken(refreshToken);
    if (!tokenData) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    // Find user (replace with your user service)
    const user = users.find(u => u.id === tokenData.userId);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Generate new token pair
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(payload);

    // Store new refresh token and revoke old one
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + (config.JWT_REFRESH_EXPIRES_IN_MS));
    await RefreshTokenService.store(user.id, newRefreshToken, expiresAt);
    // Note: In production, you might want to implement token rotation by revoking the old token

    res.json({
      success: true,
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/logout
 * Revoke refresh token
 */
router.post('/logout', authenticateToken, [
  body('refreshToken').notEmpty()
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation failed', errors.array());
    }

    const { refreshToken } = req.body;

    // Find and revoke the refresh token
    const tokenData = await RefreshTokenService.findByToken(refreshToken);
    if (tokenData) {
      await RefreshTokenService.revoke(tokenData.id);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/logout-all
 * Revoke all refresh tokens for the user
 */
router.post('/logout-all', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const revokedCount = await RefreshTokenService.revokeAllForUser(userId);

    res.json({
      success: true,
      message: `Logged out from ${revokedCount} devices`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /auth/me
 * Get current user profile
 */
router.get('/me', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    
    // Find user (replace with your user service)
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /auth/sessions
 * Get all active sessions for the user
 */
router.get('/sessions', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const activeTokens = await RefreshTokenService.getActiveTokensForUser(userId);

    const sessions = activeTokens.map(token => ({
      id: token.id,
      createdAt: token.createdAt,
      lastUsedAt: token.lastUsedAt,
      expiresAt: token.expiresAt
    }));

    res.json({
      success: true,
      data: { sessions }
    });
  } catch (error) {
    next(error);
  }
});

export default router;