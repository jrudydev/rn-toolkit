# Scripts

Utility scripts for the RN SDUI Toolkit monorepo.

## Available Scripts

### `generate-icons`

Generates app icons and splash screens for all apps from the astacinco brand favicon.

```bash
npm run generate-icons
```

**What it does:**
- Reads the source SVG from `../sites/astacinco/favicon.svg`
- Generates PNG icons at required sizes (1024x1024, 64x64)
- Creates splash screens (1284x2778)
- Applies tier-based color variants

**Generated files per app:**
| File | Size | Purpose |
|------|------|---------|
| `icon.png` | 1024x1024 | App icon (iOS/Android) |
| `adaptive-icon.png` | 1024x1024 | Android adaptive icon foreground |
| `favicon.png` | 64x64 | Web favicon |
| `splash.png` | 1284x2778 | Splash/launch screen |

**Tier-based colors:**
| Tier | Color | Hex | Used For |
|------|-------|-----|----------|
| Free | Cyan | `#00d4ff` | All free/open-source apps |
| Pro | Gold | `#F59E0B` | Premium/pro tools |

**Adding a new app:**

Edit `scripts/generate-icons.mjs` and add to `APP_CONFIG`:

```javascript
const APP_CONFIG = {
  'my-new-app': { tier: 'free', splashBg: '#07090d' },
  // ...
};
```

Then run `npm run generate-icons`.

## Dependencies

These scripts require dev dependencies installed at the root:

```bash
npm install  # Installs @resvg/resvg-js and other deps
```
