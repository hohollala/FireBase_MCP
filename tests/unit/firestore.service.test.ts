/**
 * Unit Tests for FirestoreService
 */

import { FirestoreService } from '../../src/firebase/firestore.service';
import * as admin from 'firebase-admin';

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    add: jest.fn(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    onSnapshot: jest.fn(),
  }),
}));

describe('FirestoreService', () => {
  let firestoreService: FirestoreService;
  let mockFirestore: jest.Mocked<admin.firestore.Firestore>;
  let mockApp: admin.app.App;

  beforeEach(() => {
    mockApp = {} as admin.app.App;
    mockFirestore = {
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnThis(),
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      add: jest.fn(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      onSnapshot: jest.fn(),
    } as any;

    (admin.firestore as unknown as jest.Mock).mockReturnValue(mockFirestore);
    firestoreService = new FirestoreService(mockApp);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDocument', () => {
    it('should create document with specified ID', async () => {
      const collection = 'users';
      const documentId = 'user123';
      const data = { name: 'John Doe', email: 'john@example.com' };

      const mockDocRef = {
        id: documentId,
        set: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue({
          exists: true,
          id: documentId,
          data: () => data,
        }),
      };

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue(mockDocRef),
      } as any);

      const result = await firestoreService.setDocument(collection, documentId, data);

      expect(mockFirestore.collection).toHaveBeenCalledWith(collection);
      expect(mockDocRef.set).toHaveBeenCalledWith(data);
      expect(result).toEqual({
        id: documentId,
        data: data,
      });
    });

    it('should create document with auto-generated ID', async () => {
      const collection = 'users';
      const data = { name: 'John Doe', email: 'john@example.com' };
      const autoId = 'auto-generated-id';

      const mockCollectionRef = {
        add: jest.fn().mockResolvedValue({
          id: autoId,
          get: jest.fn().mockResolvedValue({
            exists: true,
            id: autoId,
            data: () => data,
          }),
        }),
      };

      mockFirestore.collection.mockReturnValue(mockCollectionRef as any);

      const result = await firestoreService.addDocument(collection, data);

      expect(mockFirestore.collection).toHaveBeenCalledWith(collection);
      expect(mockCollectionRef.add).toHaveBeenCalledWith(data);
      expect(result.id).toBe(autoId);
      expect(result.data).toEqual(data);
    });

    it('should throw error when collection name is missing', async () => {
      const data = { name: 'John Doe' };

      await expect(firestoreService.addDocument('', data))
        .rejects
        .toThrow('Collection name is required');
    });

    it('should throw error when data is missing', async () => {
      const collection = 'users';

      await expect(firestoreService.addDocument(collection, null as any))
        .rejects
        .toThrow('Document data is required');
    });
  });

  describe('getDocument', () => {
    it('should get existing document', async () => {
      const collection = 'users';
      const documentId = 'user123';
      const data = { name: 'John Doe', email: 'john@example.com' };

      const mockDocRef = {
        get: jest.fn().mockResolvedValue({
          exists: true,
          id: documentId,
          data: () => data,
        }),
      };

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue(mockDocRef),
      } as any);

      const result = await firestoreService.getDocument(collection, documentId);

      expect(mockFirestore.collection).toHaveBeenCalledWith(collection);
      expect(result).toEqual({
        id: documentId,
        data: data,
        exists: true,
      });
    });

    it('should return null for non-existent document', async () => {
      const collection = 'users';
      const documentId = 'nonexistent';

      const mockDocRef = {
        get: jest.fn().mockResolvedValue({
          exists: false,
        }),
      };

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue(mockDocRef),
      } as any);

      const result = await firestoreService.getDocument(collection, documentId);

      expect(result).toBeNull();
    });

    it('should throw error when collection name is missing', async () => {
      await expect(firestoreService.getDocument('', 'doc123'))
        .rejects
        .toThrow('Collection name is required');
    });

    it('should throw error when document ID is missing', async () => {
      await expect(firestoreService.getDocument('users', ''))
        .rejects
        .toThrow('Document ID is required');
    });
  });

  describe('updateDocument', () => {
    it('should update document successfully', async () => {
      const collection = 'users';
      const documentId = 'user123';
      const updateData = { name: 'Updated Name' };

      const mockDocRef = {
        update: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue({
          exists: true,
          id: documentId,
          data: () => ({ name: 'Updated Name', email: 'john@example.com' }),
        }),
      };

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue(mockDocRef),
      } as any);

      const result = await firestoreService.updateDocument(collection, documentId, updateData);

      expect(mockDocRef.update).toHaveBeenCalledWith(updateData);
      expect(result.id).toBe(documentId);
    });

    it('should throw error when collection name is missing', async () => {
      const updateData = { name: 'Updated Name' };

      await expect(firestoreService.updateDocument('', 'doc123', updateData))
        .rejects
        .toThrow('Collection name is required');
    });

    it('should throw error when document ID is missing', async () => {
      const updateData = { name: 'Updated Name' };

      await expect(firestoreService.updateDocument('users', '', updateData))
        .rejects
        .toThrow('Document ID is required');
    });
  });

  describe('deleteDocument', () => {
    it('should delete document successfully', async () => {
      const collection = 'users';
      const documentId = 'user123';

      const mockDocRef = {
        delete: jest.fn().mockResolvedValue(undefined),
      };

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue(mockDocRef),
      } as any);

      await firestoreService.deleteDocument(collection, documentId);

      expect(mockDocRef.delete).toHaveBeenCalled();
    });

    it('should throw error when collection name is missing', async () => {
      await expect(firestoreService.deleteDocument('', 'doc123'))
        .rejects
        .toThrow('Collection name is required');
    });

    it('should throw error when document ID is missing', async () => {
      await expect(firestoreService.deleteDocument('users', ''))
        .rejects
        .toThrow('Document ID is required');
    });
  });

  describe('queryDocuments', () => {
    it('should query documents with filters', async () => {
      const collection = 'users';
      const filters = [
        { field: 'age', operator: '>=' as any, value: 18 },
        { field: 'active', operator: '==' as any, value: true },
      ];

      const mockQuerySnapshot = {
        docs: [
          {
            id: 'user1',
            data: () => ({ name: 'User 1', age: 25, active: true }),
          },
          {
            id: 'user2',
            data: () => ({ name: 'User 2', age: 30, active: true }),
          },
        ],
      };

      const mockQuery = {
        get: jest.fn().mockResolvedValue(mockQuerySnapshot),
      };

      mockFirestore.collection.mockReturnValue({
        where: jest.fn().mockReturnValue(mockQuery),
      } as any);

      const result = await firestoreService.queryDocuments(collection, { where: filters });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'user1',
        data: { name: 'User 1', age: 25, active: true },
      });
    });

    it('should query documents with ordering and limit', async () => {
      const collection = 'users';
      const options = {
        orderBy: [{ field: 'createdAt', direction: 'desc' as const }],
        limit: 10,
      };

      const mockQuerySnapshot = {
        docs: [
          {
            id: 'user1',
            data: () => ({ name: 'User 1', createdAt: new Date() }),
          },
        ],
      };

      const mockQuery = {
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(mockQuerySnapshot),
      };

      mockFirestore.collection.mockReturnValue(mockQuery as any);

      const result = await firestoreService.queryDocuments(collection, options);

      expect(mockQuery.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
      expect(result).toHaveLength(1);
    });

    it('should throw error when collection name is missing', async () => {
      await expect(firestoreService.queryDocuments('', {}))
        .rejects
        .toThrow('Collection name is required');
    });
  });

  describe('listenToDocument', () => {
    it('should set up document listener', async () => {
      const collection = 'users';
      const documentId = 'user123';
      const callback = jest.fn();

      const mockUnsubscribe = jest.fn();
      const mockDocRef = {
        onSnapshot: jest.fn().mockReturnValue(mockUnsubscribe),
      };

      mockFirestore.collection.mockReturnValue({
        doc: jest.fn().mockReturnValue(mockDocRef),
      } as any);

      const unsubscribe = await firestoreService.listenToDocument(collection, documentId, callback);

      expect(mockDocRef.onSnapshot).toHaveBeenCalled();
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should throw error when collection name is missing', async () => {
      const callback = jest.fn();

      await expect(firestoreService.listenToDocument('', 'doc123', callback))
        .rejects
        .toThrow('Collection name is required');
    });

    it('should throw error when document ID is missing', async () => {
      const callback = jest.fn();

      await expect(firestoreService.listenToDocument('users', '', callback))
        .rejects
        .toThrow('Document ID is required');
    });
  });
});