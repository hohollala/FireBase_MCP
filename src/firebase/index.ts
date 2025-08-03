/**
 * Firebase Service Manager
 * 
 * Central manager for all Firebase services
 */

import * as admin from 'firebase-admin';
import { logger, config } from '@utils/index';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import { StorageService } from './storage.service';
import { FunctionsService } from './functions.service';
import { RealtimeDatabaseService } from './realtime-database.service';

export class FirebaseServiceManager {
  private static instance: FirebaseServiceManager;
  private app: admin.app.App | null = null;
  private authService: AuthService | null = null;
  private firestoreService: FirestoreService | null = null;
  private storageService: StorageService | null = null;
  private functionsService: FunctionsService | null = null;
  private realtimeDatabaseService: RealtimeDatabaseService | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): FirebaseServiceManager {
    if (!FirebaseServiceManager.instance) {
      FirebaseServiceManager.instance = new FirebaseServiceManager();
    }
    return FirebaseServiceManager.instance;
  }

  /**
   * Initialize Firebase Admin SDK
   */
  async initialize(): Promise<void> {
    try {
      // Skip initialization in test environment
      if (config.isTest) {
        logger.info('Skipping Firebase initialization in test environment');
        return;
      }

      // Check if already initialized
      if (this.app) {
        logger.warn('Firebase already initialized');
        return;
      }

      // Load service account key
      const serviceAccount = require(config.firebase.serviceAccountKeyPath);

      // Initialize Firebase Admin SDK
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: config.firebase.projectId,
      });

      // Initialize services
      this.authService = new AuthService(this.app);
      this.firestoreService = new FirestoreService(this.app);
      this.storageService = new StorageService(this.app);
      this.functionsService = new FunctionsService(this.app);
      this.realtimeDatabaseService = new RealtimeDatabaseService(this.app);

      logger.info('Firebase Admin SDK initialized successfully', {
        projectId: config.firebase.projectId,
      });
    } catch (error) {
      logger.error('Failed to initialize Firebase Admin SDK', { error });
      throw error;
    }
  }

  /**
   * Get Firebase app instance
   */
  getApp(): admin.app.App {
    if (!this.app) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.app;
  }

  /**
   * Get Auth service
   */
  getAuthService(): AuthService {
    if (!this.authService) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.authService;
  }

  /**
   * Get Firestore service
   */
  getFirestoreService(): FirestoreService {
    if (!this.firestoreService) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.firestoreService;
  }

  /**
   * Get Storage service
   */
  getStorageService(): StorageService {
    if (!this.storageService) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.storageService;
  }

  /**
   * Get Functions service
   */
  getFunctionsService(): FunctionsService {
    if (!this.functionsService) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.functionsService;
  }

  /**
   * Get Realtime Database service
   */
  getRealtimeDatabaseService(): RealtimeDatabaseService {
    if (!this.realtimeDatabaseService) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.realtimeDatabaseService;
  }

  /**
   * Cleanup Firebase resources
   */
  async cleanup(): Promise<void> {
    if (this.app) {
      await this.app.delete();
      this.app = null;
      this.authService = null;
      this.firestoreService = null;
      this.storageService = null;
      this.functionsService = null;
      this.realtimeDatabaseService = null;
      logger.info('Firebase resources cleaned up');
    }
  }
}

// Export services for easy access
export * from './auth.service';
export * from './firestore.service';
export * from './storage.service';
export * from './functions.service';
export * from './realtime-database.service';