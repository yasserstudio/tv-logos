# Countries Directory

This directory contains TV channel logos organized by country and region.

## Available Regions

- **united-states/** - US television channels
- **united-kingdom/** - UK television channels
- **canada/** - Canadian television channels
- **australia/** - Australian television channels
- **germany/** - German television channels
- **france/** - French television channels
- **spain/** - Spanish television channels
- **italy/** - Italian television channels
- **international/** - International and multinational channels

## Adding New Countries

When adding logos for a new country:

1. Create a new directory with the lowercase country name (use hyphens for spaces)
2. Follow the naming convention: `channel-name-country-code.png`
3. Update the main `index.json` file
4. Ensure logos meet the specifications (512px width, PNG format)

## Examples

```
countries/
├── united-states/
│   ├── espn-us.png
│   ├── cnn-us.png
│   └── fox-news-us.png
├── united-kingdom/
│   ├── bbc-one-uk.png
│   ├── itv-uk.png
│   └── sky-news-uk.png
└── canada/
    ├── cbc-ca.png
    └── ctv-ca.png
```
