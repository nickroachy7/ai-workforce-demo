import crypto from 'crypto';
import { verifyRefreshToken } from '../utils/jwt';

export interface RefreshTokenData {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
}

/**
 * Service to manage refresh tokens
 * Note: In a real application, this would interact with a database
 * This implementation uses in-memory storage for demonstration
 */
export class RefreshTokenService {
  private static tokens: Map<string, RefreshTokenData> = new Map();

  /**
   * Store refresh token
   */
  static async store(userId: string, token: string, expiresAt: Date): Promise<RefreshTokenData> {
    const tokenData: RefreshTokenData = {
      id: crypto.randomUUID(),
      userId,
      token: this.hashToken(token),
      expiresAt,
      isRevoked: false,
      createdAt: new Date(),
    };

    this.tokens.set(tokenData.id, tokenData);
    return tokenData;
  }

  /**
   * Find refresh token by token value
   */
  static async findByToken(token: string): Promise<RefreshTokenData | null> {
    const hashedToken = this.hashToken(token);
    
    for (const tokenData of this.tokens.values()) {
      if (tokenData.token === hashedToken && !tokenData.isRevoked) {
        return tokenData;
      }
    }
    
    return null;
  }

  /**
   * Verify and get refresh token data
   */
  static async verifyToken(token: string): Promise<RefreshTokenData | null> {
    // First verify JWT signature and expiration
    const payload = verifyRefreshToken(token);
    if (!payload) {
      return null;
    }

    // Then check if token exists in our store and is not revoked
    const tokenData = await this.findByToken(token);
    if (!tokenData || tokenData.isRevoked) {
      return null;
    }

    // Check expiration
    if (tokenData.expiresAt < new Date()) {
      await this.revoke(tokenData.id);
      return null;
    }

    // Update last used timestamp
    tokenData.lastUsedAt = new Date();
    this.tokens.set(tokenData.id, tokenData);

    return tokenData;
  }

  /**
   * Revoke refresh token
   */
  static async revoke(tokenId: string): Promise<boolean> {
    const tokenData = this.tokens.get(tokenId);
    if (!tokenData) {
      return false;
    }

    tokenData.isRevoked = true;
    this.tokens.set(tokenId, tokenData);
    return true;
  }

  /**
   * Revoke all refresh tokens for a user
   */
  static async revokeAllForUser(userId: string): Promise<number> {
    let revokedCount = 0;
    
    for (const [id, tokenData] of this.tokens.entries()) {
      if (tokenData.userId === userId && !tokenData.isRevoked) {
        tokenData.isRevoked = true;
        this.tokens.set(id, tokenData);
        revokedCount++;
      }
    }
    
    return revokedCount;
  }

  /**
   * Clean up expired tokens
   */
  static async cleanupExpired(): Promise<number> {
    const now = new Date();
    let cleanedCount = 0;
    
    for (const [id, tokenData] of this.tokens.entries()) {
      if (tokenData.expiresAt < now) {
        this.tokens.delete(id);
        cleanedCount++;
      }
    }
    
    return cleanedCount;
  }

  /**
   * Get all active tokens for a user
   */
  static async getActiveTokensForUser(userId: string): Promise<RefreshTokenData[]> {
    const userTokens: RefreshTokenData[] = [];
    const now = new Date();
    
    for (const tokenData of this.tokens.values()) {
      if (
        tokenData.userId === userId &&
        !tokenData.isRevoked &&
        tokenData.expiresAt > now
      ) {
        userTokens.push(tokenData);
      }
    }
    
    return userTokens;
  }

  /**
   * Hash token for secure storage
   */
  private static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}