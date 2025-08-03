/**
 * Firebase Authentication Service
 * 
 * Handles Firebase Authentication operations
 */

import * as admin from 'firebase-admin';
import { logger, validateFirebaseUser, FirebaseError, NotFoundError } from '@utils/index';

export interface CreateUserData {
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  password?: string;
  displayName?: string;
  photoURL?: string;
  disabled?: boolean;
}

export interface UpdateUserData {
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  password?: string;
  displayName?: string;
  photoURL?: string;
  disabled?: boolean;
  customClaims?: Record<string, any>;
}

export interface ListUsersOptions {
  maxResults?: number;
  pageToken?: string;
}

export class AuthService {
  private auth: admin.auth.Auth;

  constructor(app: admin.app.App) {
    this.auth = app.auth();
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserData): Promise<admin.auth.UserRecord> {
    try {
      validateFirebaseUser(userData);

      const userRecord = await this.auth.createUser(userData);

      logger.info('User created successfully', {
        uid: userRecord.uid,
        email: userRecord.email,
      });

      return userRecord;
    } catch (error: any) {
      logger.error('Failed to create user', { error, userData });
      throw new FirebaseError(
        `Failed to create user: ${error.message}`,
        'USER_CREATION_FAILED',
        error
      );
    }
  }

  /**
   * Get user by UID
   */
  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      const userRecord = await this.auth.getUser(uid);

      logger.debug('User retrieved successfully', { uid });

      return userRecord;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundError(`User not found: ${uid}`);
      }

      logger.error('Failed to get user', { error, uid });
      throw new FirebaseError(
        `Failed to get user: ${error.message}`,
        'USER_RETRIEVAL_FAILED',
        error
      );
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
    try {
      const userRecord = await this.auth.getUserByEmail(email);

      logger.debug('User retrieved by email successfully', { email });

      return userRecord;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundError(`User not found with email: ${email}`);
      }

      logger.error('Failed to get user by email', { error, email });
      throw new FirebaseError(
        `Failed to get user by email: ${error.message}`,
        'USER_RETRIEVAL_FAILED',
        error
      );
    }
  }

  /**
   * Update user
   */
  async updateUser(uid: string, userData: UpdateUserData): Promise<admin.auth.UserRecord> {
    try {
      validateFirebaseUser(userData);

      const userRecord = await this.auth.updateUser(uid, userData);

      logger.info('User updated successfully', {
        uid: userRecord.uid,
        email: userRecord.email,
      });

      return userRecord;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundError(`User not found: ${uid}`);
      }

      logger.error('Failed to update user', { error, uid, userData });
      throw new FirebaseError(
        `Failed to update user: ${error.message}`,
        'USER_UPDATE_FAILED',
        error
      );
    }
  }

  /**
   * Delete user
   */
  async deleteUser(uid: string): Promise<void> {
    try {
      await this.auth.deleteUser(uid);

      logger.info('User deleted successfully', { uid });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundError(`User not found: ${uid}`);
      }

      logger.error('Failed to delete user', { error, uid });
      throw new FirebaseError(
        `Failed to delete user: ${error.message}`,
        'USER_DELETION_FAILED',
        error
      );
    }
  }

  /**
   * List users
   */
  async listUsers(options: ListUsersOptions = {}): Promise<admin.auth.ListUsersResult> {
    try {
      const listUsersResult = await this.auth.listUsers(
        options.maxResults || 1000,
        options.pageToken
      );

      logger.debug('Users listed successfully', {
        userCount: listUsersResult.users.length,
        hasNextPage: !!listUsersResult.pageToken,
      });

      return listUsersResult;
    } catch (error: any) {
      logger.error('Failed to list users', { error, options });
      throw new FirebaseError(
        `Failed to list users: ${error.message}`,
        'USER_LIST_FAILED',
        error
      );
    }
  }

  /**
   * Set custom user claims
   */
  async setCustomUserClaims(uid: string, customClaims: Record<string, any>): Promise<void> {
    try {
      await this.auth.setCustomUserClaims(uid, customClaims);

      logger.info('Custom claims set successfully', {
        uid,
        claims: Object.keys(customClaims),
      });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundError(`User not found: ${uid}`);
      }

      logger.error('Failed to set custom claims', { error, uid, customClaims });
      throw new FirebaseError(
        `Failed to set custom claims: ${error.message}`,
        'CUSTOM_CLAIMS_FAILED',
        error
      );
    }
  }

  /**
   * Create custom token
   */
  async createCustomToken(uid: string, developerClaims?: Record<string, any>): Promise<string> {
    try {
      const customToken = await this.auth.createCustomToken(uid, developerClaims);

      logger.info('Custom token created successfully', {
        uid,
        hasClaims: !!developerClaims,
      });

      return customToken;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundError(`User not found: ${uid}`);
      }

      logger.error('Failed to create custom token', { error, uid, developerClaims });
      throw new FirebaseError(
        `Failed to create custom token: ${error.message}`,
        'CUSTOM_TOKEN_FAILED',
        error
      );
    }
  }

  /**
   * Verify ID token
   */
  async verifyIdToken(idToken: string, checkRevoked = false): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await this.auth.verifyIdToken(idToken, checkRevoked);

      logger.debug('ID token verified successfully', {
        uid: decodedToken.uid,
        checkRevoked,
      });

      return decodedToken;
    } catch (error: any) {
      logger.error('Failed to verify ID token', { error, checkRevoked });
      throw new FirebaseError(
        `Failed to verify ID token: ${error.message}`,
        'TOKEN_VERIFICATION_FAILED',
        error
      );
    }
  }

  /**
   * Revoke refresh tokens for a user
   */
  async revokeRefreshTokens(uid: string): Promise<void> {
    try {
      await this.auth.revokeRefreshTokens(uid);

      logger.info('Refresh tokens revoked successfully', { uid });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new NotFoundError(`User not found: ${uid}`);
      }

      logger.error('Failed to revoke refresh tokens', { error, uid });
      throw new FirebaseError(
        `Failed to revoke refresh tokens: ${error.message}`,
        'TOKEN_REVOCATION_FAILED',
        error
      );
    }
  }
}