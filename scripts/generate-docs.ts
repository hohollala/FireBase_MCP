#!/usr/bin/env node

/**
 * Documentation Generation Script
 * 
 * Generates API documentation in multiple formats
 */

import { generateAPIDocumentation } from '../src/utils/api-doc-generator';
import { logger } from '../src/utils/logger';

async function main() {
  try {
    logger.info('Starting documentation generation');

    // Generate Markdown documentation
    await generateAPIDocumentation({
      outputFormat: 'markdown',
      outputPath: './docs/api.md',
      includeExamples: true,
      includeSchemas: true,
      groupByService: true,
    });

    // Generate HTML documentation
    await generateAPIDocumentation({
      outputFormat: 'html',
      outputPath: './docs/api.html',
      includeExamples: true,
      includeSchemas: true,
      groupByService: true,
    });

    // Generate JSON documentation
    await generateAPIDocumentation({
      outputFormat: 'json',
      outputPath: './docs/api.json',
      includeExamples: true,
      includeSchemas: true,
      groupByService: false,
    });

    // Generate OpenAPI specification
    await generateAPIDocumentation({
      outputFormat: 'openapi',
      outputPath: './docs/openapi.json',
      includeExamples: false,
      includeSchemas: true,
      groupByService: false,
    });

    logger.info('Documentation generation completed successfully');
    console.log('✅ API documentation generated:');
    console.log('  - docs/api.md (Markdown)');
    console.log('  - docs/api.html (HTML)');
    console.log('  - docs/api.json (JSON)');
    console.log('  - docs/openapi.json (OpenAPI)');
  } catch (error) {
    logger.error('Documentation generation failed', { error });
    console.error('❌ Documentation generation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}