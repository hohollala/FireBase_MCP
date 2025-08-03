/**
 * Firebase Performance Monitoring Service
 * 
 * Handles Firebase Performance Monitoring operations
 * Note: Firebase Admin SDK has limited Performance Monitoring capabilities
 */

import * as admin from 'firebase-admin';
import { logger, FirebaseError, ValidationError } from '@utils/index';

export interface PerformanceTrace {
  name: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
  attributes?: Record<string, string>;
  metrics?: Record<string, number>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  attributes?: Record<string, string>;
  timestamp?: number;
}

export interface NetworkRequestMetric {
  url: string;
  httpMethod: string;
  requestStartTimeMicros: number;
  requestCompletedTimeMicros: number;
  responseCode: number;
  requestPayloadBytes?: number;
  responsePayloadBytes?: number;
  responseContentType?: string;
}

export class PerformanceService {
  constructor(private _app: admin.app.App) {
    // Performance Monitoring service is mostly informational
    // Firebase Admin SDK doesn't provide direct Performance Monitoring API access
  }

  /**
   * Get performance data information
   * Note: This is informational only - actual data collection happens client-side
   */
  async getPerformanceInfo(): Promise<{
    status: string;
    message: string;
    capabilities: string[];
  }> {
    try {
      logger.debug('Getting Performance Monitoring information');

      return {
        status: 'available',
        message: 'Firebase Performance Monitoring is available for client-side integration',
        capabilities: [
          'Automatic performance data collection',
          'Custom trace creation',
          'Network request monitoring',
          'App start time measurement',
          'Screen rendering metrics',
          'Custom metrics collection'
        ]
      };
    } catch (error: any) {
      logger.error('Error getting performance info', { error });
      throw new FirebaseError(`Failed to get performance info: ${error.message}`, 'PERFORMANCE_ERROR');
    }
  }

  /**
   * Validate custom trace configuration
   */
  async validateTrace(trace: PerformanceTrace): Promise<boolean> {
    try {
      if (!trace.name) {
        throw new ValidationError('Trace name is required');
      }

      if (trace.name.length > 100) {
        throw new ValidationError('Trace name must be 100 characters or less');
      }

      // Validate trace name format
      const traceNameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
      if (!traceNameRegex.test(trace.name)) {
        throw new ValidationError('Trace name must start with a letter and contain only letters, numbers, and underscores');
      }

      // Validate attributes
      if (trace.attributes) {
        if (Object.keys(trace.attributes).length > 5) {
          throw new ValidationError('Maximum 5 custom attributes allowed per trace');
        }

        for (const [key, value] of Object.entries(trace.attributes)) {
          if (key.length > 40) {
            throw new ValidationError('Attribute key must be 40 characters or less');
          }
          if (value.length > 100) {
            throw new ValidationError('Attribute value must be 100 characters or less');
          }
        }
      }

      // Validate metrics
      if (trace.metrics) {
        if (Object.keys(trace.metrics).length > 32) {
          throw new ValidationError('Maximum 32 custom metrics allowed per trace');
        }

        for (const [key, value] of Object.entries(trace.metrics)) {
          if (key.length > 100) {
            throw new ValidationError('Metric name must be 100 characters or less');
          }
          if (value < 0) {
            throw new ValidationError('Metric values must be non-negative');
          }
        }
      }

      logger.debug('Trace validation successful', { traceName: trace.name });
      return true;
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logger.error('Error validating trace', { error, trace });
      throw new FirebaseError(`Failed to validate trace: ${error.message}`, 'VALIDATION_ERROR');
    }
  }

  /**
   * Get performance monitoring configuration
   */
  async getConfiguration(): Promise<{
    dataCollectionEnabled: boolean;
    automaticDataCollection: boolean;
    customTraceConfig: {
      maxTraces: number;
      maxAttributes: number;
      maxMetrics: number;
    };
    networkRequestConfig: {
      enabled: boolean;
      urlPatterns: string[];
    };
  }> {
    try {
      logger.debug('Getting Performance Monitoring configuration');

      return {
        dataCollectionEnabled: true,
        automaticDataCollection: true,
        customTraceConfig: {
          maxTraces: 300,
          maxAttributes: 5,
          maxMetrics: 32
        },
        networkRequestConfig: {
          enabled: true,
          urlPatterns: ['*']
        }
      };
    } catch (error: any) {
      logger.error('Error getting configuration', { error });
      throw new FirebaseError(`Failed to get configuration: ${error.message}`, 'CONFIG_ERROR');
    }
  }

  /**
   * Generate performance monitoring setup guide
   */
  async getSetupGuide(): Promise<{
    platform: string;
    instructions: string[];
    codeExamples: Record<string, string>;
  }[]> {
    try {
      logger.debug('Generating Performance Monitoring setup guide');

      return [
        {
          platform: 'Web/JavaScript',
          instructions: [
            'Install Firebase SDK: npm install firebase',
            'Initialize Firebase in your app',
            'Import Performance Monitoring',
            'Create custom traces',
            'Add custom metrics'
          ],
          codeExamples: {
            initialization: `
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';

const app = initializeApp(firebaseConfig);
const perf = getPerformance(app);
            `,
            customTrace: `
import { trace } from 'firebase/performance';

const customTrace = trace(perf, 'custom_trace');
customTrace.start();
// Your code here
customTrace.stop();
            `,
            customMetric: `
// Add custom metrics to traces
customTrace.putMetric('custom_metric', 42);
customTrace.putAttribute('user_type', 'premium');
            `
          }
        },
        {
          platform: 'Android',
          instructions: [
            'Add Firebase Performance SDK to build.gradle',
            'Apply Performance plugin',
            'Initialize in Application class',
            'Create custom traces',
            'Monitor network requests'
          ],
          codeExamples: {
            gradle: `
implementation 'com.google.firebase:firebase-perf:20.4.1'
apply plugin: 'com.google.firebase.firebase-perf'
            `,
            customTrace: `
FirebasePerformance firebasePerformance = FirebasePerformance.getInstance();
Trace myTrace = firebasePerformance.newTrace("test_trace");
myTrace.start();
// Your code here
myTrace.stop();
            `
          }
        },
        {
          platform: 'iOS',
          instructions: [
            'Add Firebase Performance to Podfile',
            'Configure in AppDelegate',
            'Create custom traces',
            'Add custom metrics',
            'Monitor network requests'
          ],
          codeExamples: {
            podfile: `pod 'Firebase/Performance'`,
            customTrace: `
let trace = Performance.startTrace(name: "test_trace")
// Your code here
trace?.stop()
            `
          }
        }
      ];
    } catch (error: any) {
      logger.error('Error generating setup guide', { error });
      throw new FirebaseError(`Failed to generate setup guide: ${error.message}`, 'SETUP_ERROR');
    }
  }

  /**
   * Get performance best practices
   */
  async getBestPractices(): Promise<{
    category: string;
    practices: string[];
  }[]> {
    try {
      logger.debug('Getting Performance Monitoring best practices');

      return [
        {
          category: 'Custom Traces',
          practices: [
            'Use meaningful trace names that describe the operation',
            'Keep trace names under 100 characters',
            'Avoid creating too many traces (max 300 per app)',
            'Use attributes to add context to traces',
            'Stop traces when operations complete'
          ]
        },
        {
          category: 'Custom Metrics',
          practices: [
            'Use descriptive metric names',
            'Ensure metric values are non-negative',
            'Limit to 32 metrics per trace',
            'Use consistent units across similar metrics',
            'Add metrics before stopping traces'
          ]
        },
        {
          category: 'Network Monitoring',
          practices: [
            'Automatic monitoring covers most HTTP/HTTPS requests',
            'Filter sensitive URLs from monitoring',
            'Monitor key API endpoints for performance',
            'Set appropriate timeout values',
            'Handle network errors gracefully'
          ]
        },
        {
          category: 'Data Collection',
          practices: [
            'Enable automatic data collection for comprehensive insights',
            'Respect user privacy and data collection preferences',
            'Monitor app start times and screen rendering',
            'Use sampling to manage data volume',
            'Regular review of performance data in console'
          ]
        }
      ];
    } catch (error: any) {
      logger.error('Error getting best practices', { error });
      throw new FirebaseError(`Failed to get best practices: ${error.message}`, 'PRACTICES_ERROR');
    }
  }
}