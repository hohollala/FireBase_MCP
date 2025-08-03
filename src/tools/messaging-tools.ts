/**
 * Firebase Cloud Messaging (FCM) MCP Tools
 * 
 * MCP tools for Firebase Cloud Messaging operations
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { FirebaseServiceManager } from '@firebase/index';
import { wrapAsyncHandler, ValidationError } from '@utils/index';

/**
 * Send to token tool
 */
export const sendToTokenTool: Tool = {
  name: 'fcm_send_to_token',
  description: 'Send FCM message to a specific device token',
  inputSchema: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'Device FCM token',
      },
      title: {
        type: 'string',
        description: 'Notification title',
      },
      body: {
        type: 'string',
        description: 'Notification body',
      },
      imageUrl: {
        type: 'string',
        description: 'Notification image URL',
      },
      data: {
        type: 'object',
        description: 'Custom data payload',
        additionalProperties: { type: 'string' },
      },
      clickAction: {
        type: 'string',
        description: 'Action when notification is clicked',
      },
    },
    required: ['token'],
  },
};

export const sendToTokenHandler = wrapAsyncHandler(async (args: any) => {
  const { token, title, body, imageUrl, data, clickAction } = args;
  
  if (!token) {
    throw new ValidationError('Device token is required');
  }
  
  const messagingService = FirebaseServiceManager.getInstance().getMessagingService();
  
  const message = {
    token,
    notification: title || body ? {
      title,
      body,
      imageUrl,
    } : undefined,
    data,
    webpush: clickAction ? {
      notification: {
        click_action: clickAction,
      },
    } : undefined,
  };
  
  const response = await messagingService.sendToToken(message);
  
  return {
    content: [
      {
        type: 'text',
        text: `FCM message sent successfully to device!

Message ID: ${response.messageId}
Device Token: ${token.substring(0, 20)}...
Title: ${title || 'Not set'}
Body: ${body || 'Not set'}
${imageUrl ? `Image: ${imageUrl}` : ''}
${data ? `Data: ${JSON.stringify(data, null, 2)}` : ''}
Success: ${response.successCount}
Failures: ${response.failureCount}`,
      },
    ],
  };
});

/**
 * Send to topic tool
 */
export const sendToTopicTool: Tool = {
  name: 'fcm_send_to_topic',
  description: 'Send FCM message to a topic',
  inputSchema: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        description: 'FCM topic name',
      },
      title: {
        type: 'string',
        description: 'Notification title',
      },
      body: {
        type: 'string',
        description: 'Notification body',
      },
      imageUrl: {
        type: 'string',
        description: 'Notification image URL',
      },
      data: {
        type: 'object',
        description: 'Custom data payload',
        additionalProperties: { type: 'string' },
      },
    },
    required: ['topic'],
  },
};

export const sendToTopicHandler = wrapAsyncHandler(async (args: any) => {
  const { topic, title, body, imageUrl, data } = args;
  
  if (!topic) {
    throw new ValidationError('Topic is required');
  }
  
  const messagingService = FirebaseServiceManager.getInstance().getMessagingService();
  
  const message = {
    topic,
    notification: title || body ? {
      title,
      body,
      imageUrl,
    } : undefined,
    data,
  };
  
  const response = await messagingService.sendToTopic(message);
  
  return {
    content: [
      {
        type: 'text',
        text: `FCM message sent successfully to topic!

Message ID: ${response.messageId}
Topic: ${topic}
Title: ${title || 'Not set'}
Body: ${body || 'Not set'}
${imageUrl ? `Image: ${imageUrl}` : ''}
${data ? `Data: ${JSON.stringify(data, null, 2)}` : ''}
Success: ${response.successCount}
Failures: ${response.failureCount}`,
      },
    ],
  };
});

/**
 * Send multicast tool
 */
export const sendMulticastTool: Tool = {
  name: 'fcm_send_multicast',
  description: 'Send FCM message to multiple device tokens',
  inputSchema: {
    type: 'object',
    properties: {
      tokens: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of device FCM tokens (max 500)',
        maxItems: 500,
      },
      title: {
        type: 'string',
        description: 'Notification title',
      },
      body: {
        type: 'string',
        description: 'Notification body',
      },
      imageUrl: {
        type: 'string',
        description: 'Notification image URL',
      },
      data: {
        type: 'object',
        description: 'Custom data payload',
        additionalProperties: { type: 'string' },
      },
    },
    required: ['tokens'],
  },
};

export const sendMulticastHandler = wrapAsyncHandler(async (args: any) => {
  const { tokens, title, body, imageUrl, data } = args;
  
  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    throw new ValidationError('At least one device token is required');
  }
  
  if (tokens.length > 500) {
    throw new ValidationError('Maximum 500 tokens allowed per multicast');
  }
  
  const messagingService = FirebaseServiceManager.getInstance().getMessagingService();
  
  const message = {
    tokens,
    notification: title || body ? {
      title,
      body,
      imageUrl,
    } : undefined,
    data,
  };
  
  const response = await messagingService.sendMulticast(message);
  
  const failedTokens = response.responses?.map((resp, index) => 
    !resp.success ? tokens[index].substring(0, 20) + '...' : null
  ).filter(token => token !== null) || [];
  
  return {
    content: [
      {
        type: 'text',
        text: `FCM multicast message sent!

Total Tokens: ${tokens.length}
Successful: ${response.successCount}
Failed: ${response.failureCount}
Title: ${title || 'Not set'}
Body: ${body || 'Not set'}
${imageUrl ? `Image: ${imageUrl}` : ''}
${data ? `Data: ${JSON.stringify(data, null, 2)}` : ''}
${failedTokens.length > 0 ? `\nFailed tokens: ${failedTokens.join(', ')}` : ''}`,
      },
    ],
  };
});

/**
 * Subscribe to topic tool
 */
export const subscribeToTopicTool: Tool = {
  name: 'fcm_subscribe_to_topic',
  description: 'Subscribe device tokens to an FCM topic',
  inputSchema: {
    type: 'object',
    properties: {
      tokens: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of device FCM tokens (max 1000)',
        maxItems: 1000,
      },
      topic: {
        type: 'string',
        description: 'FCM topic name',
      },
    },
    required: ['tokens', 'topic'],
  },
};

export const subscribeToTopicHandler = wrapAsyncHandler(async (args: any) => {
  const { tokens, topic } = args;
  
  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    throw new ValidationError('At least one device token is required');
  }
  
  if (!topic) {
    throw new ValidationError('Topic is required');
  }
  
  if (tokens.length > 1000) {
    throw new ValidationError('Maximum 1000 tokens allowed per subscription');
  }
  
  const messagingService = FirebaseServiceManager.getInstance().getMessagingService();
  const response = await messagingService.subscribeToTopic(tokens, topic);
  
  return {
    content: [
      {
        type: 'text',
        text: `Tokens subscribed to topic successfully!

Topic: ${topic}
Total Tokens: ${tokens.length}
Successful Subscriptions: ${response.successCount}
Failed Subscriptions: ${response.failureCount}

${response.failureCount > 0 ? 'Some tokens may be invalid or already subscribed.' : 'All tokens subscribed successfully!'}`,
      },
    ],
  };
});

/**
 * Unsubscribe from topic tool
 */
export const unsubscribeFromTopicTool: Tool = {
  name: 'fcm_unsubscribe_from_topic',
  description: 'Unsubscribe device tokens from an FCM topic',
  inputSchema: {
    type: 'object',
    properties: {
      tokens: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of device FCM tokens (max 1000)',
        maxItems: 1000,
      },
      topic: {
        type: 'string',
        description: 'FCM topic name',
      },
    },
    required: ['tokens', 'topic'],
  },
};

export const unsubscribeFromTopicHandler = wrapAsyncHandler(async (args: any) => {
  const { tokens, topic } = args;
  
  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    throw new ValidationError('At least one device token is required');
  }
  
  if (!topic) {
    throw new ValidationError('Topic is required');
  }
  
  if (tokens.length > 1000) {
    throw new ValidationError('Maximum 1000 tokens allowed per unsubscription');
  }
  
  const messagingService = FirebaseServiceManager.getInstance().getMessagingService();
  const response = await messagingService.unsubscribeFromTopic(tokens, topic);
  
  return {
    content: [
      {
        type: 'text',
        text: `Tokens unsubscribed from topic successfully!

Topic: ${topic}
Total Tokens: ${tokens.length}
Successful Unsubscriptions: ${response.successCount}
Failed Unsubscriptions: ${response.failureCount}

${response.failureCount > 0 ? 'Some tokens may be invalid or already unsubscribed.' : 'All tokens unsubscribed successfully!'}`,
      },
    ],
  };
});

/**
 * Send to condition tool
 */
export const sendToConditionTool: Tool = {
  name: 'fcm_send_to_condition',
  description: 'Send FCM message to devices matching a condition',
  inputSchema: {
    type: 'object',
    properties: {
      condition: {
        type: 'string',
        description: 'FCM condition (e.g., "\'TopicA\' in topics && \'TopicB\' in topics")',
      },
      title: {
        type: 'string',
        description: 'Notification title',
      },
      body: {
        type: 'string',
        description: 'Notification body',
      },
      imageUrl: {
        type: 'string',
        description: 'Notification image URL',
      },
      data: {
        type: 'object',
        description: 'Custom data payload',
        additionalProperties: { type: 'string' },
      },
    },
    required: ['condition'],
  },
};

export const sendToConditionHandler = wrapAsyncHandler(async (args: any) => {
  const { condition, title, body, imageUrl, data } = args;
  
  if (!condition) {
    throw new ValidationError('Condition is required');
  }
  
  const messagingService = FirebaseServiceManager.getInstance().getMessagingService();
  
  const message = {
    condition,
    notification: title || body ? {
      title,
      body,
      imageUrl,
    } : undefined,
    data,
  };
  
  const response = await messagingService.sendToCondition(message);
  
  return {
    content: [
      {
        type: 'text',
        text: `FCM message sent successfully to condition!

Message ID: ${response.messageId}
Condition: ${condition}
Title: ${title || 'Not set'}
Body: ${body || 'Not set'}
${imageUrl ? `Image: ${imageUrl}` : ''}
${data ? `Data: ${JSON.stringify(data, null, 2)}` : ''}
Success: ${response.successCount}
Failures: ${response.failureCount}`,
      },
    ],
  };
});

/**
 * Send broadcast tool
 */
export const sendBroadcastTool: Tool = {
  name: 'fcm_send_broadcast',
  description: 'Send FCM message to all devices (broadcast)',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Notification title',
      },
      body: {
        type: 'string',
        description: 'Notification body',
      },
      imageUrl: {
        type: 'string',
        description: 'Notification image URL',
      },
      data: {
        type: 'object',
        description: 'Custom data payload',
        additionalProperties: { type: 'string' },
      },
      priority: {
        type: 'string',
        enum: ['normal', 'high'],
        description: 'Message priority',
        default: 'normal',
      },
    },
  },
};

export const sendBroadcastHandler = wrapAsyncHandler(async (args: any) => {
  const { title, body, imageUrl, data, priority = 'normal' } = args;
  
  const messagingService = FirebaseServiceManager.getInstance().getMessagingService();
  
  const message = {
    notification: title || body ? {
      title,
      body,
      imageUrl,
    } : undefined,
    data,
    android: priority === 'high' ? {
      priority: 'high' as any,
    } : undefined,
  };
  
  const response = await messagingService.sendBroadcast(message);
  
  return {
    content: [
      {
        type: 'text',
        text: `FCM broadcast message sent successfully!

Message ID: ${response.messageId}
Title: ${title || 'Not set'}
Body: ${body || 'Not set'}
Priority: ${priority}
${imageUrl ? `Image: ${imageUrl}` : ''}
${data ? `Data: ${JSON.stringify(data, null, 2)}` : ''}

Note: Broadcast messages are sent to the 'broadcast_all' topic.
Make sure devices are subscribed to this topic to receive the message.`,
      },
    ],
  };
});

/**
 * Validate token tool
 */
export const validateTokenTool: Tool = {
  name: 'fcm_validate_token',
  description: 'Validate FCM device token format',
  inputSchema: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'FCM device token to validate',
      },
    },
    required: ['token'],
  },
};

export const validateTokenHandler = wrapAsyncHandler(async (args: any) => {
  const { token } = args;
  
  if (!token) {
    throw new ValidationError('Token is required');
  }
  
  const messagingService = FirebaseServiceManager.getInstance().getMessagingService();
  const isValid = messagingService.validateToken(token);
  
  return {
    content: [
      {
        type: 'text',
        text: `FCM Token Validation Result:

Token: ${token.substring(0, 30)}...
Valid: ${isValid ? '✅ Yes' : '❌ No'}
Length: ${token.length} characters

${isValid ? 
  'Token format appears valid and can be used for messaging.' : 
  'Token format is invalid. Check that it\'s a proper FCM registration token.'}`,
      },
    ],
  };
});

/**
 * Get service stats tool
 */
export const getServiceStatsTool: Tool = {
  name: 'fcm_get_service_stats',
  description: 'Get Firebase Cloud Messaging service information',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const getServiceStatsHandler = wrapAsyncHandler(async (_args: any) => {
  const messagingService = FirebaseServiceManager.getInstance().getMessagingService();
  const stats = messagingService.getServiceStats();
  
  return {
    content: [
      {
        type: 'text',
        text: `Firebase Cloud Messaging Service Information:

Service: ${stats.service}

Available Features:
${stats.features.map((feature: string) => `• ${feature}`).join('\n')}

Service Limits:
• Multicast tokens: ${stats.limits.multicastTokens}
• Subscription tokens: ${stats.limits.subscriptionTokens}
• Maximum message size: ${stats.limits.messageSize}
• Topic name length: ${stats.limits.topicNameLength} characters

FCM is ready for push notifications across platforms!`,
      },
    ],
  };
});

/**
 * All FCM tools
 */
export const messagingTools: Tool[] = [
  sendToTokenTool,
  sendToTopicTool,
  sendMulticastTool,
  subscribeToTopicTool,
  unsubscribeFromTopicTool,
  sendToConditionTool,
  sendBroadcastTool,
  validateTokenTool,
  getServiceStatsTool,
];

/**
 * FCM tool handlers map
 */
export const messagingToolHandlers = {
  fcm_send_to_token: sendToTokenHandler,
  fcm_send_to_topic: sendToTopicHandler,
  fcm_send_multicast: sendMulticastHandler,
  fcm_subscribe_to_topic: subscribeToTopicHandler,
  fcm_unsubscribe_from_topic: unsubscribeFromTopicHandler,
  fcm_send_to_condition: sendToConditionHandler,
  fcm_send_broadcast: sendBroadcastHandler,
  fcm_validate_token: validateTokenHandler,
  fcm_get_service_stats: getServiceStatsHandler,
};