import { spawn } from 'child_process';
import { EventEmitter } from 'events';

interface MCPResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: any;
}

interface MCPRequest {
  jsonrpc: string;
  method: string;
  params?: any;
  id: number;
}

/**
 * E2E Test for Firebase Authentication Workflow
 * Tests the complete authentication flow through MCP protocol
 */
describe('Firebase Auth E2E Workflow', () => {
  let mcpServer: any;
  let requestId = 1;

  beforeAll(async () => {
    // Start MCP server for E2E testing
    mcpServer = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        NODE_ENV: 'test',
        FIREBASE_PROJECT_ID: 'test-project-e2e',
        LOG_LEVEL: 'error' // Reduce log noise during testing
      }
    });

    // Wait for server to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  afterAll(async () => {
    if (mcpServer) {
      mcpServer.kill();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  });

  const sendMCPRequest = (request: MCPRequest): Promise<MCPResponse> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 10000);

      const handleResponse = (data: Buffer) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.id === request.id) {
            clearTimeout(timeout);
            mcpServer.stdout.off('data', handleResponse);
            resolve(response);
          }
        } catch (error) {
          // Ignore parsing errors, might be partial data
        }
      };

      mcpServer.stdout.on('data', handleResponse);
      mcpServer.stdin.write(JSON.stringify(request) + '\n');
    });
  };

  describe('MCP Protocol Initialization', () => {
    it('should initialize MCP server successfully', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'initialize',
        params: {
          protocolVersion: '1.0.0',
          clientInfo: {
            name: 'e2e-test-client',
            version: '1.0.0'
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.jsonrpc).toBe('2.0');
      expect(response.result).toBeDefined();
      expect(response.result.protocolVersion).toBe('1.0.0');
      expect(response.result.serverInfo).toBeDefined();
      expect(response.result.serverInfo.name).toBe('firebase-mcp-server');
    });

    it('should list available tools', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/list',
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.result).toBeDefined();
      expect(response.result.tools).toBeInstanceOf(Array);
      expect(response.result.tools.length).toBeGreaterThan(50);
      
      // Check for auth tools
      const authTools = response.result.tools.filter((tool: any) => 
        tool.name.startsWith('auth_')
      );
      expect(authTools.length).toBeGreaterThan(0);
    });
  });

  describe('Firebase Authentication Workflow', () => {
    let testUserId: string;
    const testUserEmail = `test-${Date.now()}@example.com`;
    const testUserPassword = 'TestPassword123!';

    it('should create a new user account', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'auth_create_user',
          arguments: {
            email: testUserEmail,
            password: testUserPassword,
            displayName: 'E2E Test User',
            emailVerified: false
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      expect(response.result.content).toBeInstanceOf(Array);
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.user).toBeDefined();
      expect(content.user.email).toBe(testUserEmail);
      expect(content.user.uid).toBeDefined();
      
      testUserId = content.user.uid;
    });

    it('should retrieve user information', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'auth_get_user',
          arguments: {
            uid: testUserId
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.user).toBeDefined();
      expect(content.user.uid).toBe(testUserId);
      expect(content.user.email).toBe(testUserEmail);
    });

    it('should update user profile', async () => {
      const newDisplayName = 'Updated E2E Test User';
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'auth_update_user',
          arguments: {
            uid: testUserId,
            displayName: newDisplayName,
            emailVerified: true
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.user.displayName).toBe(newDisplayName);
      expect(content.user.emailVerified).toBe(true);
    });

    it('should set custom user claims', async () => {
      const customClaims = {
        role: 'test-user',
        permissions: ['read', 'write'],
        testFlag: true
      };

      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'auth_set_custom_claims',
          arguments: {
            uid: testUserId,
            customClaims
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
    });

    it('should verify custom claims were set', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'auth_get_user',
          arguments: {
            uid: testUserId
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      const content = JSON.parse(response.result.content[0].text);
      expect(content.user.customClaims).toBeDefined();
      expect(content.user.customClaims.role).toBe('test-user');
      expect(content.user.customClaims.permissions).toEqual(['read', 'write']);
      expect(content.user.customClaims.testFlag).toBe(true);
    });

    it('should list users with pagination', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'auth_list_users',
          arguments: {
            maxResults: 10
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.users).toBeInstanceOf(Array);
      expect(content.users.length).toBeGreaterThan(0);
      
      // Find our test user in the list
      const testUser = content.users.find((user: any) => user.uid === testUserId);
      expect(testUser).toBeDefined();
      expect(testUser.email).toBe(testUserEmail);
    });

    it('should delete the test user', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'auth_delete_user',
          arguments: {
            uid: testUserId
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
    });

    it('should verify user was deleted', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'auth_get_user',
          arguments: {
            uid: testUserId
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      // Should return an error since user doesn't exist
      expect(response.error).toBeUndefined();
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(false);
      expect(content.error).toContain('not found');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid tool calls gracefully', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'non_existent_tool',
          arguments: {}
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeDefined();
      expect(response.error.code).toBe(-32601); // Method not found
    });

    it('should handle missing arguments', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'auth_get_user',
          arguments: {} // Missing required uid
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(false);
      expect(content.error).toBeDefined();
    });

    it('should handle invalid arguments', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'auth_create_user',
          arguments: {
            email: 'invalid-email', // Invalid email format
            password: '123' // Too short password
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(false);
      expect(content.error).toBeDefined();
    });
  });
});