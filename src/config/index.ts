import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // JWT Configuration
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'your-super-secret-access-key-change-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  JWT_ISSUER: process.env.JWT_ISSUER || 'your-app-name',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'your-app-users',

  // Convert refresh token expiry to milliseconds for easier calculation
  get JWT_REFRESH_EXPIRES_IN_MS(): number {
    const value = this.JWT_REFRESH_EXPIRES_IN;
    const units: { [key: string]: number } = {
      's': 1000,
      'm': 1000 * 60,
      'h': 1000 * 60 * 60,
      'd': 1000 * 60 * 60 * 24,
    };
    
    const match = value.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error('Invalid JWT_REFRESH_EXPIRES_IN format');
    }
    
    const [, num, unit] = match;
    return parseInt(num) * units[unit];
  },

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window

  // Security
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),

  // Validation
  validate() {
    const requiredEnvVars = [
      'JWT_ACCESS_SECRET',
      'JWT_REFRESH_SECRET'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    if (this.NODE_ENV === 'production') {
      if (this.JWT_ACCESS_SECRET === 'your-super-secret-access-key-change-in-production') {
        throw new Error('Please change JWT_ACCESS_SECRET in production');
      }
      if (this.JWT_REFRESH_SECRET === 'your-super-secret-refresh-key-change-in-production') {
        throw new Error('Please change JWT_REFRESH_SECRET in production');
      }
    }
  }
};