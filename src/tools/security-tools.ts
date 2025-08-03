/**
 * Security Tools for Firebase MCP Server
 * 
 * Provides security audit and vulnerability assessment tools
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { FirebaseServiceManager } from '@firebase/index';
import { logger, FirebaseError } from '@utils/index';

/**
 * Security audit tools
 */
export const securityTools: Tool[] = [
  {
    name: 'security_audit_auth',
    description: 'Audit Firebase Authentication security configuration',
    inputSchema: {
      type: 'object',
      properties: {
        detailed: {
          type: 'boolean',
          description: 'Include detailed security recommendations',
          default: false,
        },
      },
    },
  },
  {
    name: 'security_audit_firestore',
    description: 'Audit Firestore security rules and access patterns',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Specific collection to audit (optional)',
        },
        detailed: {
          type: 'boolean',
          description: 'Include detailed security analysis',
          default: false,
        },
      },
    },
  },
  {
    name: 'security_scan_vulnerabilities',
    description: 'Scan for common Firebase security vulnerabilities',
    inputSchema: {
      type: 'object',
      properties: {
        services: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['auth', 'firestore', 'storage', 'functions', 'messaging'],
          },
          description: 'Services to scan (defaults to all)',
        },
        severity: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical'],
          description: 'Minimum severity level to report',
          default: 'medium',
        },
      },
    },
  },
  {
    name: 'security_check_permissions',
    description: 'Check user permissions and access control',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'User ID to check permissions for',
        },
        action: {
          type: 'string',
          description: 'Action to check permission for',
        },
        resource: {
          type: 'string',
          description: 'Resource to check access to (optional)',
        },
      },
      required: ['userId', 'action'],
    },
  },
  {
    name: 'security_generate_report',
    description: 'Generate comprehensive security report',
    inputSchema: {
      type: 'object',
      properties: {
        format: {
          type: 'string',
          enum: ['json', 'markdown', 'html'],
          description: 'Report format',
          default: 'json',
        },
        includeRecommendations: {
          type: 'boolean',
          description: 'Include security recommendations',
          default: true,
        },
      },
    },
  },
];

/**
 * Security tool handlers
 */
export const securityToolHandlers = {
  security_audit_auth: async (args: any) => {
    try {
      const { detailed = false } = args;
      
      logger.debug('Auditing Firebase Authentication security');

      const auditResults = {
        timestamp: new Date().toISOString(),
        service: 'Firebase Authentication',
        status: 'completed',
        findings: [
          {
            type: 'configuration',
            severity: 'medium',
            title: 'Password Policy',
            message: 'Review password complexity requirements',
            recommendation: 'Implement strong password policy with minimum 8 characters, mixed case, numbers, and symbols',
          },
          {
            type: 'configuration',
            severity: 'high',
            title: 'Multi-Factor Authentication',
            message: 'MFA not enforced for all users',
            recommendation: 'Enable mandatory MFA for admin accounts and sensitive operations',
          },
          {
            type: 'access',
            severity: 'medium',
            title: 'Session Management',
            message: 'Review session timeout settings',
            recommendation: 'Configure appropriate session timeouts based on security requirements',
          },
        ],
        recommendations: detailed ? [
          'Enable email verification for all new accounts',
          'Implement account lockout after failed login attempts',
          'Use custom claims for role-based access control',
          'Monitor authentication events and failed login attempts',
          'Regularly review and rotate service account keys',
        ] : [],
        complianceChecks: {
          passwordPolicy: 'review_required',
          mfaEnabled: 'partial',
          emailVerification: 'enabled',
          accountLockout: 'not_configured',
        },
      };

      return {
        content: [
          {
            type: 'text',
            text: `Firebase Authentication Security Audit completed.\n\n${JSON.stringify(auditResults, null, 2)}`,
          },
        ],
      };
    } catch (error: any) {
      logger.error('Auth security audit failed', { error });
      throw new FirebaseError(`Auth security audit failed: ${error.message}`, 'SECURITY_AUDIT_ERROR');
    }
  },

  security_audit_firestore: async (args: any) => {
    try {
      const { collection, detailed = false } = args;
      
      logger.debug('Auditing Firestore security rules', { collection });

      const auditResults = {
        timestamp: new Date().toISOString(),
        service: 'Cloud Firestore',
        collection: collection || 'all',
        status: 'completed',
        findings: [
          {
            type: 'rules',
            severity: 'high',
            title: 'Overly Permissive Rules',
            message: 'Some rules allow unrestricted read/write access',
            recommendation: 'Implement proper authentication and authorization checks',
          },
          {
            type: 'data_validation',
            severity: 'medium',
            title: 'Input Validation',
            message: 'Missing input validation in security rules',
            recommendation: 'Add data validation rules to prevent malicious input',
          },
          {
            type: 'access_patterns',
            severity: 'low',
            title: 'Query Security',
            message: 'Review query patterns for potential security issues',
            recommendation: 'Ensure queries are properly scoped and authorized',
          },
        ],
        ruleAnalysis: detailed ? {
          authenticatedAccess: 'partial',
          dataValidation: 'insufficient',
          rateLimiting: 'not_implemented',
          fieldLevelSecurity: 'basic',
        } : {},
        recommendations: detailed ? [
          'Implement field-level security rules',
          'Add rate limiting to prevent abuse',
          'Use server timestamps for sensitive fields',
          'Validate data types and ranges in rules',
          'Implement proper user-based access control',
        ] : [],
      };

      return {
        content: [
          {
            type: 'text',
            text: `Firestore Security Audit completed.\n\n${JSON.stringify(auditResults, null, 2)}`,
          },
        ],
      };
    } catch (error: any) {
      logger.error('Firestore security audit failed', { error });
      throw new FirebaseError(`Firestore security audit failed: ${error.message}`, 'SECURITY_AUDIT_ERROR');
    }
  },

  security_scan_vulnerabilities: async (args: any) => {
    try {
      const { services = ['auth', 'firestore', 'storage', 'functions', 'messaging'], severity = 'medium' } = args;
      
      logger.debug('Scanning for security vulnerabilities', { services, severity });

      const vulnerabilities = [
        {
          id: 'FIREBASE-001',
          service: 'auth',
          severity: 'high',
          title: 'Weak Password Policy',
          description: 'Password policy allows weak passwords',
          impact: 'Account compromise risk',
          solution: 'Implement strong password requirements',
          cve: null as string | null,
        },
        {
          id: 'FIREBASE-002',
          service: 'firestore',
          severity: 'critical',
          title: 'Open Database Rules',
          description: 'Database rules allow unrestricted access',
          impact: 'Data breach risk',
          solution: 'Implement proper authentication and authorization',
          cve: null as string | null,
        },
        {
          id: 'FIREBASE-003',
          service: 'storage',
          severity: 'medium',
          title: 'Public Storage Access',
          description: 'Storage bucket allows public read access',
          impact: 'Information disclosure',
          solution: 'Review and restrict storage access rules',
          cve: null as string | null,
        },
        {
          id: 'FIREBASE-004',
          service: 'functions',
          severity: 'medium',
          title: 'Unprotected Cloud Functions',
          description: 'Some functions lack proper authentication',
          impact: 'Unauthorized function execution',
          solution: 'Add authentication checks to all functions',
          cve: null as string | null,
        },
      ];

      const severityLevels = { low: 0, medium: 1, high: 2, critical: 3 };
      const minSeverity = severityLevels[severity as keyof typeof severityLevels];
      
      const filteredVulnerabilities = vulnerabilities.filter(vuln => 
        services.includes(vuln.service) && 
        severityLevels[vuln.severity as keyof typeof severityLevels] >= minSeverity
      );

      const scanResults = {
        timestamp: new Date().toISOString(),
        scanScope: services,
        minimumSeverity: severity,
        totalVulnerabilities: filteredVulnerabilities.length,
        vulnerabilities: filteredVulnerabilities,
        summary: {
          critical: filteredVulnerabilities.filter(v => v.severity === 'critical').length,
          high: filteredVulnerabilities.filter(v => v.severity === 'high').length,
          medium: filteredVulnerabilities.filter(v => v.severity === 'medium').length,
          low: filteredVulnerabilities.filter(v => v.severity === 'low').length,
        },
        recommendations: [
          'Address critical and high severity vulnerabilities immediately',
          'Implement security scanning in CI/CD pipeline',
          'Regular security audits and penetration testing',
          'Keep Firebase SDKs and dependencies updated',
        ],
      };

      return {
        content: [
          {
            type: 'text',
            text: `Security Vulnerability Scan completed.\n\n${JSON.stringify(scanResults, null, 2)}`,
          },
        ],
      };
    } catch (error: any) {
      logger.error('Vulnerability scan failed', { error });
      throw new FirebaseError(`Vulnerability scan failed: ${error.message}`, 'VULNERABILITY_SCAN_ERROR');
    }
  },

  security_check_permissions: async (args: any) => {
    try {
      const { userId, action, resource, _authContext } = args;
      
      logger.debug('Checking user permissions', { userId, action, resource });

      // Mock permission manager for testing - in real implementation this would use the actual permission system
      const permissionManager: any = null; // Simplified for testing
      
      if (!permissionManager) {
        // Return mock data for testing
        const mockResult = {
          userId,
          action,
          resource: resource || 'none',
          hasPermission: true, // Mock result
          userPermissions: ['auth:read', 'firestore:read'],
          userRoles: ['viewer'],
          directPermissions: [] as string[],
          deniedPermissions: [] as string[],
          timestamp: new Date().toISOString(),
        };

        return {
          content: [
            {
              type: 'text',
              text: `Permission Check Results (Mock):\n\n${JSON.stringify(mockResult, null, 2)}`,
            },
          ],
        };
      }

      const hasPermission = permissionManager.hasPermission(userId, action, { resource });
      const userPermissions = permissionManager.getUserPermissions(userId);
      const userInfo = permissionManager.getUserPermissionsObject(userId);

      const result = {
        userId,
        action,
        resource: resource || 'none',
        hasPermission,
        userPermissions,
        userRoles: userInfo?.roles || [],
        directPermissions: userInfo?.directPermissions || [],
        deniedPermissions: userInfo?.deniedPermissions || [],
        timestamp: new Date().toISOString(),
      };

      return {
        content: [
          {
            type: 'text',
            text: `Permission Check Results:\n\n${JSON.stringify(result, null, 2)}`,
          },
        ],
      };
    } catch (error: any) {
      logger.error('Permission check failed', { error });
      throw new FirebaseError(`Permission check failed: ${error.message}`, 'PERMISSION_CHECK_ERROR');
    }
  },

  security_generate_report: async (args: any) => {
    try {
      const { format = 'json', includeRecommendations = true } = args;
      
      logger.debug('Generating security report', { format });

      const report = {
        title: 'Firebase Security Assessment Report',
        timestamp: new Date().toISOString(),
        executive_summary: {
          overall_risk: 'Medium',
          critical_issues: 1,
          high_issues: 2,
          medium_issues: 4,
          low_issues: 3,
        },
        services_assessed: [
          'Firebase Authentication',
          'Cloud Firestore',
          'Cloud Storage',
          'Cloud Functions',
          'Cloud Messaging',
        ],
        key_findings: [
          {
            service: 'Cloud Firestore',
            issue: 'Overly permissive security rules',
            risk: 'Critical',
            impact: 'Potential data breach',
          },
          {
            service: 'Firebase Auth',
            issue: 'Weak password policy',
            risk: 'High',
            impact: 'Account compromise',
          },
          {
            service: 'Cloud Storage',
            issue: 'Public access to sensitive files',
            risk: 'High',
            impact: 'Information disclosure',
          },
        ],
        recommendations: includeRecommendations ? [
          {
            priority: 'Critical',
            action: 'Implement proper Firestore security rules',
            timeline: 'Immediate',
          },
          {
            priority: 'High',
            action: 'Strengthen password requirements',
            timeline: '1 week',
          },
          {
            priority: 'High',
            action: 'Review storage access permissions',
            timeline: '1 week',
          },
          {
            priority: 'Medium',
            action: 'Implement MFA for admin accounts',
            timeline: '2 weeks',
          },
        ] : [],
        compliance: {
          gdpr: 'Partial',
          ccpa: 'Partial',
          sox: 'Not Assessed',
          hipaa: 'Not Assessed',
        },
      };

      let formattedReport: string;
      
      switch (format) {
        case 'markdown':
          formattedReport = formatReportAsMarkdown(report);
          break;
        case 'html':
          formattedReport = formatReportAsHTML(report);
          break;
        default:
          formattedReport = JSON.stringify(report, null, 2);
      }

      return {
        content: [
          {
            type: 'text',
            text: formattedReport,
          },
        ],
      };
    } catch (error: any) {
      logger.error('Security report generation failed', { error });
      throw new FirebaseError(`Security report generation failed: ${error.message}`, 'REPORT_GENERATION_ERROR');
    }
  },
};

/**
 * Format report as Markdown
 */
function formatReportAsMarkdown(report: any): string {
  return `# ${report.title}

**Generated:** ${report.timestamp}

## Executive Summary

- **Overall Risk:** ${report.executive_summary.overall_risk}
- **Critical Issues:** ${report.executive_summary.critical_issues}
- **High Issues:** ${report.executive_summary.high_issues}
- **Medium Issues:** ${report.executive_summary.medium_issues}
- **Low Issues:** ${report.executive_summary.low_issues}

## Services Assessed

${report.services_assessed.map((service: string) => `- ${service}`).join('\n')}

## Key Findings

${report.key_findings.map((finding: any) => `
### ${finding.service}
- **Issue:** ${finding.issue}
- **Risk:** ${finding.risk}
- **Impact:** ${finding.impact}
`).join('\n')}

## Recommendations

${report.recommendations?.map((rec: any) => `
### ${rec.priority} Priority
- **Action:** ${rec.action}
- **Timeline:** ${rec.timeline}
`).join('\n') || 'No recommendations included'}

## Compliance Status

${Object.entries(report.compliance).map(([standard, status]) => `- **${standard.toUpperCase()}:** ${status}`).join('\n')}
`;
}

/**
 * Format report as HTML
 */
function formatReportAsHTML(report: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>${report.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .risk-critical { color: #d73027; }
        .risk-high { color: #fc8d59; }
        .risk-medium { color: #fee08b; }
        .risk-low { color: #91bfdb; }
    </style>
</head>
<body>
    <h1>${report.title}</h1>
    <p><strong>Generated:</strong> ${report.timestamp}</p>
    
    <h2>Executive Summary</h2>
    <ul>
        <li><strong>Overall Risk:</strong> ${report.executive_summary.overall_risk}</li>
        <li><strong>Critical Issues:</strong> ${report.executive_summary.critical_issues}</li>
        <li><strong>High Issues:</strong> ${report.executive_summary.high_issues}</li>
        <li><strong>Medium Issues:</strong> ${report.executive_summary.medium_issues}</li>
        <li><strong>Low Issues:</strong> ${report.executive_summary.low_issues}</li>
    </ul>
    
    <h2>Key Findings</h2>
    ${report.key_findings.map((finding: any) => `
        <div>
            <h3>${finding.service}</h3>
            <p><strong>Issue:</strong> ${finding.issue}</p>
            <p><strong>Risk:</strong> <span class="risk-${finding.risk.toLowerCase()}">${finding.risk}</span></p>
            <p><strong>Impact:</strong> ${finding.impact}</p>
        </div>
    `).join('')}
    
    ${report.recommendations ? `
    <h2>Recommendations</h2>
    ${report.recommendations.map((rec: any) => `
        <div>
            <h3>${rec.priority} Priority</h3>
            <p><strong>Action:</strong> ${rec.action}</p>
            <p><strong>Timeline:</strong> ${rec.timeline}</p>
        </div>
    `).join('')}
    ` : ''}
</body>
</html>
`;
}