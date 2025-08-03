/**
 * Firebase Hosting MCP Tools
 * Provides information about Firebase Hosting operations
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MCPError } from '../utils/error-handler.js';
import { FirebaseServiceManager } from '../firebase/index';

// Hosting 도구 목록
export const hostingTools: Tool[] = [
  {
    name: 'hosting-list-sites',
    description: 'List all hosting sites for the Firebase project',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'hosting-get-site-info',
    description: 'Get information about a specific hosting site',
    inputSchema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'string',
          description: 'Site ID (defaults to project ID if not specified)'
        }
      },
      required: []
    }
  },
  {
    name: 'hosting-get-deployment-info',
    description: 'Get information about hosting deployments',
    inputSchema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'string',
          description: 'Site ID (defaults to project ID if not specified)'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of deployments to return'
        }
      },
      required: []
    }
  }
];

// Hosting 도구 핸들러
export const hostingToolHandlers = {
  'hosting-list-sites': async () => {
    try {
      const hostingService = FirebaseServiceManager.getInstance().getHostingService();
      const sites = await hostingService.getSiteInfo('');
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              sites: sites,
              message: 'Firebase Hosting sites retrieved successfully'
            }, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: false,
              message: `Failed to list hosting sites: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'hosting-get-site-info': async (args: any) => {
    try {
      const { siteId } = args;
      const hostingService = FirebaseServiceManager.getInstance().getHostingService();
      const siteInfo = await hostingService.getSiteInfo(siteId || '');
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              siteInfo: siteInfo,
              message: 'Site information retrieved successfully'
            }, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: false,
              message: `Failed to get site info: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'hosting-get-deployment-info': async (args: any) => {
    try {
      const { siteId } = args;
      const hostingService = FirebaseServiceManager.getInstance().getHostingService();
      const deployments = await hostingService.getDeployments(siteId || '');
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              deployments: deployments,
              message: 'Deployment information retrieved successfully'
            }, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: false,
              message: `Failed to get deployment info: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  }
};