/**
 * Permission Manager for Firebase MCP Server
 * 
 * Handles role-based access control and fine-grained permissions
 */

import { logger } from './logger';
import { ValidationError } from './error-handler';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  inherits?: string[]; // Role inheritance
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  type: 'ip' | 'time' | 'usage' | 'custom';
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in';
  value: any;
  description?: string;
}

export interface UserPermissions {
  userId: string;
  roles: string[];
  directPermissions: string[];
  deniedPermissions: string[];
  metadata?: Record<string, any>;
}

export class PermissionManager {
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private userPermissions: Map<string, UserPermissions> = new Map();

  constructor() {
    this.initializeDefaultRoles();
    this.initializeDefaultPermissions();
  }

  /**
   * Initialize default roles
   */
  private initializeDefaultRoles(): void {
    const defaultRoles: Role[] = [
      {
        id: 'viewer',
        name: 'Viewer',
        description: 'Read-only access to Firebase resources',
        permissions: [
          'auth:read',
          'firestore:read',
          'storage:read',
          'functions:read',
          'analytics:read',
          'messaging:read',
          'hosting:read',
          'remote-config:read',
          'performance:read'
        ]
      },
      {
        id: 'editor',
        name: 'Editor',
        description: 'Read and write access to Firebase resources',
        permissions: [
          'auth:*',
          'firestore:*',
          'storage:*',
          'functions:read',
          'analytics:read',
          'messaging:*',
          'hosting:read',
          'remote-config:*',
          'performance:read'
        ],
        inherits: ['viewer']
      },
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full access to all Firebase resources',
        permissions: ['*'],
        inherits: ['editor']
      },
      {
        id: 'developer',
        name: 'Developer',
        description: 'Development-focused permissions',
        permissions: [
          'auth:read',
          'firestore:*',
          'storage:*',
          'functions:*',
          'analytics:read',
          'messaging:read',
          'hosting:read',
          'remote-config:read',
          'performance:*'
        ],
        inherits: ['viewer']
      },
      {
        id: 'security-auditor',
        name: 'Security Auditor',
        description: 'Security-focused read access',
        permissions: [
          'auth:read',
          'firestore:read',
          'storage:read',
          'functions:read',
          'security:*'
        ]
      }
    ];

    defaultRoles.forEach(role => {
      this.roles.set(role.id, role);
    });

    logger.info('Default roles initialized', { 
      roleCount: defaultRoles.length,
      roles: defaultRoles.map(r => r.id)
    });
  }

  /**
   * Initialize default permissions
   */
  private initializeDefaultPermissions(): void {
    const services = [
      'auth', 'firestore', 'storage', 'functions', 
      'analytics', 'messaging', 'hosting', 'remote-config', 'performance'
    ];
    
    const actions = ['read', 'write', 'create', 'update', 'delete', 'manage'];
    
    const defaultPermissions: Permission[] = [];

    // Generate service-level permissions
    services.forEach(service => {
      actions.forEach(action => {
        defaultPermissions.push({
          id: `${service}:${action}`,
          name: `${service.charAt(0).toUpperCase() + service.slice(1)} ${action.charAt(0).toUpperCase() + action.slice(1)}`,
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} access to ${service} service`,
          resource: service,
          action: action
        });
      });

      // Service-level wildcard permission
      defaultPermissions.push({
        id: `${service}:*`,
        name: `${service.charAt(0).toUpperCase() + service.slice(1)} Full Access`,
        description: `Full access to ${service} service`,
        resource: service,
        action: '*'
      });
    });

    // Global permissions
    defaultPermissions.push({
      id: '*',
      name: 'Super Admin',
      description: 'Full access to all resources and actions',
      resource: '*',
      action: '*'
    });

    // Special permissions
    defaultPermissions.push({
      id: 'security:audit',
      name: 'Security Audit',
      description: 'Access to security audit functionality',
      resource: 'security',
      action: 'audit'
    });

    defaultPermissions.forEach(permission => {
      this.permissions.set(permission.id, permission);
    });

    logger.info('Default permissions initialized', { 
      permissionCount: defaultPermissions.length 
    });
  }

  /**
   * Add or update role
   */
  setRole(role: Role): void {
    try {
      // Validate role
      if (!role.id || !role.name) {
        throw new ValidationError('Role ID and name are required');
      }

      // Validate inheritance cycles
      if (role.inherits) {
        this.validateRoleInheritance(role.id, role.inherits);
      }

      // Validate permissions exist
      for (const permissionId of role.permissions) {
        if (permissionId !== '*' && !this.permissions.has(permissionId)) {
          logger.warn('Permission not found for role', { 
            roleId: role.id, 
            permissionId 
          });
        }
      }

      this.roles.set(role.id, role);
      logger.info('Role updated', { roleId: role.id, roleName: role.name });
    } catch (error: any) {
      logger.error('Failed to set role', { error, role });
      throw error;
    }
  }

  /**
   * Add or update permission
   */
  setPermission(permission: Permission): void {
    try {
      if (!permission.id || !permission.resource || !permission.action) {
        throw new ValidationError('Permission ID, resource, and action are required');
      }

      this.permissions.set(permission.id, permission);
      logger.debug('Permission updated', { permissionId: permission.id });
    } catch (error: any) {
      logger.error('Failed to set permission', { error, permission });
      throw error;
    }
  }

  /**
   * Set user permissions
   */
  setUserPermissions(userPermissions: UserPermissions): void {
    try {
      if (!userPermissions.userId) {
        throw new ValidationError('User ID is required');
      }

      // Validate roles exist
      for (const roleId of userPermissions.roles) {
        if (!this.roles.has(roleId)) {
          throw new ValidationError(`Role '${roleId}' does not exist`);
        }
      }

      this.userPermissions.set(userPermissions.userId, userPermissions);
      logger.info('User permissions updated', { 
        userId: userPermissions.userId,
        roles: userPermissions.roles,
        directPermissions: userPermissions.directPermissions?.length || 0
      });
    } catch (error: any) {
      logger.error('Failed to set user permissions', { error, userPermissions });
      throw error;
    }
  }

  /**
   * Check if user has permission
   */
  hasPermission(
    userId: string, 
    permissionId: string, 
    context?: Record<string, any>
  ): boolean {
    try {
      const userPerms = this.userPermissions.get(userId);
      if (!userPerms) {
        logger.debug('User not found', { userId });
        return false;
      }

      // Check denied permissions first
      if (userPerms.deniedPermissions?.includes(permissionId)) {
        return false;
      }

      // Check direct permissions
      if (userPerms.directPermissions?.includes(permissionId) || 
          userPerms.directPermissions?.includes('*')) {
        return this.checkPermissionConditions(permissionId, context);
      }

      // Check role-based permissions
      const allPermissions = this.getUserPermissions(userId);
      const hasPermission = allPermissions.includes(permissionId) || 
                           allPermissions.includes('*') ||
                           this.matchesWildcardPermission(permissionId, allPermissions);

      if (hasPermission) {
        return this.checkPermissionConditions(permissionId, context);
      }

      return false;
    } catch (error: any) {
      logger.error('Error checking permission', { error, userId, permissionId });
      return false;
    }
  }

  /**
   * Get all permissions for a user
   */
  getUserPermissions(userId: string): string[] {
    const userPerms = this.userPermissions.get(userId);
    if (!userPerms) {
      return [];
    }

    const allPermissions = new Set<string>();

    // Add direct permissions
    userPerms.directPermissions?.forEach(perm => allPermissions.add(perm));

    // Add role-based permissions
    userPerms.roles.forEach(roleId => {
      const rolePermissions = this.getRolePermissions(roleId);
      rolePermissions.forEach(perm => allPermissions.add(perm));
    });

    // Remove denied permissions
    userPerms.deniedPermissions?.forEach(perm => allPermissions.delete(perm));

    return Array.from(allPermissions);
  }

  /**
   * Get all permissions for a role (including inherited)
   */
  getRolePermissions(roleId: string): string[] {
    const role = this.roles.get(roleId);
    if (!role) {
      return [];
    }

    const allPermissions = new Set<string>();

    // Add role's direct permissions
    role.permissions.forEach(perm => allPermissions.add(perm));

    // Add inherited permissions
    if (role.inherits) {
      role.inherits.forEach(inheritedRoleId => {
        const inheritedPermissions = this.getRolePermissions(inheritedRoleId);
        inheritedPermissions.forEach(perm => allPermissions.add(perm));
      });
    }

    return Array.from(allPermissions);
  }

  /**
   * Validate role inheritance for cycles
   */
  private validateRoleInheritance(roleId: string, inherits: string[]): void {
    const visited = new Set<string>();
    const stack = [...inherits];

    while (stack.length > 0) {
      const currentRoleId = stack.pop()!;
      
      if (currentRoleId === roleId) {
        throw new ValidationError(`Circular inheritance detected for role '${roleId}'`);
      }

      if (visited.has(currentRoleId)) {
        continue;
      }

      visited.add(currentRoleId);
      
      const currentRole = this.roles.get(currentRoleId);
      if (currentRole?.inherits) {
        stack.push(...currentRole.inherits);
      }
    }
  }

  /**
   * Check if permission matches wildcard patterns
   */
  private matchesWildcardPermission(permissionId: string, userPermissions: string[]): boolean {
    return userPermissions.some(userPerm => {
      if (userPerm.endsWith('*')) {
        const prefix = userPerm.slice(0, -1);
        return permissionId.startsWith(prefix);
      }
      return false;
    });
  }

  /**
   * Check permission conditions
   */
  private checkPermissionConditions(
    permissionId: string, 
    context?: Record<string, any>
  ): boolean {
    const permission = this.permissions.get(permissionId);
    if (!permission?.conditions || !context) {
      return true;
    }

    return permission.conditions.every(condition => {
      switch (condition.type) {
        case 'ip':
          return this.checkIpCondition(condition, context.ip);
        case 'time':
          return this.checkTimeCondition(condition);
        case 'usage':
          return this.checkUsageCondition(condition, context.usage);
        default:
          return true;
      }
    });
  }

  /**
   * Check IP-based condition
   */
  private checkIpCondition(condition: PermissionCondition, ip?: string): boolean {
    if (!ip) return false;
    
    switch (condition.operator) {
      case 'equals':
        return ip === condition.value;
      case 'contains':
        return ip.includes(condition.value);
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(ip);
      default:
        return false;
    }
  }

  /**
   * Check time-based condition
   */
  private checkTimeCondition(condition: PermissionCondition): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    
    switch (condition.operator) {
      case 'between':
        const [start, end] = condition.value;
        return currentHour >= start && currentHour <= end;
      default:
        return true;
    }
  }

  /**
   * Check usage-based condition
   */
  private checkUsageCondition(condition: PermissionCondition, usage?: number): boolean {
    if (usage === undefined) return true;
    
    switch (condition.operator) {
      case 'less':
        return usage < condition.value;
      case 'greater':
        return usage > condition.value;
      default:
        return true;
    }
  }

  /**
   * Get role by ID
   */
  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId);
  }

  /**
   * Get all roles
   */
  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  /**
   * Get permission by ID
   */
  getPermission(permissionId: string): Permission | undefined {
    return this.permissions.get(permissionId);
  }

  /**
   * Get all permissions
   */
  getAllPermissions(): Permission[] {
    return Array.from(this.permissions.values());
  }

  /**
   * Get user permissions object
   */
  getUserPermissionsObject(userId: string): UserPermissions | undefined {
    return this.userPermissions.get(userId);
  }
}