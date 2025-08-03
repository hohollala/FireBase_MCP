/**
 * Firebase Authentication MCP Tools
 * 
 * MCP tools for Firebase Authentication operations
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { FirebaseServiceManager } from '@firebase/index';
import { wrapAsyncHandler, ValidationError } from '@utils/index';

/**
 * Create user tool
 */
export const createUserTool: Tool = {
  name: 'firebase_auth_create_user',
  description: 'Create a new Firebase user account',
  inputSchema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'User password (min 6 characters)',
      },
      displayName: {
        type: 'string',
        description: 'User display name',
      },
      phoneNumber: {
        type: 'string',
        description: 'User phone number',
      },
      emailVerified: {
        type: 'boolean',
        description: 'Whether email is verified',
        default: false,
      },
      disabled: {
        type: 'boolean',
        description: 'Whether user account is disabled',
        default: false,
      },
    },
    required: ['email'],
  },
};

export const createUserHandler = wrapAsyncHandler(async (args: any) => {
  const authService = FirebaseServiceManager.getInstance().getAuthService();
  
  const userRecord = await authService.createUser(args);
  
  return {
    content: [
      {
        type: 'text',
        text: `User created successfully!\n\nUID: ${userRecord.uid}\nEmail: ${userRecord.email}\nDisplay Name: ${userRecord.displayName || 'Not set'}\nEmail Verified: ${userRecord.emailVerified}\nDisabled: ${userRecord.disabled}\nCreated: ${userRecord.metadata.creationTime}`,
      },
    ],
  };
});

/**
 * Get user tool
 */
export const getUserTool: Tool = {
  name: 'firebase_auth_get_user',
  description: 'Get Firebase user by UID',
  inputSchema: {
    type: 'object',
    properties: {
      uid: {
        type: 'string',
        description: 'User UID',
      },
    },
    required: ['uid'],
  },
};

export const getUserHandler = wrapAsyncHandler(async (args: any) => {
  const { uid } = args;
  
  if (!uid) {
    throw new ValidationError('UID is required');
  }
  
  const authService = FirebaseServiceManager.getInstance().getAuthService();
  const userRecord = await authService.getUser(uid);
  
  return {
    content: [
      {
        type: 'text',
        text: `User found!\n\nUID: ${userRecord.uid}\nEmail: ${userRecord.email || 'Not set'}\nDisplay Name: ${userRecord.displayName || 'Not set'}\nPhone: ${userRecord.phoneNumber || 'Not set'}\nEmail Verified: ${userRecord.emailVerified}\nDisabled: ${userRecord.disabled}\nCreated: ${userRecord.metadata.creationTime}\nLast Sign In: ${userRecord.metadata.lastSignInTime || 'Never'}`,
      },
    ],
  };
});

/**
 * Get user by email tool
 */
export const getUserByEmailTool: Tool = {
  name: 'firebase_auth_get_user_by_email',
  description: 'Get Firebase user by email address',
  inputSchema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
    },
    required: ['email'],
  },
};

export const getUserByEmailHandler = wrapAsyncHandler(async (args: any) => {
  const { email } = args;
  
  if (!email) {
    throw new ValidationError('Email is required');
  }
  
  const authService = FirebaseServiceManager.getInstance().getAuthService();
  const userRecord = await authService.getUserByEmail(email);
  
  return {
    content: [
      {
        type: 'text',
        text: `User found!\n\nUID: ${userRecord.uid}\nEmail: ${userRecord.email}\nDisplay Name: ${userRecord.displayName || 'Not set'}\nPhone: ${userRecord.phoneNumber || 'Not set'}\nEmail Verified: ${userRecord.emailVerified}\nDisabled: ${userRecord.disabled}\nCreated: ${userRecord.metadata.creationTime}\nLast Sign In: ${userRecord.metadata.lastSignInTime || 'Never'}`,
      },
    ],
  };
});

/**
 * Update user tool
 */
export const updateUserTool: Tool = {
  name: 'firebase_auth_update_user',
  description: 'Update Firebase user account',
  inputSchema: {
    type: 'object',
    properties: {
      uid: {
        type: 'string',
        description: 'User UID',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'New email address',
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'New password (min 6 characters)',
      },
      displayName: {
        type: 'string',
        description: 'New display name',
      },
      phoneNumber: {
        type: 'string',
        description: 'New phone number',
      },
      emailVerified: {
        type: 'boolean',
        description: 'Email verification status',
      },
      disabled: {
        type: 'boolean',
        description: 'Account disabled status',
      },
    },
    required: ['uid'],
  },
};

export const updateUserHandler = wrapAsyncHandler(async (args: any) => {
  const { uid, ...updateData } = args;
  
  if (!uid) {
    throw new ValidationError('UID is required');
  }
  
  const authService = FirebaseServiceManager.getInstance().getAuthService();
  const userRecord = await authService.updateUser(uid, updateData);
  
  return {
    content: [
      {
        type: 'text',
        text: `User updated successfully!\n\nUID: ${userRecord.uid}\nEmail: ${userRecord.email || 'Not set'}\nDisplay Name: ${userRecord.displayName || 'Not set'}\nPhone: ${userRecord.phoneNumber || 'Not set'}\nEmail Verified: ${userRecord.emailVerified}\nDisabled: ${userRecord.disabled}`,
      },
    ],
  };
});

/**
 * Delete user tool
 */
export const deleteUserTool: Tool = {
  name: 'firebase_auth_delete_user',
  description: 'Delete Firebase user account',
  inputSchema: {
    type: 'object',
    properties: {
      uid: {
        type: 'string',
        description: 'User UID to delete',
      },
    },
    required: ['uid'],
  },
};

export const deleteUserHandler = wrapAsyncHandler(async (args: any) => {
  const { uid } = args;
  
  if (!uid) {
    throw new ValidationError('UID is required');
  }
  
  const authService = FirebaseServiceManager.getInstance().getAuthService();
  await authService.deleteUser(uid);
  
  return {
    content: [
      {
        type: 'text',
        text: `User deleted successfully!\n\nUID: ${uid}`,
      },
    ],
  };
});

/**
 * List users tool
 */
export const listUsersTool: Tool = {
  name: 'firebase_auth_list_users',
  description: 'List Firebase users with pagination',
  inputSchema: {
    type: 'object',
    properties: {
      maxResults: {
        type: 'number',
        minimum: 1,
        maximum: 1000,
        description: 'Maximum number of users to return (1-1000)',
        default: 100,
      },
      pageToken: {
        type: 'string',
        description: 'Page token for pagination',
      },
    },
  },
};

export const listUsersHandler = wrapAsyncHandler(async (args: any) => {
  const { maxResults = 100, pageToken } = args;
  
  const authService = FirebaseServiceManager.getInstance().getAuthService();
  const result = await authService.listUsers({ maxResults, pageToken });
  
  const userList = result.users.map(user => 
    `• ${user.uid} - ${user.email || 'No email'} - ${user.displayName || 'No name'} - ${user.disabled ? 'Disabled' : 'Active'}`
  ).join('\n');
  
  return {
    content: [
      {
        type: 'text',
        text: `Found ${result.users.length} users:\n\n${userList}\n\nHas more pages: ${!!result.pageToken}\nNext page token: ${result.pageToken || 'None'}`,
      },
    ],
  };
});

/**
 * Set custom claims tool
 */
export const setCustomClaimsTool: Tool = {
  name: 'firebase_auth_set_custom_claims',
  description: 'Set custom claims for Firebase user',
  inputSchema: {
    type: 'object',
    properties: {
      uid: {
        type: 'string',
        description: 'User UID',
      },
      claims: {
        type: 'object',
        description: 'Custom claims object',
        additionalProperties: true,
      },
    },
    required: ['uid', 'claims'],
  },
};

export const setCustomClaimsHandler = wrapAsyncHandler(async (args: any) => {
  const { uid, claims } = args;
  
  if (!uid) {
    throw new ValidationError('UID is required');
  }
  
  if (!claims || typeof claims !== 'object') {
    throw new ValidationError('Claims must be an object');
  }
  
  const authService = FirebaseServiceManager.getInstance().getAuthService();
  await authService.setCustomUserClaims(uid, claims);
  
  return {
    content: [
      {
        type: 'text',
        text: `Custom claims set successfully!\n\nUID: ${uid}\nClaims: ${JSON.stringify(claims, null, 2)}`,
      },
    ],
  };
});

/**
 * Create custom token tool
 */
export const createCustomTokenTool: Tool = {
  name: 'firebase_auth_create_custom_token',
  description: 'Create custom authentication token for Firebase user',
  inputSchema: {
    type: 'object',
    properties: {
      uid: {
        type: 'string',
        description: 'User UID',
      },
      claims: {
        type: 'object',
        description: 'Additional claims to include in token',
        additionalProperties: true,
      },
    },
    required: ['uid'],
  },
};

export const createCustomTokenHandler = wrapAsyncHandler(async (args: any) => {
  const { uid, claims } = args;
  
  if (!uid) {
    throw new ValidationError('UID is required');
  }
  
  const authService = FirebaseServiceManager.getInstance().getAuthService();
  const customToken = await authService.createCustomToken(uid, claims);
  
  return {
    content: [
      {
        type: 'text',
        text: `Custom token created successfully!\n\nUID: ${uid}\nToken: ${customToken}\nWith claims: ${claims ? JSON.stringify(claims, null, 2) : 'None'}`,
      },
    ],
  };
});

/**
 * All authentication tools
 */
export const authTools: Tool[] = [
  createUserTool,
  getUserTool,
  getUserByEmailTool,
  updateUserTool,
  deleteUserTool,
  listUsersTool,
  setCustomClaimsTool,
  createCustomTokenTool,
];

/**
 * Authentication tool handlers map
 */
export const authToolHandlers = {
  firebase_auth_create_user: createUserHandler,
  firebase_auth_get_user: getUserHandler,
  firebase_auth_get_user_by_email: getUserByEmailHandler,
  firebase_auth_update_user: updateUserHandler,
  firebase_auth_delete_user: deleteUserHandler,
  firebase_auth_list_users: listUsersHandler,
  firebase_auth_set_custom_claims: setCustomClaimsHandler,
  firebase_auth_create_custom_token: createCustomTokenHandler,
};