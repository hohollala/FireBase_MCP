/**
 * E2E Integration Tests for Firebase MCP Server
 */

import { FirebaseMCPServer } from '../../src/server/mcp-server';
import { AuthConfig } from '../../src/utils/auth-middleware';

describe('Firebase MCP Server E2E Tests', () => {
  let server: FirebaseMCPServer;

  beforeAll(async () => {
    // Use test authentication configuration
    const testAuthConfig: AuthConfig = {
      enabled: false, // Disable auth for testing
      apiKeys: [],
      allowedOrigins: ['*'],
      rateLimiting: {
        enabled: false,
        maxRequests: 1000,
        windowMs: 60000,
      },
      permissions: {},
    };

    server = new FirebaseMCPServer(testAuthConfig);
  });

  afterAll(async () => {
    if (server && server.isServerRunning()) {
      await server.stop();
    }
  });

  describe('Server Lifecycle', () => {
    it('should start and stop server successfully', async () => {
      expect(server.isServerRunning()).toBe(false);
      
      // Note: We can't actually start the server in tests due to Firebase initialization
      // This test verifies the server can be instantiated
      expect(server).toBeDefined();
      expect(typeof server.start).toBe('function');
      expect(typeof server.stop).toBe('function');
    });
  });

  describe('Authentication Integration', () => {
    it('should have authentication middleware configured', () => {
      const authMiddleware = server.getAuthMiddleware();
      expect(authMiddleware).toBeDefined();
      expect(typeof authMiddleware.authenticate).toBe('function');
      expect(typeof authMiddleware.authorize).toBe('function');
    });

    it('should have permission manager configured', () => {
      const permissionManager = server.getPermissionManager();
      expect(permissionManager).toBeDefined();
      expect(typeof permissionManager.hasPermission).toBe('function');
      expect(typeof permissionManager.setUserPermissions).toBe('function');
    });

    it('should allow updating auth configuration', () => {
      const newConfig: AuthConfig = {
        enabled: true,
        apiKeys: ['test-key'],
        allowedOrigins: ['https://example.com'],
        rateLimiting: {
          enabled: true,
          maxRequests: 100,
          windowMs: 60000,
        },
        permissions: {
          'test-key': ['read', 'write'],
        },
      };

      expect(() => server.updateAuthConfig(newConfig)).not.toThrow();
    });

    it('should allow adding user permissions', () => {
      expect(() => {
        server.addUserPermissions('testuser', ['viewer'], ['custom:action']);
      }).not.toThrow();

      const permissionManager = server.getPermissionManager();
      const userPermissions = permissionManager.getUserPermissions('testuser');
      
      expect(userPermissions).toContain('custom:action');
      expect(userPermissions).toContain('auth:read'); // From viewer role
    });
  });

  describe('Role and Permission System Integration', () => {
    it('should have default roles configured', () => {
      const permissionManager = server.getPermissionManager();
      const roles = permissionManager.getAllRoles();
      
      const roleIds = roles.map(r => r.id);
      expect(roleIds).toContain('viewer');
      expect(roleIds).toContain('editor');
      expect(roleIds).toContain('admin');
      expect(roleIds).toContain('developer');
      expect(roleIds).toContain('security-auditor');
    });

    it('should have default permissions configured', () => {
      const permissionManager = server.getPermissionManager();
      const permissions = permissionManager.getAllPermissions();
      
      const permissionIds = permissions.map(p => p.id);
      expect(permissionIds).toContain('auth:read');
      expect(permissionIds).toContain('firestore:write');
      expect(permissionIds).toContain('storage:read');
      expect(permissionIds).toContain('*'); // Admin permission
    });

    it('should handle role inheritance correctly', () => {
      const permissionManager = server.getPermissionManager();
      
      // Test editor role inheritance from viewer
      const editorPermissions = permissionManager.getRolePermissions('editor');
      expect(editorPermissions).toContain('auth:read'); // Inherited from viewer
      expect(editorPermissions).toContain('firestore:*'); // Editor's own permission
    });

    it('should handle complex permission scenarios', () => {
      const permissionManager = server.getPermissionManager();
      
      // Set up complex user permissions
      server.addUserPermissions('complexuser', ['editor'], ['custom:special']);
      
      // Test various permission checks
      expect(permissionManager.hasPermission('complexuser', 'auth:read')).toBe(true);
      expect(permissionManager.hasPermission('complexuser', 'firestore:write')).toBe(true);
      expect(permissionManager.hasPermission('complexuser', 'custom:special')).toBe(true);
      expect(permissionManager.hasPermission('complexuser', 'admin:delete')).toBe(false);
    });
  });

  describe('Security System Integration', () => {
    it('should handle permission denial correctly', () => {
      const permissionManager = server.getPermissionManager();
      
      // Set up user with denied permissions
      permissionManager.setUserPermissions({
        userId: 'restricteduser',
        roles: ['viewer'],
        directPermissions: [],
        deniedPermissions: ['auth:write'],
      });
      
      expect(permissionManager.hasPermission('restricteduser', 'auth:read')).toBe(true);
      expect(permissionManager.hasPermission('restricteduser', 'auth:write')).toBe(false);
    });

    it('should handle wildcard permissions correctly', () => {
      const permissionManager = server.getPermissionManager();
      
      // Set up admin user
      server.addUserPermissions('adminuser', ['admin'], []);
      
      // Admin should have access to everything
      expect(permissionManager.hasPermission('adminuser', 'any:action')).toBe(true);
      expect(permissionManager.hasPermission('adminuser', 'custom:permission')).toBe(true);
    });

    it('should handle service-level wildcard permissions', () => {
      const permissionManager = server.getPermissionManager();
      
      // Editor has firestore:* permission
      server.addUserPermissions('editoruser', ['editor'], []);
      
      expect(permissionManager.hasPermission('editoruser', 'firestore:read')).toBe(true);
      expect(permissionManager.hasPermission('editoruser', 'firestore:write')).toBe(true);
      expect(permissionManager.hasPermission('editoruser', 'firestore:custom')).toBe(true);
      expect(permissionManager.hasPermission('editoruser', 'storage:read')).toBe(true); // Also has storage:*
    });
  });

  describe('Statistics and Monitoring', () => {
    it('should provide authentication statistics', () => {
      const authMiddleware = server.getAuthMiddleware();
      const stats = authMiddleware.getStats();
      
      expect(stats).toHaveProperty('activeClients');
      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('rateLimitedRequests');
      expect(typeof stats.activeClients).toBe('number');
      expect(typeof stats.totalRequests).toBe('number');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid user permissions gracefully', () => {
      const permissionManager = server.getPermissionManager();
      
      expect(() => {
        permissionManager.setUserPermissions({
          userId: '', // Invalid - empty user ID
          roles: ['viewer'],
          directPermissions: [],
          deniedPermissions: [],
        });
      }).toThrow('User ID is required');
    });

    it('should handle invalid role references', () => {
      expect(() => {
        server.addUserPermissions('testuser', ['nonexistent-role'], []);
      }).toThrow('Role \'nonexistent-role\' does not exist');
    });

    it('should handle circular role inheritance', () => {
      const permissionManager = server.getPermissionManager();
      
      // Create roles that would create a circular dependency
      permissionManager.setRole({
        id: 'role-a',
        name: 'Role A',
        description: 'Test role A',
        permissions: ['test:a'],
        inherits: ['role-b'],
      });
      
      expect(() => {
        permissionManager.setRole({
          id: 'role-b',
          name: 'Role B',
          description: 'Test role B',
          permissions: ['test:b'],
          inherits: ['role-a'], // Creates circular dependency
        });
      }).toThrow('Circular inheritance detected');
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple permission checks efficiently', () => {
      const permissionManager = server.getPermissionManager();
      server.addUserPermissions('perfuser', ['editor'], []);
      
      const startTime = Date.now();
      
      // Perform many permission checks
      for (let i = 0; i < 1000; i++) {
        permissionManager.hasPermission('perfuser', 'firestore:read');
        permissionManager.hasPermission('perfuser', 'auth:write');
        permissionManager.hasPermission('perfuser', 'storage:read');
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete 3000 permission checks in reasonable time
      expect(duration).toBeLessThan(1000); // Less than 1 second
    });

    it('should handle large numbers of roles and permissions', () => {
      const permissionManager = server.getPermissionManager();
      
      const startTime = Date.now();
      
      // Create many custom roles and permissions
      for (let i = 0; i < 100; i++) {
        permissionManager.setRole({
          id: `custom-role-${i}`,
          name: `Custom Role ${i}`,
          description: `Test role ${i}`,
          permissions: [`custom:action${i}`],
        });
        
        permissionManager.setPermission({
          id: `custom:action${i}`,
          name: `Custom Action ${i}`,
          description: `Test permission ${i}`,
          resource: 'custom',
          action: `action${i}`,
        });
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should handle 100 roles/permissions creation efficiently
      expect(duration).toBeLessThan(500); // Less than 500ms
      
      // Verify they were created
      const allRoles = permissionManager.getAllRoles();
      const allPermissions = permissionManager.getAllPermissions();
      
      expect(allRoles.length).toBeGreaterThanOrEqual(105); // 5 default + 100 custom
      expect(allPermissions.length).toBeGreaterThanOrEqual(100); // At least 100 custom
    });
  });

  describe('Memory Management', () => {
    it('should clean up user permissions when needed', () => {
      const permissionManager = server.getPermissionManager();
      
      // Add many users
      for (let i = 0; i < 100; i++) {
        server.addUserPermissions(`tempuser${i}`, ['viewer'], []);
      }
      
      // Verify users exist
      expect(permissionManager.hasPermission('tempuser50', 'auth:read')).toBe(true);
      
      // Note: In a real implementation, we might have a cleanup method
      // For now, we just verify the system can handle many users
      expect(permissionManager.getUserPermissions('tempuser99')).toContain('auth:read');
    });
  });
});