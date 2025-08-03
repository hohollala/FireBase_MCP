/**
 * Firebase Firestore Service
 * 
 * Handles Firebase Firestore operations
 */

import * as admin from 'firebase-admin';
import { logger, FirebaseError, NotFoundError, ValidationError } from '@utils/index';

export interface FirestoreDocument {
  id?: string;
  data: Record<string, any>;
}

export interface QueryOptions {
  where?: Array<{
    field: string;
    operator: FirebaseFirestore.WhereFilterOp;
    value: any;
  }>;
  orderBy?: Array<{
    field: string;
    direction?: 'asc' | 'desc';
  }>;
  limit?: number;
  offset?: number;
}

export interface BatchOperation {
  type: 'set' | 'update' | 'delete';
  collection: string;
  documentId: string;
  data?: Record<string, any>;
  merge?: boolean;
}

export class FirestoreService {
  private firestore: admin.firestore.Firestore;

  constructor(app: admin.app.App) {
    this.firestore = app.firestore();
  }

  /**
   * Get a document
   */
  async getDocument(collection: string, documentId: string): Promise<FirestoreDocument> {
    try {
      if (!collection || !documentId) {
        throw new ValidationError('Collection and document ID are required');
      }

      const docRef = this.firestore.collection(collection).doc(documentId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundError(`Document not found: ${collection}/${documentId}`);
      }

      const data = doc.data();
      if (!data) {
        throw new NotFoundError(`Document has no data: ${collection}/${documentId}`);
      }

      logger.debug('Document retrieved successfully', {
        collection,
        documentId,
      });

      return {
        id: doc.id,
        data,
      };
    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to get document', { error, collection, documentId });
      throw new FirebaseError(
        `Failed to get document: ${error.message}`,
        'DOCUMENT_GET_FAILED',
        error
      );
    }
  }

  /**
   * Set a document (create or replace)
   */
  async setDocument(
    collection: string,
    documentId: string,
    data: Record<string, any>,
    merge = false
  ): Promise<FirestoreDocument> {
    try {
      if (!collection || !documentId) {
        throw new ValidationError('Collection and document ID are required');
      }

      if (!data || typeof data !== 'object') {
        throw new ValidationError('Document data must be an object');
      }

      const docRef = this.firestore.collection(collection).doc(documentId);
      await docRef.set(data, { merge });

      logger.info('Document set successfully', {
        collection,
        documentId,
        merge,
      });

      return {
        id: documentId,
        data,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to set document', { error, collection, documentId, data });
      throw new FirebaseError(
        `Failed to set document: ${error.message}`,
        'DOCUMENT_SET_FAILED',
        error
      );
    }
  }

  /**
   * Update a document
   */
  async updateDocument(
    collection: string,
    documentId: string,
    data: Record<string, any>
  ): Promise<FirestoreDocument> {
    try {
      if (!collection || !documentId) {
        throw new ValidationError('Collection and document ID are required');
      }

      if (!data || typeof data !== 'object') {
        throw new ValidationError('Update data must be an object');
      }

      const docRef = this.firestore.collection(collection).doc(documentId);
      
      // Check if document exists
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new NotFoundError(`Document not found: ${collection}/${documentId}`);
      }

      await docRef.update(data);

      // Get updated document
      const updatedDoc = await docRef.get();
      const updatedData = updatedDoc.data();

      logger.info('Document updated successfully', {
        collection,
        documentId,
      });

      return {
        id: documentId,
        data: updatedData || {},
      };
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to update document', { error, collection, documentId, data });
      throw new FirebaseError(
        `Failed to update document: ${error.message}`,
        'DOCUMENT_UPDATE_FAILED',
        error
      );
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(collection: string, documentId: string): Promise<void> {
    try {
      if (!collection || !documentId) {
        throw new ValidationError('Collection and document ID are required');
      }

      const docRef = this.firestore.collection(collection).doc(documentId);
      
      // Check if document exists
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new NotFoundError(`Document not found: ${collection}/${documentId}`);
      }

      await docRef.delete();

      logger.info('Document deleted successfully', {
        collection,
        documentId,
      });
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to delete document', { error, collection, documentId });
      throw new FirebaseError(
        `Failed to delete document: ${error.message}`,
        'DOCUMENT_DELETE_FAILED',
        error
      );
    }
  }

  /**
   * List documents in a collection
   */
  async listDocuments(collection: string, options: QueryOptions = {}): Promise<FirestoreDocument[]> {
    try {
      if (!collection) {
        throw new ValidationError('Collection is required');
      }

      let query: FirebaseFirestore.Query = this.firestore.collection(collection);

      // Apply where clauses
      if (options.where) {
        for (const whereClause of options.where) {
          query = query.where(whereClause.field, whereClause.operator, whereClause.value);
        }
      }

      // Apply order by clauses
      if (options.orderBy) {
        for (const orderByClause of options.orderBy) {
          query = query.orderBy(orderByClause.field, orderByClause.direction || 'asc');
        }
      }

      // Apply offset
      if (options.offset) {
        query = query.offset(options.offset);
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();
      const documents: FirestoreDocument[] = [];

      snapshot.forEach(doc => {
        documents.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      logger.debug('Documents listed successfully', {
        collection,
        count: documents.length,
        options,
      });

      return documents;
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to list documents', { error, collection, options });
      throw new FirebaseError(
        `Failed to list documents: ${error.message}`,
        'DOCUMENT_LIST_FAILED',
        error
      );
    }
  }

  /**
   * Query documents with advanced filtering
   */
  async queryDocuments(collection: string, options: QueryOptions): Promise<FirestoreDocument[]> {
    return this.listDocuments(collection, options);
  }

  /**
   * Batch operations
   */
  async batchOperations(operations: BatchOperation[]): Promise<void> {
    try {
      if (!operations || operations.length === 0) {
        throw new ValidationError('Operations array is required');
      }

      if (operations.length > 500) {
        throw new ValidationError('Maximum 500 operations per batch');
      }

      const batch = this.firestore.batch();

      for (const operation of operations) {
        if (!operation.collection || !operation.documentId) {
          throw new ValidationError('Collection and document ID are required for each operation');
        }

        const docRef = this.firestore.collection(operation.collection).doc(operation.documentId);

        switch (operation.type) {
          case 'set':
            if (!operation.data) {
              throw new ValidationError('Data is required for set operation');
            }
            batch.set(docRef, operation.data, { merge: operation.merge || false });
            break;

          case 'update':
            if (!operation.data) {
              throw new ValidationError('Data is required for update operation');
            }
            batch.update(docRef, operation.data);
            break;

          case 'delete':
            batch.delete(docRef);
            break;

          default:
            throw new ValidationError(`Invalid operation type: ${operation.type}`);
        }
      }

      await batch.commit();

      logger.info('Batch operations completed successfully', {
        operationCount: operations.length,
      });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to execute batch operations', { error, operations });
      throw new FirebaseError(
        `Failed to execute batch operations: ${error.message}`,
        'BATCH_OPERATIONS_FAILED',
        error
      );
    }
  }

  /**
   * Get collection info
   */
  async getCollectionInfo(collection: string): Promise<{ name: string; documentCount: number }> {
    try {
      if (!collection) {
        throw new ValidationError('Collection is required');
      }

      const snapshot = await this.firestore.collection(collection).get();
      
      logger.debug('Collection info retrieved successfully', {
        collection,
        documentCount: snapshot.size,
      });

      return {
        name: collection,
        documentCount: snapshot.size,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to get collection info', { error, collection });
      throw new FirebaseError(
        `Failed to get collection info: ${error.message}`,
        'COLLECTION_INFO_FAILED',
        error
      );
    }
  }

  /**
   * Create document with auto-generated ID
   */
  async addDocument(collection: string, data: Record<string, any>): Promise<FirestoreDocument> {
    try {
      if (!collection) {
        throw new ValidationError('Collection is required');
      }

      if (!data || typeof data !== 'object') {
        throw new ValidationError('Document data must be an object');
      }

      const docRef = await this.firestore.collection(collection).add(data);

      logger.info('Document added successfully', {
        collection,
        documentId: docRef.id,
      });

      return {
        id: docRef.id,
        data,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to add document', { error, collection, data });
      throw new FirebaseError(
        `Failed to add document: ${error.message}`,
        'DOCUMENT_ADD_FAILED',
        error
      );
    }
  }
}