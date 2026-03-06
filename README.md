# RN Toolkit

<div align="center">

### A [Spark Labs](https://patreon.com/SparkLabs343) Project

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ██████╗ ███╗   ██╗    ████████╗ ██████╗  ██████╗ ██╗    ║
║   ██╔══██╗████╗  ██║    ╚══██╔══╝██╔═══██╗██╔═══██╗██║    ║
║   ██████╔╝██╔██╗ ██║       ██║   ██║   ██║██║   ██║██║    ║
║   ██╔══██╗██║╚██╗██║       ██║   ██║   ██║██║   ██║██║    ║
║   ██║  ██║██║ ╚████║       ██║   ╚██████╔╝╚██████╔╝███████╗║
║   ╚═╝  ╚═╝╚═╝  ╚═══╝       ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝║
║                                                           ║
║         Free React Native Toolkit - MIT Licensed          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Build themeable, accessible React Native apps at lightning speed**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Patreon](https://img.shields.io/badge/Premium-Patreon-FF424D?style=flat&logo=patreon&logoColor=white)](https://patreon.com/SparkLabs343)

</div>

---

## Features

- **Theming** - Dark/light mode with scope-based overrides
- **Primitives** - Theme-aware UI components out of the box
- **i18n** - Localization and accessibility support (adapter pattern)
- **Performance** - Memory leak detection & render tracking (adapter pattern)
- **Testing** - Snapshot utilities & mock helpers

---

## Quick Start

```bash
# Install free packages from npm
npm install @rn-toolkit/theming @rn-toolkit/primitives

# Or clone and run the demo
git clone https://github.com/jrudydev/rn-toolkit.git
cd rn-toolkit
npm install
cd apps/scaffold && npx expo start --web
```

---

## Packages

| Package | Description | Adapters |
|---------|-------------|----------|
| `@rn-toolkit/theming` | Theme system with dark/light mode | - |
| `@rn-toolkit/primitives` | Theme-aware UI components (Text, Button, Card, etc.) | - |
| `@rn-toolkit/i18n` | Localization & accessibility | i18next, Console, NoOp |
| `@rn-toolkit/performance` | Memory leak detection & metrics | Firebase, Console, NoOp |
| `@rn-toolkit/testing` | Test utilities & snapshots | - |

### Premium Packages

Want SDUI, Auth, Analytics, Deep Linking, Notifications, and Security?

**[Get Premium on Patreon](https://patreon.com/SparkLabs343)** - Access to all packages + showcase-pro app.

---

## Usage Examples

### Theming

```typescript
import { ThemeProvider, useTheme } from '@rn-toolkit/theming';

<ThemeProvider mode="auto">
  <App />
</ThemeProvider>

// In components
function MyComponent() {
  const { colors, spacing, mode } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>
        Current theme: {mode}
      </Text>
    </View>
  );
}
```

### Primitives

```typescript
import { Text, Button, Card, VStack } from '@rn-toolkit/primitives';

<VStack spacing="md">
  <Text variant="title">Welcome!</Text>
  <Card variant="elevated">
    <Text>Card content here</Text>
  </Card>
  <Button label="Get Started" variant="primary" onPress={handlePress} />
</VStack>
```

### i18n with Adapter Pattern

```typescript
import { I18nProvider, useTranslation } from '@rn-toolkit/i18n';
import { I18nextAdapter } from '@rn-toolkit/i18n/adapters';

const adapter = new I18nextAdapter({ resources, lng: 'en' });

<I18nProvider adapter={adapter}>
  <App />
</I18nProvider>

// In components
function Greeting() {
  const { t, locale } = useTranslation();
  return <Text>{t('welcome')}</Text>;
}
```

### Performance Monitoring

```typescript
import { PerformanceProvider, useLeakDetector } from '@rn-toolkit/performance';
import { ConsoleAdapter } from '@rn-toolkit/performance/adapters';

const adapter = new ConsoleAdapter(); // Logs metrics to console

<PerformanceProvider adapter={adapter}>
  <App />
</PerformanceProvider>

// In components - detect memory leaks
function MyComponent() {
  useLeakDetector('MyComponent');
  return <View>...</View>;
}
```

### Testing Utilities

```typescript
import { renderWithTheme, createThemeSnapshot } from '@rn-toolkit/testing';

describe('MyComponent', () => {
  // Auto-generate light + dark snapshots
  createThemeSnapshot(<MyComponent />);

  it('renders in dark mode', () => {
    const { getByTestId } = renderWithTheme(<MyComponent />, 'dark');
    expect(getByTestId('component')).toBeTruthy();
  });
});
```

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

**Want SDUI, Auth, Analytics & more?**

[![Patreon](https://img.shields.io/badge/Get_Premium_on-Patreon-FF424D?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/SparkLabs343)

---

[Patreon](https://patreon.com/SparkLabs343) | [GitHub](https://github.com/jrudydev)

</div>
