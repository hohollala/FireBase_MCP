/**
 * Firebase Performance Monitoring MCP Tools
 * Provides tools for Firebase Performance Monitoring configuration and guidance
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { FirebaseServiceManager } from '../firebase/index';

// Performance Monitoring 도구 목록
export const performanceTools: Tool[] = [
  {
    name: 'performance-get-info',
    description: 'Get Firebase Performance Monitoring information and capabilities',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'performance-validate-trace',
    description: 'Validate custom trace configuration',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the custom trace'
        },
        attributes: {
          type: 'object',
          description: 'Custom attributes for the trace (max 5)',
          additionalProperties: {
            type: 'string'
          }
        },
        metrics: {
          type: 'object',
          description: 'Custom metrics for the trace (max 32)',
          additionalProperties: {
            type: 'number'
          }
        }
      },
      required: ['name']
    }
  },
  {
    name: 'performance-get-configuration',
    description: 'Get Performance Monitoring configuration settings',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'performance-get-setup-guide',
    description: 'Get platform-specific setup instructions for Performance Monitoring',
    inputSchema: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: ['web', 'android', 'ios', 'all'],
          description: 'Target platform for setup guide'
        }
      },
      required: []
    }
  },
  {
    name: 'performance-get-best-practices',
    description: 'Get Performance Monitoring best practices and recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['traces', 'metrics', 'network', 'collection', 'all'],
          description: 'Category of best practices to retrieve'
        }
      },
      required: []
    }
  }
];

// Performance Monitoring 도구 핸들러
export const performanceToolHandlers = {
  'performance-get-info': async () => {
    try {
      const performanceService = FirebaseServiceManager.getInstance().getPerformanceService();
      const info = await performanceService.getPerformanceInfo();
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              info: info,
              message: 'Performance Monitoring information retrieved successfully'
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
              message: `Failed to get performance info: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'performance-validate-trace': async (args: any) => {
    try {
      const { name, attributes, metrics } = args;
      const performanceService = FirebaseServiceManager.getInstance().getPerformanceService();
      
      const trace = {
        name,
        attributes,
        metrics
      };
      
      const isValid = await performanceService.validateTrace(trace);
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              valid: isValid,
              trace: trace,
              message: isValid ? 'Trace configuration is valid' : 'Trace configuration is invalid'
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
              valid: false,
              message: `Trace validation failed: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'performance-get-configuration': async () => {
    try {
      const performanceService = FirebaseServiceManager.getInstance().getPerformanceService();
      const config = await performanceService.getConfiguration();
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              configuration: config,
              message: 'Performance Monitoring configuration retrieved successfully'
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
              message: `Failed to get configuration: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'performance-get-setup-guide': async (args: any) => {
    try {
      const { platform = 'all' } = args;
      const performanceService = FirebaseServiceManager.getInstance().getPerformanceService();
      
      let setupGuide = await performanceService.getSetupGuide();
      
      // Filter by platform if specified
      if (platform !== 'all') {
        const platformMap: Record<string, string> = {
          'web': 'Web/JavaScript',
          'android': 'Android',
          'ios': 'iOS'
        };
        
        const targetPlatform = platformMap[platform];
        if (targetPlatform) {
          setupGuide = setupGuide.filter(guide => guide.platform === targetPlatform);
        }
      }
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              setupGuide: setupGuide,
              platform: platform,
              message: 'Setup guide retrieved successfully'
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
              message: `Failed to get setup guide: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'performance-get-best-practices': async (args: any) => {
    try {
      const { category = 'all' } = args;
      const performanceService = FirebaseServiceManager.getInstance().getPerformanceService();
      
      let bestPractices = await performanceService.getBestPractices();
      
      // Filter by category if specified
      if (category !== 'all') {
        const categoryMap: Record<string, string> = {
          'traces': 'Custom Traces',
          'metrics': 'Custom Metrics',
          'network': 'Network Monitoring',
          'collection': 'Data Collection'
        };
        
        const targetCategory = categoryMap[category];
        if (targetCategory) {
          bestPractices = bestPractices.filter(practice => practice.category === targetCategory);
        }
      }
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              bestPractices: bestPractices,
              category: category,
              message: 'Best practices retrieved successfully'
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
              message: `Failed to get best practices: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  }
};