/**
 * Tools Index
 * 
 * Exports all MCP tools and handlers
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { authTools, authToolHandlers } from './auth-tools';
import { firestoreTools, firestoreToolHandlers } from './firestore-tools';
import { storageTools, storageToolHandlers } from './storage-tools';
import { functionsTools, functionsToolHandlers } from './functions-tools';
import { realtimeDatabaseTools, realtimeDatabaseToolHandlers } from './realtime-database-tools';

/**
 * All available tools
 */
export const allTools: Tool[] = [
  // Ping tool for testing
  {
    name: 'ping',
    description: 'Test connectivity to the Firebase MCP server',
    inputSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Optional message to echo back',
        },
      },
    },
  },
  
  // Authentication tools
  ...authTools,

  // Firestore tools
  ...firestoreTools,

  // Storage tools
  ...storageTools,

  // Functions tools
  ...functionsTools,

  // Realtime Database tools
  ...realtimeDatabaseTools,
];

/**
 * All tool handlers
 */
export const allToolHandlers = {
  // Ping handler
  ping: async (args: any) => {
    return {
      content: [
        {
          type: 'text',
          text: `Pong! ${args?.message || 'Firebase MCP Server is running'}`,
        },
      ],
    };
  },
  
  // Authentication handlers
  ...authToolHandlers,

  // Firestore handlers
  ...firestoreToolHandlers,

  // Storage handlers
  ...storageToolHandlers,

  // Functions handlers
  ...functionsToolHandlers,

  // Realtime Database handlers
  ...realtimeDatabaseToolHandlers,
};

export * from './auth-tools';
export * from './firestore-tools';
export * from './storage-tools';
export * from './functions-tools';
export * from './realtime-database-tools';