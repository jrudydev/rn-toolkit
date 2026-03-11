# Showcase

The official showcase app for @astacinco React Native packages. Demonstrates all components and features with interactive examples.

## Overview

The showcase app demonstrates all free packages working together:

- **Theming**: Light/dark mode with color tokens
- **Primitives**: Text, Button, Card, Input, Tag, Timer, Tabs, and more
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

## Components Demonstrated

### Core Primitives
- `Text` - Themed text with variants (title, subtitle, body, caption, label)
- `Button` - Themed buttons with variants (primary, secondary, outline, ghost)
- `Card` - Container cards with variants (filled, outlined, elevated)
- `Input` - Form inputs with labels and error states
- `VStack` / `HStack` - Vertical and horizontal stacks with spacing
- `Container` - Padded content container
- `Divider` - Horizontal separator
- `Switch` - Toggle switch
- `Avatar` - User avatar with fallback initials
- `Badge` - Notification badge (positioned on icons)

### New Components
- `Tag` - Inline labels/tags for categories, status, difficulty
- `Timer` - Countdown timer with controls
- `Tabs` - Horizontal tab selector (pills, outlined, filled)
- `MarkdownViewer` - Render markdown with theme styling

## Pre-Configured Packages

### @astacinco/rn-theming
```tsx
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';

const { colors, spacing, mode, setMode } = useTheme();
```

### @astacinco/rn-primitives
```tsx
import {
  Text, Button, Card, Input, Tag, Timer, Tabs,
  VStack, HStack, Container, Divider, Switch,
  Avatar, Badge, MarkdownViewer
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

## Structure

```
showcase/
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
| Tag colors | primitives | success, warning, error, info |
| Timer | primitives | Countdown with pause/resume |
| Tabs | primitives | Pills, outlined, filled variants |
| Locale switching | i18n | EN, ES, FR |
| Translations | i18n | t() with interpolation |
| Pluralization | i18n | tp() with count |
| Number formatting | i18n | Currency, numbers, dates |
| Render tracking | performance | Count, duration |
| Measurement | performance | Async operation timing |
| Tracing | performance | Manual start/stop |

## Related

- **Assessment Practice**: Timed coding challenges
- **Challenge Hub**: Browse all challenges and assessments
