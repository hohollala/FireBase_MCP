import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * E2E Test Setup
 * Prepares environment for end-to-end testing
 */

// Global test timeout for E2E tests
jest.setTimeout(60000); // 60 seconds

// Test configuration
const TEST_CONFIG = {
  FIREBASE_PROJECT_ID: 'test-project-e2e',
  LOG_LEVEL: 'error',
  NODE_ENV: 'test'
};

/**
 * Global setup - runs once before all tests
 */
beforeAll(async () => {
  console.log('🚀 Setting up E2E test environment...');

  // Ensure dist directory exists and is built
  ensureProjectBuilt();

  // Create mock Firebase config for testing
  createMockFirebaseConfig();

  // Wait for any async setup
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('✅ E2E test environment ready');
});

/**
 * Global teardown - runs once after all tests
 */
afterAll(async () => {
  console.log('🧹 Cleaning up E2E test environment...');

  // Clean up mock config
  cleanupMockConfig();

  console.log('✅ E2E test environment cleaned up');
});

/**
 * Ensure the project is built before running E2E tests
 */
function ensureProjectBuilt(): void {
  const distPath = path.join(__dirname, '../../dist');
  const indexPath = path.join(distPath, 'index.js');

  if (!fs.existsSync(indexPath)) {
    console.log('📦 Building project for E2E tests...');
    try {
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '../../')
      });
      console.log('✅ Project built successfully');
    } catch (error) {
      console.error('❌ Failed to build project:', error);
      throw new Error('Cannot run E2E tests without building the project');
    }
  }
}

/**
 * Create mock Firebase configuration for testing
 */
function createMockFirebaseConfig(): void {
  const configDir = path.join(__dirname, '../../config');
  const testConfigPath = path.join(configDir, 'test-service-account.json');

  // Ensure config directory exists
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Create mock service account config if it doesn't exist
  if (!fs.existsSync(testConfigPath)) {
    const mockConfig = {
      type: 'service_account',
      project_id: TEST_CONFIG.FIREBASE_PROJECT_ID,
      private_key_id: 'mock-key-id',
      private_key: generateMockPrivateKey(),
      client_email: `firebase-adminsdk-test@${TEST_CONFIG.FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
      client_id: 'mock-client-id',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-test%40${TEST_CONFIG.FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`
    };

    fs.writeFileSync(testConfigPath, JSON.stringify(mockConfig, null, 2));
    console.log('✅ Mock Firebase config created');
  }

  // Set environment variable to use test config
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH = testConfigPath;
  process.env.FIREBASE_PROJECT_ID = TEST_CONFIG.FIREBASE_PROJECT_ID;
  process.env.LOG_LEVEL = TEST_CONFIG.LOG_LEVEL;
  process.env.NODE_ENV = TEST_CONFIG.NODE_ENV;
}

/**
 * Generate a mock private key for testing
 */
function generateMockPrivateKey(): string {
  return [
    '-----BEGIN PRIVATE KEY-----',
    'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0...',
    'Mock private key content for testing only',
    'This is not a real private key and should only be used for testing',
    '...additional mock content...',
    '-----END PRIVATE KEY-----'
  ].join('\\n');
}

/**
 * Clean up mock configuration files
 */
function cleanupMockConfig(): void {
  const testConfigPath = path.join(__dirname, '../../config/test-service-account.json');
  
  if (fs.existsSync(testConfigPath)) {
    try {
      fs.unlinkSync(testConfigPath);
      console.log('✅ Mock Firebase config cleaned up');
    } catch (error) {
      console.warn('⚠️  Could not clean up test config:', error);
    }
  }

  // Clean up environment variables
  delete process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  delete process.env.FIREBASE_PROJECT_ID;
  delete process.env.LOG_LEVEL;
  delete process.env.NODE_ENV;
}

/**
 * Utility function to wait for server to be ready
 */
export function waitForServer(port: number = 3000, timeout: number = 30000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkServer = () => {
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Server not ready after ${timeout}ms`));
        return;
      }

      // For MCP servers, we don't check HTTP ports
      // Instead, just wait a reasonable amount of time
      setTimeout(resolve, 2000);
    };

    checkServer();
  });
}

/**
 * Utility function to generate test data
 */
export function generateTestData(count: number = 10): Array<Record<string, any>> {
  const testData = [];
  
  for (let i = 0; i < count; i++) {
    testData.push({
      id: `test-item-${i + 1}`,
      name: `Test Item ${i + 1}`,
      value: Math.floor(Math.random() * 100),
      active: Math.random() > 0.5,
      category: ['A', 'B', 'C'][i % 3],
      createdAt: new Date(Date.now() - (i * 1000 * 60)).toISOString(),
      tags: ['test', 'e2e', `category-${['A', 'B', 'C'][i % 3]}`]
    });
  }
  
  return testData;
}

/**
 * Utility function to clean up test collections
 */
export async function cleanupTestCollections(collections: string[]): Promise<void> {
  // This would normally clean up Firebase collections
  // For now, just log the cleanup attempt
  console.log(`🧹 Cleaning up test collections: ${collections.join(', ')}`);
  
  // In a real implementation, you would:
  // 1. Connect to Firebase
  // 2. Delete all documents in each collection
  // 3. Optionally delete the collections themselves
  
  await new Promise(resolve => setTimeout(resolve, 100));
}

export { TEST_CONFIG };