#!/usr/bin/env node

/**
 * Logo Validation Script
 * Validates that logo files meet repository standards
 */

const fs = require('fs');
const path = require('path');

// Validation rules
const RULES = {
  format: 'png',
  maxWidth: 512,
  minWidth: 512,
  maxFileSize: 100 * 1024, // 100KB
  namingPattern: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?-[a-z]{2,4}\.png$/
};

/**
 * Validate logo filename
 */
function validateFilename(filename) {
  const errors = [];

  if (!RULES.namingPattern.test(filename)) {
    errors.push('Filename must follow pattern: channel-name-country-code.png (lowercase, hyphens only)');
  }

  if (!filename.endsWith('.png')) {
    errors.push('File must be PNG format');
  }

  return errors;
}

/**
 * Validate logo file
 */
function validateFile(filePath) {
  const errors = [];
  const warnings = [];

  // Check file exists
  if (!fs.existsSync(filePath)) {
    errors.push('File does not exist');
    return { errors, warnings };
  }

  // Check file size
  const stats = fs.statSync(filePath);
  if (stats.size > RULES.maxFileSize) {
    warnings.push(`File size (${(stats.size / 1024).toFixed(2)}KB) exceeds recommended limit (${RULES.maxFileSize / 1024}KB)`);
  }

  if (stats.size === 0) {
    errors.push('File is empty');
  }

  // Check filename
  const filename = path.basename(filePath);
  const filenameErrors = validateFilename(filename);
  errors.push(...filenameErrors);

  return { errors, warnings };
}

/**
 * Validate all logos in a directory
 */
function validateDirectory(dirPath) {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    files: []
  };

  if (!fs.existsSync(dirPath)) {
    console.error(`Directory does not exist: ${dirPath}`);
    return results;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file === '.gitkeep' || !file.endsWith('.png')) {
      continue;
    }

    const filePath = path.join(dirPath, file);
    const { errors, warnings } = validateFile(filePath);

    results.total++;

    const fileResult = {
      file,
      path: filePath,
      valid: errors.length === 0,
      errors,
      warnings
    };

    if (errors.length === 0) {
      results.passed++;
    } else {
      results.failed++;
    }

    if (warnings.length > 0) {
      results.warnings++;
    }

    results.files.push(fileResult);
  }

  return results;
}

/**
 * Main validation function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node validate-logo.js <file-or-directory>');
    console.log('');
    console.log('Examples:');
    console.log('  node validate-logo.js countries/united-states/espn-us.png');
    console.log('  node validate-logo.js countries/united-states/');
    process.exit(1);
  }

  const target = args[0];
  const targetPath = path.resolve(target);

  console.log('🔍 Validating logos...\n');

  // Check if target is a file or directory
  if (fs.statSync(targetPath).isDirectory()) {
    const results = validateDirectory(targetPath);

    // Print results
    console.log(`Total files: ${results.total}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`⚠️  Warnings: ${results.warnings}`);
    console.log('');

    // Print details
    for (const file of results.files) {
      if (file.errors.length > 0) {
        console.log(`❌ ${file.file}`);
        file.errors.forEach(err => console.log(`   - ${err}`));
      } else if (file.warnings.length > 0) {
        console.log(`⚠️  ${file.file}`);
        file.warnings.forEach(warn => console.log(`   - ${warn}`));
      } else {
        console.log(`✅ ${file.file}`);
      }
    }

    process.exit(results.failed > 0 ? 1 : 0);
  } else {
    const { errors, warnings } = validateFile(targetPath);

    if (errors.length > 0) {
      console.log(`❌ ${path.basename(targetPath)}`);
      errors.forEach(err => console.log(`   - ${err}`));
      process.exit(1);
    } else if (warnings.length > 0) {
      console.log(`⚠️  ${path.basename(targetPath)}`);
      warnings.forEach(warn => console.log(`   - ${warn}`));
      process.exit(0);
    } else {
      console.log(`✅ ${path.basename(targetPath)}`);
      process.exit(0);
    }
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateFile, validateFilename, validateDirectory };
