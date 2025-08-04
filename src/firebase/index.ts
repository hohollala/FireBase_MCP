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
import { AnalyticsService } from './analytics.service';
import { MessagingService } from './messaging.service';
import { HostingService } from './hosting.service';
import { RemoteConfigService } from './remote-config.service';
import { PerformanceService } from './performance.service';
import { PermissionManager } from '../utils/permission-manager';

export class FirebaseServiceManager {
  private static instance: FirebaseServiceManager;
  private app: admin.app.App | null = null;
  private authService: AuthService | null = null;
  private firestoreService: FirestoreService | null = null;
  private storageService: StorageService | null = null;
  private functionsService: FunctionsService | null = null;
  private realtimeDatabaseService: RealtimeDatabaseService | null = null;
  private analyticsService: AnalyticsService | null = null;
  private messagingService: MessagingService | null = null;
  private hostingService: HostingService | null = null;
  private remoteConfigService: RemoteConfigService | null = null;
  private performanceService: PerformanceService | null = null;
  private permissionManager: PermissionManager | null = null;

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

      // Check if Firebase configuration is available
      if (!config.firebase.projectId || config.firebase.projectId === '') {
        logger.info('Firebase project ID not configured - skipping Firebase initialization');
        return;
      }

      // Check if service account file exists
      const fs = require('fs');
      const path = require('path');
      const serviceAccountPath = path.resolve(config.firebase.serviceAccountKeyPath);
      
      if (!fs.existsSync(serviceAccountPath)) {
        logger.info('Firebase service account file not found - skipping Firebase initialization');
        return;
      }

      // Load service account key
      const serviceAccount = require(serviceAccountPath);

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
      this.analyticsService = new AnalyticsService(this.app);
      this.messagingService = new MessagingService(this.app);
      this.hostingService = new HostingService(this.app);
      this.remoteConfigService = new RemoteConfigService(this.app);
      this.performanceService = new PerformanceService(this.app);
      this.permissionManager = new PermissionManager();

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
   * Get Analytics service
   */
  getAnalyticsService(): AnalyticsService {
    if (!this.analyticsService) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.analyticsService;
  }

  /**
   * Get Messaging service
   */
  getMessagingService(): MessagingService {
    if (!this.messagingService) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.messagingService;
  }

  /**
   * Get Hosting service
   */
  getHostingService(): HostingService {
    if (!this.hostingService) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.hostingService;
  }

  /**
   * Get Remote Config service
   */
  getRemoteConfigService(): RemoteConfigService {
    if (!this.remoteConfigService) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.remoteConfigService;
  }

  /**
   * Get Performance service
   */
  getPerformanceService(): PerformanceService {
    if (!this.performanceService) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.performanceService;
  }

  /**
   * Get Permission Manager
   */
  getPermissionManager(): PermissionManager {
    if (!this.permissionManager) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return this.permissionManager;
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
      this.analyticsService = null;
      this.messagingService = null;
      this.hostingService = null;
      this.remoteConfigService = null;
      this.performanceService = null;
      this.permissionManager = null;
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
export * from './analytics.service';
export * from './messaging.service';
export * from './hosting.service';
export * from './remote-config.service';
export * from './performance.service';