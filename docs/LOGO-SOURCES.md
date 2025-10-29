# Logo Sources Guide

This guide helps you find and obtain high-quality TV channel logos for the repository.

## 🎯 Quick Start

### Where to Find Logos

#### 1. Official Channel Websites
The best source is always the official channel website:

- **USA**: NBC, ABC, CBS, Fox, ESPN, CNN, etc.
- **UK**: BBC, ITV, Channel 4, Sky, etc.
- **Canada**: CBC, CTV, Global, etc.

Look for:
- Press/Media kits
- About pages
- Brand guidelines
- Footer logos

#### 2. Existing Logo Repositories

**Recommended sources:**
- [tv-logo/tv-logos](https://github.com/tv-logo/tv-logos) - Comprehensive collection
- [Wikimedia Commons](https://commons.wikimedia.org/) - Search "TV channel logo"
- [Brands of the World](https://www.brandsoftheworld.com/) - High-quality vector logos

**Note**: Always verify licenses and ensure you have permission to use.

#### 3. Search Engines

Google Images with specific search terms:
```
"Channel Name" logo transparent PNG
"Channel Name" logo 512px
"Channel Name" official logo
```

**Image search tips:**
- Use Tools → Size → Large
- Look for transparent backgrounds
- Verify it's the current logo version

#### 4. Press Kits and Media Resources

Many networks provide official media resources:
- **NBCUniversal**: [Press Site](https://www.nbcuniversal.com/press)
- **ViacomCBS**: Check individual network sites
- **Disney**: [Media site](https://press.disney.com/)
- **BBC**: [Media Centre](https://www.bbc.co.uk/mediacentre)

## 📐 Preparing Logos

### Required Specifications

- **Format**: PNG
- **Width**: 512px (maintain aspect ratio)
- **Background**: Transparent
- **File Size**: Under 100KB
- **Quality**: High resolution, clean edges

### Tools for Logo Preparation

#### Vector to PNG Conversion

If you have an SVG or vector file:

**Online Tools:**
- [CloudConvert](https://cloudconvert.com/svg-to-png) - SVG to PNG
- [Photopea](https://www.photopea.com/) - Free online Photoshop alternative

**Desktop Software:**
- Adobe Illustrator
- Inkscape (free)
- Affinity Designer

**Conversion Settings:**
- Width: 512px
- Maintain aspect ratio
- Export with transparency

#### PNG Optimization

Reduce file size without losing quality:

**Online Tools:**
- [TinyPNG](https://tinypng.com/) - Smart PNG optimization
- [ImageOptim Online](https://imageoptim.com/online) - Advanced optimization
- [Squoosh](https://squoosh.app/) - Google's image optimizer

**Command Line:**
```bash
# Using pngquant
pngquant --quality=80-100 --force --ext .png logo.png

# Using optipng
optipng -o7 logo.png
```

#### Background Removal

If logo has a background:

**Online Tools:**
- [Remove.bg](https://www.remove.bg/) - AI background removal
- [PhotoScissors](https://photoscissors.com/) - Manual/auto removal
- [Photopea](https://www.photopea.com/) - Use magic wand tool

**Desktop Software:**
- Photoshop - Magic wand or pen tool
- GIMP - Select by color tool

### Step-by-Step Workflow

#### 1. Find the Logo
```
✓ Search official channel website
✓ Check press/media sections
✓ Verify it's the current version
```

#### 2. Download/Extract
```
✓ Get highest resolution available
✓ Prefer vector formats (SVG, AI, EPS)
✓ Ensure transparent background
```

#### 3. Prepare the Logo
```
✓ Open in image editor
✓ Resize to 512px width
✓ Remove background if needed
✓ Clean up edges (remove artifacts)
✓ Add padding if logo touches edges
```

#### 4. Optimize
```
✓ Run through TinyPNG or similar
✓ Verify file size < 100KB
✓ Check quality on both light/dark backgrounds
```

#### 5. Validate
```
✓ Run validation script
✓ Check filename follows convention
✓ Verify transparency
```

## 📋 Logo Checklist

Before adding a logo to the repository:

- [ ] Logo is from official source or verified repository
- [ ] Current version (not outdated)
- [ ] 512px width (exact)
- [ ] PNG format with transparency
- [ ] File size under 100KB
- [ ] Clean edges, no artifacts
- [ ] Proper padding (5-10% around logo)
- [ ] Tested on light and dark backgrounds
- [ ] Filename follows naming convention
- [ ] Passes validation script

## 🔍 Quality Checks

### Visual Inspection

**Check for:**
- Sharp, clean edges (no pixelation)
- Proper colors (matches official branding)
- No compression artifacts
- Transparent background (not white)
- Adequate padding around logo
- Readable at small sizes (32px)

### Testing Backgrounds

Test your logo on different backgrounds:

```html
<!-- Light background -->
<div style="background: white; padding: 20px;">
  <img src="logo.png" width="200">
</div>

<!-- Dark background -->
<div style="background: #1a1a1a; padding: 20px;">
  <img src="logo.png" width="200">
</div>
```

## ⚖️ Legal Considerations

### Trademark Notice

- All logos are trademarks of their respective owners
- This repository doesn't claim ownership
- Logos provided for personal/educational use
- Commercial use must comply with trademark laws

### Usage Rights

**Acceptable:**
- Personal IPTV applications
- Educational projects
- Open source applications
- Non-commercial use with attribution

**Not Acceptable:**
- Selling logos to third parties
- Unauthorized commercial products
- Misrepresenting ownership
- Modifying logos (except sizing)

### Verification

Before adding a logo, ensure:
- You obtained it from a legitimate source
- You're not violating any copyright
- You have permission to redistribute
- It complies with repository license (CC BY-SA 4.0)

## 🛠️ Advanced Tips

### Batch Processing

For processing multiple logos:

**ImageMagick** (command line):
```bash
# Resize all logos to 512px width
for file in *.png; do
  convert "$file" -resize 512x -background none -flatten "resized/$file"
done

# Optimize all logos
for file in *.png; do
  optipng -o7 "$file"
done
```

**Node.js** (with Sharp library):
```javascript
const sharp = require('sharp');
const fs = require('fs');

const files = fs.readdirSync('./logos');

for (const file of files) {
  if (file.endsWith('.png')) {
    sharp(`./logos/${file}`)
      .resize(512, null)
      .png({ quality: 90 })
      .toFile(`./output/${file}`);
  }
}
```

### Vector Editing

When working with vector logos:

**Inkscape** (free):
```bash
# Export SVG to PNG at 512px width
inkscape logo.svg --export-png=logo.png --export-width=512
```

**Adobe Illustrator**:
1. File → Export → Export As
2. Format: PNG
3. Resolution: High (300 PPI)
4. Background: Transparent
5. Width: 512px

## 📚 Resources

### Tools
- [Photopea](https://www.photopea.com/) - Free online editor
- [GIMP](https://www.gimp.org/) - Free desktop editor
- [Inkscape](https://inkscape.org/) - Free vector editor
- [ImageMagick](https://imagemagick.org/) - Command-line image processing

### Optimization
- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)
- [ImageOptim](https://imageoptim.com/)

### Conversion
- [CloudConvert](https://cloudconvert.com/)
- [Online Convert](https://www.online-convert.com/)

### Learning
- [PNG Optimization Guide](https://tinypng.com/analyzer)
- [Image Formats Explained](https://web.dev/choose-the-right-image-format/)

## ❓ FAQ

**Q: Can I use logos from other GitHub repositories?**
A: Yes, if they're under compatible licenses. Always check and provide attribution.

**Q: What if I can't find a transparent version?**
A: Use background removal tools like Remove.bg or Photoshop's magic wand.

**Q: The logo is too small, can I upscale it?**
A: Avoid upscaling raster images. Search for higher resolution or vector versions.

**Q: Can I submit a slightly modified logo?**
A: No. Only submit official, unmodified logos (resizing is OK).

**Q: What about logos for channels that rebranded?**
A: Always use the current logo. Historical logos can be noted in metadata.

---

Need help? Open an issue or check our [Contributing Guide](../CONTRIBUTING.md).
