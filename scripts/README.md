# Scripts Directory

Utility scripts for managing and maintaining the TV Logos repository.

## 📋 Available Scripts

### validate-logo.js

Validates logo files against repository standards.

**Usage:**

```bash
# Validate a single file
node scripts/validate-logo.js countries/united-states/espn-us.png

# Validate entire directory
node scripts/validate-logo.js countries/united-states/

# Validate all logos
node scripts/validate-logo.js countries/
```

**Validation checks:**

- ✅ Filename follows naming convention (`channel-name-country-code.png`)
- ✅ File is PNG format
- ✅ File exists and is not empty
- ⚠️  File size under 100KB (warning if exceeded)

**Example output:**

```
🔍 Validating logos...

Total files: 3
✅ Passed: 3
❌ Failed: 0
⚠️  Warnings: 0

✅ espn-us.png
✅ cnn-us.png
✅ fox-news-us.png
```

**Using npm:**

```bash
npm run validate              # Validate all
npm run validate:file <path>  # Validate specific file
```

### update-index.js

Automatically scans all logo files and updates `index.json` with metadata.

**Usage:**

```bash
# Update index.json
node scripts/update-index.js
```

**What it does:**

- Scans all directories in `countries/`
- Extracts channel information from filenames
- Auto-detects categories based on channel names
- Updates `index.json` with:
  - Channel metadata (id, name, country, category)
  - File paths and URLs
  - Statistics (total channels, countries)
  - Categories list

**Example output:**

```
🔄 Scanning for logos...

Found 5 logos

📁 united-states: 3 logos
   - ESPN (sports)
   - CNN (news)
   - Fox News (news)

📁 united-kingdom: 2 logos
   - BBC One (general)
   - ITV (general)

📝 Updating index.json...
✅ Index updated successfully!
   Total channels: 5
   Categories: general, news, sports
   Last updated: 2025-10-29
```

**Using npm:**

```bash
npm run update
```

**Category auto-detection:**

The script automatically detects categories based on channel names:

- **sports**: ESPN, NFL Network, NBA TV, etc.
- **news**: CNN, BBC News, Fox News, etc.
- **entertainment**: E!, Bravo, Lifetime, etc.
- **movies**: HBO, Showtime, AMC, etc.
- **documentary**: Discovery, History, Nat Geo, etc.
- **kids**: Disney, Nickelodeon, Cartoon Network, etc.
- **music**: MTV, VH1, CMT, etc.
- **lifestyle**: HGTV, Food Network, TLC, etc.
- **religious**: Faith-based channels
- **general**: Default category

## 🚀 Quick Reference

### Common Workflows

**Adding a new logo:**

```bash
# 1. Add logo file
cp logo.png countries/united-states/channel-us.png

# 2. Validate
npm run validate:file countries/united-states/channel-us.png

# 3. Update index
npm run update

# 4. Commit
git add .
git commit -m "Add Channel (US) logo"
```

**Batch validation:**

```bash
# Validate all logos before committing
npm run validate

# If all pass, update index
npm run update

# Commit everything
git add .
git commit -m "Add multiple logos"
```

**Run all checks:**

```bash
# Validate + Update in one command
npm test
```

## 📝 Script Details

### validate-logo.js

**Dependencies:** None (uses Node.js built-ins)

**Validation rules:**

```javascript
{
  format: 'png',
  maxFileSize: 100 * 1024,  // 100KB
  namingPattern: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?-[a-z]{2,4}\.png$/
}
```

**Exit codes:**
- `0` - All validations passed
- `1` - One or more validations failed

**Module exports:**

```javascript
const { validateFile, validateFilename, validateDirectory } = require('./validate-logo');
```

### update-index.js

**Dependencies:** None (uses Node.js built-ins)

**Index structure:**

```json
{
  "version": "1.0.0",
  "updated": "2025-10-29",
  "description": "TV Logos Repository Index",
  "repository": "https://github.com/[username]/tv-logos",
  "base_url": "https://raw.githubusercontent.com/[username]/tv-logos/main",
  "channels": [...],
  "categories": [...],
  "countries": [...],
  "statistics": {...}
}
```

**Module exports:**

```javascript
const { scanLogos, updateIndex, parseFilename } = require('./update-index');
```

## 🔧 Advanced Usage

### Pre-commit Hook

Automatically validate before commits:

```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🔍 Validating logos..."
node scripts/validate-logo.js countries/
if [ $? -ne 0 ]; then
  echo "❌ Validation failed"
  exit 1
fi
echo "📝 Updating index..."
node scripts/update-index.js
git add index.json
exit 0
EOF

chmod +x .git/hooks/pre-commit
```

### GitHub Actions

Automatically validate PRs:

```yaml
# .github/workflows/validate.yml
name: Validate Logos

on:
  pull_request:
    paths:
      - 'countries/**/*.png'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Validate logos
        run: node scripts/validate-logo.js countries/
      - name: Check index updated
        run: |
          node scripts/update-index.js
          git diff --exit-code index.json
```

### Custom Scripts

**Example: Find logos by category**

```javascript
const index = require('../index.json');

const category = 'sports';
const sportsChannels = index.channels.filter(c => c.category === category);

console.log(`${category} channels:`);
sportsChannels.forEach(c => console.log(`- ${c.name} (${c.country_code})`));
```

**Example: Generate country statistics**

```javascript
const index = require('../index.json');

const stats = index.channels.reduce((acc, channel) => {
  acc[channel.country] = (acc[channel.country] || 0) + 1;
  return acc;
}, {});

console.log('Logos per country:');
Object.entries(stats).forEach(([country, count]) => {
  console.log(`${country}: ${count}`);
});
```

## 📚 Resources

- [WORKFLOW.md](../docs/WORKFLOW.md) - Complete workflow guide
- [LOGO-SOURCES.md](../docs/LOGO-SOURCES.md) - Logo sources and preparation
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines

## 🔮 Future Scripts

Planned additions:

- **optimize.js** - Batch optimize PNG files
- **generate-report.js** - Generate repository statistics
- **find-duplicates.js** - Detect duplicate logos
- **check-broken-links.js** - Verify logo URLs
- **resize.js** - Batch resize logos to 512px

## 🤝 Contributing Scripts

Have an idea for a useful script? Contributions welcome!

**Requirements:**
- Use Node.js built-ins (avoid external dependencies if possible)
- Include clear documentation
- Add usage examples
- Follow existing code style
- Add npm script in package.json

---

For questions or issues, open a GitHub issue.
