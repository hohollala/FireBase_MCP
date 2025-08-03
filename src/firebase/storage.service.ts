/**
 * Firebase Storage Service
 * 
 * Handles Firebase Cloud Storage operations
 */

import * as admin from 'firebase-admin';
import { logger, FirebaseError, NotFoundError, ValidationError } from '@utils/index';

export interface StorageFile {
  name: string;
  bucket: string;
  size: number;
  contentType?: string;
  etag?: string;
  timeCreated?: string;
  updated?: string;
  downloadURL?: string;
}

export interface UploadOptions {
  destination?: string;
  metadata?: {
    contentType?: string;
    customMetadata?: Record<string, string>;
  };
  public?: boolean;
}

export interface ListFilesOptions {
  prefix?: string;
  delimiter?: string;
  maxResults?: number;
  pageToken?: string;
}

export class StorageService {
  private storage: admin.storage.Storage;
  private defaultBucket: any;

  constructor(app: admin.app.App) {
    this.storage = app.storage();
    this.defaultBucket = this.storage.bucket();
  }

  /**
   * Upload file from local path
   */
  async uploadFile(
    localFilePath: string,
    options: UploadOptions = {}
  ): Promise<StorageFile> {
    try {
      if (!localFilePath) {
        throw new ValidationError('Local file path is required');
      }

      const destination = options.destination || localFilePath.split('/').pop() || 'file';

      const [uploadResult] = await this.defaultBucket.upload(localFilePath, {
        destination,
        metadata: options.metadata,
        public: options.public,
      });

      const [metadata] = await uploadResult.getMetadata();

      logger.info('File uploaded successfully', {
        fileName: destination,
        size: metadata.size,
      });

      return {
        name: uploadResult.name,
        bucket: uploadResult.bucket.name,
        size: parseInt(metadata.size || '0'),
        contentType: metadata.contentType,
        etag: metadata.etag,
        timeCreated: metadata.timeCreated,
        updated: metadata.updated,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to upload file', { error, localFilePath, options });
      throw new FirebaseError(
        `Failed to upload file: ${error.message}`,
        'FILE_UPLOAD_FAILED',
        error
      );
    }
  }

  /**
   * Upload file from buffer
   */
  async uploadFromBuffer(
    buffer: Buffer,
    fileName: string,
    options: UploadOptions = {}
  ): Promise<StorageFile> {
    try {
      if (!buffer || !fileName) {
        throw new ValidationError('Buffer and file name are required');
      }

      const file = this.defaultBucket.file(fileName);
      const stream = file.createWriteStream({
        metadata: options.metadata || undefined,
        public: options.public,
      });

      return new Promise((resolve, reject) => {
        stream.on('error', (error: any) => {
          logger.error('Failed to upload from buffer', { error, fileName });
          reject(new FirebaseError(
            `Failed to upload from buffer: ${error.message}`,
            'BUFFER_UPLOAD_FAILED',
            error
          ));
        });

        stream.on('finish', async () => {
          try {
            const [metadata] = await file.getMetadata();

            logger.info('File uploaded from buffer successfully', {
              fileName,
              size: metadata.size,
            });

            resolve({
              name: file.name,
              bucket: file.bucket.name,
              size: parseInt(metadata.size || '0'),
              contentType: metadata.contentType,
              etag: metadata.etag,
              timeCreated: metadata.timeCreated,
              updated: metadata.updated,
            });
          } catch (error: any) {
            reject(new FirebaseError(
              `Failed to get metadata after upload: ${error.message}`,
              'METADATA_RETRIEVAL_FAILED',
              error
            ));
          }
        });

        stream.end(buffer);
      });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to upload from buffer', { error, fileName, options });
      throw new FirebaseError(
        `Failed to upload from buffer: ${error.message}`,
        'BUFFER_UPLOAD_FAILED',
        error
      );
    }
  }

  /**
   * Download file to local path
   */
  async downloadFile(fileName: string, localDestination: string): Promise<void> {
    try {
      if (!fileName || !localDestination) {
        throw new ValidationError('File name and local destination are required');
      }

      const file = this.defaultBucket.file(fileName);
      
      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        throw new NotFoundError(`File not found: ${fileName}`);
      }

      await file.download({ destination: localDestination });

      logger.info('File downloaded successfully', {
        fileName,
        localDestination,
      });
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to download file', { error, fileName, localDestination });
      throw new FirebaseError(
        `Failed to download file: ${error.message}`,
        'FILE_DOWNLOAD_FAILED',
        error
      );
    }
  }

  /**
   * Get file as buffer
   */
  async getFileBuffer(fileName: string): Promise<Buffer> {
    try {
      if (!fileName) {
        throw new ValidationError('File name is required');
      }

      const file = this.defaultBucket.file(fileName);
      
      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        throw new NotFoundError(`File not found: ${fileName}`);
      }

      const [buffer] = await file.download();

      logger.debug('File buffer retrieved successfully', {
        fileName,
        size: buffer.length,
      });

      return buffer;
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to get file buffer', { error, fileName });
      throw new FirebaseError(
        `Failed to get file buffer: ${error.message}`,
        'FILE_BUFFER_FAILED',
        error
      );
    }
  }

  /**
   * Delete file
   */
  async deleteFile(fileName: string): Promise<void> {
    try {
      if (!fileName) {
        throw new ValidationError('File name is required');
      }

      const file = this.defaultBucket.file(fileName);
      
      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        throw new NotFoundError(`File not found: ${fileName}`);
      }

      await file.delete();

      logger.info('File deleted successfully', { fileName });
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to delete file', { error, fileName });
      throw new FirebaseError(
        `Failed to delete file: ${error.message}`,
        'FILE_DELETE_FAILED',
        error
      );
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(fileName: string): Promise<StorageFile> {
    try {
      if (!fileName) {
        throw new ValidationError('File name is required');
      }

      const file = this.defaultBucket.file(fileName);
      
      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        throw new NotFoundError(`File not found: ${fileName}`);
      }

      const [metadata] = await file.getMetadata();

      logger.debug('File metadata retrieved successfully', { fileName });

      return {
        name: file.name,
        bucket: file.bucket.name,
        size: parseInt(metadata.size || '0'),
        contentType: metadata.contentType,
        etag: metadata.etag,
        timeCreated: metadata.timeCreated,
        updated: metadata.updated,
      };
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to get file metadata', { error, fileName });
      throw new FirebaseError(
        `Failed to get file metadata: ${error.message}`,
        'FILE_METADATA_FAILED',
        error
      );
    }
  }

  /**
   * List files in bucket
   */
  async listFiles(options: ListFilesOptions = {}): Promise<{
    files: StorageFile[];
    nextPageToken?: string;
  }> {
    try {
      const [files, , response] = await this.defaultBucket.getFiles({
        prefix: options.prefix,
        delimiter: options.delimiter,
        maxResults: options.maxResults,
        pageToken: options.pageToken,
      });

      const fileList: StorageFile[] = await Promise.all(
        files.map(async (file: any) => {
          try {
            const [metadata] = await file.getMetadata();
            return {
              name: file.name,
              bucket: file.bucket.name,
              size: parseInt(metadata.size || '0'),
              contentType: metadata.contentType,
              etag: metadata.etag,
              timeCreated: metadata.timeCreated,
              updated: metadata.updated,
            };
          } catch (error: any) {
            // If metadata retrieval fails, return basic info
            return {
              name: file.name,
              bucket: file.bucket.name,
              size: 0,
            };
          }
        })
      );

      logger.debug('Files listed successfully', {
        fileCount: fileList.length,
        prefix: options.prefix,
      });

      return {
        files: fileList,
        nextPageToken: response?.nextPageToken,
      };
    } catch (error: any) {
      logger.error('Failed to list files', { error, options });
      throw new FirebaseError(
        `Failed to list files: ${error.message}`,
        'FILE_LIST_FAILED',
        error
      );
    }
  }

  /**
   * Get signed URL for file access
   */
  async getSignedUrl(
    fileName: string,
    action: 'read' | 'write' | 'delete' = 'read',
    expiresInMinutes = 60
  ): Promise<string> {
    try {
      if (!fileName) {
        throw new ValidationError('File name is required');
      }

      const file = this.defaultBucket.file(fileName);
      
      // For read action, check if file exists
      if (action === 'read') {
        const [exists] = await file.exists();
        if (!exists) {
          throw new NotFoundError(`File not found: ${fileName}`);
        }
      }

      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + expiresInMinutes);

      const [signedUrl] = await file.getSignedUrl({
        action,
        expires,
      });

      logger.debug('Signed URL generated successfully', {
        fileName,
        action,
        expiresInMinutes,
      });

      return signedUrl;
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to generate signed URL', { error, fileName, action });
      throw new FirebaseError(
        `Failed to generate signed URL: ${error.message}`,
        'SIGNED_URL_FAILED',
        error
      );
    }
  }

  /**
   * Copy file within bucket
   */
  async copyFile(sourceFileName: string, destinationFileName: string): Promise<StorageFile> {
    try {
      if (!sourceFileName || !destinationFileName) {
        throw new ValidationError('Source and destination file names are required');
      }

      const sourceFile = this.defaultBucket.file(sourceFileName);
      const destinationFile = this.defaultBucket.file(destinationFileName);
      
      // Check if source file exists
      const [exists] = await sourceFile.exists();
      if (!exists) {
        throw new NotFoundError(`Source file not found: ${sourceFileName}`);
      }

      await sourceFile.copy(destinationFile);
      
      const [metadata] = await destinationFile.getMetadata();

      logger.info('File copied successfully', {
        sourceFileName,
        destinationFileName,
      });

      return {
        name: destinationFile.name,
        bucket: destinationFile.bucket.name,
        size: parseInt(metadata.size || '0'),
        contentType: metadata.contentType,
        etag: metadata.etag,
        timeCreated: metadata.timeCreated,
        updated: metadata.updated,
      };
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to copy file', { error, sourceFileName, destinationFileName });
      throw new FirebaseError(
        `Failed to copy file: ${error.message}`,
        'FILE_COPY_FAILED',
        error
      );
    }
  }

  /**
   * Move file within bucket
   */
  async moveFile(sourceFileName: string, destinationFileName: string): Promise<StorageFile> {
    try {
      if (!sourceFileName || !destinationFileName) {
        throw new ValidationError('Source and destination file names are required');
      }

      const sourceFile = this.defaultBucket.file(sourceFileName);
      const destinationFile = this.defaultBucket.file(destinationFileName);
      
      // Check if source file exists
      const [exists] = await sourceFile.exists();
      if (!exists) {
        throw new NotFoundError(`Source file not found: ${sourceFileName}`);
      }

      await sourceFile.move(destinationFile);
      
      const [metadata] = await destinationFile.getMetadata();

      logger.info('File moved successfully', {
        sourceFileName,
        destinationFileName,
      });

      return {
        name: destinationFile.name,
        bucket: destinationFile.bucket.name,
        size: parseInt(metadata.size || '0'),
        contentType: metadata.contentType,
        etag: metadata.etag,
        timeCreated: metadata.timeCreated,
        updated: metadata.updated,
      };
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to move file', { error, sourceFileName, destinationFileName });
      throw new FirebaseError(
        `Failed to move file: ${error.message}`,
        'FILE_MOVE_FAILED',
        error
      );
    }
  }

  /**
   * Update file metadata
   */
  async updateFileMetadata(
    fileName: string,
    metadata: {
      contentType?: string;
      customMetadata?: Record<string, string>;
    }
  ): Promise<StorageFile> {
    try {
      if (!fileName) {
        throw new ValidationError('File name is required');
      }

      if (!metadata || Object.keys(metadata).length === 0) {
        throw new ValidationError('Metadata is required');
      }

      const file = this.defaultBucket.file(fileName);
      
      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        throw new NotFoundError(`File not found: ${fileName}`);
      }

      await file.setMetadata(metadata);
      
      const [updatedMetadata] = await file.getMetadata();

      logger.info('File metadata updated successfully', { fileName });

      return {
        name: file.name,
        bucket: file.bucket.name,
        size: parseInt(updatedMetadata.size || '0'),
        contentType: updatedMetadata.contentType,
        etag: updatedMetadata.etag,
        timeCreated: updatedMetadata.timeCreated,
        updated: updatedMetadata.updated,
      };
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to update file metadata', { error, fileName, metadata });
      throw new FirebaseError(
        `Failed to update file metadata: ${error.message}`,
        'FILE_METADATA_UPDATE_FAILED',
        error
      );
    }
  }
}