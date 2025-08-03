/**
 * API Documentation Generator
 * 
 * Automatically generates API documentation for Firebase MCP Server tools
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { allTools } from '@tools/index';
import { logger } from './logger';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface APIDocConfig {
  outputFormat: 'markdown' | 'html' | 'json' | 'openapi';
  outputPath: string;
  includeExamples: boolean;
  includeSchemas: boolean;
  groupByService: boolean;
}

export interface ToolDocumentation {
  name: string;
  description: string;
  service: string;
  inputSchema: any;
  outputSchema?: any;
  examples?: any[];
  category: string;
}

export class APIDocGenerator {
  private config: APIDocConfig;

  constructor(config: APIDocConfig) {
    this.config = config;
  }

  /**
   * Generate complete API documentation
   */
  async generateDocumentation(): Promise<void> {
    try {
      logger.info('Starting API documentation generation', { 
        format: this.config.outputFormat,
        outputPath: this.config.outputPath 
      });

      // Analyze all tools
      const toolDocs = this.analyzeTools(allTools);

      // Group by service if requested
      const organizedDocs = this.config.groupByService 
        ? this.groupToolsByService(toolDocs)
        : toolDocs;

      // Generate documentation based on format
      let content: string;
      switch (this.config.outputFormat) {
        case 'markdown':
          content = this.generateMarkdown(organizedDocs);
          break;
        case 'html':
          content = this.generateHTML(organizedDocs);
          break;
        case 'json':
          content = JSON.stringify(organizedDocs, null, 2);
          break;
        case 'openapi':
          content = this.generateOpenAPI(organizedDocs);
          break;
        default:
          throw new Error(`Unsupported format: ${this.config.outputFormat}`);
      }

      // Ensure output directory exists
      const outputDir = this.config.outputPath.substring(0, this.config.outputPath.lastIndexOf('/'));
      mkdirSync(outputDir, { recursive: true });

      // Write documentation
      writeFileSync(this.config.outputPath, content, 'utf8');

      logger.info('API documentation generated successfully', {
        toolCount: toolDocs.length,
        outputPath: this.config.outputPath,
        format: this.config.outputFormat
      });
    } catch (error: any) {
      logger.error('Failed to generate API documentation', { error });
      throw error;
    }
  }

  /**
   * Analyze all tools and extract documentation
   */
  private analyzeTools(tools: Tool[]): ToolDocumentation[] {
    return tools.map(tool => {
      const [service, action] = tool.name.split('_');
      
      return {
        name: tool.name,
        description: tool.description || 'No description available',
        service: service || 'general',
        inputSchema: tool.inputSchema,
        category: this.categorizeService(service),
        examples: this.config.includeExamples ? this.generateExamples(tool) : undefined,
      };
    });
  }

  /**
   * Categorize service types
   */
  private categorizeService(service: string): string {
    const categories: Record<string, string> = {
      auth: 'Authentication',
      firestore: 'Database',
      storage: 'Storage',
      functions: 'Serverless',
      analytics: 'Analytics',
      messaging: 'Messaging',
      hosting: 'Web Hosting',
      'remote-config': 'Configuration',
      performance: 'Performance',
      security: 'Security',
      ping: 'Utilities'
    };
    
    return categories[service] || 'Other';
  }

  /**
   * Group tools by service
   */
  private groupToolsByService(toolDocs: ToolDocumentation[]): Record<string, ToolDocumentation[]> {
    return toolDocs.reduce((groups, tool) => {
      const service = tool.service;
      if (!groups[service]) {
        groups[service] = [];
      }
      groups[service].push(tool);
      return groups;
    }, {} as Record<string, ToolDocumentation[]>);
  }

  /**
   * Generate example requests/responses for tools
   */
  private generateExamples(tool: Tool): any[] {
    const examples: any[] = [];
    
    // Generate basic example based on input schema
    if (tool.inputSchema) {
      const exampleInput: any = {};
      
      if (tool.inputSchema.properties) {
        for (const [key, prop] of Object.entries(tool.inputSchema.properties as any)) {
          exampleInput[key] = this.generateExampleValue(prop);
        }
      }

      examples.push({
        name: 'Basic Usage',
        input: exampleInput,
        description: `Basic example of using ${tool.name}`
      });
    }

    // Add service-specific examples
    examples.push(...this.getServiceSpecificExamples(tool.name));

    return examples;
  }

  /**
   * Generate example value based on property type
   */
  private generateExampleValue(property: any): any {
    switch (property.type) {
      case 'string':
        if (property.enum) {
          return property.enum[0];
        }
        return property.description?.includes('ID') ? 'user123' : 'example';
      case 'number':
      case 'integer':
        return property.minimum || 1;
      case 'boolean':
        return property.default ?? true;
      case 'array':
        return [this.generateExampleValue(property.items || { type: 'string' })];
      case 'object':
        const obj: any = {};
        if (property.properties) {
          for (const [key, prop] of Object.entries(property.properties)) {
            obj[key] = this.generateExampleValue(prop);
          }
        }
        return obj;
      default:
        return 'example';
    }
  }

  /**
   * Get service-specific examples
   */
  private getServiceSpecificExamples(toolName: string): any[] {
    const examples: Record<string, any[]> = {
      auth_create_user: [{
        name: 'Create User with Email',
        input: {
          email: 'user@example.com',
          password: 'securepassword123',
          displayName: 'John Doe'
        },
        description: 'Create a new user with email and password'
      }],
      firestore_create_document: [{
        name: 'Create User Profile',
        input: {
          collection: 'users',
          documentId: 'user123',
          data: {
            name: 'John Doe',
            email: 'john@example.com',
            createdAt: new Date().toISOString()
          }
        },
        description: 'Create a user profile document'
      }],
      storage_upload_file: [{
        name: 'Upload Profile Image',
        input: {
          bucket: 'profile-images',
          fileName: 'user123/avatar.jpg',
          fileContent: 'base64-encoded-image-data',
          contentType: 'image/jpeg'
        },
        description: 'Upload a user profile image'
      }]
    };

    return examples[toolName] || [];
  }

  /**
   * Generate Markdown documentation
   */
  private generateMarkdown(docs: ToolDocumentation[] | Record<string, ToolDocumentation[]>): string {
    let markdown = `# Firebase MCP Server API Documentation

Generated on: ${new Date().toISOString()}

## Overview

This document provides comprehensive API documentation for the Firebase MCP Server, which enables AI development tools to interact with Firebase services through the Model Context Protocol (MCP).

## Available Services

`;

    if (Array.isArray(docs)) {
      // Flat structure
      const services = [...new Set(docs.map(d => d.service))];
      markdown += services.map(service => `- ${service}`).join('\n') + '\n\n';

      markdown += '## Tools\n\n';
      docs.forEach(tool => {
        markdown += this.generateToolMarkdown(tool);
      });
    } else {
      // Grouped structure
      const services = Object.keys(docs);
      markdown += services.map(service => `- ${service} (${docs[service].length} tools)`).join('\n') + '\n\n';

      services.forEach(service => {
        markdown += `## ${service.charAt(0).toUpperCase() + service.slice(1)} Service\n\n`;
        docs[service].forEach(tool => {
          markdown += this.generateToolMarkdown(tool);
        });
      });
    }

    return markdown;
  }

  /**
   * Generate markdown for a single tool
   */
  private generateToolMarkdown(tool: ToolDocumentation): string {
    let markdown = `### ${tool.name}\n\n`;
    markdown += `**Category:** ${tool.category}\n\n`;
    markdown += `${tool.description}\n\n`;

    if (this.config.includeSchemas && tool.inputSchema) {
      markdown += `**Input Schema:**\n\n\`\`\`json\n${JSON.stringify(tool.inputSchema, null, 2)}\n\`\`\`\n\n`;
    }

    if (this.config.includeExamples && tool.examples) {
      markdown += `**Examples:**\n\n`;
      tool.examples.forEach(example => {
        markdown += `**${example.name}**\n\n`;
        markdown += `${example.description}\n\n`;
        markdown += `\`\`\`json\n${JSON.stringify(example.input, null, 2)}\n\`\`\`\n\n`;
      });
    }

    markdown += '---\n\n';
    return markdown;
  }

  /**
   * Generate HTML documentation
   */
  private generateHTML(docs: ToolDocumentation[] | Record<string, ToolDocumentation[]>): string {
    const title = 'Firebase MCP Server API Documentation';
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
        .tool { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .tool-name { color: #007bff; font-size: 1.4em; font-weight: bold; margin-bottom: 10px; }
        .tool-category { background: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-size: 0.9em; color: #495057; }
        .schema { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }
        .example { background: #e7f3ff; padding: 15px; border-radius: 4px; margin: 10px 0; }
        pre { white-space: pre-wrap; }
        .service-section { margin-bottom: 40px; }
        .service-title { color: #28a745; font-size: 1.8em; border-bottom: 1px solid #28a745; padding-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <p>Generated on: ${new Date().toISOString()}</p>
            <p>Comprehensive API documentation for Firebase MCP Server tools</p>
        </div>
`;

    if (Array.isArray(docs)) {
      html += '<div class="tools-section">\n';
      docs.forEach(tool => {
        html += this.generateToolHTML(tool);
      });
      html += '</div>\n';
    } else {
      Object.entries(docs).forEach(([service, tools]) => {
        html += `<div class="service-section">
            <h2 class="service-title">${service.charAt(0).toUpperCase() + service.slice(1)} Service</h2>
`;
        tools.forEach(tool => {
          html += this.generateToolHTML(tool);
        });
        html += '</div>\n';
      });
    }

    html += `    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Generate HTML for a single tool
   */
  private generateToolHTML(tool: ToolDocumentation): string {
    let html = `        <div class="tool">
            <div class="tool-name">${tool.name}</div>
            <span class="tool-category">${tool.category}</span>
            <p>${tool.description}</p>
`;

    if (this.config.includeSchemas && tool.inputSchema) {
      html += `            <h4>Input Schema</h4>
            <div class="schema">
                <pre>${JSON.stringify(tool.inputSchema, null, 2)}</pre>
            </div>
`;
    }

    if (this.config.includeExamples && tool.examples) {
      html += `            <h4>Examples</h4>\n`;
      tool.examples.forEach(example => {
        html += `            <div class="example">
                <strong>${example.name}</strong>
                <p>${example.description}</p>
                <pre>${JSON.stringify(example.input, null, 2)}</pre>
            </div>
`;
      });
    }

    html += '        </div>\n';
    return html;
  }

  /**
   * Generate OpenAPI specification
   */
  private generateOpenAPI(docs: ToolDocumentation[] | Record<string, ToolDocumentation[]>): string {
    const tools = Array.isArray(docs) ? docs : Object.values(docs).flat();
    
    const openapi = {
      openapi: '3.0.0',
      info: {
        title: 'Firebase MCP Server API',
        version: '1.0.0',
        description: 'Firebase Model Context Protocol Server API Documentation',
        contact: {
          name: 'Firebase MCP Server',
          url: 'https://github.com/firebase/firebase-mcp-server'
        }
      },
      servers: [
        {
          url: 'stdio://firebase-mcp-server',
          description: 'MCP Server via stdio transport'
        }
      ],
      paths: {} as any,
      components: {
        schemas: {} as any
      }
    };

    // Generate paths for each tool
    tools.forEach(tool => {
      const path = `/tools/${tool.name}`;
      openapi.paths[path] = {
        post: {
          summary: tool.description,
          tags: [tool.service],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: tool.inputSchema || {}
              }
            }
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      content: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            type: { type: 'string' },
                            text: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      // Add input schema to components if it doesn't exist
      if (tool.inputSchema && !openapi.components.schemas[`${tool.name}Input`]) {
        openapi.components.schemas[`${tool.name}Input`] = tool.inputSchema;
      }
    });

    return JSON.stringify(openapi, null, 2);
  }
}

/**
 * Default configuration for API documentation generation
 */
export const defaultDocConfig: APIDocConfig = {
  outputFormat: 'markdown',
  outputPath: './docs/api.md',
  includeExamples: true,
  includeSchemas: true,
  groupByService: true,
};

/**
 * Generate API documentation with default configuration
 */
export async function generateAPIDocumentation(config?: Partial<APIDocConfig>): Promise<void> {
  const finalConfig = { ...defaultDocConfig, ...config };
  const generator = new APIDocGenerator(finalConfig);
  await generator.generateDocumentation();
}