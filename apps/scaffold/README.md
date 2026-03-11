# Scaffold

A minimal Expo app pre-configured with all @astacinco free packages. Use this as a template for new practice apps or feature development.

## Overview

The scaffold app demonstrates all free packages working together:

- **Theming**: Light/dark mode with color tokens
- **Primitives**: Text, Button, Card, Input, VStack, HStack
- **i18n**: Translations, pluralization, locale formatting
- **Performance**: Render tracking, measurement, tracing

## Quick Start

```bash
# Install dependencies
npm install

# Start development
npm start

# Run on specific platform
npm run ios
npm run android
npm run web
```

## Pre-Configured Packages

### @astacinco/rn-theming
```tsx
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';

const { colors, spacing, mode, setMode } = useTheme();
```

### @astacinco/rn-primitives
```tsx
import {
  Text, Button, Card, Input,
  VStack, HStack, Container, Divider
} from '@astacinco/rn-primitives';
```

### @astacinco/rn-i18n
```tsx
import {
  I18nProvider, ConsoleAdapter,
  useTranslation, useLocale
} from '@astacinco/rn-i18n';

const { t, tp } = useTranslation();
const { locale, setLocale, formatCurrency } = useLocale();
```

### @astacinco/rn-performance
```tsx
import {
  PerformanceProvider, ConsoleAdapter,
  usePerformance, useRenderTracker
} from '@astacinco/rn-performance';

const { measure, startTrace } = usePerformance();
const renderInfo = useRenderTracker({ componentName: 'MyComponent' });
```

## Use as Template

Copy this scaffold to create new practice apps:

```bash
# From monorepo root
cp -r apps/scaffold apps/my-new-app
cd apps/my-new-app

# Update app.json with new name/slug
# Update package.json name
npm install
npm start
```

## Structure

```
scaffold/
├── App.tsx           # Main app with all demos
├── app/              # Expo Router pages
│   ├── _layout.tsx
│   └── index.tsx
├── assets/           # App icons and images
├── app.json          # Expo config
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
└── babel.config.js   # Babel config
```

## Features Demonstrated

| Feature | Package | Demo |
|---------|---------|------|
| Theme toggle | theming | Light/dark mode switch |
| Color tokens | theming | Primary, secondary, success, etc. |
| Surface variants | theming | surface, surfaceElevated |
| Spacing scale | theming | xs, sm, md, lg, xl |
| Text variants | primitives | title, subtitle, body, caption |
| Button variants | primitives | primary, secondary, outline, ghost |
| Card variants | primitives | filled, outlined, elevated |
| Input validation | primitives | error state, labels |
| Locale switching | i18n | EN, ES, FR |
| Translations | i18n | t() with interpolation |
| Pluralization | i18n | tp() with count |
| Number formatting | i18n | Currency, numbers, dates |
| Render tracking | performance | Count, duration |
| Measurement | performance | Async operation timing |
| Tracing | performance | Manual start/stop |

## Adapters (Console-based)

Both i18n and performance use ConsoleAdapter for development:

```tsx
// i18n adapter
const i18nAdapter = new I18nConsoleAdapter({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'],
  resources: { ... }
});

// Performance adapter
const perfAdapter = new PerfConsoleAdapter({ prefix: '[Perf]' });
```

Production apps should use:
- Firebase adapters
- Analytics adapters
- Custom adapters

## Related

- **Assessment Practice**: Timed coding challenges
- **Challenge Hub**: Browse all challenges and assessments
