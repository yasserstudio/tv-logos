# Contributing to TV Logos

Thank you for your interest in contributing to the TV Logos repository! This guide will help you submit high-quality logos.

## 📋 Submission Guidelines

### Before You Submit

1. **Check for Duplicates**: Search existing logos to avoid duplicates
2. **Verify Trademark**: Ensure you have the right to use and share the logo
3. **Quality Check**: Logos must be high resolution and clean

### Logo Requirements

#### Technical Specifications

- **Format**: PNG with transparent background
- **Width**: 512px (height should maintain aspect ratio)
- **File Size**: Under 100KB (optimize with tools like TinyPNG or ImageOptim)
- **Color Mode**: RGB
- **Background**: Transparent (required)
- **Quality**: Sharp edges, no artifacts or pixelation

#### Visual Standards

- ✅ Official channel logo (current version)
- ✅ Clean and centered
- ✅ Proper padding (logo shouldn't touch edges)
- ✅ Readable at small sizes
- ❌ No watermarks or additional text
- ❌ No shadows or effects (unless part of official logo)
- ❌ No backgrounds (must be transparent)

### Naming Convention

Follow this strict naming pattern:

```
channel-name-country-code.png
```

#### Rules:
- All lowercase
- Use hyphens (`-`) to separate words
- Include country code at the end
- Remove special characters (except hyphens)
- Use official channel name

#### Examples:
```
✅ espn-us.png
✅ bbc-one-uk.png
✅ discovery-channel-us.png
✅ a-and-e-us.png (for A&E)
✅ espn-plus-us.png (for ESPN+)

❌ ESPN.png
❌ bbc_one_uk.png
❌ Discovery Channel US.png
❌ a&e-us.png
```

### Country Codes

Use ISO 3166-1 alpha-2 or common abbreviations:

- `us` - United States
- `uk` - United Kingdom
- `ca` - Canada
- `au` - Australia
- `de` - Germany
- `fr` - France
- `es` - Spain
- `it` - Italy
- `intl` - International

## 🚀 How to Contribute

### Option 1: GitHub Pull Request (Recommended)

1. **Fork the Repository**
   ```bash
   git clone https://github.com/[username]/tv-logos.git
   cd tv-logos
   ```

2. **Create a New Branch**
   ```bash
   git checkout -b add-channel-name
   ```

3. **Add Your Logo**
   - Place the logo in the appropriate country directory
   - Example: `countries/united-states/channel-name-us.png`

4. **Update index.json**
   Add an entry for your channel:
   ```json
   {
     "id": "channel-name-us",
     "name": "Channel Name",
     "country": "united-states",
     "country_code": "us",
     "category": "sports",
     "path": "countries/united-states/channel-name-us.png",
     "url": "https://raw.githubusercontent.com/[username]/tv-logos/main/countries/united-states/channel-name-us.png"
   }
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add Channel Name (US) logo"
   git push origin add-channel-name
   ```

6. **Create Pull Request**
   - Go to GitHub and create a pull request
   - Describe the channel and provide verification

### Option 2: GitHub Issue

If you can't submit a PR, create an issue:

1. Go to [Issues](../../issues)
2. Click "New Issue"
3. Use template: "Logo Request"
4. Provide channel details and source

## ✅ Pull Request Checklist

Before submitting, ensure:

- [ ] Logo meets technical specifications (512px width, PNG, transparent)
- [ ] File size is under 100KB
- [ ] Naming convention is followed exactly
- [ ] Logo is placed in correct country directory
- [ ] `index.json` is updated with channel metadata
- [ ] No duplicate logos exist
- [ ] Logo is official and current
- [ ] Commit message is descriptive

## 🔍 Review Process

1. **Automated Checks**: CI will verify file format and naming
2. **Manual Review**: Maintainers check quality and accuracy
3. **Feedback**: You may receive requests for changes
4. **Approval**: Once approved, your logo will be merged

## 📜 Legal Considerations

- **Trademarks**: All logos are trademarks of their respective owners
- **Usage**: Logos are for personal and educational use only
- **License**: By contributing, you agree to CC BY-SA 4.0 license
- **Verification**: You must have legitimate access to the logo
- **No Selling**: It's forbidden to sell or monetize these logos

## 🛠️ Optimization Tools

Recommended tools for preparing logos:

- **Vector Editing**: Adobe Illustrator, Inkscape, Figma
- **Raster Editing**: Photoshop, GIMP, Photopea
- **Optimization**: TinyPNG, ImageOptim, pngquant
- **Format Conversion**: CloudConvert, online-convert.com

## 💡 Tips for High-Quality Logos

1. **Start with Vector**: If possible, work from SVG or vector source
2. **Export Settings**: Use "Export for Web" with transparency
3. **Test Backgrounds**: Check logo on both light and dark backgrounds
4. **Padding**: Leave 5-10% padding around logo edges
5. **Consistency**: Match the style of existing logos in the repo

## ❓ Questions?

If you have questions or need help:

- Check existing [Issues](../../issues)
- Review the [README](README.md)
- Open a new issue with the "Question" label

## 🙏 Thank You!

Your contributions help make this resource valuable for the IPTV community!
