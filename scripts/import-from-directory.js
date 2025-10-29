#!/usr/bin/env node

/**
 * Import Logos from Local Directory
 * Copies PNG logos from a local directory structure into the repository
 */

const fs = require('fs');
const path = require('path');

// Country directory mappings
const COUNTRY_MAPPINGS = {
  'united-states': ['united-states', 'us', 'usa', 'america'],
  'united-kingdom': ['united-kingdom', 'uk', 'britain', 'england'],
  'canada': ['canada', 'ca', 'canadian'],
  'australia': ['australia', 'au', 'aussie'],
  'germany': ['germany', 'de', 'deutschland', 'german'],
  'france': ['france', 'fr', 'french'],
  'spain': ['spain', 'es', 'espana', 'spanish'],
  'italy': ['italy', 'it', 'italia', 'italian'],
  'international': ['international', 'world', 'global', 'intl']
};

/**
 * Map directory name to our country directory
 */
function mapCountryDirectory(dirName) {
  const nameLower = dirName.toLowerCase();

  for (const [ourDir, aliases] of Object.entries(COUNTRY_MAPPINGS)) {
    if (aliases.some(alias => nameLower.includes(alias))) {
      return ourDir;
    }
  }

  // If no match, return sanitized version
  return dirName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

/**
 * Sanitize filename to match our convention
 */
function sanitizeFilename(filename, countryCode) {
  // Remove extension
  let name = path.basename(filename, path.extname(filename));

  // Convert to lowercase
  name = name.toLowerCase();

  // Replace spaces and underscores with hyphens
  name = name.replace(/[\s_]+/g, '-');

  // Remove special characters (keep only alphanumeric and hyphens)
  name = name.replace(/[^a-z0-9-]/g, '');

  // Remove multiple consecutive hyphens
  name = name.replace(/-+/g, '-');

  // Remove leading/trailing hyphens
  name = name.replace(/^-+|-+$/g, '');

  // Check if it already ends with country code
  if (!name.endsWith(`-${countryCode}`)) {
    name = `${name}-${countryCode}`;
  }

  return `${name}.png`;
}

/**
 * Get country code from directory name
 */
function getCountryCode(dirName) {
  const nameLower = dirName.toLowerCase();

  const codeMap = {
    'united-states': 'us',
    'united-kingdom': 'uk',
    'canada': 'ca',
    'australia': 'au',
    'germany': 'de',
    'france': 'fr',
    'spain': 'es',
    'italy': 'it',
    'international': 'intl'
  };

  for (const [dir, code] of Object.entries(codeMap)) {
    if (COUNTRY_MAPPINGS[dir].some(alias => nameLower.includes(alias))) {
      return code;
    }
  }

  return 'xx'; // Unknown
}

/**
 * Copy file with optional rename
 */
function copyFile(source, destination, options = {}) {
  const { dryRun = false, overwrite = false } = options;

  if (!overwrite && fs.existsSync(destination)) {
    return { status: 'skipped', message: 'already exists' };
  }

  if (dryRun) {
    return { status: 'dry-run', message: 'would copy' };
  }

  try {
    fs.copyFileSync(source, destination);
    return { status: 'success', message: 'copied' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

/**
 * Import logos from a directory
 */
function importFromDirectory(sourceDir, options = {}) {
  const {
    dryRun = false,
    overwrite = false,
    recursive = true,
    sanitize = true
  } = options;

  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    files: []
  };

  const repoRoot = path.join(__dirname, '..');
  const countriesDir = path.join(repoRoot, 'countries');

  // Check if source directory exists
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source directory does not exist: ${sourceDir}`);
    return results;
  }

  // Check if source is a directory
  if (!fs.statSync(sourceDir).isDirectory()) {
    console.error(`❌ Source path is not a directory: ${sourceDir}`);
    return results;
  }

  // Process directory
  function processDirectory(dir, depth = 0) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && recursive) {
        // Recursively process subdirectories
        processDirectory(fullPath, depth + 1);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
        // Process PNG file
        const relativePath = path.relative(sourceDir, fullPath);
        const dirName = path.dirname(relativePath);

        // Determine target country directory
        let targetCountry;
        if (dirName === '.') {
          // Files in root - need to guess or use default
          targetCountry = 'international';
        } else {
          // Map directory name to country
          const firstDir = dirName.split(path.sep)[0];
          targetCountry = mapCountryDirectory(firstDir);
        }

        const countryCode = getCountryCode(targetCountry);

        // Sanitize filename if requested
        let targetFilename = entry.name;
        if (sanitize) {
          targetFilename = sanitizeFilename(entry.name, countryCode);
        }

        // Ensure target directory exists
        const targetDir = path.join(countriesDir, targetCountry);
        if (!fs.existsSync(targetDir)) {
          if (!dryRun) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
        }

        const targetPath = path.join(targetDir, targetFilename);

        // Copy file
        const result = copyFile(fullPath, targetPath, { dryRun, overwrite });

        results.files.push({
          source: relativePath,
          target: `countries/${targetCountry}/${targetFilename}`,
          status: result.status,
          message: result.message
        });

        if (result.status === 'success') {
          results.success++;
        } else if (result.status === 'skipped') {
          results.skipped++;
        } else if (result.status === 'error') {
          results.failed++;
        }
      }
    }
  }

  processDirectory(sourceDir);

  return results;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  console.log('📥 TV Logos Importer - Local Directory Edition\n');

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node import-from-directory.js <source-directory> [options]\n');
    console.log('Options:');
    console.log('  -d, --dry-run          Show what would be copied without copying');
    console.log('  -o, --overwrite        Overwrite existing files');
    console.log('  -n, --no-recursive     Do not process subdirectories');
    console.log('  -s, --no-sanitize      Do not sanitize filenames');
    console.log('  -h, --help             Show this help message\n');
    console.log('Examples:');
    console.log('  node scripts/import-from-directory.js /path/to/logos');
    console.log('  node scripts/import-from-directory.js ~/Downloads/tv-logos --dry-run');
    console.log('  node scripts/import-from-directory.js ./logos --overwrite');
    process.exit(0);
  }

  const sourceDir = path.resolve(args[0]);

  // Parse options
  const options = {
    dryRun: args.includes('--dry-run') || args.includes('-d'),
    overwrite: args.includes('--overwrite') || args.includes('-o'),
    recursive: !(args.includes('--no-recursive') || args.includes('-n')),
    sanitize: !(args.includes('--no-sanitize') || args.includes('-s'))
  };

  console.log(`Source: ${sourceDir}`);
  console.log(`Options:`, options);
  console.log('');

  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be copied\n');
  }

  // Import logos
  const results = importFromDirectory(sourceDir, options);

  // Display results
  console.log('📊 Results:\n');

  const statusIcons = {
    'success': '✅',
    'skipped': '⏭️',
    'error': '❌',
    'dry-run': '🔍'
  };

  results.files.forEach(file => {
    const icon = statusIcons[file.status] || '❓';
    console.log(`${icon} ${file.source} → ${file.target}`);
    if (file.message) {
      console.log(`   ${file.message}`);
    }
  });

  console.log('');
  console.log('📈 Summary:');
  console.log(`   ✅ Copied: ${results.success}`);
  console.log(`   ⏭️  Skipped: ${results.skipped}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   📁 Total: ${results.files.length}`);

  if (!options.dryRun && results.success > 0) {
    console.log('\n💡 Next steps:');
    console.log('   1. Run: npm run validate');
    console.log('   2. Run: npm run update');
    console.log('   3. Review and commit changes');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { importFromDirectory, sanitizeFilename, mapCountryDirectory };
