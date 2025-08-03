# Firebase MCP Server User Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Authentication & Security](#authentication--security)
5. [Service Overview](#service-overview)
6. [Usage Examples](#usage-examples)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## Introduction

The Firebase MCP Server is a Model Context Protocol (MCP) server that enables AI development tools like Claude Code, Claude Desktop, Gemini CLI, and Cursor IDE to interact with Firebase services. It provides a standardized interface for managing Firebase Authentication, Firestore, Storage, Functions, and other Firebase services.

### What is MCP?

Model Context Protocol (MCP) is a standardized protocol that allows AI assistants to securely access external resources and tools. The Firebase MCP Server implements this protocol to provide seamless Firebase integration for AI-powered development workflows.

### Supported Firebase Services

- **Firebase Authentication** - User management, custom claims, authentication tokens
- **Cloud Firestore** - Document databases, collections, queries, real-time listeners
- **Cloud Storage** - File upload/download, metadata management, access control  
- **Cloud Functions** - Function deployment, invocation, log retrieval
- **Realtime Database** - Real-time data synchronization, database operations
- **Analytics** - Event tracking, user properties, conversion funnels
- **Cloud Messaging** - Push notifications, topic messaging, message templates
- **Firebase Hosting** - Static site hosting information and management
- **Remote Config** - Dynamic app configuration, A/B testing parameters
- **Performance Monitoring** - App performance tracking, custom metrics
- **Security Tools** - Security auditing, vulnerability scanning, compliance checks

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Firebase project with Admin SDK service account key
- AI development tool with MCP support (Claude Code, Claude Desktop, etc.)

### Step 1: Install the Server

```bash
# Clone the repository
git clone https://github.com/firebase/firebase-mcp-server.git
cd firebase-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

### Step 2: Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

3. Configure Firebase services you plan to use:
   - Enable Authentication methods
   - Create Firestore database
   - Set up Storage bucket
   - Configure other services as needed

### Step 3: MCP Client Configuration

#### Claude Code
Add to your MCP configuration file:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "node",
      "args": ["path/to/firebase-mcp-server/dist/index.js"],
      "env": {
        "FIREBASE_SERVICE_ACCOUNT_PATH": "path/to/service-account-key.json",
        "FIREBASE_PROJECT_ID": "your-project-id"
      }
    }
  }
}
```

#### Claude Desktop
Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "node",
      "args": ["path/to/firebase-mcp-server/dist/index.js"],
      "env": {
        "FIREBASE_SERVICE_ACCOUNT_PATH": "path/to/service-account-key.json",
        "FIREBASE_PROJECT_ID": "your-project-id"
      }
    }
  }
}
```

## Configuration

### Environment Variables

The server supports the following environment variables:

```bash
# Required
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/service-account-key.json
FIREBASE_PROJECT_ID=your-project-id

# Optional
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
LOG_LEVEL=info
MCP_TRANSPORT=stdio
SERVER_NAME=firebase-mcp-server
SERVER_VERSION=1.0.0

# Authentication (optional)
AUTH_ENABLED=false
AUTH_API_KEYS=key1,key2,key3
AUTH_RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW_MS=60000
```

### Configuration File

Create `config/firebase-config.json`:

```json
{
  "firebase": {
    "projectId": "your-project-id",
    "serviceAccountKeyPath": "./config/service-account-key.json",
    "databaseURL": "https://your-project.firebaseio.com"
  },
  "server": {
    "name": "firebase-mcp-server",
    "version": "1.0.0"
  },
  "mcp": {
    "transport": "stdio"
  },
  "logging": {
    "level": "info"
  }
}
```

## Authentication & Security

### Client Authentication

The server supports optional client authentication for production deployments:

```json
{
  "auth": {
    "enabled": true,
    "apiKeys": ["your-secure-api-key"],
    "allowedOrigins": ["*"],
    "rateLimiting": {
      "enabled": true,
      "maxRequests": 100,
      "windowMs": 60000
    }
  }
}
```

### Role-Based Access Control

Configure user roles and permissions:

```javascript
// Set user permissions
server.addUserPermissions('user123', ['editor'], ['firestore:read', 'storage:write']);

// Available roles:
// - viewer: Read-only access
// - editor: Read/write access to most services  
// - admin: Full access to all services
// - developer: Development-focused permissions
// - security-auditor: Security-focused read access
```

### Security Best Practices

1. **Secure Service Account Keys**
   - Store service account keys securely
   - Use environment variables, not hardcoded paths
   - Rotate keys regularly

2. **Enable Authentication**
   - Use strong API keys in production
   - Implement rate limiting
   - Restrict allowed origins

3. **Firestore Security Rules**
   - Implement proper security rules
   - Validate data on server and client
   - Use authentication-based access control

4. **Regular Security Audits**
   - Use built-in security audit tools
   - Monitor for vulnerabilities
   - Keep dependencies updated

## Service Overview

### Firebase Authentication

Manage users, authentication, and access control:

```javascript
// Create user
auth_create_user({
  email: "user@example.com",
  password: "securepassword",
  displayName: "John Doe"
})

// Set custom claims
auth_set_custom_claims({
  uid: "user123",
  customClaims: { role: "admin", tier: "premium" }
})

// Generate custom token
auth_create_custom_token({
  uid: "user123",
  additionalClaims: { feature: "beta" }
})
```

### Cloud Firestore

Document database operations:

```javascript
// Create document
firestore_create_document({
  collection: "users",
  documentId: "user123",
  data: {
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date().toISOString()
  }
})

// Query documents
firestore_query_documents({
  collection: "users",
  where: [
    { field: "age", operator: ">=", value: 18 },
    { field: "active", operator: "==", value: true }
  ],
  orderBy: { field: "createdAt", direction: "desc" },
  limit: 10
})

// Listen to changes
firestore_listen_to_document({
  collection: "users",
  documentId: "user123"
})
```

### Cloud Storage

File storage and management:

```javascript
// Upload file
storage_upload_file({
  bucket: "user-uploads",
  fileName: "profile-images/user123.jpg",
  fileContent: "base64-encoded-content",
  contentType: "image/jpeg",
  metadata: { uploadedBy: "user123" }
})

// Download file
storage_download_file({
  bucket: "user-uploads",
  fileName: "profile-images/user123.jpg"
})

// Generate signed URL
storage_generate_signed_url({
  bucket: "user-uploads", 
  fileName: "profile-images/user123.jpg",
  action: "read",
  expires: 3600
})
```

### Cloud Functions

Serverless function management:

```javascript
// Deploy function
functions_deploy({
  name: "processOrder",
  source: "function-source-code",
  runtime: "nodejs18",
  trigger: "https",
  environmentVariables: { 
    DATABASE_URL: "your-db-url" 
  }
})

// Call function
functions_call({
  name: "processOrder",
  data: { orderId: "order123", amount: 99.99 }
})

// Get function logs
functions_get_logs({
  functionName: "processOrder",
  lines: 100
})
```

## Usage Examples

### Complete User Registration Flow

```javascript
// 1. Create user account
const user = await auth_create_user({
  email: "newuser@example.com",
  password: "securepassword123",
  displayName: "New User"
});

// 2. Create user profile in Firestore
await firestore_create_document({
  collection: "users",
  documentId: user.uid,
  data: {
    email: user.email,
    displayName: user.displayName,
    createdAt: new Date().toISOString(),
    settings: {
      notifications: true,
      theme: "light"
    }
  }
});

// 3. Set user role
await auth_set_custom_claims({
  uid: user.uid,
  customClaims: { role: "user", verified: false }
});

// 4. Send welcome notification
await messaging_send_to_user({
  uid: user.uid,
  title: "Welcome!",
  body: "Thanks for joining our app",
  data: { type: "welcome" }
});
```

### E-commerce Order Processing

```javascript
// 1. Create order document
const order = await firestore_create_document({
  collection: "orders",
  data: {
    userId: "user123",
    items: [
      { productId: "prod1", quantity: 2, price: 25.99 },
      { productId: "prod2", quantity: 1, price: 15.50 }
    ],
    total: 67.48,
    status: "pending",
    createdAt: new Date().toISOString()
  }
});

// 2. Process payment (via Cloud Function)
const paymentResult = await functions_call({
  name: "processPayment",
  data: {
    orderId: order.id,
    amount: 67.48,
    paymentMethod: "card_123"
  }
});

// 3. Update order status
await firestore_update_document({
  collection: "orders",
  documentId: order.id,
  data: {
    status: paymentResult.success ? "paid" : "failed",
    paymentId: paymentResult.paymentId,
    updatedAt: new Date().toISOString()
  }
});

// 4. Send confirmation
if (paymentResult.success) {
  await messaging_send_to_user({
    uid: "user123",
    title: "Order Confirmed",
    body: `Your order #${order.id} has been confirmed`,
    data: { orderId: order.id, type: "order_confirmation" }
  });
}
```

### Real-time Chat System

```javascript
// 1. Create chat room
const chatRoom = await firestore_create_document({
  collection: "chatRooms",
  data: {
    name: "General Discussion",
    participants: ["user1", "user2", "user3"],
    createdAt: new Date().toISOString(),
    lastMessage: null
  }
});

// 2. Listen to new messages
await firestore_listen_to_collection({
  collection: `chatRooms/${chatRoom.id}/messages`,
  orderBy: { field: "timestamp", direction: "asc" }
});

// 3. Send message function
async function sendMessage(roomId, userId, message) {
  // Add message to Firestore
  const messageDoc = await firestore_create_document({
    collection: `chatRooms/${roomId}/messages`,
    data: {
      userId: userId,
      message: message,
      timestamp: new Date().toISOString(),
      type: "text"
    }
  });

  // Update room's last message
  await firestore_update_document({
    collection: "chatRooms",
    documentId: roomId,
    data: {
      lastMessage: {
        text: message,
        userId: userId,
        timestamp: messageDoc.timestamp
      }
    }
  });

  // Notify other participants
  const room = await firestore_get_document({
    collection: "chatRooms",
    documentId: roomId
  });

  const otherParticipants = room.participants.filter(p => p !== userId);
  
  await messaging_send_to_users({
    uids: otherParticipants,
    title: `New message in ${room.name}`,
    body: message,
    data: { roomId: roomId, type: "chat_message" }
  });
}
```

## Troubleshooting

### Common Issues

#### 1. Service Account Authentication Errors

**Error:** `Service account key not found`

**Solution:**
- Verify the service account key path is correct
- Ensure the file exists and has proper permissions
- Check that the key is valid and not expired

#### 2. Firebase Project Access Issues

**Error:** `Permission denied accessing Firebase project`

**Solution:**
- Verify the service account has necessary IAM roles
- Check that the project ID is correct
- Ensure Firebase services are enabled

#### 3. MCP Connection Issues

**Error:** `Failed to connect to MCP server`

**Solution:**
- Check that the server is built (`npm run build`)
- Verify the MCP client configuration
- Check server logs for detailed error messages

#### 4. Firestore Permission Errors

**Error:** `Missing or insufficient permissions`

**Solution:**
- Review Firestore security rules
- Ensure proper authentication is in place
- Check service account permissions

### Debug Mode

Enable debug logging for troubleshooting:

```bash
LOG_LEVEL=debug npm start
```

### Health Check

Test server connectivity:

```javascript
// Use the ping tool to test connection
ping({ message: "test connection" })
```

### Security Audit

Run security checks:

```javascript
// Audit authentication configuration
security_audit_auth({ detailed: true })

// Scan for vulnerabilities
security_scan_vulnerabilities({
  services: ["auth", "firestore", "storage"],
  severity: "medium"
})

// Generate security report
security_generate_report({
  format: "markdown",
  includeRecommendations: true
})
```

## Best Practices

### 1. Security

- **Use strong service account key security**
- **Implement proper Firestore security rules**
- **Enable client authentication in production**
- **Regular security audits and updates**
- **Monitor for suspicious activity**

### 2. Performance

- **Use batch operations for multiple documents**
- **Implement proper indexing in Firestore**
- **Optimize file sizes for Storage operations**
- **Use pagination for large data sets**
- **Cache frequently accessed data**

### 3. Error Handling

- **Always handle errors gracefully**
- **Use try-catch blocks for async operations**
- **Implement retry logic for transient failures**
- **Log errors for debugging and monitoring**

### 4. Data Management

- **Use consistent data structures**
- **Implement data validation**
- **Plan for data migration and schema changes**
- **Use server timestamps for consistency**
- **Implement soft deletes where appropriate**

### 5. Monitoring

- **Monitor API usage and performance**
- **Set up alerts for errors and anomalies**
- **Track user activity and engagement**
- **Regular performance reviews**
- **Capacity planning for scaling**

## Support and Resources

### Documentation
- [Firebase Documentation](https://firebase.google.com/docs)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [API Reference](./api.md)

### Community
- [Firebase Community](https://firebase.google.com/community)
- [GitHub Issues](https://github.com/firebase/firebase-mcp-server/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

### Updates
- Check GitHub releases for updates
- Follow Firebase blog for announcements
- Subscribe to security advisories