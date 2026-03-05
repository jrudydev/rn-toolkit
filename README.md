# 🚀 RN SDUI Toolkit

<div align="center">

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ██████╗ ███╗   ██╗    ███████╗██████╗ ██╗   ██╗██╗      ║
║   ██╔══██╗████╗  ██║    ██╔════╝██╔══██╗██║   ██║██║      ║
║   ██████╔╝██╔██╗ ██║    ███████╗██║  ██║██║   ██║██║      ║
║   ██╔══██╗██║╚██╗██║    ╚════██║██║  ██║██║   ██║██║      ║
║   ██║  ██║██║ ╚████║    ███████║██████╔╝╚██████╔╝██║      ║
║   ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚══════╝╚═════╝  ╚═════╝ ╚═╝      ║
║                                                           ║
║         Server-Driven UI Toolkit for React Native         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Build dynamic, themeable React Native apps at lightning speed ⚡**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)

</div>

---

## ✨ Features

- 🎨 **Theming** - Dark/light mode with scope-based overrides
- 🧩 **Primitives** - Theme-aware UI components out of the box
- 📡 **SDUI** - Render UI from JSON schemas (server-driven)
- 🔗 **Deep Linking** - Type-safe navigation with history
- 🧪 **Testing** - Snapshot utilities + declarative DSL

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run scaffold app (web)
cd apps/scaffold
npx expo start --web

# Run tests
npm test
```

---

## 📦 Packages

| Package | Description | Tier |
|---------|-------------|------|
| 🎨 `@rn-toolkit/theming` | Theme system with dark/light mode | 🆓 Free |
| 🧩 `@rn-toolkit/primitives` | Theme-aware UI components | 🆓 Free |
| 🧪 `@rn-toolkit/testing` | Basic test utilities & snapshots | 🆓 Free |
| 🔬 `@rn-toolkit/testing/dsl` | Declarative test DSL | 💎 Paid |
| 📡 `@rn-toolkit/sdui` | Server-Driven UI engine | 💎 Paid |
| 🔗 `@rn-toolkit/deeplink` | Type-safe navigation | 💎 Paid |

---

## 📚 Documentation

| Doc | Description |
|-----|-------------|
| 📍 [Roadmap](./Docs/ROADMAP.md) | Development phases and progress |
| 🏗️ [Architecture](./Docs/ARCHITECTURE.md) | System design and patterns |
| 💰 [Package Tiers](./Docs/PACKAGE_TIERS.md) | Free vs Paid packages |
| 🧪 [Testing Strategy](./Docs/TESTING_STRATEGY.md) | Testing approach |

---

## 🎨 Usage

### Theming (Free)

```typescript
import { ThemeProvider, useTheme } from '@rn-toolkit/theming';

// 🌗 Wrap your app with auto dark/light detection
<ThemeProvider mode="auto">
  <App />
</ThemeProvider>

// 🎨 Use in components
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

### SDUI (Paid)

```typescript
import { SDUIRenderer } from '@rn-toolkit/sdui';

// 📡 Define UI as JSON (from your backend)
const screenSchema = {
  type: 'screen',
  children: [
    { type: 'text', props: { variant: 'title', content: 'Welcome!' } },
    { type: 'button', props: { label: 'Get Started' } }
  ]
};

// 🎯 Render with one line
<SDUIRenderer schema={screenSchema} />
```

---

## 🛠️ Development

```bash
npm run typecheck    # ✅ TypeScript check
npm run lint         # 🔍 ESLint
npm test             # 🧪 Run tests
npm run test:coverage # 📊 Tests with coverage
```

---

## 📋 Progress

- [x] 🎨 Theming package
- [x] 📱 Scaffold app with web support
- [ ] 🧪 Testing utilities
- [ ] 🧩 Primitives package
- [ ] 📡 SDUI engine
- [ ] 🔗 Deep linking

---

## 📄 License

- 🆓 **Free packages**: MIT License
- 💎 **Paid packages**: Commercial (subscription required)

See [Package Tiers](./Docs/PACKAGE_TIERS.md) for details.

---

<div align="center">

**Made with ❤️ for React Native developers**

</div>
