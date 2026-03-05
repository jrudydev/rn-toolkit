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

**Build dynamic, themeable, secure React Native apps at lightning speed**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![Tests](https://img.shields.io/badge/Tests-137%20passing-brightgreen)](./packages)

</div>

---

## ✨ Features

- 🎨 **Theming** - Dark/light mode with scope-based overrides
- 🧩 **Primitives** - Theme-aware UI components out of the box
- 📡 **SDUI** - Render UI from JSON schemas (server-driven)
- 🔗 **Deep Linking** - Type-safe navigation with history
- 🔐 **Security** - Secure storage, input sanitization, schema validation
- 🔑 **Auth** - Firebase authentication with social login & 2FA
- 🌍 **i18n** - Localization and accessibility support
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

| Package | Description | Status | Tier |
|---------|-------------|--------|------|
| 🎨 `@rn-toolkit/theming` | Theme system with dark/light mode | ✅ Ready | 🆓 Free |
| 🧩 `@rn-toolkit/primitives` | Theme-aware UI components | ✅ Ready | 🆓 Free |
| 🧪 `@rn-toolkit/testing` | Basic test utilities & snapshots | ✅ Ready | 🆓 Free |
| 📡 `@rn-toolkit/sdui` | Server-Driven UI engine | ✅ Ready | 💎 Paid |
| 🔐 `@rn-toolkit/security` | Secure storage & validation | 🚧 Building | 💎 Paid |
| 🔑 `@rn-toolkit/auth` | Firebase authentication | 📋 Planned | 💎 Paid |
| 🔗 `@rn-toolkit/deeplink` | Type-safe navigation | 📋 Planned | 💎 Paid |
| 🌍 `@rn-toolkit/i18n` | Localization & accessibility | 📋 Planned | 🆓 Free |
| 🔬 `@rn-toolkit/testing/dsl` | Declarative test DSL | 📋 Planned | 💎 Paid |

---

## 📊 Stats

```
📊 Tests Passing:     137
📸 Theme Snapshots:    18
📦 Packages Built:      5
🎨 UI Components:      10
🔧 Claude Skills:       3
```

---

## 📚 Documentation

| Doc | Description |
|-----|-------------|
| 📍 [Roadmap](./Docs/ROADMAP.md) | Development phases and progress |
| 🏗️ [Architecture](./Docs/ARCHITECTURE.md) | System design and patterns |
| 💰 [Package Tiers](./Docs/PACKAGE_TIERS.md) | Free vs Paid packages |
| 🧪 [Testing Strategy](./Docs/TESTING_STRATEGY.md) | Testing approach |

---

## 🎨 Usage Examples

### Theming (Free)

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

### Primitives (Free)

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

### SDUI (Paid)

```typescript
import { SDUIRenderer } from '@rn-toolkit/sdui';

// Define UI as JSON (from your backend)
const screenSchema = {
  type: 'screen',
  children: [
    { type: 'text', props: { variant: 'title', content: 'Welcome!' } },
    { type: 'button', props: { label: 'Get Started' } }
  ]
};

// Render with one line
<SDUIRenderer schema={screenSchema} />
```

### Security (Paid - Coming Soon)

```typescript
import { SecureStorage, sanitize, validateSchema } from '@rn-toolkit/security';

// Secure storage
await SecureStorage.set('auth_token', token);
const token = await SecureStorage.get('auth_token');

// Input sanitization
const cleanInput = sanitize.text(userInput);
const cleanHtml = sanitize.html(htmlContent);

// Schema validation
const isValid = validateSchema(sduiSchema);
```

### Auth (Paid - Coming Soon)

```typescript
import { AuthProvider, useAuth } from '@rn-toolkit/auth';

<AuthProvider config={firebaseConfig}>
  <App />
</AuthProvider>

// In components
function Profile() {
  const { user, signOut, signInWithGoogle } = useAuth();

  if (!user) {
    return <Button label="Sign In" onPress={signInWithGoogle} />;
  }

  return <Text>Welcome, {user.displayName}</Text>;
}
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

### ✅ Complete
- [x] 🎨 Theming package (11 tests)
- [x] 🧪 Testing utilities (35 tests)
- [x] 🧩 Primitives package (60 tests, 16 snapshots)
- [x] 📡 SDUI engine (31 tests, 2 snapshots)
- [x] 📱 Scaffold app with web support
- [x] 🤖 Claude skills (pre-commit, new-component, theme-test)

### 🚧 In Progress
- [ ] 🔐 Security package

### 📋 Planned
- [ ] 🔑 Auth package (Firebase)
- [ ] 🔗 Deep linking
- [ ] 🌍 i18n & accessibility
- [ ] 🔬 Testing DSL

---

## 📄 License

- 🆓 **Free packages**: MIT License
- 💎 **Paid packages**: Commercial (subscription required)

See [Package Tiers](./Docs/PACKAGE_TIERS.md) for details.

---

<div align="center">

**Made with ❤️ for React Native developers**

*Security-first. Enterprise-ready. Built with PayPal-grade thinking.*

</div>
