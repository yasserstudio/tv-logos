# Logo Import Guide

This guide explains how to quickly import logos from external sources into your repository.

## 🚀 Quick Import Methods

### Method 1: Import from GitHub Repository (tv-logo/tv-logos)

The easiest way to populate your repository is to import logos from the official [tv-logo/tv-logos](https://github.com/tv-logo/tv-logos) repository.

**Import all logos:**

```bash
npm run import:github
```

**Import from specific country:**

```bash
npm run import:github -- --country united-states
```

**Import with limit (for testing):**

```bash
npm run import:github -- --country united-states --limit 10
```

**Dry run (see what would be imported):**

```bash
npm run import:github -- --dry-run
```

**Full command options:**

```bash
node scripts/import-from-github.js [options]

Options:
  -c, --country <name>   Import only from specific country
  -l, --limit <number>   Limit number of logos per directory
  -d, --dry-run          Show what would be downloaded
  -h, --help             Show help message
```

### Method 2: Import from Local Directory

If you have logos in a local directory, you can import them automatically.

**Basic usage:**

```bash
npm run import:dir -- /path/to/logos
```

**Examples:**

```bash
# Import from downloaded tv-logos repository
npm run import:dir -- ~/Downloads/tv-logos/countries

# Import from custom directory
npm run import:dir -- /mnt/media/logos

# Dry run to see what would be imported
npm run import:dir -- ~/logos --dry-run

# Overwrite existing files
npm run import:dir -- ~/logos --overwrite
```

**Full command options:**

```bash
node scripts/import-from-directory.js <source-directory> [options]

Options:
  -d, --dry-run          Show what would be copied
  -o, --overwrite        Overwrite existing files
  -n, --no-recursive     Do not process subdirectories
  -s, --no-sanitize      Do not sanitize filenames
  -h, --help             Show help message
```

## 📋 Import Workflows

### Workflow 1: Bootstrap Repository from GitHub

Quickly populate your repository with logos from tv-logo/tv-logos:

```bash
# 1. Import logos from USA (testing with 20 logos)
npm run import:github -- --country united-states --limit 20

# 2. Validate imported logos
npm run validate

# 3. Update index.json
npm run update

# 4. Review changes
git status

# 5. Commit
git add .
git commit -m "Import logos from tv-logo/tv-logos"
git push
```

### Workflow 2: Import All Countries

Import logos from all available countries:

```bash
# 1. Import all (this will take time and download many files)
npm run import:github

# 2. Validate all
npm run validate

# 3. Update index
npm run update

# 4. Commit
git add .
git commit -m "Import all logos from tv-logo/tv-logos"
git push
```

### Workflow 3: Import from Local Clone

If you've already cloned tv-logo/tv-logos locally:

```bash
# 1. Clone the source repository
git clone https://github.com/tv-logo/tv-logos.git ~/tv-logos-source

# 2. Import from local directory
npm run import:dir -- ~/tv-logos-source/countries

# 3. Validate
npm run validate

# 4. Update index
npm run update

# 5. Clean up source
rm -rf ~/tv-logos-source

# 6. Commit
git add .
git commit -m "Import logos from tv-logo/tv-logos"
git push
```

### Workflow 4: Import Custom Logo Collection

If you have your own logo collection:

```bash
# 1. Organize your logos in directories by country
# Structure:
#   /my-logos/
#     ├── usa/         (or united-states)
#     ├── uk/          (or united-kingdom)
#     └── canada/

# 2. Import (with filename sanitization)
npm run import:dir -- /my-logos

# 3. Validate (check for any issues)
npm run validate

# 4. Update index
npm run update

# 5. Review and commit
git add .
git commit -m "Import custom logo collection"
git push
```

## 🔧 Advanced Usage

### Selective Country Import

Import logos only for specific countries:

```bash
# United States
npm run import:github -- --country united-states

# United Kingdom
npm run import:github -- --country united-kingdom

# Multiple countries (run separately)
npm run import:github -- --country united-states
npm run import:github -- --country canada
npm run import:github -- --country australia
```

### Testing Before Import

Always test with dry-run first:

```bash
# Test GitHub import
npm run import:github -- --country united-states --limit 5 --dry-run

# Test directory import
npm run import:dir -- ~/logos --dry-run
```

### Handling Existing Logos

By default, import scripts skip existing files:

```bash
# This will skip files that already exist
npm run import:dir -- ~/logos

# To overwrite existing files
npm run import:dir -- ~/logos --overwrite
```

### Filename Sanitization

The directory import automatically sanitizes filenames:

- Converts to lowercase
- Replaces spaces/underscores with hyphens
- Removes special characters
- Adds country code suffix if missing

**Example transformations:**

```
ESPN US.png          → espn-us.png
BBC_One_UK.png       → bbc-one-uk.png
Discovery Channel.png → discovery-channel-us.png
A&E.png              → a-e-us.png
```

To disable sanitization:

```bash
npm run import:dir -- ~/logos --no-sanitize
```

## 📊 Post-Import Checklist

After importing logos, always run:

```bash
# 1. Validate all logos
npm run validate

# 2. Check for errors
# Fix any validation errors reported

# 3. Update index.json
npm run update

# 4. Review changes
git status
git diff countries/
git diff index.json

# 5. Commit if satisfied
git add .
git commit -m "Import logos: [description]"
git push
```

## 🎯 Import Strategies

### Strategy 1: Start Small (Recommended)

Best for getting started:

```bash
# Import 10-20 logos from one country
npm run import:github -- --country united-states --limit 20
npm run validate
npm run update
git add . && git commit -m "Initial logo import (US - 20 logos)"
```

### Strategy 2: Country by Country

Systematic approach:

```bash
# Import each country separately
for country in united-states united-kingdom canada; do
  echo "Importing $country..."
  npm run import:github -- --country $country --limit 50
  npm run validate
  npm run update
  git add . && git commit -m "Import logos: $country"
done
```

### Strategy 3: Full Import

Import everything at once (requires time and bandwidth):

```bash
npm run import:github
# Wait for download to complete...
npm run validate
npm run update
git add . && git commit -m "Import all logos from tv-logo/tv-logos"
```

## ⚠️ Important Notes

### GitHub API Rate Limiting

The GitHub import script uses GitHub API which has rate limits:

- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5000 requests/hour

For large imports, the script includes delays between downloads to avoid rate limiting.

### Network Requirements

- GitHub import requires internet connection
- Large imports may take significant time
- Download speeds depend on your connection

### File Organization

- Imported logos maintain their original filenames
- Directory import supports automatic filename sanitization
- Country directories are auto-mapped from source structure

### Validation

Always validate after import:

```bash
npm run validate
```

This ensures:
- Filenames follow convention
- File formats are correct
- No corrupted files

## 🆘 Troubleshooting

### "No directories found"

**Problem:** GitHub import can't fetch repository structure

**Solutions:**
- Check internet connection
- Verify GitHub is accessible
- Try local directory import instead

### "Already exists" messages

**Problem:** Files already exist in destination

**Solutions:**
- Normal behavior - script skips existing files
- Use `--overwrite` flag to replace existing files
- Delete existing files first if needed

### Validation failures after import

**Problem:** Imported logos fail validation

**Solutions:**

```bash
# See which files failed
npm run validate

# Common issues:
# 1. Filename not lowercase
#    Fix: Rename file to lowercase

# 2. Wrong naming convention
#    Fix: Rename to match channel-name-country-code.png

# 3. File too large
#    Fix: Optimize with TinyPNG
```

### Country not recognized

**Problem:** Directory import doesn't recognize country

**Solutions:**
- Ensure directory name includes country identifier
- Supported patterns: "united-states", "us", "usa"
- Check COUNTRY_MAPPINGS in script for full list

## 📚 Examples

### Example 1: Quick Start

```bash
# Import 10 US logos
npm run import:github -- --country united-states --limit 10

# Validate and update
npm test

# Commit
git add . && git commit -m "Add 10 US channel logos"
```

### Example 2: Import from Downloaded Zip

```bash
# 1. Download tv-logos as zip from GitHub
# 2. Extract to ~/Downloads/tv-logos-master

# 3. Import
npm run import:dir -- ~/Downloads/tv-logos-master/countries

# 4. Validate and update
npm test

# 5. Commit
git add . && git commit -m "Import logos from tv-logo/tv-logos"
```

### Example 3: Selective Import

```bash
# Only import sports channels (manual process)
# 1. Import all
npm run import:github -- --country united-states

# 2. Remove non-sports manually, or
# 3. Use grep to find sports channels in index.json
cat index.json | grep -i "sports"

# 4. Delete unwanted files
# 5. Update index
npm run update
```

## 🔗 Resources

- [tv-logo/tv-logos](https://github.com/tv-logo/tv-logos) - Source repository
- [WORKFLOW.md](WORKFLOW.md) - Standard logo addition workflow
- [LOGO-SOURCES.md](LOGO-SOURCES.md) - Logo sources and preparation

---

For questions or issues, open a GitHub issue.
