import { spawn } from 'child_process';

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
 * E2E Test for Firebase Firestore Workflow
 * Tests complete Firestore CRUD operations through MCP protocol
 */
describe('Firebase Firestore E2E Workflow', () => {
  let mcpServer: any;
  let requestId = 1000; // Different range from auth tests

  beforeAll(async () => {
    // Start MCP server for E2E testing
    mcpServer = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        NODE_ENV: 'test',
        FIREBASE_PROJECT_ID: 'test-project-e2e',
        LOG_LEVEL: 'error'
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

  describe('Document CRUD Operations', () => {
    const testCollection = 'e2e-test-collection';
    const testDocumentId = `test-doc-${Date.now()}`;
    const testDocumentData = {
      name: 'E2E Test Document',
      value: 42,
      active: true,
      createdAt: new Date().toISOString(),
      tags: ['test', 'e2e', 'firestore']
    };

    it('should create a document with specific ID', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_set_document',
          arguments: {
            collection: testCollection,
            documentId: testDocumentId,
            data: testDocumentData
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.document).toBeDefined();
      expect(content.document.id).toBe(testDocumentId);
      expect(content.document.data.name).toBe(testDocumentData.name);
    });

    it('should retrieve the created document', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_get_document',
          arguments: {
            collection: testCollection,
            documentId: testDocumentId
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.document).toBeDefined();
      expect(content.document.id).toBe(testDocumentId);
      expect(content.document.data.name).toBe(testDocumentData.name);
      expect(content.document.data.value).toBe(testDocumentData.value);
      expect(content.document.data.active).toBe(testDocumentData.active);
    });

    it('should update the document', async () => {
      const updateData = {
        name: 'Updated E2E Test Document',
        value: 84,
        updatedAt: new Date().toISOString()
      };

      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_update_document',
          arguments: {
            collection: testCollection,
            documentId: testDocumentId,
            data: updateData
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

    it('should verify document was updated', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_get_document',
          arguments: {
            collection: testCollection,
            documentId: testDocumentId
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.document.data.name).toBe('Updated E2E Test Document');
      expect(content.document.data.value).toBe(84);
      expect(content.document.data.updatedAt).toBeDefined();
      expect(content.document.data.active).toBe(true); // Should still exist
    });

    it('should create document with auto-generated ID', async () => {
      const autoDocData = {
        type: 'auto-generated',
        timestamp: Date.now(),
        random: Math.random()
      };

      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_add_document',
          arguments: {
            collection: testCollection,
            data: autoDocData
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.document).toBeDefined();
      expect(content.document.id).toBeDefined();
      expect(content.document.id.length).toBeGreaterThan(0);
      expect(content.document.data.type).toBe('auto-generated');
    });
  });

  describe('Collection Queries', () => {
    const queryCollection = 'e2e-query-collection';

    beforeAll(async () => {
      // Create test documents for querying
      const testDocs = [
        { name: 'Doc 1', value: 10, category: 'A', active: true },
        { name: 'Doc 2', value: 20, category: 'B', active: true },
        { name: 'Doc 3', value: 30, category: 'A', active: false },
        { name: 'Doc 4', value: 40, category: 'C', active: true }
      ];

      for (let i = 0; i < testDocs.length; i++) {
        const request: MCPRequest = {
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'firestore_set_document',
            arguments: {
              collection: queryCollection,
              documentId: `query-doc-${i + 1}`,
              data: testDocs[i]
            }
          },
          id: requestId++
        };
        await sendMCPRequest(request);
      }
    });

    it('should query documents with filters', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_query_documents',
          arguments: {
            collection: queryCollection,
            filters: [
              { field: 'active', operator: '==', value: true },
              { field: 'value', operator: '>=', value: 20 }
            ]
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.documents).toBeInstanceOf(Array);
      expect(content.documents.length).toBe(2); // Doc 2 and Doc 4
      
      content.documents.forEach((doc: any) => {
        expect(doc.data.active).toBe(true);
        expect(doc.data.value).toBeGreaterThanOrEqual(20);
      });
    });

    it('should query documents with ordering and limit', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_query_documents',
          arguments: {
            collection: queryCollection,
            orderBy: [{ field: 'value', direction: 'desc' }],
            limit: 2
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.documents).toBeInstanceOf(Array);
      expect(content.documents.length).toBe(2);
      
      // Should return docs with highest values first
      expect(content.documents[0].data.value).toBe(40);
      expect(content.documents[1].data.value).toBe(30);
    });

    it('should get all documents in collection', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_get_collection',
          arguments: {
            collection: queryCollection
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.documents).toBeInstanceOf(Array);
      expect(content.documents.length).toBe(4); // All test documents
    });
  });

  describe('Batch Operations', () => {
    const batchCollection = 'e2e-batch-collection';

    it('should perform batch write operations', async () => {
      const batchOperations = [
        {
          operation: 'set',
          collection: batchCollection,
          documentId: 'batch-doc-1',
          data: { name: 'Batch Doc 1', value: 100 }
        },
        {
          operation: 'set',
          collection: batchCollection,
          documentId: 'batch-doc-2',
          data: { name: 'Batch Doc 2', value: 200 }
        },
        {
          operation: 'update',
          collection: batchCollection,
          documentId: 'batch-doc-1',
          data: { updated: true }
        }
      ];

      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_batch_write',
          arguments: {
            operations: batchOperations
          }
        },
        id: requestId++
      };

      const response = await sendMCPRequest(request);
      
      expect(response.error).toBeUndefined();
      expect(response.result).toBeDefined();
      
      const content = JSON.parse(response.result.content[0].text);
      expect(content.success).toBe(true);
      expect(content.operationsCount).toBe(3);
    });

    it('should verify batch operations were applied', async () => {
      // Check first document
      const request1: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_get_document',
          arguments: {
            collection: batchCollection,
            documentId: 'batch-doc-1'
          }
        },
        id: requestId++
      };

      const response1 = await sendMCPRequest(request1);
      const content1 = JSON.parse(response1.result.content[0].text);
      
      expect(content1.success).toBe(true);
      expect(content1.document.data.name).toBe('Batch Doc 1');
      expect(content1.document.data.value).toBe(100);
      expect(content1.document.data.updated).toBe(true);

      // Check second document
      const request2: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_get_document',
          arguments: {
            collection: batchCollection,
            documentId: 'batch-doc-2'
          }
        },
        id: requestId++
      };

      const response2 = await sendMCPRequest(request2);
      const content2 = JSON.parse(response2.result.content[0].text);
      
      expect(content2.success).toBe(true);
      expect(content2.document.data.name).toBe('Batch Doc 2');
      expect(content2.document.data.value).toBe(200);
      expect(content2.document.data.updated).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent document gracefully', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_get_document',
          arguments: {
            collection: 'non-existent-collection',
            documentId: 'non-existent-doc'
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

    it('should handle invalid collection names', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_set_document',
          arguments: {
            collection: '', // Empty collection name
            documentId: 'test-doc',
            data: { test: true }
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

    it('should handle invalid query filters', async () => {
      const request: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_query_documents',
          arguments: {
            collection: 'test-collection',
            filters: [
              { field: 'test', operator: 'invalid-operator', value: 'test' }
            ]
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

  describe('Cleanup', () => {
    it('should delete test documents', async () => {
      const collectionsToClean = [
        'e2e-test-collection',
        'e2e-query-collection',
        'e2e-batch-collection'
      ];

      for (const collection of collectionsToClean) {
        // Get all documents in collection
        const listRequest: MCPRequest = {
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'firestore_get_collection',
            arguments: { collection }
          },
          id: requestId++
        };

        const listResponse = await sendMCPRequest(listRequest);
        
        if (listResponse.result) {
          const content = JSON.parse(listResponse.result.content[0].text);
          
          if (content.success && content.documents) {
            // Delete each document
            for (const doc of content.documents) {
              const deleteRequest: MCPRequest = {
                jsonrpc: '2.0',
                method: 'tools/call',
                params: {
                  name: 'firestore_delete_document',
                  arguments: {
                    collection,
                    documentId: doc.id
                  }
                },
                id: requestId++
              };

              await sendMCPRequest(deleteRequest);
            }
          }
        }
      }

      // Verify cleanup (at least one collection should be empty)
      const verifyRequest: MCPRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'firestore_get_collection',
          arguments: {
            collection: 'e2e-test-collection'
          }
        },
        id: requestId++
      };

      const verifyResponse = await sendMCPRequest(verifyRequest);
      const verifyContent = JSON.parse(verifyResponse.result.content[0].text);
      
      // Should either be empty or return success: false (no documents)
      expect(
        verifyContent.documents?.length === 0 || verifyContent.success === false
      ).toBe(true);
    });
  });
});