/**
 * Firebase Storage MCP Tools
 * 
 * MCP tools for Firebase Cloud Storage operations
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { FirebaseServiceManager } from '@firebase/index';
import { wrapAsyncHandler, ValidationError } from '@utils/index';

/**
 * Upload file tool
 */
export const uploadFileTool: Tool = {
  name: 'storage_upload_file',
  description: 'Upload a file to Firebase Storage',
  inputSchema: {
    type: 'object',
    properties: {
      localFilePath: {
        type: 'string',
        description: 'Local file path to upload',
      },
      destination: {
        type: 'string',
        description: 'Destination path in storage (optional)',
      },
      contentType: {
        type: 'string',
        description: 'Content type of the file (optional)',
      },
      customMetadata: {
        type: 'object',
        description: 'Custom metadata key-value pairs',
        additionalProperties: { type: 'string' },
      },
      public: {
        type: 'boolean',
        description: 'Whether to make file publicly accessible',
        default: false,
      },
    },
    required: ['localFilePath'],
  },
};

export const uploadFileHandler = wrapAsyncHandler(async (args: any) => {
  const { localFilePath, destination, contentType, customMetadata, public: isPublic = false } = args;
  
  if (!localFilePath) {
    throw new ValidationError('Local file path is required');
  }
  
  const storageService = FirebaseServiceManager.getInstance().getStorageService();
  const file = await storageService.uploadFile(localFilePath, {
    destination,
    metadata: {
      contentType,
      customMetadata,
    },
    public: isPublic,
  });
  
  return {
    content: [
      {
        type: 'text',
        text: `File uploaded successfully!

File Name: ${file.name}
Bucket: ${file.bucket}
Size: ${(file.size / 1024).toFixed(2)} KB
Content Type: ${file.contentType || 'Not set'}
Created: ${file.timeCreated || 'Not available'}
Public: ${isPublic ? 'Yes' : 'No'}`,
      },
    ],
  };
});

/**
 * Download file tool
 */
export const downloadFileTool: Tool = {
  name: 'storage_download_file',
  description: 'Download a file from Firebase Storage',
  inputSchema: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string',
        description: 'Name/path of the file in storage',
      },
      localDestination: {
        type: 'string',
        description: 'Local path where to save the downloaded file',
      },
    },
    required: ['fileName', 'localDestination'],
  },
};

export const downloadFileHandler = wrapAsyncHandler(async (args: any) => {
  const { fileName, localDestination } = args;
  
  if (!fileName || !localDestination) {
    throw new ValidationError('File name and local destination are required');
  }
  
  const storageService = FirebaseServiceManager.getInstance().getStorageService();
  await storageService.downloadFile(fileName, localDestination);
  
  return {
    content: [
      {
        type: 'text',
        text: `File downloaded successfully!

Source: ${fileName}
Destination: ${localDestination}`,
      },
    ],
  };
});

/**
 * Delete file tool
 */
export const deleteFileTool: Tool = {
  name: 'storage_delete_file',
  description: 'Delete a file from Firebase Storage',
  inputSchema: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string',
        description: 'Name/path of the file to delete',
      },
    },
    required: ['fileName'],
  },
};

export const deleteFileHandler = wrapAsyncHandler(async (args: any) => {
  const { fileName } = args;
  
  if (!fileName) {
    throw new ValidationError('File name is required');
  }
  
  const storageService = FirebaseServiceManager.getInstance().getStorageService();
  await storageService.deleteFile(fileName);
  
  return {
    content: [
      {
        type: 'text',
        text: `File deleted successfully!

File Name: ${fileName}`,
      },
    ],
  };
});

/**
 * Get file metadata tool
 */
export const getFileMetadataTool: Tool = {
  name: 'storage_get_file_metadata',
  description: 'Get metadata information about a file in Firebase Storage',
  inputSchema: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string',
        description: 'Name/path of the file',
      },
    },
    required: ['fileName'],
  },
};

export const getFileMetadataHandler = wrapAsyncHandler(async (args: any) => {
  const { fileName } = args;
  
  if (!fileName) {
    throw new ValidationError('File name is required');
  }
  
  const storageService = FirebaseServiceManager.getInstance().getStorageService();
  const file = await storageService.getFileMetadata(fileName);
  
  return {
    content: [
      {
        type: 'text',
        text: `File Metadata:

File Name: ${file.name}
Bucket: ${file.bucket}
Size: ${(file.size / 1024).toFixed(2)} KB
Content Type: ${file.contentType || 'Not set'}
ETag: ${file.etag || 'Not available'}
Created: ${file.timeCreated || 'Not available'}
Updated: ${file.updated || 'Not available'}`,
      },
    ],
  };
});

/**
 * List files tool
 */
export const listFilesTool: Tool = {
  name: 'storage_list_files',
  description: 'List files in Firebase Storage bucket with optional filtering',
  inputSchema: {
    type: 'object',
    properties: {
      prefix: {
        type: 'string',
        description: 'Filter files by prefix (folder path)',
      },
      delimiter: {
        type: 'string',
        description: 'Delimiter for hierarchical listing (e.g., "/" for folders)',
      },
      maxResults: {
        type: 'number',
        description: 'Maximum number of files to return',
        minimum: 1,
        maximum: 1000,
        default: 50,
      },
      pageToken: {
        type: 'string',
        description: 'Page token for pagination',
      },
    },
  },
};

export const listFilesHandler = wrapAsyncHandler(async (args: any) => {
  const { prefix, delimiter, maxResults = 50, pageToken } = args;
  
  const storageService = FirebaseServiceManager.getInstance().getStorageService();
  const result = await storageService.listFiles({
    prefix,
    delimiter,
    maxResults,
    pageToken,
  });
  
  const fileList = result.files.map(file => 
    `• ${file.name} - ${(file.size / 1024).toFixed(2)} KB - ${file.contentType || 'Unknown type'} - ${file.timeCreated || 'Unknown date'}`
  ).join('\n');
  
  return {
    content: [
      {
        type: 'text',
        text: `Found ${result.files.length} files:

${fileList || 'No files found'}

${prefix ? `Filtered by prefix: ${prefix}` : 'No prefix filter'}
${result.nextPageToken ? `Next page token: ${result.nextPageToken}` : 'No more pages'}`,
      },
    ],
  };
});

/**
 * Get signed URL tool
 */
export const getSignedUrlTool: Tool = {
  name: 'storage_get_signed_url',
  description: 'Generate a signed URL for file access in Firebase Storage',
  inputSchema: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string',
        description: 'Name/path of the file',
      },
      action: {
        type: 'string',
        enum: ['read', 'write', 'delete'],
        description: 'Action for the signed URL',
        default: 'read',
      },
      expiresInMinutes: {
        type: 'number',
        description: 'URL expiration time in minutes',
        minimum: 1,
        maximum: 10080, // 1 week
        default: 60,
      },
    },
    required: ['fileName'],
  },
};

export const getSignedUrlHandler = wrapAsyncHandler(async (args: any) => {
  const { fileName, action = 'read', expiresInMinutes = 60 } = args;
  
  if (!fileName) {
    throw new ValidationError('File name is required');
  }
  
  const storageService = FirebaseServiceManager.getInstance().getStorageService();
  const signedUrl = await storageService.getSignedUrl(fileName, action, expiresInMinutes);
  
  return {
    content: [
      {
        type: 'text',
        text: `Signed URL generated successfully!

File: ${fileName}
Action: ${action}
Expires in: ${expiresInMinutes} minutes
URL: ${signedUrl}

⚠️ Warning: This URL provides ${action} access to the file. Keep it secure and don't share publicly unless intended.`,
      },
    ],
  };
});

/**
 * Copy file tool
 */
export const copyFileTool: Tool = {
  name: 'storage_copy_file',
  description: 'Copy a file within Firebase Storage bucket',
  inputSchema: {
    type: 'object',
    properties: {
      sourceFileName: {
        type: 'string',
        description: 'Source file name/path',
      },
      destinationFileName: {
        type: 'string',
        description: 'Destination file name/path',
      },
    },
    required: ['sourceFileName', 'destinationFileName'],
  },
};

export const copyFileHandler = wrapAsyncHandler(async (args: any) => {
  const { sourceFileName, destinationFileName } = args;
  
  if (!sourceFileName || !destinationFileName) {
    throw new ValidationError('Source and destination file names are required');
  }
  
  const storageService = FirebaseServiceManager.getInstance().getStorageService();
  const file = await storageService.copyFile(sourceFileName, destinationFileName);
  
  return {
    content: [
      {
        type: 'text',
        text: `File copied successfully!

Source: ${sourceFileName}
Destination: ${destinationFileName}
Size: ${(file.size / 1024).toFixed(2)} KB
Created: ${file.timeCreated || 'Not available'}`,
      },
    ],
  };
});

/**
 * Move file tool
 */
export const moveFileTool: Tool = {
  name: 'storage_move_file',
  description: 'Move/rename a file within Firebase Storage bucket',
  inputSchema: {
    type: 'object',
    properties: {
      sourceFileName: {
        type: 'string',
        description: 'Source file name/path',
      },
      destinationFileName: {
        type: 'string',
        description: 'Destination file name/path',
      },
    },
    required: ['sourceFileName', 'destinationFileName'],
  },
};

export const moveFileHandler = wrapAsyncHandler(async (args: any) => {
  const { sourceFileName, destinationFileName } = args;
  
  if (!sourceFileName || !destinationFileName) {
    throw new ValidationError('Source and destination file names are required');
  }
  
  const storageService = FirebaseServiceManager.getInstance().getStorageService();
  const file = await storageService.moveFile(sourceFileName, destinationFileName);
  
  return {
    content: [
      {
        type: 'text',
        text: `File moved successfully!

From: ${sourceFileName}
To: ${destinationFileName}
Size: ${(file.size / 1024).toFixed(2)} KB
Updated: ${file.updated || 'Not available'}`,
      },
    ],
  };
});

/**
 * Update file metadata tool
 */
export const updateFileMetadataTool: Tool = {
  name: 'storage_update_file_metadata',
  description: 'Update metadata for a file in Firebase Storage',
  inputSchema: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string',
        description: 'Name/path of the file',
      },
      contentType: {
        type: 'string',
        description: 'New content type',
      },
      customMetadata: {
        type: 'object',
        description: 'Custom metadata key-value pairs',
        additionalProperties: { type: 'string' },
      },
    },
    required: ['fileName'],
  },
};

export const updateFileMetadataHandler = wrapAsyncHandler(async (args: any) => {
  const { fileName, contentType, customMetadata } = args;
  
  if (!fileName) {
    throw new ValidationError('File name is required');
  }
  
  if (!contentType && !customMetadata) {
    throw new ValidationError('At least one metadata field (contentType or customMetadata) is required');
  }
  
  const metadata: any = {};
  if (contentType) metadata.contentType = contentType;
  if (customMetadata) metadata.customMetadata = customMetadata;
  
  const storageService = FirebaseServiceManager.getInstance().getStorageService();
  const file = await storageService.updateFileMetadata(fileName, metadata);
  
  return {
    content: [
      {
        type: 'text',
        text: `File metadata updated successfully!

File: ${fileName}
Content Type: ${file.contentType || 'Not set'}
Size: ${(file.size / 1024).toFixed(2)} KB
Updated: ${file.updated || 'Not available'}
${customMetadata ? `\nCustom Metadata: ${JSON.stringify(customMetadata, null, 2)}` : ''}`,
      },
    ],
  };
});

/**
 * All Storage tools
 */
export const storageTools: Tool[] = [
  uploadFileTool,
  downloadFileTool,
  deleteFileTool,
  getFileMetadataTool,
  listFilesTool,
  getSignedUrlTool,
  copyFileTool,
  moveFileTool,
  updateFileMetadataTool,
];

/**
 * Storage tool handlers map
 */
export const storageToolHandlers = {
  storage_upload_file: uploadFileHandler,
  storage_download_file: downloadFileHandler,
  storage_delete_file: deleteFileHandler,
  storage_get_file_metadata: getFileMetadataHandler,
  storage_list_files: listFilesHandler,
  storage_get_signed_url: getSignedUrlHandler,
  storage_copy_file: copyFileHandler,
  storage_move_file: moveFileHandler,
  storage_update_file_metadata: updateFileMetadataHandler,
};