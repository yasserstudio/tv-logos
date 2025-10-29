#!/usr/bin/env node

/**
 * Index Update Script
 * Automatically updates index.json with logos from the countries directory
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const INDEX_FILE = path.join(__dirname, '..', 'index.json');
const COUNTRIES_DIR = path.join(__dirname, '..', 'countries');

// Country mappings
const COUNTRY_MAPPINGS = {
  'united-states': { code: 'us', name: 'United States' },
  'united-kingdom': { code: 'uk', name: 'United Kingdom' },
  'canada': { code: 'ca', name: 'Canada' },
  'australia': { code: 'au', name: 'Australia' },
  'germany': { code: 'de', name: 'Germany' },
  'france': { code: 'fr', name: 'France' },
  'spain': { code: 'es', name: 'Spain' },
  'italy': { code: 'it', name: 'Italy' },
  'international': { code: 'intl', name: 'International' }
};

// Category keywords for auto-detection
const CATEGORY_KEYWORDS = {
  sports: ['espn', 'sport', 'nfl', 'nba', 'mlb', 'nhl', 'fox-sports', 'bein', 'tennis', 'golf'],
  news: ['news', 'cnn', 'bbc-news', 'fox-news', 'msnbc', 'cnbc', 'sky-news'],
  entertainment: ['entertainment', 'e-network', 'bravo', 'lifetime'],
  movies: ['movies', 'hbo', 'showtime', 'starz', 'cinemax', 'amc', 'tcm'],
  documentary: ['discovery', 'history', 'national-geographic', 'animal-planet', 'science'],
  kids: ['kids', 'disney', 'nickelodeon', 'cartoon-network', 'nick-jr', 'disney-junior'],
  music: ['mtv', 'vh1', 'music', 'cmt'],
  lifestyle: ['hgtv', 'food-network', 'travel', 'cooking', 'tlc'],
  religious: ['religious', 'christian', 'catholic', 'faith']
};

/**
 * Detect category based on channel name
 */
function detectCategory(channelName) {
  const lowerName = channelName.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return category;
    }
  }

  return 'general';
}

/**
 * Parse filename to extract channel info
 */
function parseFilename(filename, countryDir) {
  const nameWithoutExt = filename.replace('.png', '');
  const parts = nameWithoutExt.split('-');
  const countryCode = parts[parts.length - 1];
  const channelSlug = parts.slice(0, -1).join('-');

  // Convert slug to readable name
  const channelName = parts
    .slice(0, -1)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const country = COUNTRY_MAPPINGS[countryDir] || { code: countryCode, name: countryDir };

  return {
    id: nameWithoutExt,
    name: channelName,
    country: countryDir,
    country_code: countryCode,
    category: detectCategory(channelSlug)
  };
}

/**
 * Scan countries directory for logos
 */
function scanLogos() {
  const channels = [];

  if (!fs.existsSync(COUNTRIES_DIR)) {
    console.error('Countries directory not found');
    return channels;
  }

  const countries = fs.readdirSync(COUNTRIES_DIR);

  for (const country of countries) {
    const countryPath = path.join(COUNTRIES_DIR, country);

    if (!fs.statSync(countryPath).isDirectory()) {
      continue;
    }

    const files = fs.readdirSync(countryPath);

    for (const file of files) {
      if (file === '.gitkeep' || !file.endsWith('.png')) {
        continue;
      }

      const channelInfo = parseFilename(file, country);
      const relativePath = `countries/${country}/${file}`;

      channels.push({
        ...channelInfo,
        path: relativePath,
        url: `https://raw.githubusercontent.com/[username]/tv-logos/main/${relativePath}`
      });
    }
  }

  return channels;
}

/**
 * Update index.json
 */
function updateIndex(channels) {
  let index;

  // Load existing index or create new one
  if (fs.existsSync(INDEX_FILE)) {
    index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
  } else {
    index = {
      version: '1.0.0',
      description: 'TV Logos Repository Index',
      repository: 'https://github.com/[username]/tv-logos',
      base_url: 'https://raw.githubusercontent.com/[username]/tv-logos/main'
    };
  }

  // Update channels
  index.channels = channels;
  index.updated = new Date().toISOString().split('T')[0];

  // Update statistics
  index.statistics = {
    total_channels: channels.length,
    total_countries: Object.keys(COUNTRY_MAPPINGS).length,
    last_updated: new Date().toISOString().split('T')[0]
  };

  // Update countries list
  index.countries = Object.entries(COUNTRY_MAPPINGS).map(([dir, info]) => ({
    code: info.code,
    name: info.name,
    directory: `countries/${dir}`
  }));

  // Update categories
  const uniqueCategories = [...new Set(channels.map(c => c.category))].sort();
  index.categories = uniqueCategories;

  // Write back to file
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + '\n');

  return index;
}

/**
 * Main function
 */
function main() {
  console.log('🔄 Scanning for logos...\n');

  const channels = scanLogos();

  console.log(`Found ${channels.length} logos\n`);

  if (channels.length === 0) {
    console.log('ℹ️  No logos found. Add PNG files to countries directories.');
    process.exit(0);
  }

  // Group by country for display
  const byCountry = {};
  channels.forEach(channel => {
    if (!byCountry[channel.country]) {
      byCountry[channel.country] = [];
    }
    byCountry[channel.country].push(channel);
  });

  // Display summary
  for (const [country, logos] of Object.entries(byCountry)) {
    console.log(`📁 ${country}: ${logos.length} logos`);
    logos.forEach(logo => {
      console.log(`   - ${logo.name} (${logo.category})`);
    });
  }

  console.log('\n📝 Updating index.json...');

  const index = updateIndex(channels);

  console.log(`✅ Index updated successfully!`);
  console.log(`   Total channels: ${index.statistics.total_channels}`);
  console.log(`   Categories: ${index.categories.join(', ')}`);
  console.log(`   Last updated: ${index.statistics.last_updated}`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { scanLogos, updateIndex, parseFilename };
