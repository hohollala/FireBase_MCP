/**
 * Unit Tests for AuthService
 */

import { AuthService } from '../../src/firebase/auth.service';
import * as admin from 'firebase-admin';

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({
    createUser: jest.fn(),
    getUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    setCustomUserClaims: jest.fn(),
    createCustomToken: jest.fn(),
    verifyIdToken: jest.fn(),
    listUsers: jest.fn(),
  }),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuth: jest.Mocked<admin.auth.Auth>;
  let mockApp: admin.app.App;

  beforeEach(() => {
    mockApp = {} as admin.app.App;
    mockAuth = {
      createUser: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      setCustomUserClaims: jest.fn(),
      createCustomToken: jest.fn(),
      verifyIdToken: jest.fn(),
      listUsers: jest.fn(),
    } as any;

    (admin.auth as jest.Mock).mockReturnValue(mockAuth);
    authService = new AuthService(mockApp);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      };

      const expectedUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      mockAuth.createUser.mockResolvedValue(expectedUser as any);

      const result = await authService.createUser(userData);

      expect(mockAuth.createUser).toHaveBeenCalledWith(userData);
      expect(result).toEqual(expectedUser);
    });

    it('should throw error when email is missing', async () => {
      const userData = {
        password: 'password123',
        displayName: 'Test User',
      };

      await expect(authService.createUser(userData as any))
        .rejects
        .toThrow('Email is required');
    });

    it('should handle Firebase auth errors', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const firebaseError = new Error('email-already-exists');
      mockAuth.createUser.mockRejectedValue(firebaseError);

      await expect(authService.createUser(userData))
        .rejects
        .toThrow('Failed to create user: email-already-exists');
    });
  });

  describe('getUser', () => {
    it('should get user by UID', async () => {
      const uid = 'test-uid';
      const expectedUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      mockAuth.getUser.mockResolvedValue(expectedUser as any);

      const result = await authService.getUser(uid);

      expect(mockAuth.getUser).toHaveBeenCalledWith(uid);
      expect(result).toEqual(expectedUser);
    });

    it('should throw error when UID is missing', async () => {
      await expect(authService.getUser(''))
        .rejects
        .toThrow('UID is required');
    });

    it('should handle user not found', async () => {
      const uid = 'nonexistent-uid';
      const firebaseError = new Error('user-not-found');
      mockAuth.getUser.mockRejectedValue(firebaseError);

      await expect(authService.getUser(uid))
        .rejects
        .toThrow('Failed to get user: user-not-found');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const uid = 'test-uid';
      const updateData = {
        displayName: 'Updated Name',
        email: 'updated@example.com',
      };

      const expectedUser = {
        uid: 'test-uid',
        email: 'updated@example.com',
        displayName: 'Updated Name',
      };

      mockAuth.updateUser.mockResolvedValue(expectedUser as any);

      const result = await authService.updateUser(uid, updateData);

      expect(mockAuth.updateUser).toHaveBeenCalledWith(uid, updateData);
      expect(result).toEqual(expectedUser);
    });

    it('should throw error when UID is missing', async () => {
      const updateData = { displayName: 'Updated Name' };

      await expect(authService.updateUser('', updateData))
        .rejects
        .toThrow('UID is required');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const uid = 'test-uid';
      mockAuth.deleteUser.mockResolvedValue(undefined);

      await authService.deleteUser(uid);

      expect(mockAuth.deleteUser).toHaveBeenCalledWith(uid);
    });

    it('should throw error when UID is missing', async () => {
      await expect(authService.deleteUser(''))
        .rejects
        .toThrow('UID is required');
    });
  });

  describe('setCustomUserClaims', () => {
    it('should set custom claims successfully', async () => {
      const uid = 'test-uid';
      const customClaims = { role: 'admin', tier: 'premium' };

      mockAuth.setCustomUserClaims.mockResolvedValue(undefined);

      await authService.setCustomUserClaims(uid, customClaims);

      expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith(uid, customClaims);
    });

    it('should throw error when UID is missing', async () => {
      const customClaims = { role: 'admin' };

      await expect(authService.setCustomUserClaims('', customClaims))
        .rejects
        .toThrow('UID is required');
    });
  });

  describe('createCustomToken', () => {
    it('should create custom token successfully', async () => {
      const uid = 'test-uid';
      const additionalClaims = { feature: 'beta' };
      const expectedToken = 'custom-token-123';

      mockAuth.createCustomToken.mockResolvedValue(expectedToken);

      const result = await authService.createCustomToken(uid, additionalClaims);

      expect(mockAuth.createCustomToken).toHaveBeenCalledWith(uid, additionalClaims);
      expect(result).toBe(expectedToken);
    });

    it('should create custom token without additional claims', async () => {
      const uid = 'test-uid';
      const expectedToken = 'custom-token-123';

      mockAuth.createCustomToken.mockResolvedValue(expectedToken);

      const result = await authService.createCustomToken(uid);

      expect(mockAuth.createCustomToken).toHaveBeenCalledWith(uid, undefined);
      expect(result).toBe(expectedToken);
    });
  });

  describe('verifyIdToken', () => {
    it('should verify ID token successfully', async () => {
      const idToken = 'id-token-123';
      const expectedClaims = {
        uid: 'test-uid',
        email: 'test@example.com',
        iss: 'https://securetoken.google.com/test-project',
      };

      mockAuth.verifyIdToken.mockResolvedValue(expectedClaims as any);

      const result = await authService.verifyIdToken(idToken);

      expect(mockAuth.verifyIdToken).toHaveBeenCalledWith(idToken);
      expect(result).toEqual(expectedClaims);
    });

    it('should throw error when token is missing', async () => {
      await expect(authService.verifyIdToken(''))
        .rejects
        .toThrow('ID token is required');
    });

    it('should handle invalid token', async () => {
      const idToken = 'invalid-token';
      const firebaseError = new Error('invalid-token');
      mockAuth.verifyIdToken.mockRejectedValue(firebaseError);

      await expect(authService.verifyIdToken(idToken))
        .rejects
        .toThrow('Failed to verify token: invalid-token');
    });
  });

  describe('listUsers', () => {
    it('should list users with default pagination', async () => {
      const expectedResult = {
        users: [
          { uid: 'user1', email: 'user1@example.com' },
          { uid: 'user2', email: 'user2@example.com' },
        ],
        pageToken: 'next-page-token',
      };

      mockAuth.listUsers.mockResolvedValue(expectedResult as any);

      const result = await authService.listUsers();

      expect(mockAuth.listUsers).toHaveBeenCalledWith(1000, undefined);
      expect(result).toEqual(expectedResult);
    });

    it('should list users with custom pagination', async () => {
      const maxResults = 10;
      const pageToken = 'page-token-123';
      const expectedResult = {
        users: [{ uid: 'user1', email: 'user1@example.com' }],
        pageToken: undefined as any,
      };

      mockAuth.listUsers.mockResolvedValue(expectedResult as any);

      const result = await authService.listUsers({ maxResults, pageToken });

      expect(mockAuth.listUsers).toHaveBeenCalledWith(maxResults, pageToken);
      expect(result).toEqual(expectedResult);
    });
  });
});