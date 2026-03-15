# RN Toolkit

<div align="center">

### A [Spark Labs](https://patreon.com/SparkLabs343) Project

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║   ██████╗ ███╗   ██╗    ████████╗ ██████╗  ██████╗ ██╗     ██╗  ██╗██╗████████╗║
║   ██╔══██╗████╗  ██║    ╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██║ ██╔╝██║╚══██╔══╝║
║   ██████╔╝██╔██╗ ██║       ██║   ██║   ██║██║   ██║██║     █████╔╝ ██║   ██║   ║
║   ██╔══██╗██║╚██╗██║       ██║   ██║   ██║██║   ██║██║     ██╔═██╗ ██║   ██║   ║
║   ██║  ██║██║ ╚████║       ██║   ╚██████╔╝╚██████╔╝███████╗██║  ██╗██║   ██║   ║
║   ╚═╝  ╚═╝╚═╝  ╚═══╝       ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   ║
║                                                                               ║
║                    Free React Native Toolkit - MIT Licensed                   ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

**Build themeable, accessible React Native apps at lightning speed**

[![npm](https://img.shields.io/npm/v/@astacinco/rn-theming?label=theming)](https://www.npmjs.com/package/@astacinco/rn-theming)
[![npm](https://img.shields.io/npm/v/@astacinco/rn-primitives?label=primitives)](https://www.npmjs.com/package/@astacinco/rn-primitives)
[![npm](https://img.shields.io/npm/v/@astacinco/rn-i18n?label=i18n)](https://www.npmjs.com/package/@astacinco/rn-i18n)
[![npm](https://img.shields.io/npm/v/@astacinco/rn-performance?label=performance)](https://www.npmjs.com/package/@astacinco/rn-performance)
[![npm](https://img.shields.io/npm/v/@astacinco/rn-testing?label=testing)](https://www.npmjs.com/package/@astacinco/rn-testing)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Patreon](https://img.shields.io/badge/Premium-Patreon-FF424D?style=flat&logo=patreon&logoColor=white)](https://patreon.com/SparkLabs343)

</div>

---

## Why Use This?

| Metric | With Packages | Native Only |
|--------|--------------|-------------|
| **Lines of Code** | ~170 | ~300 |
| **Time to Build** | 90 min | 120 min |
| **Boilerplate** | ✅ Abstracted | ❌ Manual |
| **Theme Support** | ✅ Built-in | ❌ Build yourself |
| **Testing Utils** | ✅ Included | ❌ Write from scratch |

**2× less code** — Focus on features, not boilerplate. Our packages handle theming, accessibility, and common patterns so you ship faster.

> 💡 **Try it yourself:** [Challenge Hub](https://astacinco.com/hub) lets you build the same feature with and without packages to see the difference.

---

## Architecture Overview

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                          🎨 YOUR REACT NATIVE APP 🎨                         ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    ┌─────────────────────────────────────────────────────────────────────┐   ║
║    │                        📦 @astacinco/rn-primitives                    │   ║
║    │     ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │   ║
║    │     │  Text  │ │ Button │ │  Card  │ │ Stack  │ │ Input  │         │   ║
║    │     └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘         │   ║
║    │         │          │          │          │          │               │   ║
║    │         └──────────┴──────────┴────┬─────┴──────────┘               │   ║
║    │                                    │                                │   ║
║    │                              useTheme()                             │   ║
║    │                                    │                                │   ║
║    └────────────────────────────────────┼────────────────────────────────┘   ║
║                                         │                                    ║
║                                         ▼                                    ║
║    ┌─────────────────────────────────────────────────────────────────────┐   ║
║    │                        🎨 @astacinco/rn-theming                       │   ║
║    │                                                                     │   ║
║    │     ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │   ║
║    │     │    Colors    │    │   Spacing    │    │  Typography  │       │   ║
║    │     │  ☀️ Light    │    │  xs sm md lg │    │  title body  │       │   ║
║    │     │  🌙 Dark     │    │     xl xxl   │    │   caption    │       │   ║
║    │     └──────────────┘    └──────────────┘    └──────────────┘       │   ║
║    │                                                                     │   ║
║    │              ThemeProvider ──► useTheme() ──► Components            │   ║
║    │                                                                     │   ║
║    └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║                         🔌 ADAPTER PATTERN PACKAGES 🔌                       ║
║                                                                              ║
║    ┌─────────────────────────────────────────────────────────────────────┐   ║
║    │                          @astacinco/rn-i18n                           │   ║
║    │                                                                     │   ║
║    │     ┌─────────────────────────────────────────────────────────┐     │   ║
║    │     │                    I18nProvider                         │     │   ║
║    │     │                         │                               │     │   ║
║    │     │         ┌───────────────┼───────────────┐               │     │   ║
║    │     │         ▼               ▼               ▼               │     │   ║
║    │     │   ┌──────────┐   ┌──────────┐   ┌──────────┐           │     │   ║
║    │     │   │ i18next  │   │ Console  │   │   NoOp   │           │     │   ║
║    │     │   │ Adapter  │   │ Adapter  │   │ Adapter  │           │     │   ║
║    │     │   │   🌐     │   │   🔧     │   │   🧪     │           │     │   ║
║    │     │   └──────────┘   └──────────┘   └──────────┘           │     │   ║
║    │     │    Production      Debug         Testing               │     │   ║
║    │     └─────────────────────────────────────────────────────────┘     │   ║
║    └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║    ┌─────────────────────────────────────────────────────────────────────┐   ║
║    │                       @astacinco/rn-performance                       │   ║
║    │                                                                     │   ║
║    │     ┌─────────────────────────────────────────────────────────┐     │   ║
║    │     │                 PerformanceProvider                     │     │   ║
║    │     │                         │                               │     │   ║
║    │     │         ┌───────────────┼───────────────┐               │     │   ║
║    │     │         ▼               ▼               ▼               │     │   ║
║    │     │   ┌──────────┐   ┌──────────┐   ┌──────────┐           │     │   ║
║    │     │   │ Firebase │   │ Console  │   │   NoOp   │           │     │   ║
║    │     │   │ Adapter  │   │ Adapter  │   │ Adapter  │           │     │   ║
║    │     │   │   🔥     │   │   🔧     │   │   🧪     │           │     │   ║
║    │     │   └──────────┘   └──────────┘   └──────────┘           │     │   ║
║    │     │    Production      Debug         Testing               │     │   ║
║    │     └─────────────────────────────────────────────────────────┘     │   ║
║    └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## Why Adapters?

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                        🚫 WITHOUT ADAPTERS (Locked In)                       ║
║                                                                              ║
║    ┌─────────────────┐         ┌─────────────────┐                          ║
║    │   Your App      │ ──────► │   Firebase 🔒   │  Can't change!           ║
║    └─────────────────┘         └─────────────────┘                          ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║                        ✅ WITH ADAPTERS (Freedom!)                           ║
║                                                                              ║
║    ┌─────────────────┐         ┌─────────────────┐                          ║
║    │                 │ ──────► │   Firebase 🔥   │  Production              ║
║    │   Your App      │ ──────► │   Console 🔧    │  Development             ║
║    │                 │ ──────► │   NoOp 🧪       │  Testing                 ║
║    │                 │ ──────► │   Custom 🔌     │  Your own!               ║
║    └─────────────────┘         └─────────────────┘                          ║
║                                                                              ║
║    ┌────────────────────────────────────────────────────────────────────┐    ║
║    │  SWAP ADAPTERS WITH ONE LINE:                                     │    ║
║    │                                                                    │    ║
║    │  const adapter = __DEV__                                          │    ║
║    │    ? new ConsoleAdapter()     // 🔧 Logs everything               │    ║
║    │    : new FirebaseAdapter();   // 🔥 Production tracking           │    ║
║    └────────────────────────────────────────────────────────────────────┘    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## Packages

| Package | Description | Adapters |
|---------|-------------|----------|
| `@astacinco/rn-theming` | Theme system with dark/light mode | - |
| `@astacinco/rn-primitives` | Theme-aware UI components | - |
| `@astacinco/rn-i18n` | Localization & accessibility | i18next, Console, NoOp |
| `@astacinco/rn-performance` | Memory leak detection & metrics | Firebase, Console, NoOp |
| `@astacinco/rn-testing` | Test utilities & snapshots | - |

---

## Quick Start

```bash
# Install from npm
npm install @astacinco/rn-theming @astacinco/rn-primitives

# Or clone the demo
git clone https://github.com/jrudydev/rn-toolkit.git
cd rn-toolkit && npm install
cd apps/scaffold && npx expo start --web
```

---

## Theme Flow

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                              🎨 THEME FLOW 🎨                                ║
║                                                                              ║
║     ┌─────────────┐                                                         ║
║     │   System    │                                                         ║
║     │  ☀️ / 🌙    │                                                         ║
║     └──────┬──────┘                                                         ║
║            │                                                                 ║
║            ▼                                                                 ║
║     ┌─────────────────────────────────────────────────────────────────┐     ║
║     │                      ThemeProvider                              │     ║
║     │                                                                 │     ║
║     │   mode="auto" ───► Detects system preference                    │     ║
║     │   mode="light" ──► Forces light mode                            │     ║
║     │   mode="dark" ───► Forces dark mode                             │     ║
║     │                                                                 │     ║
║     └─────────────────────────────┬───────────────────────────────────┘     ║
║                                   │                                         ║
║                                   ▼                                         ║
║     ┌─────────────────────────────────────────────────────────────────┐     ║
║     │                        useTheme()                               │     ║
║     │                                                                 │     ║
║     │   const { colors, spacing, typography, shadows, mode } = ...    │     ║
║     │                                                                 │     ║
║     └─────────────────────────────┬───────────────────────────────────┘     ║
║                                   │                                         ║
║            ┌──────────────────────┼──────────────────────┐                  ║
║            ▼                      ▼                      ▼                  ║
║     ┌────────────┐         ┌────────────┐         ┌────────────┐           ║
║     │   Button   │         │    Card    │         │    Text    │           ║
║     │  primary   │         │  elevated  │         │   title    │           ║
║     │ secondary  │         │  outlined  │         │   body     │           ║
║     │  outline   │         │   filled   │         │  caption   │           ║
║     └────────────┘         └────────────┘         └────────────┘           ║
║                                                                              ║
║                    All components auto-adapt to theme! ✨                   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## Usage Examples

### Theming

```typescript
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';

<ThemeProvider mode="auto">
  <App />
</ThemeProvider>

function MyComponent() {
  const { colors, spacing, mode } = useTheme();
  return (
    <View style={{ backgroundColor: colors.background, padding: spacing.md }}>
      <Text style={{ color: colors.text }}>Theme: {mode}</Text>
    </View>
  );
}
```

### Primitives

```typescript
import { Text, Button, Card, VStack } from '@astacinco/rn-primitives';

<VStack spacing="md">
  <Text variant="title">Welcome!</Text>
  <Card variant="elevated">
    <Text>Card content here</Text>
  </Card>
  <Button label="Get Started" variant="primary" onPress={handlePress} />
</VStack>
```

### i18n with Adapters

```typescript
import { I18nProvider, useTranslation } from '@astacinco/rn-i18n';
import { I18nextAdapter } from '@astacinco/rn-i18n/adapters';

const adapter = new I18nextAdapter({ resources, lng: 'en' });

<I18nProvider adapter={adapter}>
  <App />
</I18nProvider>
```

### Performance Monitoring

```typescript
import { PerformanceProvider, useLeakDetector } from '@astacinco/rn-performance';
import { ConsoleAdapter } from '@astacinco/rn-performance/adapters';

<PerformanceProvider adapter={new ConsoleAdapter()}>
  <App />
</PerformanceProvider>

function MyComponent() {
  useLeakDetector('MyComponent'); // Alerts if component leaks!
  return <View>...</View>;
}
```

---

## Want More?

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                          💎 PREMIUM PACKAGES 💎                              ║
║                                                                              ║
║     ┌────────────────────────────────────────────────────────────────────┐   ║
║     │                                                                    │   ║
║     │   📡 SDUI          Render UI from JSON - server-driven magic      │   ║
║     │   🔑 Auth          Social login, 2FA, session management          │   ║
║     │   📊 Analytics     Event tracking with adapter pattern            │   ║
║     │   🔗 Deep Link     Type-safe navigation + badge counts            │   ║
║     │   🔔 Notifications Push notifications with FCM                    │   ║
║     │   🔐 Security      Secure storage, XSS protection, validation     │   ║
║     │   🔬 Testing DSL   Generate 24 tests from 3 lines of code!        │   ║
║     │                                                                    │   ║
║     └────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║                     Support development on Patreon! 🚀                       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

[![Patreon](https://img.shields.io/badge/Get_Premium_on-Patreon-FF424D?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/SparkLabs343)

---

## Development

```bash
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm test             # Run tests
npm run test:coverage # Tests with coverage
```

---

## License

MIT License - Use freely in personal and commercial projects.

---

<div align="center">

### Built at [Spark Labs](https://patreon.com/SparkLabs343)

**Made with ❤️ for React Native developers**

[Patreon](https://patreon.com/SparkLabs343) | [GitHub](https://github.com/jrudydev)

</div>
