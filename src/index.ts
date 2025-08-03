/**
 * Firebase MCP Server - Main Entry Point
 * 
 * This is the main entry point for the Firebase MCP Server.
 * It initializes the server and starts listening for MCP client connections.
 */

import { FirebaseMCPServer } from '@server/mcp-server';
import { logger } from '@utils/logger';
import { config } from '@utils/config';
import { validateEnvironment } from '@utils/validator';

/**
 * Main function to start the Firebase MCP Server
 */
async function main(): Promise<void> {
  try {
    // Validate environment configuration
    validateEnvironment();
    
    logger.info('Starting Firebase MCP Server...', {
      version: config.server.version,
      name: config.server.name,
      transport: config.mcp.transport,
    });

    // Initialize Firebase MCP Server
    const server = new FirebaseMCPServer();
    
    // Start the server
    await server.start();
    
    logger.info('Firebase MCP Server started successfully');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Failed to start Firebase MCP Server', { error });
    process.exit(1);
  }
}

// Start the server
main().catch(error => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});