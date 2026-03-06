# RN Toolkit Pro - Showcase App

This app demonstrates ALL @rn-toolkit packages working together. It's available exclusively to **Pro Developer+** Patreon supporters.

## Packages Demonstrated

### FREE Packages
- **@rn-toolkit/theming** - Dark/light mode, color tokens, spacing scale
- **@rn-toolkit/primitives** - Text, Button, Card, Input, Stack, Divider
- **@rn-toolkit/i18n** - Multi-language support, formatting, pluralization
- **@rn-toolkit/performance** - Render tracking, traces, measurements
- **@rn-toolkit/testing** - Theme-aware test utilities

### PAID Packages
- **@rn-toolkit/sdui** - Server-Driven UI rendering
- **@rn-toolkit/auth** - Multi-provider authentication
- **@rn-toolkit/analytics** - Event tracking and metrics
- **@rn-toolkit/deeplink** - Type-safe navigation
- **@rn-toolkit/notifications** - Push notifications
- **@rn-toolkit/security** - Secure storage, biometrics

## Getting Started

### Prerequisites

1. Make sure you have access to the paid packages (see PATRON_ONBOARDING.md)
2. Configure your `.npmrc` with GitHub Packages authentication

### Installation

```bash
# From the monorepo root
npm install

# Navigate to showcase-pro
cd apps/showcase-pro

# Start the app
npm start
```

### Running on Platforms

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Features Tour

### Home Screen
- Quick theme toggle
- Language switcher (5 languages)
- Package overview

### SDUI Screen
- Live JSON schema rendering
- Dynamic content from "server"
- Action handling integration

### Auth Screen
- Mock authentication flows
- Multi-provider support demo
- Session state management

### Analytics Screen
- Event tracking demo
- Real-time event log
- Custom metric recording

### i18n Screen
- 5 language support (EN, ES, FR, DE, JA)
- Translation interpolation
- Pluralization rules
- Number/currency/date formatting

### Performance Screen
- Render count tracking
- Render duration metrics
- Manual trace control
- Measurement tools

## Customization

### Adding Languages

Edit the `i18nAdapter` configuration in `App.tsx`:

```typescript
const i18nAdapter = new I18nConsoleAdapter({
  supportedLocales: ['en', 'es', 'fr', 'de', 'ja', 'ko'], // Add 'ko' for Korean
  resources: {
    // ... add Korean translations
  }
});
```

### Connecting Real Backend

Replace the adapters with production implementations:

```typescript
// Instead of NoOpAdapter, use Firebase:
import { FirebaseAuthAdapter } from '@rn-toolkit/auth';
import { FirebaseAnalyticsAdapter } from '@rn-toolkit/analytics';

const authAdapter = new FirebaseAuthAdapter();
const analyticsAdapter = new FirebaseAnalyticsAdapter();
```

### Adding SDUI Screens

Create schemas in `server/schemas/` and fetch them at runtime:

```typescript
const schema = await fetch('https://your-api.com/sdui/home').then(r => r.json());
return <SDUIRenderer schema={schema} />;
```

## Support

- **Discord**: Join our Spark Labs server
- **GitHub Issues**: For bugs and feature requests
- **Patreon DM**: For access issues

---

Built with love at **Spark Labs** by astacinco
