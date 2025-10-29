# TV Logos Repository

A comprehensive collection of television channel logos for IPTV players and streaming applications.

## 📋 Overview

This repository provides high-quality TV channel logos organized by country and region. All logos are optimized for use in IPTV applications, electronic program guides (EPG), and streaming interfaces.

## 🗂️ Repository Structure

```
tv-logos/
├── countries/          # Logos organized by country/region
│   ├── united-states/
│   ├── united-kingdom/
│   ├── canada/
│   ├── international/
│   └── ...
├── misc/              # Supporting materials
├── scripts/           # Utility scripts
└── index.json         # Metadata mapping for programmatic access
```

## 📐 Logo Specifications

- **Format**: PNG with transparent background
- **Width**: 512px (maintaining aspect ratio)
- **Optimization**: Suitable for both light and dark backgrounds
- **Quality**: High resolution with clean edges

## 🏷️ Naming Convention

Logos follow a consistent lowercase, hyphenated naming pattern:

```
channel-name-country-code.png
```

### Examples:
- `espn-us.png` - ESPN (United States)
- `bbc-one-uk.png` - BBC One (United Kingdom)
- `cbc-news-ca.png` - CBC News (Canada)
- `discovery-channel-us.png` - Discovery Channel

### Special Cases:
- Ampersands (`&`) → `and` (e.g., `a-and-e-us.png`)
- Plus channels → `plus` suffix (e.g., `espn-plus-us.png`)
- Regional variants → include region code (e.g., `nbc-4-washington-us.png`)

## 🚀 Usage

### Direct URL Access

Access logos directly via raw GitHub URLs:

```
https://raw.githubusercontent.com/[username]/tv-logos/main/countries/united-states/espn-us.png
```

### Programmatic Access

Use the `index.json` file for API integration:

```javascript
const response = await fetch('https://raw.githubusercontent.com/[username]/tv-logos/main/index.json');
const logos = await response.json();
const espnLogo = logos.channels.find(c => c.id === 'espn-us');
```

### In IPTV Players

Reference logos in your M3U playlists:

```
#EXTINF:-1 tvg-logo="https://raw.githubusercontent.com/[username]/tv-logos/main/countries/united-states/espn-us.png",ESPN
http://example.com/stream
```

## 🚀 Quick Start

### Adding Logos

```bash
# 1. Clone the repository
git clone https://github.com/[username]/tv-logos.git
cd tv-logos

# 2. Add your logo to the appropriate directory
cp your-logo.png countries/united-states/channel-name-us.png

# 3. Validate the logo
npm run validate:file countries/united-states/channel-name-us.png

# 4. Update the index
npm run update

# 5. Commit and push
git add .
git commit -m "Add Channel Name (US) logo"
git push
```

For detailed instructions, see [WORKFLOW.md](docs/WORKFLOW.md).

## 📚 Documentation

- **[WORKFLOW.md](docs/WORKFLOW.md)** - Step-by-step guide for adding logos
- **[LOGO-SOURCES.md](docs/LOGO-SOURCES.md)** - Where to find and prepare logos
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

## 🛠️ Scripts

This repository includes helpful scripts for managing logos:

```bash
# Validate all logos
npm run validate

# Validate a specific logo
npm run validate:file countries/united-states/espn-us.png

# Update index.json with all logos
npm run update

# Run validation and update
npm test
```

See [scripts/README.md](scripts/README.md) for more details.

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Submitting new logos
- Logo quality standards
- Naming conventions
- File size optimization

### Where to Get Logos

See [LOGO-SOURCES.md](docs/LOGO-SOURCES.md) for comprehensive guidance on:
- Official channel websites
- Existing logo repositories
- Logo preparation tools
- Optimization techniques

## 📜 License

This repository is licensed under [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](LICENSE).

**Important Notes:**
- All logos are trademarks of their respective owners
- Logos are provided for personal and educational use
- Attribution is required when using these logos
- Commercial use must comply with trademark laws
- It is forbidden to sell these logos or use them in any illegitimate way

## 🌟 Acknowledgments

Inspired by the excellent work at [tv-logo/tv-logos](https://github.com/tv-logo/tv-logos).

## 📧 Support

- **Issues**: Report bugs or request logos via [GitHub Issues](../../issues)
- **Contributions**: Submit pull requests following our guidelines

---

**Disclaimer**: This repository contains logos that are trademarks of their respective television networks and broadcasters. All rights belong to their respective owners.
