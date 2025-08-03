/**
 * Authentication Middleware for MCP Server
 * 
 * Provides client authentication and authorization for MCP requests
 */

import { logger } from './logger';
import { ValidationError, AuthenticationError } from './error-handler';

export interface AuthConfig {
  enabled: boolean;
  apiKeys: string[];
  allowedOrigins: string[];
  rateLimiting: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
  };
  permissions: {
    [key: string]: string[];
  };
}

export interface AuthContext {
  isAuthenticated: boolean;
  apiKey?: string;
  permissions: string[];
  clientId?: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
  };
}

export class AuthMiddleware {
  private config: AuthConfig;
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(config: AuthConfig) {
    this.config = config;
    this.startCleanupInterval();
  }

  /**
   * Authenticate MCP request
   */
  async authenticate(headers: Record<string, string>): Promise<AuthContext> {
    try {
      if (!this.config.enabled) {
        return {
          isAuthenticated: true,
          permissions: ['*'],
        };
      }

      const apiKey = this.extractApiKey(headers);
      const origin = headers.origin || headers.referer;

      // Validate API key
      if (!apiKey) {
        throw new AuthenticationError('API key is required');
      }

      if (!this.config.apiKeys.includes(apiKey)) {
        throw new AuthenticationError('Invalid API key');
      }

      // Validate origin if configured
      if (this.config.allowedOrigins.length > 0 && origin) {
        const isAllowedOrigin = this.config.allowedOrigins.some(allowedOrigin => {
          if (allowedOrigin === '*') return true;
          if (allowedOrigin.endsWith('*')) {
            return origin.startsWith(allowedOrigin.slice(0, -1));
          }
          return origin === allowedOrigin;
        });

        if (!isAllowedOrigin) {
          throw new AuthenticationError('Origin not allowed');
        }
      }

      // Rate limiting
      const rateLimitInfo = await this.checkRateLimit(apiKey);

      // Get permissions for API key
      const permissions = this.config.permissions[apiKey] || ['read'];

      const authContext: AuthContext = {
        isAuthenticated: true,
        apiKey,
        permissions,
        clientId: this.generateClientId(apiKey),
        rateLimitInfo,
      };

      logger.debug('Authentication successful', {
        clientId: authContext.clientId,
        permissions: authContext.permissions,
      });

      return authContext;
    } catch (error: any) {
      logger.warn('Authentication failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Authorize action based on permissions
   */
  authorize(authContext: AuthContext, action: string, resource?: string): boolean {
    try {
      if (!authContext.isAuthenticated) {
        return false;
      }

      // Admin permissions
      if (authContext.permissions.includes('*') || authContext.permissions.includes('admin')) {
        return true;
      }

      // Check specific permissions
      const requiredPermission = resource ? `${action}:${resource}` : action;
      
      const hasPermission = authContext.permissions.some(permission => {
        // Exact match
        if (permission === requiredPermission) return true;
        
        // Wildcard match
        if (permission.endsWith('*')) {
          const prefix = permission.slice(0, -1);
          return requiredPermission.startsWith(prefix);
        }
        
        // Action-level permission
        if (permission === action) return true;
        
        return false;
      });

      logger.debug('Authorization check', {
        action,
        resource,
        requiredPermission,
        userPermissions: authContext.permissions,
        hasPermission,
      });

      return hasPermission;
    } catch (error: any) {
      logger.error('Authorization error', { error });
      return false;
    }
  }

  /**
   * Extract API key from headers
   */
  private extractApiKey(headers: Record<string, string>): string | undefined {
    // Check Authorization header (Bearer token)
    const authHeader = headers.authorization || headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check X-API-Key header
    const apiKeyHeader = headers['x-api-key'] || headers['X-API-Key'];
    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    return undefined;
  }

  /**
   * Check rate limiting
   */
  private async checkRateLimit(apiKey: string): Promise<{ remaining: number; resetTime: number }> {
    if (!this.config.rateLimiting.enabled) {
      return {
        remaining: this.config.rateLimiting.maxRequests,
        resetTime: Date.now() + this.config.rateLimiting.windowMs,
      };
    }

    const now = Date.now();
    const windowStart = now - this.config.rateLimiting.windowMs;
    
    let requestInfo = this.requestCounts.get(apiKey);
    
    // Reset if window has passed
    if (!requestInfo || requestInfo.resetTime <= now) {
      requestInfo = {
        count: 0,
        resetTime: now + this.config.rateLimiting.windowMs,
      };
    }

    // Check if rate limit exceeded
    if (requestInfo.count >= this.config.rateLimiting.maxRequests) {
      throw new AuthenticationError(
        `Rate limit exceeded. Try again after ${new Date(requestInfo.resetTime).toISOString()}`
      );
    }

    // Increment request count
    requestInfo.count++;
    this.requestCounts.set(apiKey, requestInfo);

    return {
      remaining: this.config.rateLimiting.maxRequests - requestInfo.count,
      resetTime: requestInfo.resetTime,
    };
  }

  /**
   * Generate client ID from API key
   */
  private generateClientId(apiKey: string): string {
    const hash = require('crypto')
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');
    return `client_${hash.substring(0, 8)}`;
  }

  /**
   * Start cleanup interval for rate limiting
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [apiKey, requestInfo] of this.requestCounts.entries()) {
        if (requestInfo.resetTime <= now) {
          this.requestCounts.delete(apiKey);
        }
      }
    }, this.config.rateLimiting.windowMs);
  }

  /**
   * Get authentication statistics
   */
  getStats(): {
    activeClients: number;
    totalRequests: number;
    rateLimitedRequests: number;
  } {
    return {
      activeClients: this.requestCounts.size,
      totalRequests: Array.from(this.requestCounts.values())
        .reduce((sum, info) => sum + info.count, 0),
      rateLimitedRequests: 0, // Would need to track this separately
    };
  }
}

/**
 * Default authentication configuration
 */
export const defaultAuthConfig: AuthConfig = {
  enabled: false, // Disabled by default for development
  apiKeys: [],
  allowedOrigins: ['*'],
  rateLimiting: {
    enabled: true,
    maxRequests: 100,
    windowMs: 60000, // 1 minute
  },
  permissions: {
    // Example permissions structure
    // 'api-key-1': ['read', 'write'],
    // 'api-key-2': ['read'],
    // 'admin-key': ['*'],
  },
};