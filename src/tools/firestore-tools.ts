/**
 * Firebase Firestore MCP Tools
 * 
 * MCP tools for Firebase Firestore operations
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { FirebaseServiceManager } from '@firebase/index';
import { wrapAsyncHandler, ValidationError } from '@utils/index';

/**
 * Get document tool
 */
export const getDocumentTool: Tool = {
  name: 'firestore_get_document',
  description: 'Get a document from Firestore collection',
  inputSchema: {
    type: 'object',
    properties: {
      collection: {
        type: 'string',
        description: 'Collection name',
      },
      documentId: {
        type: 'string',
        description: 'Document ID',
      },
    },
    required: ['collection', 'documentId'],
  },
};

export const getDocumentHandler = wrapAsyncHandler(async (args: any) => {
  const { collection, documentId } = args;
  
  if (!collection || !documentId) {
    throw new ValidationError('Collection and document ID are required');
  }
  
  const firestoreService = FirebaseServiceManager.getInstance().getFirestoreService();
  const document = await firestoreService.getDocument(collection, documentId);
  
  return {
    content: [
      {
        type: 'text',
        text: `Document retrieved successfully!\n\nCollection: ${collection}\nDocument ID: ${document.id}\nData:\n${JSON.stringify(document.data, null, 2)}`,
      },
    ],
  };
});

/**
 * Set document tool
 */
export const setDocumentTool: Tool = {
  name: 'firestore_set_document',
  description: 'Set (create or replace) a document in Firestore collection',
  inputSchema: {
    type: 'object',
    properties: {
      collection: {
        type: 'string',
        description: 'Collection name',
      },
      documentId: {
        type: 'string',
        description: 'Document ID',
      },
      data: {
        type: 'object',
        description: 'Document data',
        additionalProperties: true,
      },
      merge: {
        type: 'boolean',
        description: 'Whether to merge with existing document',
        default: false,
      },
    },
    required: ['collection', 'documentId', 'data'],
  },
};

export const setDocumentHandler = wrapAsyncHandler(async (args: any) => {
  const { collection, documentId, data, merge = false } = args;
  
  if (!collection || !documentId) {
    throw new ValidationError('Collection and document ID are required');
  }
  
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Data must be an object');
  }
  
  const firestoreService = FirebaseServiceManager.getInstance().getFirestoreService();
  const document = await firestoreService.setDocument(collection, documentId, data, merge);
  
  return {
    content: [
      {
        type: 'text',
        text: `Document ${merge ? 'merged' : 'set'} successfully!\n\nCollection: ${collection}\nDocument ID: ${document.id}\nData:\n${JSON.stringify(document.data, null, 2)}`,
      },
    ],
  };
});

/**
 * Update document tool
 */
export const updateDocumentTool: Tool = {
  name: 'firestore_update_document',
  description: 'Update an existing document in Firestore collection',
  inputSchema: {
    type: 'object',
    properties: {
      collection: {
        type: 'string',
        description: 'Collection name',
      },
      documentId: {
        type: 'string',
        description: 'Document ID',
      },
      data: {
        type: 'object',
        description: 'Update data (partial document)',
        additionalProperties: true,
      },
    },
    required: ['collection', 'documentId', 'data'],
  },
};

export const updateDocumentHandler = wrapAsyncHandler(async (args: any) => {
  const { collection, documentId, data } = args;
  
  if (!collection || !documentId) {
    throw new ValidationError('Collection and document ID are required');
  }
  
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Data must be an object');
  }
  
  const firestoreService = FirebaseServiceManager.getInstance().getFirestoreService();
  const document = await firestoreService.updateDocument(collection, documentId, data);
  
  return {
    content: [
      {
        type: 'text',
        text: `Document updated successfully!\n\nCollection: ${collection}\nDocument ID: ${document.id}\nUpdated Data:\n${JSON.stringify(document.data, null, 2)}`,
      },
    ],
  };
});

/**
 * Delete document tool
 */
export const deleteDocumentTool: Tool = {
  name: 'firestore_delete_document',
  description: 'Delete a document from Firestore collection',
  inputSchema: {
    type: 'object',
    properties: {
      collection: {
        type: 'string',
        description: 'Collection name',
      },
      documentId: {
        type: 'string',
        description: 'Document ID to delete',
      },
    },
    required: ['collection', 'documentId'],
  },
};

export const deleteDocumentHandler = wrapAsyncHandler(async (args: any) => {
  const { collection, documentId } = args;
  
  if (!collection || !documentId) {
    throw new ValidationError('Collection and document ID are required');
  }
  
  const firestoreService = FirebaseServiceManager.getInstance().getFirestoreService();
  await firestoreService.deleteDocument(collection, documentId);
  
  return {
    content: [
      {
        type: 'text',
        text: `Document deleted successfully!\n\nCollection: ${collection}\nDocument ID: ${documentId}`,
      },
    ],
  };
});

/**
 * Add document tool (auto-generated ID)
 */
export const addDocumentTool: Tool = {
  name: 'firestore_add_document',
  description: 'Add a document to Firestore collection with auto-generated ID',
  inputSchema: {
    type: 'object',
    properties: {
      collection: {
        type: 'string',
        description: 'Collection name',
      },
      data: {
        type: 'object',
        description: 'Document data',
        additionalProperties: true,
      },
    },
    required: ['collection', 'data'],
  },
};

export const addDocumentHandler = wrapAsyncHandler(async (args: any) => {
  const { collection, data } = args;
  
  if (!collection) {
    throw new ValidationError('Collection is required');
  }
  
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Data must be an object');
  }
  
  const firestoreService = FirebaseServiceManager.getInstance().getFirestoreService();
  const document = await firestoreService.addDocument(collection, data);
  
  return {
    content: [
      {
        type: 'text',
        text: `Document added successfully!\n\nCollection: ${collection}\nGenerated Document ID: ${document.id}\nData:\n${JSON.stringify(document.data, null, 2)}`,
      },
    ],
  };
});

/**
 * List documents tool
 */
export const listDocumentsTool: Tool = {
  name: 'firestore_list_documents',
  description: 'List documents in a Firestore collection with optional filtering',
  inputSchema: {
    type: 'object',
    properties: {
      collection: {
        type: 'string',
        description: 'Collection name',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of documents to return',
        minimum: 1,
        maximum: 1000,
        default: 50,
      },
      offset: {
        type: 'number',
        description: 'Number of documents to skip',
        minimum: 0,
        default: 0,
      },
      orderBy: {
        type: 'array',
        description: 'Order by clauses',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              description: 'Field to order by',
            },
            direction: {
              type: 'string',
              enum: ['asc', 'desc'],
              description: 'Sort direction',
              default: 'asc',
            },
          },
          required: ['field'],
        },
      },
      where: {
        type: 'array',
        description: 'Where clauses for filtering',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              description: 'Field to filter on',
            },
            operator: {
              type: 'string',
              enum: ['==', '!=', '<', '<=', '>', '>=', 'array-contains', 'array-contains-any', 'in', 'not-in'],
              description: 'Comparison operator',
            },
            value: {
              description: 'Value to compare against',
            },
          },
          required: ['field', 'operator', 'value'],
        },
      },
    },
    required: ['collection'],
  },
};

export const listDocumentsHandler = wrapAsyncHandler(async (args: any) => {
  const { collection, limit = 50, offset = 0, orderBy, where } = args;
  
  if (!collection) {
    throw new ValidationError('Collection is required');
  }
  
  const firestoreService = FirebaseServiceManager.getInstance().getFirestoreService();
  const documents = await firestoreService.listDocuments(collection, {
    limit,
    offset,
    orderBy,
    where,
  });
  
  const documentList = documents.map(doc => 
    `• ${doc.id}: ${JSON.stringify(doc.data).substring(0, 100)}${Object.keys(doc.data).length > 3 ? '...' : ''}`
  ).join('\n');
  
  return {
    content: [
      {
        type: 'text',
        text: `Found ${documents.length} documents in collection "${collection}":\n\n${documentList || 'No documents found'}\n\nShowing ${documents.length} documents (offset: ${offset}, limit: ${limit})`,
      },
    ],
  };
});

/**
 * Query documents tool
 */
export const queryDocumentsTool: Tool = {
  name: 'firestore_query_documents',
  description: 'Query documents in a Firestore collection with advanced filtering',
  inputSchema: {
    type: 'object',
    properties: {
      collection: {
        type: 'string',
        description: 'Collection name',
      },
      where: {
        type: 'array',
        description: 'Where clauses for filtering (required for query)',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              description: 'Field to filter on',
            },
            operator: {
              type: 'string',
              enum: ['==', '!=', '<', '<=', '>', '>=', 'array-contains', 'array-contains-any', 'in', 'not-in'],
              description: 'Comparison operator',
            },
            value: {
              description: 'Value to compare against',
            },
          },
          required: ['field', 'operator', 'value'],
        },
        minItems: 1,
      },
      orderBy: {
        type: 'array',
        description: 'Order by clauses',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              description: 'Field to order by',
            },
            direction: {
              type: 'string',
              enum: ['asc', 'desc'],
              description: 'Sort direction',
              default: 'asc',
            },
          },
          required: ['field'],
        },
      },
      limit: {
        type: 'number',
        description: 'Maximum number of documents to return',
        minimum: 1,
        maximum: 1000,
        default: 50,
      },
    },
    required: ['collection', 'where'],
  },
};

export const queryDocumentsHandler = wrapAsyncHandler(async (args: any) => {
  const { collection, where, orderBy, limit = 50 } = args;
  
  if (!collection) {
    throw new ValidationError('Collection is required');
  }
  
  if (!where || !Array.isArray(where) || where.length === 0) {
    throw new ValidationError('At least one where clause is required for query');
  }
  
  const firestoreService = FirebaseServiceManager.getInstance().getFirestoreService();
  const documents = await firestoreService.queryDocuments(collection, {
    where,
    orderBy,
    limit,
  });
  
  const documentList = documents.map(doc => 
    `• ${doc.id}: ${JSON.stringify(doc.data, null, 2)}`
  ).join('\n');
  
  const whereString = where.map(w => `${w.field} ${w.operator} ${JSON.stringify(w.value)}`).join(' AND ');
  
  return {
    content: [
      {
        type: 'text',
        text: `Query results for collection "${collection}":\nWhere: ${whereString}\n\nFound ${documents.length} matching documents:\n\n${documentList || 'No documents found'}`,
      },
    ],
  };
});

/**
 * Get collection info tool
 */
export const getCollectionInfoTool: Tool = {
  name: 'firestore_get_collection_info',
  description: 'Get information about a Firestore collection',
  inputSchema: {
    type: 'object',
    properties: {
      collection: {
        type: 'string',
        description: 'Collection name',
      },
    },
    required: ['collection'],
  },
};

export const getCollectionInfoHandler = wrapAsyncHandler(async (args: any) => {
  const { collection } = args;
  
  if (!collection) {
    throw new ValidationError('Collection is required');
  }
  
  const firestoreService = FirebaseServiceManager.getInstance().getFirestoreService();
  const info = await firestoreService.getCollectionInfo(collection);
  
  return {
    content: [
      {
        type: 'text',
        text: `Collection Information:\n\nName: ${info.name}\nDocument Count: ${info.documentCount}`,
      },
    ],
  };
});

/**
 * Batch operations tool
 */
export const batchOperationsTool: Tool = {
  name: 'firestore_batch_operations',
  description: 'Execute multiple Firestore operations in a single batch (max 500 operations)',
  inputSchema: {
    type: 'object',
    properties: {
      operations: {
        type: 'array',
        description: 'Array of operations to execute',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['set', 'update', 'delete'],
              description: 'Operation type',
            },
            collection: {
              type: 'string',
              description: 'Collection name',
            },
            documentId: {
              type: 'string',
              description: 'Document ID',
            },
            data: {
              type: 'object',
              description: 'Document data (required for set/update)',
              additionalProperties: true,
            },
            merge: {
              type: 'boolean',
              description: 'Whether to merge for set operations',
              default: false,
            },
          },
          required: ['type', 'collection', 'documentId'],
        },
        minItems: 1,
        maxItems: 500,
      },
    },
    required: ['operations'],
  },
};

export const batchOperationsHandler = wrapAsyncHandler(async (args: any) => {
  const { operations } = args;
  
  if (!operations || !Array.isArray(operations) || operations.length === 0) {
    throw new ValidationError('Operations array is required');
  }
  
  const firestoreService = FirebaseServiceManager.getInstance().getFirestoreService();
  await firestoreService.batchOperations(operations);
  
  const operationSummary = operations.map((op, index) => 
    `${index + 1}. ${op.type.toUpperCase()} ${op.collection}/${op.documentId}`
  ).join('\n');
  
  return {
    content: [
      {
        type: 'text',
        text: `Batch operations completed successfully!\n\nExecuted ${operations.length} operations:\n\n${operationSummary}`,
      },
    ],
  };
});

/**
 * All Firestore tools
 */
export const firestoreTools: Tool[] = [
  getDocumentTool,
  setDocumentTool,
  updateDocumentTool,
  deleteDocumentTool,
  addDocumentTool,
  listDocumentsTool,
  queryDocumentsTool,
  getCollectionInfoTool,
  batchOperationsTool,
];

/**
 * Firestore tool handlers map
 */
export const firestoreToolHandlers = {
  firestore_get_document: getDocumentHandler,
  firestore_set_document: setDocumentHandler,
  firestore_update_document: updateDocumentHandler,
  firestore_delete_document: deleteDocumentHandler,
  firestore_add_document: addDocumentHandler,
  firestore_list_documents: listDocumentsHandler,
  firestore_query_documents: queryDocumentsHandler,
  firestore_get_collection_info: getCollectionInfoHandler,
  firestore_batch_operations: batchOperationsHandler,
};