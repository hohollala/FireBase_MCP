/**
 * Configuration Management Utility
 * 
 * Handles loading and validation of configuration from environment variables
 * and configuration files.
 */

import { config as dotenvConfig } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenvConfig();

export interface ServerConfig {
  name: string;
  version: string;
  port: number;
  host: string;
}

export interface MCPConfig {
  transport: 'stdio' | 'http';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface FirebaseConfig {
  projectId: string;
  serviceAccountKeyPath: string;
}

export interface WebDashboardConfig {
  enabled: boolean;
  port: number;
  host: string;
}

export interface Config {
  server: ServerConfig;
  mcp: MCPConfig;
  firebase: FirebaseConfig;
  webDashboard: WebDashboardConfig;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

/**
 * Load configuration from environment variables and config files
 */
function loadConfig(): Config {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Load MCP config file
  const mcpConfigPath = path.join(__dirname, '..', '..', 'config', 'mcp-config.json');
  
  try {
    if (fs.existsSync(mcpConfigPath)) {
      const configContent = fs.readFileSync(mcpConfigPath, 'utf-8');
      JSON.parse(configContent); // Validate JSON format
    }
  } catch (error) {
    console.warn('Failed to load MCP config file:', error);
  }
  
  return {
    server: {
      name: process.env.MCP_SERVER_NAME || 'firebase-mcp-server',
      version: process.env.MCP_SERVER_VERSION || '1.0.0',
      port: parseInt(process.env.PORT || '3000', 10),
      host: process.env.HOST || 'localhost',
    },
    mcp: {
      transport: (process.env.MCP_TRANSPORT as 'stdio' | 'http') || 'stdio',
      logLevel: (process.env.MCP_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
    },
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      serviceAccountKeyPath: process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || path.join(__dirname, '..', '..', 'config', 'service-account.json'),
    },
    webDashboard: {
      enabled: process.env.WEB_DASHBOARD_ENABLED === 'true',
      port: parseInt(process.env.WEB_DASHBOARD_PORT || '3001', 10),
      host: process.env.WEB_DASHBOARD_HOST || 'localhost',
    },
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
  };
}

export const config = loadConfig();