/**
 * Unit Tests for AuthMiddleware
 */

import { AuthMiddleware, AuthConfig } from '../../src/utils/auth-middleware';

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let authConfig: AuthConfig;

  beforeEach(() => {
    authConfig = {
      enabled: true,
      apiKeys: ['test-api-key-1', 'test-api-key-2'],
      allowedOrigins: ['https://example.com', 'https://app.example.com'],
      rateLimiting: {
        enabled: true,
        maxRequests: 100,
        windowMs: 60000,
      },
      permissions: {
        'test-api-key-1': ['read', 'write'],
        'test-api-key-2': ['read'],
      },
    };

    authMiddleware = new AuthMiddleware(authConfig);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('authenticate', () => {
    it('should authenticate with valid API key in Authorization header', async () => {
      const headers = {
        authorization: 'Bearer test-api-key-1',
      };

      const result = await authMiddleware.authenticate(headers);

      expect(result.isAuthenticated).toBe(true);
      expect(result.apiKey).toBe('test-api-key-1');
      expect(result.permissions).toEqual(['read', 'write']);
      expect(result.clientId).toMatch(/^client_[a-f0-9]{8}$/);
    });

    it('should authenticate with valid API key in X-API-Key header', async () => {
      const headers = {
        'x-api-key': 'test-api-key-2',
      };

      const result = await authMiddleware.authenticate(headers);

      expect(result.isAuthenticated).toBe(true);
      expect(result.apiKey).toBe('test-api-key-2');
      expect(result.permissions).toEqual(['read']);
    });

    it('should return full access when authentication is disabled', async () => {
      const disabledConfig = { ...authConfig, enabled: false };
      const middleware = new AuthMiddleware(disabledConfig);

      const result = await middleware.authenticate({});

      expect(result.isAuthenticated).toBe(true);
      expect(result.permissions).toEqual(['*']);
    });

    it('should throw error when API key is missing', async () => {
      const headers = {};

      await expect(authMiddleware.authenticate(headers))
        .rejects
        .toThrow('API key is required');
    });

    it('should throw error when API key is invalid', async () => {
      const headers = {
        authorization: 'Bearer invalid-key',
      };

      await expect(authMiddleware.authenticate(headers))
        .rejects
        .toThrow('Invalid API key');
    });

    it('should validate origin when configured', async () => {
      const headers = {
        authorization: 'Bearer test-api-key-1',
        origin: 'https://example.com',
      };

      const result = await authMiddleware.authenticate(headers);

      expect(result.isAuthenticated).toBe(true);
    });

    it('should reject invalid origin', async () => {
      const headers = {
        authorization: 'Bearer test-api-key-1',
        origin: 'https://malicious.com',
      };

      await expect(authMiddleware.authenticate(headers))
        .rejects
        .toThrow('Origin not allowed');
    });

    it('should allow wildcard origin', async () => {
      const wildcardConfig = {
        ...authConfig,
        allowedOrigins: ['*'],
      };
      const middleware = new AuthMiddleware(wildcardConfig);

      const headers = {
        authorization: 'Bearer test-api-key-1',
        origin: 'https://any-origin.com',
      };

      const result = await middleware.authenticate(headers);

      expect(result.isAuthenticated).toBe(true);
    });

    it('should handle prefix origin matching', async () => {
      const prefixConfig = {
        ...authConfig,
        allowedOrigins: ['https://app.example.*'],
      };
      const middleware = new AuthMiddleware(prefixConfig);

      const headers = {
        authorization: 'Bearer test-api-key-1',
        origin: 'https://app.example.dev',
      };

      const result = await middleware.authenticate(headers);

      expect(result.isAuthenticated).toBe(true);
    });

    it('should include rate limit info in response', async () => {
      const headers = {
        authorization: 'Bearer test-api-key-1',
      };

      const result = await authMiddleware.authenticate(headers);

      expect(result.rateLimitInfo).toBeDefined();
      expect(result.rateLimitInfo!.remaining).toBe(99); // One request used
      expect(typeof result.rateLimitInfo!.resetTime).toBe('number');
    });

    it('should enforce rate limiting', async () => {
      const limitedConfig = {
        ...authConfig,
        rateLimiting: {
          enabled: true,
          maxRequests: 2,
          windowMs: 60000,
        },
      };
      const middleware = new AuthMiddleware(limitedConfig);

      const headers = {
        authorization: 'Bearer test-api-key-1',
      };

      // First two requests should succeed
      await middleware.authenticate(headers);
      await middleware.authenticate(headers);

      // Third request should fail
      await expect(middleware.authenticate(headers))
        .rejects
        .toThrow('Rate limit exceeded');
    });

    it('should assign default permissions for unknown API key', async () => {
      const headers = {
        authorization: 'Bearer unknown-key',
      };

      // First make the key valid by adding it to the config
      authConfig.apiKeys.push('unknown-key');
      const middleware = new AuthMiddleware(authConfig);

      const result = await middleware.authenticate(headers);

      expect(result.permissions).toEqual(['read']); // Default permissions
    });
  });

  describe('authorize', () => {
    let authContext: any;

    beforeEach(() => {
      authContext = {
        isAuthenticated: true,
        permissions: ['read', 'write:users'],
      };
    });

    it('should authorize with admin permissions', () => {
      const adminContext = {
        ...authContext,
        permissions: ['*'],
      };

      const result = authMiddleware.authorize(adminContext, 'delete', 'users');

      expect(result).toBe(true);
    });

    it('should authorize with specific permission', () => {
      const result = authMiddleware.authorize(authContext, 'read');

      expect(result).toBe(true);
    });

    it('should authorize with resource-specific permission', () => {
      const result = authMiddleware.authorize(authContext, 'write', 'users');

      expect(result).toBe(true);
    });

    it('should authorize with wildcard permission', () => {
      const wildcardContext = {
        ...authContext,
        permissions: ['write:*'],
      };

      const result = authMiddleware.authorize(wildcardContext, 'write', 'posts');

      expect(result).toBe(true);
    });

    it('should deny without authentication', () => {
      const unauthContext = {
        isAuthenticated: false,
        permissions: [] as string[],
      };

      const result = authMiddleware.authorize(unauthContext, 'read');

      expect(result).toBe(false);
    });

    it('should deny without required permission', () => {
      const result = authMiddleware.authorize(authContext, 'delete', 'users');

      expect(result).toBe(false);
    });

    it('should deny access to restricted resource', () => {
      const limitedContext = {
        ...authContext,
        permissions: ['read:users'],
      };

      const result = authMiddleware.authorize(limitedContext, 'read', 'admin');

      expect(result).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should reset rate limit after window expires', async () => {
      const shortWindowConfig = {
        ...authConfig,
        rateLimiting: {
          enabled: true,
          maxRequests: 1,
          windowMs: 100, // 100ms window
        },
      };
      const middleware = new AuthMiddleware(shortWindowConfig);

      const headers = {
        authorization: 'Bearer test-api-key-1',
      };

      // Use up the rate limit
      await middleware.authenticate(headers);

      // Wait for window to reset
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be able to authenticate again
      const result = await middleware.authenticate(headers);
      expect(result.isAuthenticated).toBe(true);
    });

    it('should track different API keys separately', async () => {
      const headers1 = { authorization: 'Bearer test-api-key-1' };
      const headers2 = { authorization: 'Bearer test-api-key-2' };

      const result1 = await authMiddleware.authenticate(headers1);
      const result2 = await authMiddleware.authenticate(headers2);

      expect(result1.isAuthenticated).toBe(true);
      expect(result2.isAuthenticated).toBe(true);
      expect(result1.rateLimitInfo!.remaining).toBe(99);
      expect(result2.rateLimitInfo!.remaining).toBe(99);
    });

    it('should provide accurate remaining requests', async () => {
      const headers = {
        authorization: 'Bearer test-api-key-1',
      };

      const result1 = await authMiddleware.authenticate(headers);
      expect(result1.rateLimitInfo!.remaining).toBe(99);

      const result2 = await authMiddleware.authenticate(headers);
      expect(result2.rateLimitInfo!.remaining).toBe(98);
    });
  });

  describe('Statistics', () => {
    it('should provide authentication statistics', async () => {
      const headers1 = { authorization: 'Bearer test-api-key-1' };
      const headers2 = { authorization: 'Bearer test-api-key-2' };

      await authMiddleware.authenticate(headers1);
      await authMiddleware.authenticate(headers2);
      await authMiddleware.authenticate(headers1);

      const stats = authMiddleware.getStats();

      expect(stats.activeClients).toBe(2);
      expect(stats.totalRequests).toBe(3);
      expect(typeof stats.rateLimitedRequests).toBe('number');
    });
  });

  describe('Client ID Generation', () => {
    it('should generate consistent client IDs for same API key', async () => {
      const headers = {
        authorization: 'Bearer test-api-key-1',
      };

      const result1 = await authMiddleware.authenticate(headers);
      const result2 = await authMiddleware.authenticate(headers);

      expect(result1.clientId).toBe(result2.clientId);
      expect(result1.clientId).toMatch(/^client_[a-f0-9]{8}$/);
    });

    it('should generate different client IDs for different API keys', async () => {
      const headers1 = { authorization: 'Bearer test-api-key-1' };
      const headers2 = { authorization: 'Bearer test-api-key-2' };

      const result1 = await authMiddleware.authenticate(headers1);
      const result2 = await authMiddleware.authenticate(headers2);

      expect(result1.clientId).not.toBe(result2.clientId);
    });
  });
});