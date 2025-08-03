/**
 * Error Handling Utility
 * 
 * Provides centralized error handling and formatting for MCP responses
 */

import { logger } from './logger';

/**
 * Base error class for Firebase MCP Server
 */
export class FirebaseMCPError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, code: string, statusCode = 500, details?: any) {
    super(message);
    this.name = 'FirebaseMCPError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    
    // Maintain proper stack trace
    Error.captureStackTrace(this, FirebaseMCPError);
  }
}

/**
 * MCP-specific error types
 */
export class MCPError extends FirebaseMCPError {
  constructor(message: string, code: string, details?: any) {
    super(message, code, 400, details);
    this.name = 'MCPError';
  }
}

export class FirebaseError extends FirebaseMCPError {
  constructor(message: string, code: string, details?: any) {
    super(message, code, 500, details);
    this.name = 'FirebaseError';
  }
}

export class ValidationError extends FirebaseMCPError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends FirebaseMCPError {
  constructor(message: string, details?: any) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends FirebaseMCPError {
  constructor(message: string, details?: any) {
    super(message, 'AUTHORIZATION_ERROR', 403, details);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends FirebaseMCPError {
  constructor(message: string, details?: any) {
    super(message, 'NOT_FOUND', 404, details);
    this.name = 'NotFoundError';
  }
}

/**
 * Error handler for MCP tool calls
 */
export function handleMCPError(error: any): any {
  // Log the error
  logger.error('MCP Error occurred', {
    error: error.message,
    stack: error.stack,
    code: error.code,
    details: error.details,
  });

  // Format error for MCP response
  if (error instanceof FirebaseMCPError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  // Handle Firebase Admin SDK errors
  if (error.code && error.code.startsWith('auth/')) {
    return {
      error: {
        code: 'FIREBASE_AUTH_ERROR',
        message: error.message,
        details: { firebaseCode: error.code },
      },
    };
  }

  if (error.code && error.code.startsWith('firestore/')) {
    return {
      error: {
        code: 'FIREBASE_FIRESTORE_ERROR',
        message: error.message,
        details: { firebaseCode: error.code },
      },
    };
  }

  // Handle unknown errors
  return {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: {
        originalMessage: error.message,
      },
    },
  };
}

/**
 * Async error wrapper for MCP tools
 */
export function wrapAsyncHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
): (...args: T) => Promise<R | { error: any }> {
  return async (...args: T): Promise<R | { error: any }> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleMCPError(error);
    }
  };
}