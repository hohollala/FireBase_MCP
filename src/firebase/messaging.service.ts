/**
 * Firebase Cloud Messaging (FCM) Service
 * 
 * Handles Firebase Cloud Messaging operations
 */

import * as admin from 'firebase-admin';
import { logger, FirebaseError, ValidationError } from '@utils/index';

export interface FCMMessage {
  token?: string;
  topic?: string;
  condition?: string;
  notification?: {
    title?: string;
    body?: string;
    imageUrl?: string;
  };
  data?: Record<string, string>;
  android?: admin.messaging.AndroidConfig;
  apns?: admin.messaging.ApnsConfig;
  webpush?: admin.messaging.WebpushConfig;
  fcmOptions?: admin.messaging.FcmOptions;
}

export interface FCMMulticastMessage {
  tokens: string[];
  notification?: {
    title?: string;
    body?: string;
    imageUrl?: string;
  };
  data?: Record<string, string>;
  android?: admin.messaging.AndroidConfig;
  apns?: admin.messaging.ApnsConfig;
  webpush?: admin.messaging.WebpushConfig;
  fcmOptions?: admin.messaging.FcmOptions;
}

export interface FCMResponse {
  messageId?: string;
  successCount?: number;
  failureCount?: number;
  responses?: admin.messaging.SendResponse[];
}

export class MessagingService {
  private messaging: admin.messaging.Messaging;

  constructor(app: admin.app.App) {
    this.messaging = app.messaging();
  }

  /**
   * Send message to a single device token
   */
  async sendToToken(message: FCMMessage): Promise<FCMResponse> {
    try {
      if (!message.token) {
        throw new ValidationError('Device token is required');
      }

      const fcmMessage: admin.messaging.Message = {
        token: message.token,
        ...(message.notification && { notification: message.notification }),
        ...(message.data && { data: message.data }),
        ...(message.android && { android: message.android }),
        ...(message.apns && { apns: message.apns }),
        ...(message.webpush && { webpush: message.webpush }),
        ...(message.fcmOptions && { fcmOptions: message.fcmOptions }),
      };

      const messageId = await this.messaging.send(fcmMessage);

      logger.info('Message sent successfully to token', {
        messageId,
        token: message.token.substring(0, 20) + '...',
      });

      return {
        messageId,
        successCount: 1,
        failureCount: 0,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to send message to token', { error, message });
      throw new FirebaseError(
        `Failed to send message to token: ${error.message}`,
        'FCM_SEND_TOKEN_FAILED',
        error
      );
    }
  }

  /**
   * Send message to a topic
   */
  async sendToTopic(message: FCMMessage): Promise<FCMResponse> {
    try {
      if (!message.topic) {
        throw new ValidationError('Topic is required');
      }

      const fcmMessage: admin.messaging.Message = {
        topic: message.topic,
        notification: message.notification,
        data: message.data,
        android: message.android,
        apns: message.apns,
        webpush: message.webpush,
        fcmOptions: message.fcmOptions,
      };

      const messageId = await this.messaging.send(fcmMessage);

      logger.info('Message sent successfully to topic', {
        messageId,
        topic: message.topic,
      });

      return {
        messageId,
        successCount: 1,
        failureCount: 0,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to send message to topic', { error, message });
      throw new FirebaseError(
        `Failed to send message to topic: ${error.message}`,
        'FCM_SEND_TOPIC_FAILED',
        error
      );
    }
  }

  /**
   * Send message to a condition
   */
  async sendToCondition(message: FCMMessage): Promise<FCMResponse> {
    try {
      if (!message.condition) {
        throw new ValidationError('Condition is required');
      }

      const fcmMessage: admin.messaging.Message = {
        condition: message.condition,
        notification: message.notification,
        data: message.data,
        android: message.android,
        apns: message.apns,
        webpush: message.webpush,
        fcmOptions: message.fcmOptions,
      };

      const messageId = await this.messaging.send(fcmMessage);

      logger.info('Message sent successfully to condition', {
        messageId,
        condition: message.condition,
      });

      return {
        messageId,
        successCount: 1,
        failureCount: 0,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to send message to condition', { error, message });
      throw new FirebaseError(
        `Failed to send message to condition: ${error.message}`,
        'FCM_SEND_CONDITION_FAILED',
        error
      );
    }
  }

  /**
   * Send message to multiple tokens (multicast)
   */
  async sendMulticast(message: FCMMulticastMessage): Promise<FCMResponse> {
    try {
      if (!message.tokens || message.tokens.length === 0) {
        throw new ValidationError('At least one device token is required');
      }

      if (message.tokens.length > 500) {
        throw new ValidationError('Maximum 500 tokens allowed per multicast');
      }

      const multicastMessage: admin.messaging.MulticastMessage = {
        tokens: message.tokens,
        notification: message.notification,
        data: message.data,
        android: message.android,
        apns: message.apns,
        webpush: message.webpush,
        fcmOptions: message.fcmOptions,
      };

      const response = await this.messaging.sendMulticast(multicastMessage);

      logger.info('Multicast message sent successfully', {
        successCount: response.successCount,
        failureCount: response.failureCount,
        totalTokens: message.tokens.length,
      });

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to send multicast message', { error, message });
      throw new FirebaseError(
        `Failed to send multicast message: ${error.message}`,
        'FCM_SEND_MULTICAST_FAILED',
        error
      );
    }
  }

  /**
   * Subscribe tokens to a topic
   */
  async subscribeToTopic(tokens: string[], topic: string): Promise<any> {
    try {
      if (!tokens || tokens.length === 0) {
        throw new ValidationError('At least one token is required');
      }

      if (!topic) {
        throw new ValidationError('Topic is required');
      }

      if (tokens.length > 1000) {
        throw new ValidationError('Maximum 1000 tokens allowed per subscription');
      }

      const response = await this.messaging.subscribeToTopic(tokens, topic);

      logger.info('Tokens subscribed to topic successfully', {
        topic,
        successCount: response.successCount,
        failureCount: response.failureCount,
        totalTokens: tokens.length,
      });

      return response;
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to subscribe tokens to topic', { error, tokens, topic });
      throw new FirebaseError(
        `Failed to subscribe tokens to topic: ${error.message}`,
        'FCM_SUBSCRIBE_FAILED',
        error
      );
    }
  }

  /**
   * Unsubscribe tokens from a topic
   */
  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<any> {
    try {
      if (!tokens || tokens.length === 0) {
        throw new ValidationError('At least one token is required');
      }

      if (!topic) {
        throw new ValidationError('Topic is required');
      }

      if (tokens.length > 1000) {
        throw new ValidationError('Maximum 1000 tokens allowed per unsubscription');
      }

      const response = await this.messaging.unsubscribeFromTopic(tokens, topic);

      logger.info('Tokens unsubscribed from topic successfully', {
        topic,
        successCount: response.successCount,
        failureCount: response.failureCount,
        totalTokens: tokens.length,
      });

      return response;
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to unsubscribe tokens from topic', { error, tokens, topic });
      throw new FirebaseError(
        `Failed to unsubscribe tokens from topic: ${error.message}`,
        'FCM_UNSUBSCRIBE_FAILED',
        error
      );
    }
  }

  /**
   * Send message to all devices (broadcast)
   */
  async sendBroadcast(message: Omit<FCMMessage, 'token' | 'topic' | 'condition'>): Promise<FCMResponse> {
    try {
      // Use a broadcast topic that all devices should be subscribed to
      const broadcastMessage: FCMMessage = {
        ...message,
        topic: 'broadcast_all',
      };

      return await this.sendToTopic(broadcastMessage);
    } catch (error: any) {
      logger.error('Failed to send broadcast message', { error, message });
      throw new FirebaseError(
        `Failed to send broadcast message: ${error.message}`,
        'FCM_BROADCAST_FAILED',
        error
      );
    }
  }

  /**
   * Send scheduled message (simulate scheduling)
   */
  async scheduleMessage(
    message: FCMMessage,
    scheduleTime: Date
  ): Promise<{ scheduledId: string; scheduleTime: Date }> {
    try {
      const now = new Date();
      if (scheduleTime <= now) {
        throw new ValidationError('Schedule time must be in the future');
      }

      // Note: FCM doesn't support native scheduling
      // This would require implementing a scheduler using Cloud Tasks or similar
      const scheduledId = `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      logger.info('Message scheduled', {
        scheduledId,
        scheduleTime: scheduleTime.toISOString(),
      });

      // In a real implementation, you would:
      // 1. Store the message in a database
      // 2. Set up a Cloud Task or Cloud Scheduler job
      // 3. Return the schedule ID for tracking
      
      throw new FirebaseError(
        'Message scheduling requires additional setup with Cloud Tasks or Cloud Scheduler.',
        'FCM_SCHEDULING_NOT_IMPLEMENTED'
      );
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof FirebaseError) {
        throw error;
      }

      logger.error('Failed to schedule message', { error, message, scheduleTime });
      throw new FirebaseError(
        `Failed to schedule message: ${error.message}`,
        'FCM_SCHEDULE_FAILED',
        error
      );
    }
  }

  /**
   * Create notification template
   */
  createNotificationTemplate(
    title: string,
    body: string,
    imageUrl?: string,
    data?: Record<string, string>
  ): Partial<FCMMessage> {
    return {
      notification: {
        title,
        body,
        imageUrl,
      },
      data,
    };
  }

  /**
   * Create platform-specific configurations
   */
  createPlatformConfig(platform: 'android' | 'ios' | 'web', config: any): any {
    switch (platform) {
      case 'android':
        return {
          android: {
            priority: 'high',
            notification: {
              icon: 'default',
              color: '#0078ff',
              sound: 'default',
              ...config,
            },
          },
        };

      case 'ios':
        return {
          apns: {
            payload: {
              aps: {
                alert: {
                  title: config.title,
                  body: config.body,
                },
                sound: 'default',
                badge: config.badge || 1,
                ...config,
              },
            },
          },
        };

      case 'web':
        return {
          webpush: {
            notification: {
              icon: '/icon-192x192.png',
              badge: '/badge-72x72.png',
              requireInteraction: true,
              ...config,
            },
          },
        };

      default:
        throw new ValidationError(`Unsupported platform: ${platform}`);
    }
  }

  /**
   * Validate FCM token format
   */
  validateToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // Basic FCM token format validation
    // Actual tokens are much longer and contain specific patterns
    return token.length > 100 && /^[A-Za-z0-9_-]+$/.test(token.replace(/:/g, ''));
  }

  /**
   * Get messaging service statistics
   */
  getServiceStats(): any {
    return {
      service: 'Firebase Cloud Messaging',
      features: [
        'Send to device tokens',
        'Send to topics',
        'Send to conditions',
        'Multicast messaging',
        'Topic subscription management',
        'Platform-specific configurations',
        'Notification templates',
      ],
      limits: {
        multicastTokens: 500,
        subscriptionTokens: 1000,
        messageSize: '4KB',
        topicNameLength: 255,
      },
    };
  }
}