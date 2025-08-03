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
import { analyticsTools, analyticsToolHandlers } from './analytics-tools';
import { messagingTools, messagingToolHandlers } from './messaging-tools';
import { hostingTools, hostingToolHandlers } from './hosting-tools';
import { remoteConfigTools, remoteConfigToolHandlers } from './remote-config-tools';
import { performanceTools, performanceToolHandlers } from './performance-tools';
import { securityTools, securityToolHandlers } from './security-tools';

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

  // Analytics tools
  ...analyticsTools,

  // Messaging tools
  ...messagingTools,

  // Hosting tools
  ...hostingTools,

  // Remote Config tools
  ...remoteConfigTools,

  // Performance Monitoring tools
  ...performanceTools,

  // Security tools
  ...securityTools,
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

  // Analytics handlers
  ...analyticsToolHandlers,

  // Messaging handlers
  ...messagingToolHandlers,

  // Hosting handlers
  ...hostingToolHandlers,

  // Remote Config handlers
  ...remoteConfigToolHandlers,

  // Performance Monitoring handlers
  ...performanceToolHandlers,

  // Security handlers
  ...securityToolHandlers,
};

export * from './auth-tools';
export * from './firestore-tools';
export * from './storage-tools';
export * from './functions-tools';
export * from './realtime-database-tools';
export * from './analytics-tools';
export * from './messaging-tools';
export * from './hosting-tools';
export * from './remote-config-tools';
export * from './performance-tools';
export * from './security-tools';