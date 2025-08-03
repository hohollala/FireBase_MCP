"use strict";
/**
 * Jest Test Setup
 *
 * Global test setup and configuration for Jest testing framework.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
// Load test environment variables
(0, dotenv_1.config)({ path: '.env.test' });
// Set test environment
process.env.NODE_ENV = 'test';
// Global test timeout
jest.setTimeout(30000);
// Mock Firebase Admin SDK for tests
jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn(),
    credential: {
        cert: jest.fn(),
    },
    auth: jest.fn(() => ({
        createUser: jest.fn(),
        getUser: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
        listUsers: jest.fn(),
        setCustomUserClaims: jest.fn(),
    })),
    firestore: jest.fn(() => ({
        collection: jest.fn(),
        doc: jest.fn(),
        batch: jest.fn(),
    })),
    storage: jest.fn(() => ({
        bucket: jest.fn(),
    })),
}));
// Console suppression for cleaner test output
const originalConsole = console;
beforeAll(() => {
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
});
afterAll(() => {
    console.log = originalConsole.log;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
});
// Global test utilities
global.testUtils = {
    createMockMCPRequest: (method, params) => ({
        jsonrpc: '2.0',
        id: Math.random(),
        method,
        params,
    }),
    createMockFirebaseUser: (uid) => ({
        uid,
        email: `${uid}@test.com`,
        emailVerified: true,
        displayName: `Test User ${uid}`,
        photoURL: null,
        disabled: false,
        metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString(),
        },
        customClaims: {},
    }),
};
//# sourceMappingURL=setup.js.map