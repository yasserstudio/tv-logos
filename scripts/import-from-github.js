#!/usr/bin/env node

/**
 * Import Logos from tv-logo/tv-logos GitHub Repository
 * Downloads logos from the official tv-logo/tv-logos repository
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const REPO_API_BASE = 'https://api.github.com/repos/tv-logo/tv-logos/contents';
const RAW_BASE = 'https://raw.githubusercontent.com/tv-logo/tv-logos/master';

// Country directory mappings
const COUNTRY_MAPPINGS = {
  'united-states': ['united-states', 'us', 'usa'],
  'united-kingdom': ['united-kingdom', 'uk', 'britain'],
  'canada': ['canada', 'ca'],
  'australia': ['australia', 'au'],
  'germany': ['germany', 'de', 'deutschland'],
  'france': ['france', 'fr'],
  'spain': ['spain', 'es', 'espana'],
  'italy': ['italy', 'it', 'italia'],
  'international': ['international', 'world']
};

/**
 * Fetch JSON from GitHub API
 */
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'tv-logos-importer',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse JSON'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Download file from URL
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const file = fs.createWriteStream(destPath);

    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${response.statusCode}`));
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });

      file.on('error', (err) => {
        file.close();
        fs.unlinkSync(destPath);
        reject(err);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
      }
      reject(err);
    });
  });
}

/**
 * Map source directory to our country directory
 */
function mapCountryDirectory(sourceDir) {
  const sourceLower = sourceDir.toLowerCase();

  for (const [ourDir, aliases] of Object.entries(COUNTRY_MAPPINGS)) {
    if (aliases.some(alias => sourceLower.includes(alias))) {
      return ourDir;
    }
  }

  return null;
}

/**
 * List directories in the repo
 */
async function listRepoDirectories() {
  try {
    console.log('🔍 Fetching repository structure...\n');

    const contents = await fetchJSON(`${REPO_API_BASE}/countries`);

    const directories = contents
      .filter(item => item.type === 'dir')
      .map(item => item.name);

    return directories;
  } catch (error) {
    console.error('❌ Failed to fetch repository structure:', error.message);
    return [];
  }
}

/**
 * Import logos from a specific directory
 */
async function importFromDirectory(sourceDir, targetDir, options = {}) {
  const { limit = null, dryRun = false } = options;

  try {
    console.log(`📁 Processing: ${sourceDir}`);

    // Fetch directory contents
    const contents = await fetchJSON(`${REPO_API_BASE}/countries/${sourceDir}`);

    let pngFiles = contents.filter(item =>
      item.type === 'file' && item.name.toLowerCase().endsWith('.png')
    );

    if (limit) {
      pngFiles = pngFiles.slice(0, limit);
    }

    console.log(`   Found ${pngFiles.length} logo(s)`);

    if (dryRun) {
      console.log('   [DRY RUN] Would download:');
      pngFiles.forEach(file => console.log(`   - ${file.name}`));
      return { success: 0, failed: 0, skipped: pngFiles.length };
    }

    // Ensure target directory exists
    const targetPath = path.join(__dirname, '..', 'countries', targetDir);
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    let success = 0;
    let failed = 0;
    let skipped = 0;

    for (const file of pngFiles) {
      const destFile = path.join(targetPath, file.name);

      // Skip if already exists
      if (fs.existsSync(destFile)) {
        console.log(`   ⏭️  ${file.name} (already exists)`);
        skipped++;
        continue;
      }

      try {
        const downloadUrl = `${RAW_BASE}/countries/${sourceDir}/${file.name}`;
        await downloadFile(downloadUrl, destFile);
        console.log(`   ✅ ${file.name}`);
        success++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`   ❌ ${file.name} - ${error.message}`);
        failed++;
      }
    }

    return { success, failed, skipped };
  } catch (error) {
    console.error(`   ❌ Failed to process directory: ${error.message}`);
    return { success: 0, failed: 0, skipped: 0 };
  }
}

/**
 * Main import function
 */
async function main() {
  const args = process.argv.slice(2);

  console.log('📥 TV Logos Importer - GitHub Edition\n');
  console.log('Source: https://github.com/tv-logo/tv-logos\n');

  // Parse arguments
  let country = null;
  let limit = null;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--country' || args[i] === '-c') {
      country = args[++i];
    } else if (args[i] === '--limit' || args[i] === '-l') {
      limit = parseInt(args[++i]);
    } else if (args[i] === '--dry-run' || args[i] === '-d') {
      dryRun = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log('Usage: node import-from-github.js [options]\n');
      console.log('Options:');
      console.log('  -c, --country <name>   Import only from specific country (e.g., "united-states")');
      console.log('  -l, --limit <number>   Limit number of logos per directory');
      console.log('  -d, --dry-run          Show what would be downloaded without downloading');
      console.log('  -h, --help             Show this help message\n');
      console.log('Examples:');
      console.log('  node scripts/import-from-github.js');
      console.log('  node scripts/import-from-github.js --country united-states --limit 10');
      console.log('  node scripts/import-from-github.js --dry-run');
      process.exit(0);
    }
  }

  // Get available directories from source repo
  const sourceDirectories = await listRepoDirectories();

  if (sourceDirectories.length === 0) {
    console.log('❌ No directories found in source repository');
    process.exit(1);
  }

  console.log('Available directories:');
  sourceDirectories.forEach(dir => console.log(`  - ${dir}`));
  console.log('');

  // Determine which directories to import
  let toImport = [];

  if (country) {
    const mapped = mapCountryDirectory(country);
    if (!mapped) {
      console.log(`❌ Unknown country: ${country}`);
      console.log('Available: ' + Object.keys(COUNTRY_MAPPINGS).join(', '));
      process.exit(1);
    }

    // Find matching source directory
    const sourceDir = sourceDirectories.find(dir =>
      COUNTRY_MAPPINGS[mapped].some(alias => dir.toLowerCase().includes(alias))
    );

    if (sourceDir) {
      toImport.push({ source: sourceDir, target: mapped });
    } else {
      console.log(`❌ No matching directory found for: ${country}`);
      process.exit(1);
    }
  } else {
    // Import from all matching directories
    for (const sourceDir of sourceDirectories) {
      const targetDir = mapCountryDirectory(sourceDir);
      if (targetDir) {
        toImport.push({ source: sourceDir, target: targetDir });
      }
    }
  }

  if (toImport.length === 0) {
    console.log('❌ No directories to import');
    process.exit(1);
  }

  console.log(`📦 Will import from ${toImport.length} director${toImport.length === 1 ? 'y' : 'ies'}\n`);

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be downloaded\n');
  }

  // Import logos
  let totalSuccess = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const { source, target } of toImport) {
    const result = await importFromDirectory(source, target, { limit, dryRun });
    totalSuccess += result.success;
    totalFailed += result.failed;
    totalSkipped += result.skipped;
    console.log('');
  }

  // Summary
  console.log('📊 Summary:');
  console.log(`   ✅ Downloaded: ${totalSuccess}`);
  console.log(`   ⏭️  Skipped: ${totalSkipped}`);
  console.log(`   ❌ Failed: ${totalFailed}`);

  if (!dryRun && totalSuccess > 0) {
    console.log('\n💡 Next steps:');
    console.log('   1. Run: npm run validate');
    console.log('   2. Run: npm run update');
    console.log('   3. Review and commit changes');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { downloadFile, importFromDirectory, listRepoDirectories };
