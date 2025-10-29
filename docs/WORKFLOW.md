# Logo Addition Workflow

This guide walks you through the complete process of adding logos to the repository.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** installed (v16 or higher)
2. **Git** installed
3. Repository cloned locally

### Installation

```bash
# Clone the repository
git clone https://github.com/[username]/tv-logos.git
cd tv-logos

# Install dependencies (if any)
npm install
```

## 📝 Standard Workflow

### Step 1: Obtain the Logo

See [LOGO-SOURCES.md](LOGO-SOURCES.md) for detailed information on finding logos.

**Quick checklist:**
- Find official logo source
- Download highest resolution available
- Prefer vector formats (SVG)
- Ensure current version

### Step 2: Prepare the Logo

**Required specifications:**
- Format: PNG
- Width: 512px
- Background: Transparent
- File size: < 100KB

**Using online tools:**

1. **Convert to PNG** (if needed):
   - Upload to [CloudConvert](https://cloudconvert.com/)
   - Convert SVG → PNG at 512px width

2. **Remove background** (if needed):
   - Upload to [Remove.bg](https://remove.bg/)
   - Download transparent version

3. **Optimize file size**:
   - Upload to [TinyPNG](https://tinypng.com/)
   - Download optimized version

### Step 3: Name the File

Follow the naming convention: `channel-name-country-code.png`

**Examples:**
```bash
espn-us.png           # ESPN (United States)
bbc-one-uk.png        # BBC One (United Kingdom)
cbc-news-ca.png       # CBC News (Canada)
fox-sports-1-us.png   # Fox Sports 1 (US)
a-and-e-us.png        # A&E (replace & with 'and')
discovery-plus-us.png # Discovery+ (use 'plus' for +)
```

**Rules:**
- All lowercase
- Hyphens to separate words
- Country code at end
- No special characters (except hyphens)

### Step 4: Place the Logo

Copy the logo file to the appropriate country directory:

```bash
# United States
cp logo.png countries/united-states/espn-us.png

# United Kingdom
cp logo.png countries/united-kingdom/bbc-one-uk.png

# Canada
cp logo.png countries/canada/cbc-ca.png
```

### Step 5: Validate the Logo

Run the validation script:

```bash
# Validate single file
node scripts/validate-logo.js countries/united-states/espn-us.png

# Validate entire directory
node scripts/validate-logo.js countries/united-states/
```

**Expected output:**
```
🔍 Validating logos...

✅ espn-us.png
```

**If validation fails:**
```
❌ ESPN-US.png
   - Filename must follow pattern: channel-name-country-code.png (lowercase, hyphens only)
```

Fix the issues and validate again.

### Step 6: Update Index

Run the index update script:

```bash
node scripts/update-index.js
```

**Expected output:**
```
🔄 Scanning for logos...

Found 5 logos

📁 united-states: 3 logos
   - ESPN (sports)
   - CNN (news)
   - HBO (movies)

📁 united-kingdom: 2 logos
   - BBC One (general)
   - Sky News (news)

📝 Updating index.json...
✅ Index updated successfully!
   Total channels: 5
   Categories: general, movies, news, sports
   Last updated: 2025-10-29
```

This automatically updates `index.json` with all logos.

### Step 7: Test the Logo

Verify the logo looks good:

**Create a test HTML file:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .test-container {
      display: flex;
      gap: 20px;
      padding: 20px;
    }
    .light { background: white; }
    .dark { background: #1a1a1a; }
    img { width: 200px; }
  </style>
</head>
<body>
  <div class="test-container">
    <div class="light">
      <img src="countries/united-states/espn-us.png" alt="ESPN">
    </div>
    <div class="dark">
      <img src="countries/united-states/espn-us.png" alt="ESPN">
    </div>
  </div>
</body>
</html>
```

Open in browser and check:
- Logo is clear and sharp
- Transparent background works on both light/dark
- Proper padding around logo
- No artifacts or pixelation

### Step 8: Commit Changes

```bash
# Check status
git status

# Add the new logo and updated index
git add countries/united-states/espn-us.png
git add index.json

# Commit with descriptive message
git commit -m "Add ESPN (US) logo"

# Push to your branch
git push origin your-branch-name
```

### Step 9: Create Pull Request

1. Go to GitHub repository
2. Click "Pull Requests" → "New Pull Request"
3. Select your branch
4. Fill in the PR template:

```markdown
## Logo Addition

**Channel:** ESPN
**Country:** United States
**Category:** Sports

**Checklist:**
- [x] Logo meets specifications (512px, PNG, transparent)
- [x] File size under 100KB
- [x] Naming convention followed
- [x] Validation passed
- [x] Index.json updated
- [x] Tested on light/dark backgrounds

**Source:** https://www.espn.com/press
```

5. Submit the pull request

## 🔄 Batch Addition Workflow

Adding multiple logos at once:

### Method 1: Manual Batch

```bash
# 1. Add all logos to appropriate directories
cp logo1.png countries/united-states/channel1-us.png
cp logo2.png countries/united-states/channel2-us.png
cp logo3.png countries/united-kingdom/channel3-uk.png

# 2. Validate all at once
node scripts/validate-logo.js countries/

# 3. Update index
node scripts/update-index.js

# 4. Commit all changes
git add countries/ index.json
git commit -m "Add multiple channel logos

- Channel 1 (US)
- Channel 2 (US)
- Channel 3 (UK)
"
git push
```

### Method 2: Using Scripts

Create a batch script for automation:

```bash
#!/bin/bash
# batch-add.sh

LOGOS_DIR="./new-logos"
REPO_DIR="."

for logo in "$LOGOS_DIR"/*.png; do
  filename=$(basename "$logo")

  # Extract country code (last part before .png)
  country_code="${filename##*-}"
  country_code="${country_code%.png}"

  # Determine country directory
  case "$country_code" in
    us) country_dir="united-states" ;;
    uk) country_dir="united-kingdom" ;;
    ca) country_dir="canada" ;;
    *) echo "Unknown country code: $country_code"; continue ;;
  esac

  # Copy logo
  cp "$logo" "$REPO_DIR/countries/$country_dir/$filename"
  echo "Added: $filename → countries/$country_dir/"
done

# Validate and update index
node scripts/validate-logo.js countries/
node scripts/update-index.js
```

Usage:
```bash
# Place all logos in ./new-logos/
chmod +x batch-add.sh
./batch-add.sh
```

## 🛠️ Advanced Workflows

### Using npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "validate": "node scripts/validate-logo.js countries/",
    "validate:file": "node scripts/validate-logo.js",
    "update": "node scripts/update-index.js",
    "test": "npm run validate && npm run update"
  }
}
```

Then use:
```bash
npm run validate              # Validate all logos
npm run validate:file logo.png  # Validate one logo
npm run update                # Update index
npm test                      # Validate + Update
```

### Pre-commit Hook

Automatically validate before commits:

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "🔍 Validating logos..."

# Run validation
node scripts/validate-logo.js countries/

if [ $? -ne 0 ]; then
  echo "❌ Validation failed. Please fix errors before committing."
  exit 1
fi

# Update index
echo "📝 Updating index..."
node scripts/update-index.js

# Add updated index to commit
git add index.json

echo "✅ Pre-commit checks passed"
exit 0
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

### GitHub Actions CI/CD

Automatically validate PRs:

Create `.github/workflows/validate.yml`:

```yaml
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

      - name: Check index is updated
        run: |
          node scripts/update-index.js
          git diff --exit-code index.json || {
            echo "index.json is not up to date"
            exit 1
          }
```

## 📊 Quality Assurance

### Before Committing

Run this checklist:

```bash
# 1. Validate logo
node scripts/validate-logo.js countries/united-states/espn-us.png

# 2. Check file size
ls -lh countries/united-states/espn-us.png

# 3. Update index
node scripts/update-index.js

# 4. Verify in index.json
cat index.json | grep "espn-us"

# 5. Test display (open in browser)
# 6. Commit
git add .
git commit -m "Add ESPN (US) logo"
```

### Common Issues and Fixes

**Issue: Validation fails - filename not lowercase**
```bash
# Fix: Rename file
mv ESPN-us.png espn-us.png
```

**Issue: File size too large**
```bash
# Fix: Optimize with pngquant
pngquant --quality=80-100 --force --ext .png logo.png
```

**Issue: Background not transparent**
```bash
# Fix: Use online tool or image editor
# Upload to remove.bg or use Photoshop/GIMP
```

**Issue: Logo not 512px width**
```bash
# Fix: Resize with ImageMagick
convert logo.png -resize 512x logo-512.png
```

## 🎯 Best Practices

1. **One logo per commit** (for individual additions)
2. **Batch similar logos** (multiple logos from same source)
3. **Always validate** before committing
4. **Update index** automatically
5. **Test visually** on light/dark backgrounds
6. **Write clear commit messages**
7. **Include source** in PR description

## 📚 References

- [Logo Sources Guide](LOGO-SOURCES.md) - Where to find logos
- [Contributing Guidelines](../CONTRIBUTING.md) - Repository rules
- [README](../README.md) - Repository overview

---

Need help? Open an issue or discussion on GitHub.
