/**
 * Firebase Realtime Database Service
 * 
 * Handles Firebase Realtime Database operations
 */

import * as admin from 'firebase-admin';
import { logger, FirebaseError, NotFoundError, ValidationError } from '@utils/index';

export interface RealtimeData {
  path: string;
  value: any;
  key?: string | null;
}

export interface RTDBQueryOptions {
  orderBy?: 'key' | 'value' | string;
  limitToFirst?: number;
  limitToLast?: number;
  startAt?: any;
  startAfter?: any;
  endAt?: any;
  endBefore?: any;
  equalTo?: any;
}

export interface ListenerCallback {
  (snapshot: admin.database.DataSnapshot, prevChildKey?: string | null): void;
}

export class RealtimeDatabaseService {
  private database: admin.database.Database;

  constructor(app: admin.app.App) {
    this.database = app.database();
  }

  /**
   * Set data at a path
   */
  async setData(path: string, value: any): Promise<RealtimeData> {
    try {
      if (!path) {
        throw new ValidationError('Path is required');
      }

      const ref = this.database.ref(path);
      await ref.set(value);

      logger.info('Data set successfully', { path, hasValue: value !== null });

      return {
        path,
        value,
        key: ref.key,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to set data', { error, path, value });
      throw new FirebaseError(
        `Failed to set data: ${error.message}`,
        'DATABASE_SET_FAILED',
        error
      );
    }
  }

  /**
   * Update data at a path
   */
  async updateData(path: string, updates: Record<string, any>): Promise<RealtimeData> {
    try {
      if (!path) {
        throw new ValidationError('Path is required');
      }

      if (!updates || typeof updates !== 'object') {
        throw new ValidationError('Updates must be an object');
      }

      const ref = this.database.ref(path);
      await ref.update(updates);

      // Get the updated data
      const snapshot = await ref.once('value');
      const value = snapshot.val();

      logger.info('Data updated successfully', { path, updateKeys: Object.keys(updates) });

      return {
        path,
        value,
        key: ref.key,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to update data', { error, path, updates });
      throw new FirebaseError(
        `Failed to update data: ${error.message}`,
        'DATABASE_UPDATE_FAILED',
        error
      );
    }
  }

  /**
   * Get data from a path
   */
  async getData(path: string): Promise<RealtimeData> {
    try {
      if (!path) {
        throw new ValidationError('Path is required');
      }

      const ref = this.database.ref(path);
      const snapshot = await ref.once('value');

      if (!snapshot.exists()) {
        throw new NotFoundError(`No data found at path: ${path}`);
      }

      const value = snapshot.val();

      logger.debug('Data retrieved successfully', { path, hasValue: value !== null });

      return {
        path,
        value,
        key: snapshot.key,
      };
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to get data', { error, path });
      throw new FirebaseError(
        `Failed to get data: ${error.message}`,
        'DATABASE_GET_FAILED',
        error
      );
    }
  }

  /**
   * Delete data at a path
   */
  async deleteData(path: string): Promise<void> {
    try {
      if (!path) {
        throw new ValidationError('Path is required');
      }

      const ref = this.database.ref(path);
      
      // Check if data exists
      const snapshot = await ref.once('value');
      if (!snapshot.exists()) {
        throw new NotFoundError(`No data found at path: ${path}`);
      }

      await ref.remove();

      logger.info('Data deleted successfully', { path });
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to delete data', { error, path });
      throw new FirebaseError(
        `Failed to delete data: ${error.message}`,
        'DATABASE_DELETE_FAILED',
        error
      );
    }
  }

  /**
   * Push data to a path (auto-generated key)
   */
  async pushData(path: string, value: any): Promise<RealtimeData> {
    try {
      if (!path) {
        throw new ValidationError('Path is required');
      }

      const ref = this.database.ref(path);
      const childRef = await ref.push(value);

      logger.info('Data pushed successfully', { 
        path, 
        generatedKey: childRef.key,
        hasValue: value !== null 
      });

      return {
        path: `${path}/${childRef.key}`,
        value,
        key: childRef.key,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to push data', { error, path, value });
      throw new FirebaseError(
        `Failed to push data: ${error.message}`,
        'DATABASE_PUSH_FAILED',
        error
      );
    }
  }

  /**
   * Query data with filters
   */
  async queryData(path: string, options: RTDBQueryOptions = {}): Promise<RealtimeData[]> {
    try {
      if (!path) {
        throw new ValidationError('Path is required');
      }

      let query: admin.database.Query = this.database.ref(path);

      // Apply ordering
      if (options.orderBy) {
        switch (options.orderBy) {
          case 'key':
            query = query.orderByKey();
            break;
          case 'value':
            query = query.orderByValue();
            break;
          default:
            query = query.orderByChild(options.orderBy);
            break;
        }
      }

      // Apply range filters
      if (options.startAt !== undefined) {
        query = query.startAt(options.startAt);
      }
      if (options.startAfter !== undefined) {
        query = query.startAfter(options.startAfter);
      }
      if (options.endAt !== undefined) {
        query = query.endAt(options.endAt);
      }
      if (options.endBefore !== undefined) {
        query = query.endBefore(options.endBefore);
      }
      if (options.equalTo !== undefined) {
        query = query.equalTo(options.equalTo);
      }

      // Apply limits
      if (options.limitToFirst) {
        query = query.limitToFirst(options.limitToFirst);
      }
      if (options.limitToLast) {
        query = query.limitToLast(options.limitToLast);
      }

      const snapshot = await query.once('value');
      const results: RealtimeData[] = [];

      snapshot.forEach(childSnapshot => {
        results.push({
          path: childSnapshot.ref.toString().replace(this.database.ref().toString(), ''),
          value: childSnapshot.val(),
          key: childSnapshot.key,
        });
        return false; // Continue iteration
      });

      logger.debug('Data queried successfully', { 
        path, 
        resultCount: results.length,
        options 
      });

      return results;
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to query data', { error, path, options });
      throw new FirebaseError(
        `Failed to query data: ${error.message}`,
        'DATABASE_QUERY_FAILED',
        error
      );
    }
  }

  /**
   * Add a listener for data changes
   */
  addListener(
    path: string,
    eventType: 'value' | 'child_added' | 'child_changed' | 'child_removed' | 'child_moved',
    callback: ListenerCallback
  ): () => void {
    try {
      if (!path) {
        throw new ValidationError('Path is required');
      }

      const ref = this.database.ref(path);
      
      ref.on(eventType, callback);

      logger.info('Listener added successfully', { path, eventType });

      // Return unsubscribe function
      return () => {
        ref.off(eventType, callback);
        logger.info('Listener removed', { path, eventType });
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to add listener', { error, path, eventType });
      throw new FirebaseError(
        `Failed to add listener: ${error.message}`,
        'DATABASE_LISTENER_FAILED',
        error
      );
    }
  }

  /**
   * Remove all listeners from a path
   */
  removeAllListeners(path: string, eventType?: string): void {
    try {
      if (!path) {
        throw new ValidationError('Path is required');
      }

      const ref = this.database.ref(path);
      
      if (eventType) {
        ref.off(eventType as any);
      } else {
        ref.off();
      }

      logger.info('Listeners removed successfully', { path, eventType });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to remove listeners', { error, path, eventType });
      throw new FirebaseError(
        `Failed to remove listeners: ${error.message}`,
        'DATABASE_REMOVE_LISTENERS_FAILED',
        error
      );
    }
  }

  /**
   * Perform a transaction
   */
  async transaction(
    path: string,
    updateFunction: (currentData: any) => any
  ): Promise<{ committed: boolean; snapshot: RealtimeData | null }> {
    try {
      if (!path) {
        throw new ValidationError('Path is required');
      }

      if (typeof updateFunction !== 'function') {
        throw new ValidationError('Update function is required');
      }

      const ref = this.database.ref(path);
      
      const result = await ref.transaction(updateFunction);

      logger.info('Transaction completed', { 
        path, 
        committed: result.committed,
        hasSnapshot: result.snapshot !== null 
      });

      return {
        committed: result.committed,
        snapshot: result.snapshot ? {
          path,
          value: result.snapshot.val(),
          key: result.snapshot.key,
        } : null,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to perform transaction', { error, path });
      throw new FirebaseError(
        `Failed to perform transaction: ${error.message}`,
        'DATABASE_TRANSACTION_FAILED',
        error
      );
    }
  }

  /**
   * Check if data exists at a path
   */
  async exists(path: string): Promise<boolean> {
    try {
      if (!path) {
        throw new ValidationError('Path is required');
      }

      const ref = this.database.ref(path);
      const snapshot = await ref.once('value');

      const exists = snapshot.exists();

      logger.debug('Existence check completed', { path, exists });

      return exists;
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to check existence', { error, path });
      throw new FirebaseError(
        `Failed to check existence: ${error.message}`,
        'DATABASE_EXISTS_FAILED',
        error
      );
    }
  }

  /**
   * Get the database reference URL
   */
  getDatabaseUrl(): string {
    return this.database.ref().toString();
  }

  /**
   * Go offline (disconnect from Firebase)
   */
  goOffline(): void {
    try {
      this.database.goOffline();
      logger.info('Database went offline');
    } catch (error: any) {
      logger.error('Failed to go offline', { error });
      throw new FirebaseError(
        `Failed to go offline: ${error.message}`,
        'DATABASE_OFFLINE_FAILED',
        error
      );
    }
  }

  /**
   * Go online (reconnect to Firebase)
   */
  goOnline(): void {
    try {
      this.database.goOnline();
      logger.info('Database went online');
    } catch (error: any) {
      logger.error('Failed to go online', { error });
      throw new FirebaseError(
        `Failed to go online: ${error.message}`,
        'DATABASE_ONLINE_FAILED',
        error
      );
    }
  }
}