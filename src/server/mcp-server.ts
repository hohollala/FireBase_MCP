/**
 * Firebase MCP Server
 * 
 * Main MCP server implementation that handles communication with AI clients
 * and provides Firebase service integration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  InitializeRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { logger, config, validateEnvironment } from '@utils/index';
import { FirebaseServiceManager } from '@firebase/index';
import { allTools, allToolHandlers } from '@tools/index';
import { AuthMiddleware, AuthConfig, defaultAuthConfig } from '@utils/auth-middleware';
import { PermissionManager } from '@utils/permission-manager';

export class FirebaseMCPServer {
  private server: Server;
  private isRunning = false;
  private authMiddleware: AuthMiddleware;
  private permissionManager: PermissionManager;

  constructor(authConfig?: AuthConfig) {
    this.server = new Server(
      {
        name: config.server.name,
        version: config.server.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize authentication and permission systems
    this.authMiddleware = new AuthMiddleware(authConfig || defaultAuthConfig);
    this.permissionManager = new PermissionManager();

    this.setupHandlers();
  }

  /**
   * Setup MCP request handlers
   */
  private setupHandlers(): void {
    // Initialize handler
    this.server.setRequestHandler(InitializeRequestSchema, async (request) => {
      logger.info('MCP client connected', {
        clientInfo: request.params.clientInfo,
      });

      return {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: config.server.name,
          version: config.server.version,
        },
      };
    });

    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.debug('Listing available tools');

      return {
        tools: allTools,
      };
    });

    // Call tool handler with authentication
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const headers = (request as any).headers || {};

      logger.debug('Tool called', { name, args });

      try {
        // Authenticate request
        const authContext = await this.authMiddleware.authenticate(headers);
        logger.debug('Authentication successful', { 
          clientId: authContext.clientId,
          permissions: authContext.permissions 
        });

        // Authorize action
        const [service, action] = name.split('_');
        const isAuthorized = this.authMiddleware.authorize(authContext, action, service);
        
        if (!isAuthorized) {
          throw new Error(`Insufficient permissions for ${name}`);
        }

        // Check if Firebase is available for Firebase-related tools
        const firebaseManager = FirebaseServiceManager.getInstance();
        const isFirebaseTool = name.startsWith('firebase_') || 
                              name.startsWith('auth_') || 
                              name.startsWith('firestore_') || 
                              name.startsWith('storage_') || 
                              name.startsWith('functions_') ||
                              name.startsWith('analytics_') ||
                              name.startsWith('messaging_') ||
                              name.startsWith('performance_') ||
                              name.startsWith('remote_config_') ||
                              name.startsWith('hosting_') ||
                              name.startsWith('realtime_database_') ||
                              name.startsWith('security_');

        if (isFirebaseTool && !firebaseManager.getApp()) {
          throw new Error(`Firebase not configured - cannot execute ${name}. Please configure Firebase project and service account.`);
        }

        // Find and execute handler
        const handler = allToolHandlers[name as keyof typeof allToolHandlers];
        if (!handler) {
          throw new Error(`Unknown tool: ${name}`);
        }

        // Add auth context and Firebase manager to args for handler use
        const enrichedArgs = {
          ...args,
          _authContext: authContext,
          firebaseManager: firebaseManager
        };

        return await handler(enrichedArgs);
      } catch (error: any) {
        logger.warn('Tool execution failed', { 
          name, 
          error: error.message,
          headers: Object.keys(headers)
        });
        throw error;
      }
    });

    // Error handler
    this.server.onerror = (error) => {
      logger.error('MCP Server error', { error });
    };
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Server is already running');
    }

    // Validate environment before starting
    validateEnvironment();

    // Initialize Firebase (optional - won't fail if Firebase is not configured)
    try {
      await FirebaseServiceManager.getInstance().initialize();
      logger.info('Firebase services initialized successfully');
    } catch (error) {
      logger.warn('Firebase initialization failed - running in limited mode', { 
        error: error instanceof Error ? error.message : error 
      });
      // Continue without Firebase - server will still work for basic MCP operations
    }

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    this.isRunning = true;

    logger.info('Firebase MCP Server started', {
      transport: config.mcp.transport,
      version: config.server.version,
    });
  }

  /**
   * Stop the MCP server
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    await this.server.close();
    await FirebaseServiceManager.getInstance().cleanup();
    this.isRunning = false;

    logger.info('Firebase MCP Server stopped');
  }

  /**
   * Check if server is running
   */
  isServerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get authentication middleware
   */
  getAuthMiddleware(): AuthMiddleware {
    return this.authMiddleware;
  }

  /**
   * Get permission manager
   */
  getPermissionManager(): PermissionManager {
    return this.permissionManager;
  }

  /**
   * Update authentication configuration
   */
  updateAuthConfig(config: AuthConfig): void {
    this.authMiddleware = new AuthMiddleware(config);
    logger.info('Authentication configuration updated');
  }

  /**
   * Add user permissions
   */
  addUserPermissions(userId: string, roles: string[], directPermissions?: string[]): void {
    this.permissionManager.setUserPermissions({
      userId,
      roles,
      directPermissions: directPermissions || [],
      deniedPermissions: []
    });
    logger.info('User permissions added', { userId, roles });
  }
}