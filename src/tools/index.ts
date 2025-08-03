/**
 * Tools Index
 * 
 * Exports all MCP tools and handlers
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { authTools, authToolHandlers } from './auth-tools';
import { firestoreTools, firestoreToolHandlers } from './firestore-tools';

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
};

export * from './auth-tools';
export * from './firestore-tools';