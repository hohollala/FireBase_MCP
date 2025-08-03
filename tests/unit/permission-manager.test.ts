/**
 * Unit Tests for PermissionManager
 */

import { PermissionManager, Role, Permission, UserPermissions } from '../../src/utils/permission-manager';

describe('PermissionManager', () => {
  let permissionManager: PermissionManager;

  beforeEach(() => {
    permissionManager = new PermissionManager();
  });

  describe('Initialization', () => {
    it('should initialize with default roles', () => {
      const roles = permissionManager.getAllRoles();
      
      expect(roles.length).toBeGreaterThan(0);
      
      const roleIds = roles.map(r => r.id);
      expect(roleIds).toContain('viewer');
      expect(roleIds).toContain('editor');
      expect(roleIds).toContain('admin');
      expect(roleIds).toContain('developer');
      expect(roleIds).toContain('security-auditor');
    });

    it('should initialize with default permissions', () => {
      const permissions = permissionManager.getAllPermissions();
      
      expect(permissions.length).toBeGreaterThan(0);
      
      const permissionIds = permissions.map(p => p.id);
      expect(permissionIds).toContain('auth:read');
      expect(permissionIds).toContain('firestore:write');
      expect(permissionIds).toContain('*');
    });
  });

  describe('Role Management', () => {
    it('should add new role', () => {
      const newRole: Role = {
        id: 'custom-role',
        name: 'Custom Role',
        description: 'A custom role for testing',
        permissions: ['auth:read', 'firestore:read'],
      };

      permissionManager.setRole(newRole);

      const retrievedRole = permissionManager.getRole('custom-role');
      expect(retrievedRole).toEqual(newRole);
    });

    it('should update existing role', () => {
      const updatedRole: Role = {
        id: 'viewer',
        name: 'Updated Viewer',
        description: 'Updated viewer role',
        permissions: ['auth:read', 'firestore:read', 'storage:read'],
      };

      permissionManager.setRole(updatedRole);

      const retrievedRole = permissionManager.getRole('viewer');
      expect(retrievedRole?.name).toBe('Updated Viewer');
      expect(retrievedRole?.permissions).toContain('storage:read');
    });

    it('should throw error for invalid role', () => {
      const invalidRole = {
        id: '',
        name: 'Invalid Role',
        description: 'Missing ID',
        permissions: [] as string[],
      };

      expect(() => permissionManager.setRole(invalidRole as Role))
        .toThrow('Role ID and name are required');
    });

    it('should validate role inheritance cycles', () => {
      const role1: Role = {
        id: 'role1',
        name: 'Role 1',
        description: 'First role',
        permissions: ['auth:read'],
        inherits: ['role2'],
      };

      const role2: Role = {
        id: 'role2',
        name: 'Role 2',
        description: 'Second role',
        permissions: ['firestore:read'],
        inherits: ['role1'], // Circular dependency
      };

      permissionManager.setRole(role2);

      expect(() => permissionManager.setRole(role1))
        .toThrow('Circular inheritance detected for role \'role1\'');
    });
  });

  describe('Permission Management', () => {
    it('should add new permission', () => {
      const newPermission: Permission = {
        id: 'custom:action',
        name: 'Custom Action',
        description: 'A custom permission',
        resource: 'custom',
        action: 'action',
      };

      permissionManager.setPermission(newPermission);

      const retrievedPermission = permissionManager.getPermission('custom:action');
      expect(retrievedPermission).toEqual(newPermission);
    });

    it('should throw error for invalid permission', () => {
      const invalidPermission = {
        id: '',
        name: 'Invalid Permission',
        description: 'Missing ID',
        resource: 'test',
        action: 'read',
      };

      expect(() => permissionManager.setPermission(invalidPermission as Permission))
        .toThrow('Permission ID, resource, and action are required');
    });
  });

  describe('User Permission Management', () => {
    it('should set user permissions', () => {
      const userPermissions: UserPermissions = {
        userId: 'user123',
        roles: ['viewer', 'developer'],
        directPermissions: ['custom:action'],
        deniedPermissions: ['auth:delete'],
      };

      permissionManager.setUserPermissions(userPermissions);

      const retrievedPermissions = permissionManager.getUserPermissionsObject('user123');
      expect(retrievedPermissions).toEqual(userPermissions);
    });

    it('should throw error for invalid user permissions', () => {
      const invalidPermissions = {
        userId: '',
        roles: ['viewer'],
        directPermissions: [] as string[],
        deniedPermissions: [] as string[],
      };

      expect(() => permissionManager.setUserPermissions(invalidPermissions as UserPermissions))
        .toThrow('User ID is required');
    });

    it('should validate role existence', () => {
      const userPermissions: UserPermissions = {
        userId: 'user123',
        roles: ['nonexistent-role'],
        directPermissions: [] as string[],
        deniedPermissions: [] as string[],
      };

      expect(() => permissionManager.setUserPermissions(userPermissions))
        .toThrow('Role \'nonexistent-role\' does not exist');
    });
  });

  describe('Permission Checking', () => {
    beforeEach(() => {
      // Set up test user
      const userPermissions: UserPermissions = {
        userId: 'testuser',
        roles: ['editor'],
        directPermissions: ['custom:action'],
        deniedPermissions: ['auth:delete'],
      };
      permissionManager.setUserPermissions(userPermissions);
    });

    it('should check direct permissions', () => {
      const hasPermission = permissionManager.hasPermission('testuser', 'custom:action');
      expect(hasPermission).toBe(true);
    });

    it('should check role-based permissions', () => {
      const hasPermission = permissionManager.hasPermission('testuser', 'firestore:write');
      expect(hasPermission).toBe(true);
    });

    it('should deny explicitly denied permissions', () => {
      const hasPermission = permissionManager.hasPermission('testuser', 'auth:delete');
      expect(hasPermission).toBe(false);
    });

    it('should handle wildcard permissions', () => {
      // Admin role has '*' permission
      const adminUser: UserPermissions = {
        userId: 'admin',
        roles: ['admin'],
        directPermissions: [] as string[],
        deniedPermissions: [] as string[],
      };
      permissionManager.setUserPermissions(adminUser);

      const hasPermission = permissionManager.hasPermission('admin', 'any:permission');
      expect(hasPermission).toBe(true);
    });

    it('should handle service-level wildcard permissions', () => {
      const hasPermission = permissionManager.hasPermission('testuser', 'firestore:read');
      expect(hasPermission).toBe(true);
    });

    it('should return false for nonexistent user', () => {
      const hasPermission = permissionManager.hasPermission('nonexistent', 'auth:read');
      expect(hasPermission).toBe(false);
    });

    it('should return false for unauthorized permissions', () => {
      const hasPermission = permissionManager.hasPermission('testuser', 'functions:deploy');
      expect(hasPermission).toBe(false);
    });
  });

  describe('Role Inheritance', () => {
    it('should inherit permissions from parent roles', () => {
      const permissions = permissionManager.getRolePermissions('editor');
      
      // Editor should have its own permissions plus inherited from viewer
      expect(permissions).toContain('auth:read'); // From viewer
      expect(permissions).toContain('firestore:*'); // From editor
    });

    it('should handle multiple inheritance levels', () => {
      const permissions = permissionManager.getRolePermissions('admin');
      
      // Admin inherits from editor, which inherits from viewer
      expect(permissions).toContain('*'); // Admin's own permission
    });
  });

  describe('getUserPermissions', () => {
    beforeEach(() => {
      const userPermissions: UserPermissions = {
        userId: 'testuser',
        roles: ['viewer', 'developer'],
        directPermissions: ['custom:action'],
        deniedPermissions: ['auth:write'],
      };
      permissionManager.setUserPermissions(userPermissions);
    });

    it('should return all user permissions', () => {
      const permissions = permissionManager.getUserPermissions('testuser');
      
      expect(permissions).toContain('custom:action'); // Direct permission
      expect(permissions).toContain('auth:read'); // From viewer role
      expect(permissions).toContain('functions:*'); // From developer role
      expect(permissions).not.toContain('auth:write'); // Denied permission
    });

    it('should return empty array for nonexistent user', () => {
      const permissions = permissionManager.getUserPermissions('nonexistent');
      expect(permissions).toEqual([]);
    });

    it('should deduplicate permissions', () => {
      const permissions = permissionManager.getUserPermissions('testuser');
      const uniquePermissions = [...new Set(permissions)];
      
      expect(permissions.length).toBe(uniquePermissions.length);
    });
  });

  describe('Permission Conditions', () => {
    beforeEach(() => {
      // Add permission with conditions
      const conditionalPermission: Permission = {
        id: 'conditional:action',
        name: 'Conditional Action',
        description: 'Action with IP restriction',
        resource: 'conditional',
        action: 'action',
        conditions: [
          {
            type: 'ip',
            operator: 'equals',
            value: '192.168.1.1',
            description: 'Only from specific IP',
          },
        ],
      };
      permissionManager.setPermission(conditionalPermission);

      const userPermissions: UserPermissions = {
        userId: 'conduser',
        roles: [],
        directPermissions: ['conditional:action'],
        deniedPermissions: [] as string[],
      };
      permissionManager.setUserPermissions(userPermissions);
    });

    it('should check IP-based conditions', () => {
      const context = { ip: '192.168.1.1' };
      const hasPermission = permissionManager.hasPermission('conduser', 'conditional:action', context);
      expect(hasPermission).toBe(true);
    });

    it('should deny access with wrong IP', () => {
      const context = { ip: '192.168.1.2' };
      const hasPermission = permissionManager.hasPermission('conduser', 'conditional:action', context);
      expect(hasPermission).toBe(false);
    });

    it('should allow access without conditions when no context provided', () => {
      // For permissions without conditions
      const hasPermission = permissionManager.hasPermission('conduser', 'conditional:action');
      expect(hasPermission).toBe(true);
    });
  });

  describe('Security Auditor Role', () => {
    beforeEach(() => {
      const userPermissions: UserPermissions = {
        userId: 'auditor',
        roles: ['security-auditor'],
        directPermissions: [] as string[],
        deniedPermissions: [] as string[],
      };
      permissionManager.setUserPermissions(userPermissions);
    });

    it('should have security-specific permissions', () => {
      const hasSecurityPermission = permissionManager.hasPermission('auditor', 'security:audit');
      expect(hasSecurityPermission).toBe(true);
    });

    it('should have read access to core services', () => {
      const hasAuthRead = permissionManager.hasPermission('auditor', 'auth:read');
      const hasFirestoreRead = permissionManager.hasPermission('auditor', 'firestore:read');
      
      expect(hasAuthRead).toBe(true);
      expect(hasFirestoreRead).toBe(true);
    });

    it('should not have write permissions', () => {
      const hasAuthWrite = permissionManager.hasPermission('auditor', 'auth:write');
      const hasFirestoreWrite = permissionManager.hasPermission('auditor', 'firestore:write');
      
      expect(hasAuthWrite).toBe(false);
      expect(hasFirestoreWrite).toBe(false);
    });
  });
});