/**
 * Firebase Remote Config Service
 * 
 * Handles Firebase Remote Config operations
 */

import * as admin from 'firebase-admin';
import { logger, FirebaseError, ValidationError } from '@utils/index';

export interface RemoteConfigParameter {
  key: string;
  defaultValue?: any;
  conditionalValues?: Record<string, any>;
  description?: string;
}

export interface RemoteConfigTemplate {
  etag?: string;
  parameters?: Record<string, any>;
  parameterGroups?: Record<string, any>;
  conditions?: any[];
  version?: any;
}

export class RemoteConfigService {
  private remoteConfig: admin.remoteConfig.RemoteConfig;

  constructor(app: admin.app.App) {
    this.remoteConfig = app.remoteConfig();
  }

  /**
   * Get Remote Config template
   */
  async getTemplate(): Promise<RemoteConfigTemplate> {
    try {
      const template = await this.remoteConfig.getTemplate();

      logger.info('Remote Config template retrieved successfully', {
        etag: template.etag,
        parameterCount: Object.keys(template.parameters || {}).length,
        conditionCount: (template.conditions || []).length,
      });

      return {
        etag: template.etag,
        parameters: template.parameters,
        parameterGroups: template.parameterGroups,
        conditions: template.conditions,
        version: template.version,
      };
    } catch (error: any) {
      logger.error('Failed to get Remote Config template', { error });
      throw new FirebaseError(
        `Failed to get Remote Config template: ${error.message}`,
        'REMOTE_CONFIG_GET_FAILED',
        error
      );
    }
  }

  /**
   * Publish Remote Config template
   */
  async publishTemplate(template: admin.remoteConfig.RemoteConfigTemplate): Promise<RemoteConfigTemplate> {
    try {
      if (!template) {
        throw new ValidationError('Template is required');
      }

      const publishedTemplate = await this.remoteConfig.publishTemplate(template);

      logger.info('Remote Config template published successfully', {
        etag: publishedTemplate.etag,
        version: publishedTemplate.version?.versionNumber,
      });

      return {
        etag: publishedTemplate.etag,
        parameters: publishedTemplate.parameters,
        parameterGroups: publishedTemplate.parameterGroups,
        conditions: publishedTemplate.conditions,
        version: publishedTemplate.version,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to publish Remote Config template', { error });
      throw new FirebaseError(
        `Failed to publish Remote Config template: ${error.message}`,
        'REMOTE_CONFIG_PUBLISH_FAILED',
        error
      );
    }
  }

  /**
   * Create a new parameter
   */
  async createParameter(
    key: string,
    defaultValue: any,
    description?: string,
    conditionalValues?: Record<string, any>
  ): Promise<void> {
    try {
      if (!key) {
        throw new ValidationError('Parameter key is required');
      }

      const template = await this.remoteConfig.getTemplate();

      // Add new parameter
      template.parameters = template.parameters || {};
      template.parameters[key] = {
        defaultValue: { value: String(defaultValue) },
        description,
      };

      // Add conditional values if provided
      if (conditionalValues) {
        template.parameters[key].conditionalValues = conditionalValues;
      }

      await this.remoteConfig.publishTemplate(template);

      logger.info('Remote Config parameter created successfully', {
        key,
        hasDescription: !!description,
        hasConditionalValues: !!conditionalValues,
      });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to create Remote Config parameter', { error, key });
      throw new FirebaseError(
        `Failed to create Remote Config parameter: ${error.message}`,
        'REMOTE_CONFIG_PARAMETER_CREATE_FAILED',
        error
      );
    }
  }

  /**
   * Update a parameter
   */
  async updateParameter(
    key: string,
    defaultValue?: any,
    description?: string,
    conditionalValues?: Record<string, any>
  ): Promise<void> {
    try {
      if (!key) {
        throw new ValidationError('Parameter key is required');
      }

      const template = await this.remoteConfig.getTemplate();

      if (!template.parameters || !template.parameters[key]) {
        throw new ValidationError(`Parameter '${key}' does not exist`);
      }

      // Update parameter
      if (defaultValue !== undefined) {
        template.parameters[key].defaultValue = { value: String(defaultValue) };
      }

      if (description !== undefined) {
        template.parameters[key].description = description;
      }

      if (conditionalValues !== undefined) {
        template.parameters[key].conditionalValues = conditionalValues;
      }

      await this.remoteConfig.publishTemplate(template);

      logger.info('Remote Config parameter updated successfully', { key });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to update Remote Config parameter', { error, key });
      throw new FirebaseError(
        `Failed to update Remote Config parameter: ${error.message}`,
        'REMOTE_CONFIG_PARAMETER_UPDATE_FAILED',
        error
      );
    }
  }

  /**
   * Delete a parameter
   */
  async deleteParameter(key: string): Promise<void> {
    try {
      if (!key) {
        throw new ValidationError('Parameter key is required');
      }

      const template = await this.remoteConfig.getTemplate();

      if (!template.parameters || !template.parameters[key]) {
        throw new ValidationError(`Parameter '${key}' does not exist`);
      }

      delete template.parameters[key];

      await this.remoteConfig.publishTemplate(template);

      logger.info('Remote Config parameter deleted successfully', { key });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to delete Remote Config parameter', { error, key });
      throw new FirebaseError(
        `Failed to delete Remote Config parameter: ${error.message}`,
        'REMOTE_CONFIG_PARAMETER_DELETE_FAILED',
        error
      );
    }
  }

  /**
   * Get a specific parameter
   */
  async getParameter(key: string): Promise<RemoteConfigParameter | null> {
    try {
      if (!key) {
        throw new ValidationError('Parameter key is required');
      }

      const template = await this.remoteConfig.getTemplate();

      if (!template.parameters || !template.parameters[key]) {
        return null;
      }

      const parameter = template.parameters[key];

      logger.debug('Remote Config parameter retrieved', { key });

      return {
        key,
        defaultValue: (parameter.defaultValue as any)?.value || 'N/A',
        conditionalValues: parameter.conditionalValues,
        description: parameter.description,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to get Remote Config parameter', { error, key });
      throw new FirebaseError(
        `Failed to get Remote Config parameter: ${error.message}`,
        'REMOTE_CONFIG_PARAMETER_GET_FAILED',
        error
      );
    }
  }

  /**
   * List all parameters
   */
  async listParameters(): Promise<RemoteConfigParameter[]> {
    try {
      const template = await this.remoteConfig.getTemplate();

      if (!template.parameters) {
        return [];
      }

      const parameters: RemoteConfigParameter[] = Object.entries(template.parameters).map(
        ([key, param]) => ({
          key,
          defaultValue: (param.defaultValue as any)?.value || 'N/A',
          conditionalValues: param.conditionalValues,
          description: param.description,
        })
      );

      logger.debug('Remote Config parameters listed', {
        count: parameters.length,
      });

      return parameters;
    } catch (error: any) {
      logger.error('Failed to list Remote Config parameters', { error });
      throw new FirebaseError(
        `Failed to list Remote Config parameters: ${error.message}`,
        'REMOTE_CONFIG_PARAMETER_LIST_FAILED',
        error
      );
    }
  }

  /**
   * Get template version history
   */
  async getVersionHistory(limit = 10): Promise<any[]> {
    try {
      const versions = await this.remoteConfig.listVersions({ 
        pageSize: limit 
      });

      logger.debug('Remote Config version history retrieved', {
        count: versions.versions.length,
      });

      return versions.versions;
    } catch (error: any) {
      logger.error('Failed to get Remote Config version history', { error });
      throw new FirebaseError(
        `Failed to get Remote Config version history: ${error.message}`,
        'REMOTE_CONFIG_VERSION_HISTORY_FAILED',
        error
      );
    }
  }

  /**
   * Rollback to a specific version
   */
  async rollbackToVersion(versionNumber: number): Promise<RemoteConfigTemplate> {
    try {
      if (!versionNumber || versionNumber < 1) {
        throw new ValidationError('Valid version number is required');
      }

      const template = await this.remoteConfig.getTemplateAtVersion(String(versionNumber));
      const publishedTemplate = await this.remoteConfig.publishTemplate(template);

      logger.info('Remote Config rolled back successfully', {
        versionNumber,
        newEtag: publishedTemplate.etag,
      });

      return {
        etag: publishedTemplate.etag,
        parameters: publishedTemplate.parameters,
        parameterGroups: publishedTemplate.parameterGroups,
        conditions: publishedTemplate.conditions,
        version: publishedTemplate.version,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to rollback Remote Config', { error, versionNumber });
      throw new FirebaseError(
        `Failed to rollback Remote Config: ${error.message}`,
        'REMOTE_CONFIG_ROLLBACK_FAILED',
        error
      );
    }
  }

  /**
   * Validate template
   */
  async validateTemplate(template: admin.remoteConfig.RemoteConfigTemplate): Promise<boolean> {
    try {
      if (!template) {
        throw new ValidationError('Template is required');
      }

      // Use publishTemplate with validateOnly option
      await this.remoteConfig.publishTemplate(template, { force: false });

      logger.debug('Remote Config template validation successful');

      return true;
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.debug('Remote Config template validation failed', { error });
      return false;
    }
  }

  /**
   * Get service information
   */
  getServiceInfo(): any {
    return {
      service: 'Firebase Remote Config',
      description: 'Change app behavior and appearance without publishing an app update',
      features: [
        'Dynamic configuration',
        'A/B testing support',
        'User segmentation',
        'Gradual rollouts',
        'Real-time updates',
        'Version history',
        'Template validation',
        'Rollback capability',
      ],
      dataTypes: [
        'String values',
        'Boolean values',
        'Number values',
        'JSON objects',
      ],
      limits: {
        parameters: 2000,
        parameterKeyLength: 256,
        valueLength: 1048576, // 1MB
        conditions: 500,
      },
    };
  }
}