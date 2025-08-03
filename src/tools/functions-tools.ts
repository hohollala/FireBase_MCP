/**
 * Firebase Functions MCP Tools
 * 
 * MCP tools for Firebase Cloud Functions operations
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { FirebaseServiceManager } from '@firebase/index';
import { wrapAsyncHandler, ValidationError } from '@utils/index';

/**
 * Trigger Firestore function tool
 */
export const triggerFirestoreFunctionTool: Tool = {
  name: 'functions_trigger_firestore',
  description: 'Trigger a Cloud Function by performing Firestore operations',
  inputSchema: {
    type: 'object',
    properties: {
      collection: {
        type: 'string',
        description: 'Firestore collection name',
      },
      documentId: {
        type: 'string',
        description: 'Document ID',
      },
      operation: {
        type: 'string',
        enum: ['create', 'update', 'delete'],
        description: 'Firestore operation type',
        default: 'create',
      },
      data: {
        type: 'object',
        description: 'Document data (required for create/update)',
        additionalProperties: true,
      },
    },
    required: ['collection', 'documentId'],
  },
};

export const triggerFirestoreFunctionHandler = wrapAsyncHandler(async (args: any) => {
  const { collection, documentId, operation = 'create', data } = args;
  
  if (!collection || !documentId) {
    throw new ValidationError('Collection and document ID are required');
  }
  
  const functionsService = FirebaseServiceManager.getInstance().getFunctionsService();
  await functionsService.triggerFirestoreFunction(collection, documentId, data, operation);
  
  return {
    content: [
      {
        type: 'text',
        text: `Firestore function triggered successfully!

Operation: ${operation.toUpperCase()}
Collection: ${collection}
Document ID: ${documentId}
${data ? `\nData: ${JSON.stringify(data, null, 2)}` : ''}

Any Cloud Functions listening to this Firestore path will be triggered.`,
      },
    ],
  };
});

/**
 * Trigger Auth function tool
 */
export const triggerAuthFunctionTool: Tool = {
  name: 'functions_trigger_auth',
  description: 'Trigger a Cloud Function by performing Authentication operations',
  inputSchema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['create', 'delete'],
        description: 'Auth operation type',
      },
      userData: {
        type: 'object',
        description: 'User data',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email (required for create)',
          },
          password: {
            type: 'string',
            description: 'User password (for create)',
          },
          uid: {
            type: 'string',
            description: 'User UID (required for delete)',
          },
          displayName: {
            type: 'string',
            description: 'User display name',
          },
        },
      },
    },
    required: ['operation', 'userData'],
  },
};

export const triggerAuthFunctionHandler = wrapAsyncHandler(async (args: any) => {
  const { operation, userData } = args;
  
  if (!operation || !userData) {
    throw new ValidationError('Operation and user data are required');
  }
  
  const functionsService = FirebaseServiceManager.getInstance().getFunctionsService();
  const result = await functionsService.triggerAuthFunction(operation, userData);
  
  return {
    content: [
      {
        type: 'text',
        text: `Auth function triggered successfully!

Operation: ${operation.toUpperCase()}
${operation === 'create' ? `New User UID: ${result}` : ''}
${operation === 'delete' ? `Deleted User UID: ${userData.uid}` : ''}

Any Cloud Functions listening to Auth events will be triggered.`,
      },
    ],
  };
});

/**
 * Trigger Storage function tool
 */
export const triggerStorageFunctionTool: Tool = {
  name: 'functions_trigger_storage',
  description: 'Trigger a Cloud Function by performing Storage operations',
  inputSchema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['upload', 'delete'],
        description: 'Storage operation type',
      },
      fileName: {
        type: 'string',
        description: 'File name/path in storage',
      },
      fileContent: {
        type: 'string',
        description: 'File content (for upload operation)',
      },
      contentType: {
        type: 'string',
        description: 'File content type',
      },
      customMetadata: {
        type: 'object',
        description: 'Custom metadata for the file',
        additionalProperties: { type: 'string' },
      },
    },
    required: ['operation', 'fileName'],
  },
};

export const triggerStorageFunctionHandler = wrapAsyncHandler(async (args: any) => {
  const { operation, fileName, fileContent, contentType, customMetadata } = args;
  
  if (!operation || !fileName) {
    throw new ValidationError('Operation and file name are required');
  }
  
  if (operation === 'upload' && !fileContent) {
    throw new ValidationError('File content is required for upload operation');
  }
  
  const functionsService = FirebaseServiceManager.getInstance().getFunctionsService();
  
  const fileData = operation === 'upload' ? Buffer.from(fileContent, 'utf8') : undefined;
  const metadata = contentType || customMetadata ? {
    contentType,
    customMetadata,
  } : undefined;
  
  await functionsService.triggerStorageFunction(operation, fileName, fileData, metadata);
  
  return {
    content: [
      {
        type: 'text',
        text: `Storage function triggered successfully!

Operation: ${operation.toUpperCase()}
File: ${fileName}
${operation === 'upload' ? `Content Length: ${fileContent?.length || 0} characters` : ''}
${contentType ? `Content Type: ${contentType}` : ''}

Any Cloud Functions listening to Storage events will be triggered.`,
      },
    ],
  };
});

/**
 * Send message to Pub/Sub topic tool
 */
export const sendTopicMessageTool: Tool = {
  name: 'functions_send_topic_message',
  description: 'Send a message to Pub/Sub topic to trigger Cloud Functions',
  inputSchema: {
    type: 'object',
    properties: {
      topicName: {
        type: 'string',
        description: 'Pub/Sub topic name',
      },
      message: {
        type: 'object',
        description: 'Message data',
        additionalProperties: true,
      },
      attributes: {
        type: 'object',
        description: 'Message attributes',
        additionalProperties: { type: 'string' },
      },
    },
    required: ['topicName', 'message'],
  },
};

export const sendTopicMessageHandler = wrapAsyncHandler(async (args: any) => {
  const { topicName, message, attributes } = args;
  
  if (!topicName || !message) {
    throw new ValidationError('Topic name and message are required');
  }
  
  const functionsService = FirebaseServiceManager.getInstance().getFunctionsService();
  
  try {
    const messageId = await functionsService.sendMessageToTopic(topicName, message, attributes);
    
    return {
      content: [
        {
          type: 'text',
          text: `Message sent to Pub/Sub topic successfully!

Topic: ${topicName}
Message ID: ${messageId}
Message: ${JSON.stringify(message, null, 2)}
${attributes ? `Attributes: ${JSON.stringify(attributes, null, 2)}` : ''}

Any Cloud Functions subscribed to this topic will be triggered.`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Pub/Sub messaging is not available in this MCP server.

Topic: ${topicName}
Message: ${JSON.stringify(message, null, 2)}

Note: This feature requires separate Google Cloud Pub/Sub client setup. 
You can trigger Pub/Sub functions by:
1. Using the Google Cloud Console
2. Using the gcloud CLI: gcloud pubsub topics publish ${topicName} --message='${JSON.stringify(message)}'
3. Setting up a separate Pub/Sub client in your application`,
        },
      ],
    };
  }
});

/**
 * Schedule task tool
 */
export const scheduleTaskTool: Tool = {
  name: 'functions_schedule_task',
  description: 'Schedule a Cloud Task to trigger HTTP Cloud Functions',
  inputSchema: {
    type: 'object',
    properties: {
      queueName: {
        type: 'string',
        description: 'Cloud Tasks queue name',
      },
      functionUrl: {
        type: 'string',
        description: 'HTTP Cloud Function URL',
      },
      payload: {
        type: 'object',
        description: 'Task payload data',
        additionalProperties: true,
      },
      scheduleTime: {
        type: 'string',
        description: 'ISO 8601 datetime for when to execute the task',
      },
    },
    required: ['queueName', 'functionUrl'],
  },
};

export const scheduleTaskHandler = wrapAsyncHandler(async (args: any) => {
  const { queueName, functionUrl, payload, scheduleTime } = args;
  
  if (!queueName || !functionUrl) {
    throw new ValidationError('Queue name and function URL are required');
  }
  
  const functionsService = FirebaseServiceManager.getInstance().getFunctionsService();
  
  try {
    const taskId = await functionsService.scheduleTask(
      queueName,
      functionUrl,
      payload,
      scheduleTime ? new Date(scheduleTime) : undefined
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `Task scheduled successfully!

Queue: ${queueName}
Function URL: ${functionUrl}
Task ID: ${taskId}
${scheduleTime ? `Scheduled for: ${scheduleTime}` : 'Scheduled for immediate execution'}
${payload ? `Payload: ${JSON.stringify(payload, null, 2)}` : ''}`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Cloud Tasks scheduling is not available in this MCP server.

Queue: ${queueName}
Function URL: ${functionUrl}
${payload ? `Payload: ${JSON.stringify(payload, null, 2)}` : ''}

Note: This feature requires separate Google Cloud Tasks client setup.
You can schedule tasks by:
1. Using the Google Cloud Console
2. Using the gcloud CLI
3. Setting up a separate Cloud Tasks client in your application`,
        },
      ],
    };
  }
});

/**
 * Get function info tool
 */
export const getFunctionInfoTool: Tool = {
  name: 'functions_get_info',
  description: 'Get information about a Cloud Function',
  inputSchema: {
    type: 'object',
    properties: {
      functionName: {
        type: 'string',
        description: 'Name of the Cloud Function',
      },
    },
    required: ['functionName'],
  },
};

export const getFunctionInfoHandler = wrapAsyncHandler(async (args: any) => {
  const { functionName } = args;
  
  if (!functionName) {
    throw new ValidationError('Function name is required');
  }
  
  const functionsService = FirebaseServiceManager.getInstance().getFunctionsService();
  
  try {
    const functionInfo = await functionsService.getFunctionInfo(functionName);
    
    return {
      content: [
        {
          type: 'text',
          text: `Function Information:

Name: ${functionInfo.name}
Status: ${functionInfo.status}
Version: ${functionInfo.versionId}
Updated: ${functionInfo.updateTime}
${functionInfo.httpsTrigger?.url ? `HTTPS URL: ${functionInfo.httpsTrigger.url}` : ''}
${functionInfo.eventTrigger ? `Event Trigger: ${functionInfo.eventTrigger.eventType} on ${functionInfo.eventTrigger.resource}` : ''}`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Function information retrieval is not available in this MCP server.

Function: ${functionName}

Note: This feature requires Google Cloud Functions API client setup.
You can get function information by:
1. Using the Google Cloud Console
2. Using the gcloud CLI: gcloud functions describe ${functionName}
3. Setting up a separate Cloud Functions API client`,
        },
      ],
    };
  }
});

/**
 * List functions tool
 */
export const listFunctionsTool: Tool = {
  name: 'functions_list',
  description: 'List all Cloud Functions in the project',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const listFunctionsHandler = wrapAsyncHandler(async (_args: any) => {
  const functionsService = FirebaseServiceManager.getInstance().getFunctionsService();
  
  try {
    const functions = await functionsService.listFunctions();
    
    const functionList = functions.map(func => 
      `• ${func.name} - ${func.status} - ${func.httpsTrigger?.url || 'Event-triggered'}`
    ).join('\n');
    
    return {
      content: [
        {
          type: 'text',
          text: `Cloud Functions in project:

${functionList || 'No functions found'}

Total functions: ${functions.length}`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Function listing is not available in this MCP server.

Note: This feature requires Google Cloud Functions API client setup.
You can list functions by:
1. Using the Google Cloud Console
2. Using the gcloud CLI: gcloud functions list
3. Setting up a separate Cloud Functions API client`,
        },
      ],
    };
  }
});

/**
 * All Functions tools
 */
export const functionsTools: Tool[] = [
  triggerFirestoreFunctionTool,
  triggerAuthFunctionTool,
  triggerStorageFunctionTool,
  sendTopicMessageTool,
  scheduleTaskTool,
  getFunctionInfoTool,
  listFunctionsTool,
];

/**
 * Functions tool handlers map
 */
export const functionsToolHandlers = {
  functions_trigger_firestore: triggerFirestoreFunctionHandler,
  functions_trigger_auth: triggerAuthFunctionHandler,
  functions_trigger_storage: triggerStorageFunctionHandler,
  functions_send_topic_message: sendTopicMessageHandler,
  functions_schedule_task: scheduleTaskHandler,
  functions_get_info: getFunctionInfoHandler,
  functions_list: listFunctionsHandler,
};