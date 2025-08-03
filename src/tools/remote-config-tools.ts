/**
 * Firebase Remote Config MCP Tools
 * Provides tools for managing Remote Config parameters and conditions
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { FirebaseServiceManager } from '../firebase/index';

// Remote Config 도구 목록
export const remoteConfigTools: Tool[] = [
  {
    name: 'remote-config-get-template',
    description: 'Get the current Remote Config template',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'remote-config-list-parameters',
    description: 'List all Remote Config parameters',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'remote-config-get-parameter',
    description: 'Get a specific Remote Config parameter',
    inputSchema: {
      type: 'object',
      properties: {
        parameterName: {
          type: 'string',
          description: 'Name of the parameter to retrieve'
        }
      },
      required: ['parameterName']
    }
  },
  {
    name: 'remote-config-create-parameter',
    description: 'Create a new Remote Config parameter',
    inputSchema: {
      type: 'object',
      properties: {
        parameterName: {
          type: 'string',
          description: 'Name of the parameter'
        },
        defaultValue: {
          type: 'string',
          description: 'Default value for the parameter'
        },
        description: {
          type: 'string',
          description: 'Description of the parameter'
        },
        valueType: {
          type: 'string',
          enum: ['STRING', 'BOOLEAN', 'NUMBER', 'JSON'],
          description: 'Type of the parameter value'
        }
      },
      required: ['parameterName', 'defaultValue']
    }
  },
  {
    name: 'remote-config-update-parameter',
    description: 'Update an existing Remote Config parameter',
    inputSchema: {
      type: 'object',
      properties: {
        parameterName: {
          type: 'string',
          description: 'Name of the parameter to update'
        },
        defaultValue: {
          type: 'string',
          description: 'New default value for the parameter'
        },
        description: {
          type: 'string',
          description: 'New description of the parameter'
        },
        valueType: {
          type: 'string',
          enum: ['STRING', 'BOOLEAN', 'NUMBER', 'JSON'],
          description: 'Type of the parameter value'
        }
      },
      required: ['parameterName']
    }
  },
  {
    name: 'remote-config-delete-parameter',
    description: 'Delete a Remote Config parameter',
    inputSchema: {
      type: 'object',
      properties: {
        parameterName: {
          type: 'string',
          description: 'Name of the parameter to delete'
        }
      },
      required: ['parameterName']
    }
  },
  {
    name: 'remote-config-publish-template',
    description: 'Publish the current Remote Config template',
    inputSchema: {
      type: 'object',
      properties: {
        validateOnly: {
          type: 'boolean',
          description: 'If true, only validate the template without publishing'
        }
      },
      required: []
    }
  },
  {
    name: 'remote-config-rollback-template',
    description: 'Rollback to a previous Remote Config template version',
    inputSchema: {
      type: 'object',
      properties: {
        versionNumber: {
          type: 'number',
          description: 'Version number to rollback to'
        }
      },
      required: ['versionNumber']
    }
  },
  {
    name: 'remote-config-list-versions',
    description: 'List Remote Config template versions',
    inputSchema: {
      type: 'object',
      properties: {
        pageSize: {
          type: 'number',
          description: 'Number of versions to return (max 300)'
        },
        pageToken: {
          type: 'string',
          description: 'Token for pagination'
        }
      },
      required: []
    }
  }
];

// Remote Config 도구 핸들러
export const remoteConfigToolHandlers = {
  'remote-config-get-template': async () => {
    try {
      const remoteConfigService = FirebaseServiceManager.getInstance().getRemoteConfigService();
      const template = await remoteConfigService.getTemplate();
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              template: template,
              message: 'Remote Config template retrieved successfully'
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
              message: `Failed to get Remote Config template: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'remote-config-list-parameters': async () => {
    try {
      const remoteConfigService = FirebaseServiceManager.getInstance().getRemoteConfigService();
      const parameters = await remoteConfigService.listParameters();
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              parameters: parameters,
              count: parameters.length,
              message: 'Remote Config parameters listed successfully'
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
              message: `Failed to list Remote Config parameters: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'remote-config-get-parameter': async (args: any) => {
    try {
      const { parameterName } = args;
      const remoteConfigService = FirebaseServiceManager.getInstance().getRemoteConfigService();
      const parameter = await remoteConfigService.getParameter(parameterName);
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              parameter: parameter,
              message: `Parameter '${parameterName}' retrieved successfully`
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
              message: `Failed to get parameter '${args.parameterName}': ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'remote-config-create-parameter': async (args: any) => {
    try {
      const { parameterName, defaultValue, description, valueType } = args;
      const remoteConfigService = FirebaseServiceManager.getInstance().getRemoteConfigService();
      
      const result = await remoteConfigService.createParameter(
        parameterName,
        defaultValue,
        description,
        valueType
      );
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              parameter: result,
              message: `Parameter '${parameterName}' created successfully`
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
              message: `Failed to create parameter '${args.parameterName}': ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'remote-config-update-parameter': async (args: any) => {
    try {
      const { parameterName, defaultValue, description, valueType } = args;
      const remoteConfigService = FirebaseServiceManager.getInstance().getRemoteConfigService();
      
      const result = await remoteConfigService.updateParameter(
        parameterName,
        defaultValue,
        description,
        valueType
      );
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              parameter: result,
              message: `Parameter '${parameterName}' updated successfully`
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
              message: `Failed to update parameter '${args.parameterName}': ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'remote-config-delete-parameter': async (args: any) => {
    try {
      const { parameterName } = args;
      const remoteConfigService = FirebaseServiceManager.getInstance().getRemoteConfigService();
      
      await remoteConfigService.deleteParameter(parameterName);
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              message: `Parameter '${parameterName}' deleted successfully`
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
              message: `Failed to delete parameter '${args.parameterName}': ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'remote-config-publish-template': async (args: any) => {
    try {
      const { validateOnly = false } = args;
      const remoteConfigService = FirebaseServiceManager.getInstance().getRemoteConfigService();
      
      const result = await remoteConfigService.publishTemplate(validateOnly);
      
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              result: result,
              message: validateOnly 
                ? 'Template validation completed successfully' 
                : 'Template published successfully'
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
              message: `Failed to publish template: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'remote-config-rollback-template': async () => {
    try {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: false,
              message: 'Template rollback is not available through Firebase Admin SDK. Please use Firebase Console or CLI for rollback operations.'
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
              message: `Rollback operation not supported: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  },

  'remote-config-list-versions': async () => {
    try {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: false,
              message: 'Version listing is not available through Firebase Admin SDK. Please use Firebase Console or CLI for version management.'
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
              message: `Version listing not supported: ${error.message}`
            }, null, 2)
          }
        ]
      };
    }
  }
};