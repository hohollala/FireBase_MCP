/**
 * Unit Tests for Security Tools
 */

import { securityToolHandlers } from '../../src/tools/security-tools';

describe('Security Tools', () => {
  describe('security_audit_auth', () => {
    it('should perform basic auth audit', async () => {
      const args = { detailed: false };
      const result = await securityToolHandlers.security_audit_auth(args);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      
      const auditData = JSON.parse(result.content[0].text.split('\n\n')[1]);
      expect(auditData.service).toBe('Firebase Authentication');
      expect(auditData.status).toBe('completed');
      expect(auditData.findings).toHaveLength(3);
    });

    it('should perform detailed auth audit', async () => {
      const args = { detailed: true };
      const result = await securityToolHandlers.security_audit_auth(args);

      expect(result.content).toHaveLength(1);
      
      const auditData = JSON.parse(result.content[0].text.split('\n\n')[1]);
      expect(auditData.recommendations).toHaveLength(5);
      expect(auditData.complianceChecks).toBeDefined();
    });
  });

  describe('security_audit_firestore', () => {
    it('should perform basic firestore audit', async () => {
      const args = { detailed: false };
      const result = await securityToolHandlers.security_audit_firestore(args);

      expect(result.content).toHaveLength(1);
      
      const auditData = JSON.parse(result.content[0].text.split('\n\n')[1]);
      expect(auditData.service).toBe('Cloud Firestore');
      expect(auditData.collection).toBe('all');
      expect(auditData.findings).toHaveLength(3);
    });

    it('should perform detailed firestore audit for specific collection', async () => {
      const args = { collection: 'users', detailed: true };
      const result = await securityToolHandlers.security_audit_firestore(args);

      expect(result.content).toHaveLength(1);
      
      const auditData = JSON.parse(result.content[0].text.split('\n\n')[1]);
      expect(auditData.collection).toBe('users');
      expect(auditData.ruleAnalysis).toBeDefined();
      expect(auditData.recommendations).toHaveLength(5);
    });
  });

  describe('security_scan_vulnerabilities', () => {
    it('should scan all services with default severity', async () => {
      const args = {};
      const result = await securityToolHandlers.security_scan_vulnerabilities(args);

      expect(result.content).toHaveLength(1);
      
      const scanData = JSON.parse(result.content[0].text.split('\n\n')[1]);
      expect(scanData.scanScope).toEqual(['auth', 'firestore', 'storage', 'functions', 'messaging']);
      expect(scanData.minimumSeverity).toBe('medium');
      expect(scanData.totalVulnerabilities).toBeGreaterThan(0);
    });

    it('should scan specific services with high severity', async () => {
      const args = { 
        services: ['auth', 'firestore'], 
        severity: 'high' 
      };
      const result = await securityToolHandlers.security_scan_vulnerabilities(args);

      expect(result.content).toHaveLength(1);
      
      const scanData = JSON.parse(result.content[0].text.split('\n\n')[1]);
      expect(scanData.scanScope).toEqual(['auth', 'firestore']);
      expect(scanData.minimumSeverity).toBe('high');
      
      // Should only include high and critical vulnerabilities
      scanData.vulnerabilities.forEach((vuln: any) => {
        expect(['high', 'critical']).toContain(vuln.severity);
      });
    });

    it('should provide vulnerability summary', async () => {
      const args = { severity: 'low' };
      const result = await securityToolHandlers.security_scan_vulnerabilities(args);

      const scanData = JSON.parse(result.content[0].text.split('\n\n')[1]);
      expect(scanData.summary).toBeDefined();
      expect(typeof scanData.summary.critical).toBe('number');
      expect(typeof scanData.summary.high).toBe('number');
      expect(typeof scanData.summary.medium).toBe('number');
      expect(typeof scanData.summary.low).toBe('number');
    });
  });

  describe('security_check_permissions', () => {
    it('should check user permissions', async () => {
      const args = {
        userId: 'user123',
        action: 'read',
        resource: 'firestore',
      };
      const result = await securityToolHandlers.security_check_permissions(args);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].text).toContain('Permission manager not available');
    });

    it('should handle missing parameters', async () => {
      const args = {
        userId: 'user123',
        action: 'read',
      };
      const result = await securityToolHandlers.security_check_permissions(args);

      expect(result.content).toHaveLength(1);
      
      const permissionData = JSON.parse(result.content[0].text.split(':\n\n')[1]);
      expect(permissionData.userId).toBe('user123');
      expect(permissionData.action).toBe('read');
      expect(permissionData.resource).toBe('none');
    });
  });

  describe('security_generate_report', () => {
    it('should generate JSON report with recommendations', async () => {
      const args = { 
        format: 'json', 
        includeRecommendations: true 
      };
      const result = await securityToolHandlers.security_generate_report(args);

      expect(result.content).toHaveLength(1);
      
      const report = JSON.parse(result.content[0].text);
      expect(report.title).toBe('Firebase Security Assessment Report');
      expect(report.executive_summary).toBeDefined();
      expect(report.services_assessed).toHaveLength(5);
      expect(report.key_findings).toHaveLength(3);
      expect(report.recommendations).toHaveLength(4);
    });

    it('should generate markdown report', async () => {
      const args = { format: 'markdown' };
      const result = await securityToolHandlers.security_generate_report(args);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].text).toContain('# Firebase Security Assessment Report');
      expect(result.content[0].text).toContain('## Executive Summary');
      expect(result.content[0].text).toContain('## Services Assessed');
    });

    it('should generate HTML report', async () => {
      const args = { format: 'html' };
      const result = await securityToolHandlers.security_generate_report(args);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].text).toContain('<!DOCTYPE html>');
      expect(result.content[0].text).toContain('<title>Firebase Security Assessment Report</title>');
      expect(result.content[0].text).toContain('<h1>Firebase Security Assessment Report</h1>');
    });

    it('should generate report without recommendations', async () => {
      const args = { 
        format: 'json', 
        includeRecommendations: false 
      };
      const result = await securityToolHandlers.security_generate_report(args);

      const report = JSON.parse(result.content[0].text);
      expect(report.recommendations).toHaveLength(0);
    });
  });

  describe('Security Vulnerability Detection', () => {
    it('should detect critical vulnerabilities', async () => {
      const args = { severity: 'critical' };
      const result = await securityToolHandlers.security_scan_vulnerabilities(args);

      const scanData = JSON.parse(result.content[0].text.split('\n\n')[1]);
      const criticalVulns = scanData.vulnerabilities.filter((v: any) => v.severity === 'critical');
      
      expect(criticalVulns.length).toBeGreaterThan(0);
      criticalVulns.forEach((vuln: any) => {
        expect(vuln).toHaveProperty('id');
        expect(vuln).toHaveProperty('service');
        expect(vuln).toHaveProperty('title');
        expect(vuln).toHaveProperty('description');
        expect(vuln).toHaveProperty('impact');
        expect(vuln).toHaveProperty('solution');
      });
    });

    it('should provide detailed vulnerability information', async () => {
      const args = { services: ['firestore'], severity: 'high' };
      const result = await securityToolHandlers.security_scan_vulnerabilities(args);

      const scanData = JSON.parse(result.content[0].text.split('\n\n')[1]);
      const firestoreVulns = scanData.vulnerabilities.filter((v: any) => v.service === 'firestore');
      
      expect(firestoreVulns.length).toBeGreaterThan(0);
      firestoreVulns.forEach((vuln: any) => {
        expect(vuln.id).toMatch(/^FIREBASE-\d+$/);
        expect(vuln.service).toBe('firestore');
        expect(['high', 'critical']).toContain(vuln.severity);
      });
    });
  });

  describe('Compliance Checks', () => {
    it('should include compliance status in auth audit', async () => {
      const args = { detailed: true };
      const result = await securityToolHandlers.security_audit_auth(args);

      const auditData = JSON.parse(result.content[0].text.split('\n\n')[1]);
      expect(auditData.complianceChecks).toBeDefined();
      expect(auditData.complianceChecks.passwordPolicy).toBeDefined();
      expect(auditData.complianceChecks.mfaEnabled).toBeDefined();
      expect(auditData.complianceChecks.emailVerification).toBeDefined();
      expect(auditData.complianceChecks.accountLockout).toBeDefined();
    });

    it('should include compliance status in security report', async () => {
      const args = { format: 'json' };
      const result = await securityToolHandlers.security_generate_report(args);

      const report = JSON.parse(result.content[0].text);
      expect(report.compliance).toBeDefined();
      expect(report.compliance.gdpr).toBeDefined();
      expect(report.compliance.ccpa).toBeDefined();
      expect(report.compliance.sox).toBeDefined();
      expect(report.compliance.hipaa).toBeDefined();
    });
  });
});