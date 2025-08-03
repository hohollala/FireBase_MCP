/**
 * Validation Utility
 * 
 * Provides validation functions for environment configuration and input data
 */

import * as Joi from 'joi';
import { config } from './config';
import { logger } from './logger';

/**
 * Schema for environment validation
 */
const environmentSchema = Joi.object({
  server: Joi.object({
    name: Joi.string().required(),
    version: Joi.string().required(),
    port: Joi.number().port().required(),
    host: Joi.string().required(),
  }).required(),
  
  mcp: Joi.object({
    transport: Joi.string().valid('stdio', 'http').required(),
    logLevel: Joi.string().valid('debug', 'info', 'warn', 'error').required(),
  }).required(),
  
  firebase: Joi.object({
    projectId: Joi.string().when('$isTest', {
      is: false,
      then: Joi.required(),
      otherwise: Joi.optional().allow(''),
    }),
    serviceAccountKeyPath: Joi.string().required(),
  }).required(),
  
  webDashboard: Joi.object({
    enabled: Joi.boolean().required(),
    port: Joi.number().port().required(),
    host: Joi.string().required(),
  }).required(),
  
  isDevelopment: Joi.boolean().required(),
  isProduction: Joi.boolean().required(),
  isTest: Joi.boolean().required(),
});

/**
 * Validate environment configuration
 */
export function validateEnvironment(): void {
  const { error } = environmentSchema.validate(config, {
    context: { isTest: config.isTest },
  });
  
  if (error) {
    logger.error('Environment validation failed', { error: error.details });
    throw new Error(`Configuration validation failed: ${error.message}`);
  }
  
  logger.debug('Environment validation passed');
}

/**
 * Schema for MCP tool parameters
 */
export const mcpToolParamsSchema = Joi.object({
  name: Joi.string().required(),
  arguments: Joi.object().required(),
});

/**
 * Validate MCP tool parameters
 */
export function validateMCPToolParams(params: any): any {
  const { error, value } = mcpToolParamsSchema.validate(params);
  
  if (error) {
    throw new Error(`Invalid MCP tool parameters: ${error.message}`);
  }
  
  return value;
}

/**
 * Schema for Firebase Auth user data
 */
export const firebaseUserSchema = Joi.object({
  uid: Joi.string().optional(),
  email: Joi.string().email().optional(),
  emailVerified: Joi.boolean().optional(),
  displayName: Joi.string().optional(),
  photoURL: Joi.string().uri().optional().allow(null),
  disabled: Joi.boolean().optional(),
  customClaims: Joi.object().optional(),
});

/**
 * Validate Firebase user data
 */
export function validateFirebaseUser(userData: any): any {
  const { error, value } = firebaseUserSchema.validate(userData);
  
  if (error) {
    throw new Error(`Invalid Firebase user data: ${error.message}`);
  }
  
  return value;
}