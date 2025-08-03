/**
 * Firebase Realtime Database MCP Tools
 * 
 * MCP tools for Firebase Realtime Database operations
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { FirebaseServiceManager } from '@firebase/index';
import { wrapAsyncHandler, ValidationError } from '@utils/index';

/**
 * Set data tool
 */
export const setDataTool: Tool = {
  name: 'rtdb_set_data',
  description: 'Set data at a path in Realtime Database',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Database path (e.g., "users/123" or "messages")',
      },
      value: {
        description: 'Data to set (can be any JSON value)',
      },
    },
    required: ['path', 'value'],
  },
};

export const setDataHandler = wrapAsyncHandler(async (args: any) => {
  const { path, value } = args;
  
  if (!path) {
    throw new ValidationError('Path is required');
  }
  
  const rtdbService = FirebaseServiceManager.getInstance().getRealtimeDatabaseService();
  const result = await rtdbService.setData(path, value);
  
  return {
    content: [
      {
        type: 'text',
        text: `Data set successfully!

Path: ${result.path}
Key: ${result.key || 'N/A'}
Value: ${JSON.stringify(result.value, null, 2)}`,
      },
    ],
  };
});

/**
 * Get data tool
 */
export const getDataTool: Tool = {
  name: 'rtdb_get_data',
  description: 'Get data from a path in Realtime Database',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Database path to read from',
      },
    },
    required: ['path'],
  },
};

export const getDataHandler = wrapAsyncHandler(async (args: any) => {
  const { path } = args;
  
  if (!path) {
    throw new ValidationError('Path is required');
  }
  
  const rtdbService = FirebaseServiceManager.getInstance().getRealtimeDatabaseService();
  const result = await rtdbService.getData(path);
  
  return {
    content: [
      {
        type: 'text',
        text: `Data retrieved successfully!

Path: ${result.path}
Key: ${result.key || 'N/A'}
Value: ${JSON.stringify(result.value, null, 2)}`,
      },
    ],
  };
});

/**
 * Update data tool
 */
export const updateDataTool: Tool = {
  name: 'rtdb_update_data',
  description: 'Update data at a path in Realtime Database',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Database path to update',
      },
      updates: {
        type: 'object',
        description: 'Object with update data',
        additionalProperties: true,
      },
    },
    required: ['path', 'updates'],
  },
};

export const updateDataHandler = wrapAsyncHandler(async (args: any) => {
  const { path, updates } = args;
  
  if (!path) {
    throw new ValidationError('Path is required');
  }
  
  if (!updates || typeof updates !== 'object') {
    throw new ValidationError('Updates must be an object');
  }
  
  const rtdbService = FirebaseServiceManager.getInstance().getRealtimeDatabaseService();
  const result = await rtdbService.updateData(path, updates);
  
  return {
    content: [
      {
        type: 'text',
        text: `Data updated successfully!

Path: ${result.path}
Updated fields: ${Object.keys(updates).join(', ')}
New value: ${JSON.stringify(result.value, null, 2)}`,
      },
    ],
  };
});

/**
 * Delete data tool
 */
export const deleteDataTool: Tool = {
  name: 'rtdb_delete_data',
  description: 'Delete data at a path in Realtime Database',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Database path to delete',
      },
    },
    required: ['path'],
  },
};

export const deleteDataHandler = wrapAsyncHandler(async (args: any) => {
  const { path } = args;
  
  if (!path) {
    throw new ValidationError('Path is required');
  }
  
  const rtdbService = FirebaseServiceManager.getInstance().getRealtimeDatabaseService();
  await rtdbService.deleteData(path);
  
  return {
    content: [
      {
        type: 'text',
        text: `Data deleted successfully!

Path: ${path}`,
      },
    ],
  };
});

/**
 * Push data tool
 */
export const pushDataTool: Tool = {
  name: 'rtdb_push_data',
  description: 'Push data to a path in Realtime Database (auto-generated key)',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Database path to push to',
      },
      value: {
        description: 'Data to push (can be any JSON value)',
      },
    },
    required: ['path', 'value'],
  },
};

export const pushDataHandler = wrapAsyncHandler(async (args: any) => {
  const { path, value } = args;
  
  if (!path) {
    throw new ValidationError('Path is required');
  }
  
  const rtdbService = FirebaseServiceManager.getInstance().getRealtimeDatabaseService();
  const result = await rtdbService.pushData(path, value);
  
  return {
    content: [
      {
        type: 'text',
        text: `Data pushed successfully!

Base Path: ${path}
Generated Key: ${result.key}
Full Path: ${result.path}
Value: ${JSON.stringify(result.value, null, 2)}`,
      },
    ],
  };
});

/**
 * Query data tool
 */
export const queryDataTool: Tool = {
  name: 'rtdb_query_data',
  description: 'Query data with filters from Realtime Database',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Database path to query',
      },
      orderBy: {
        type: 'string',
        description: 'Order by: "key", "value", or child key name',
      },
      limitToFirst: {
        type: 'number',
        description: 'Limit to first N results',
        minimum: 1,
      },
      limitToLast: {
        type: 'number',
        description: 'Limit to last N results',
        minimum: 1,
      },
      startAt: {
        description: 'Start at value',
      },
      endAt: {
        description: 'End at value',
      },
      equalTo: {
        description: 'Equal to value',
      },
    },
    required: ['path'],
  },
};

export const queryDataHandler = wrapAsyncHandler(async (args: any) => {
  const { path, orderBy, limitToFirst, limitToLast, startAt, endAt, equalTo } = args;
  
  if (!path) {
    throw new ValidationError('Path is required');
  }
  
  const options = {
    orderBy,
    limitToFirst,
    limitToLast,
    startAt,
    endAt,
    equalTo,
  };
  
  // Remove undefined values
  Object.keys(options).forEach(key => {
    if (options[key as keyof typeof options] === undefined) {
      delete options[key as keyof typeof options];
    }
  });
  
  const rtdbService = FirebaseServiceManager.getInstance().getRealtimeDatabaseService();
  const results = await rtdbService.queryData(path, options);
  
  const resultList = results.map(result => 
    `• ${result.key || 'N/A'}: ${JSON.stringify(result.value).substring(0, 100)}${JSON.stringify(result.value).length > 100 ? '...' : ''}`
  ).join('\n');
  
  return {
    content: [
      {
        type: 'text',
        text: `Query completed successfully!

Path: ${path}
Query options: ${JSON.stringify(options, null, 2)}
Results found: ${results.length}

${resultList || 'No results found'}`,
      },
    ],
  };
});

/**
 * Check if data exists tool
 */
export const existsDataTool: Tool = {
  name: 'rtdb_exists',
  description: 'Check if data exists at a path in Realtime Database',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Database path to check',
      },
    },
    required: ['path'],
  },
};

export const existsDataHandler = wrapAsyncHandler(async (args: any) => {
  const { path } = args;
  
  if (!path) {
    throw new ValidationError('Path is required');
  }
  
  const rtdbService = FirebaseServiceManager.getInstance().getRealtimeDatabaseService();
  const exists = await rtdbService.exists(path);
  
  return {
    content: [
      {
        type: 'text',
        text: `Existence check completed!

Path: ${path}
Exists: ${exists ? 'Yes' : 'No'}`,
      },
    ],
  };
});

/**
 * Transaction tool
 */
export const transactionTool: Tool = {
  name: 'rtdb_transaction',
  description: 'Perform an atomic transaction on Realtime Database data',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Database path for transaction',
      },
      operation: {
        type: 'string',
        enum: ['increment', 'decrement', 'set_if_null'],
        description: 'Transaction operation type',
      },
      value: {
        type: 'number',
        description: 'Value for increment/decrement operations',
      },
      newValue: {
        description: 'New value for set_if_null operation',
      },
    },
    required: ['path', 'operation'],
  },
};

export const transactionHandler = wrapAsyncHandler(async (args: any) => {
  const { path, operation, value, newValue } = args;
  
  if (!path) {
    throw new ValidationError('Path is required');
  }
  
  let updateFunction: (currentData: any) => any;
  
  switch (operation) {
    case 'increment':
      if (typeof value !== 'number') {
        throw new ValidationError('Value must be a number for increment operation');
      }
      updateFunction = (currentData) => {
        return (currentData || 0) + value;
      };
      break;
      
    case 'decrement':
      if (typeof value !== 'number') {
        throw new ValidationError('Value must be a number for decrement operation');
      }
      updateFunction = (currentData) => {
        return (currentData || 0) - value;
      };
      break;
      
    case 'set_if_null':
      if (newValue === undefined) {
        throw new ValidationError('newValue is required for set_if_null operation');
      }
      updateFunction = (currentData) => {
        return currentData === null ? newValue : currentData;
      };
      break;
      
    default:
      throw new ValidationError(`Invalid operation: ${operation}`);
  }
  
  const rtdbService = FirebaseServiceManager.getInstance().getRealtimeDatabaseService();
  const result = await rtdbService.transaction(path, updateFunction);
  
  return {
    content: [
      {
        type: 'text',
        text: `Transaction completed!

Path: ${path}
Operation: ${operation}
Committed: ${result.committed}
${result.snapshot ? `Final value: ${JSON.stringify(result.snapshot.value, null, 2)}` : 'No snapshot available'}`,
      },
    ],
  };
});

/**
 * Get database info tool
 */
export const getDatabaseInfoTool: Tool = {
  name: 'rtdb_get_info',
  description: 'Get Realtime Database connection information',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const getDatabaseInfoHandler = wrapAsyncHandler(async (_args: any) => {
  const rtdbService = FirebaseServiceManager.getInstance().getRealtimeDatabaseService();
  const databaseUrl = rtdbService.getDatabaseUrl();
  
  return {
    content: [
      {
        type: 'text',
        text: `Database Information:

Database URL: ${databaseUrl}
Status: Connected
Type: Realtime Database

Note: This database supports real-time data synchronization and offline capabilities.`,
      },
    ],
  };
});

/**
 * Connection control tool
 */
export const connectionControlTool: Tool = {
  name: 'rtdb_connection_control',
  description: 'Control Realtime Database connection (online/offline)',
  inputSchema: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['online', 'offline'],
        description: 'Connection action',
      },
    },
    required: ['action'],
  },
};

export const connectionControlHandler = wrapAsyncHandler(async (args: any) => {
  const { action } = args;
  
  if (!action) {
    throw new ValidationError('Action is required');
  }
  
  const rtdbService = FirebaseServiceManager.getInstance().getRealtimeDatabaseService();
  
  switch (action) {
    case 'online':
      rtdbService.goOnline();
      break;
    case 'offline':
      rtdbService.goOffline();
      break;
    default:
      throw new ValidationError(`Invalid action: ${action}`);
  }
  
  return {
    content: [
      {
        type: 'text',
        text: `Database connection ${action === 'online' ? 'restored' : 'disconnected'}!

Status: ${action === 'online' ? 'Online' : 'Offline'}

${action === 'offline' ? 
  'The database is now offline. Any writes will be queued until you go back online.' : 
  'The database is now online. Any queued writes will be sent to the server.'}`,
      },
    ],
  };
});

/**
 * All Realtime Database tools
 */
export const realtimeDatabaseTools: Tool[] = [
  setDataTool,
  getDataTool,
  updateDataTool,
  deleteDataTool,
  pushDataTool,
  queryDataTool,
  existsDataTool,
  transactionTool,
  getDatabaseInfoTool,
  connectionControlTool,
];

/**
 * Realtime Database tool handlers map
 */
export const realtimeDatabaseToolHandlers = {
  rtdb_set_data: setDataHandler,
  rtdb_get_data: getDataHandler,
  rtdb_update_data: updateDataHandler,
  rtdb_delete_data: deleteDataHandler,
  rtdb_push_data: pushDataHandler,
  rtdb_query_data: queryDataHandler,
  rtdb_exists: existsDataHandler,
  rtdb_transaction: transactionHandler,
  rtdb_get_info: getDatabaseInfoHandler,
  rtdb_connection_control: connectionControlHandler,
};