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

export class FirebaseMCPServer {
  private server: Server;
  private isRunning = false;

  constructor() {
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

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      logger.debug('Tool called', { name, args });

      const handler = allToolHandlers[name as keyof typeof allToolHandlers];
      if (!handler) {
        throw new Error(`Unknown tool: ${name}`);
      }

      return await handler(args);
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

    // Initialize Firebase
    await FirebaseServiceManager.getInstance().initialize();

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
}