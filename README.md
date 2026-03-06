# 🚀 RN SDUI Toolkit

<div align="center">

### A [Spark Labs](https://patreon.com/SparkLabs343) Project

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
[![Tests](https://img.shields.io/badge/Tests-600%2B%20passing-brightgreen)](./packages)
[![Patreon](https://img.shields.io/badge/Patreon-Support%20Development-FF424D?style=flat&logo=patreon&logoColor=white)](https://patreon.com/SparkLabs343)

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

### 🆓 Free Packages (This Repo)

| Package | Description | Status |
|---------|-------------|--------|
| 🎨 `@rn-toolkit/theming` | Theme system with dark/light mode | ✅ Ready |
| 🧩 `@rn-toolkit/primitives` | Theme-aware UI components | ✅ Ready |
| 🌍 `@rn-toolkit/i18n` | Localization & accessibility | ✅ Ready |
| ⚡ `@rn-toolkit/performance` | Memory leak detection & metrics | ✅ Ready |
| 🧪 `@rn-toolkit/testing` | Basic test utilities & snapshots | ✅ Ready |

### 💎 Premium Packages ([Patreon](https://patreon.com/SparkLabs343))

| Package | Description | Status |
|---------|-------------|--------|
| 📡 `@rn-toolkit/sdui` | Server-Driven UI engine | ✅ Ready |
| 🔑 `@rn-toolkit/auth` | Multi-provider authentication | ✅ Ready |
| 📊 `@rn-toolkit/analytics` | Analytics with adapter pattern | ✅ Ready |
| 🔗 `@rn-toolkit/deeplink` | Type-safe navigation + badging | ✅ Ready |
| 🔔 `@rn-toolkit/notifications` | Push notifications | ✅ Ready |
| 🔐 `@rn-toolkit/security` | Secure storage & validation | ✅ Ready |
| 🔬 `@rn-toolkit/testing/dsl` | Declarative test DSL | ✅ Ready |

> **Want premium packages?** Support development on [Patreon](https://patreon.com/SparkLabs343) and get access to all packages, the showcase-pro app, and priority support.

---

## 📊 Stats

```
📊 Tests Passing:     600+
📸 Theme Snapshots:    19
📦 Total Packages:     11
🆓 Free Packages:       5
💎 Premium Packages:    6
🎨 UI Components:      10+
🔧 Adapter Pattern:   Yes
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

### Security (Paid)

```typescript
import { SecureStorage, sanitize, validateSchema } from '@rn-toolkit/security';

// Secure storage (Keychain/Keystore)
await SecureStorage.set('auth_token', token);
const token = await SecureStorage.get('auth_token');

// Input sanitization (XSS, SQL injection, path traversal)
const cleanInput = sanitize.text(userInput);      // Strip HTML
const cleanHtml = sanitize.html(htmlContent);     // Safe HTML
const cleanUrl = sanitize.url(urlInput);          // Block javascript:
const cleanEmail = sanitize.email(emailInput);    // Validate & normalize

// SDUI schema validation (block malicious payloads)
const result = validateSchema(sduiSchema);
if (!result.valid) {
  console.error('Schema rejected:', result.errors);
}
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

### ✅ Complete (All 11 Packages!)
- [x] 🎨 Theming - Dark/light mode, tokens, scopes
- [x] 🧩 Primitives - Text, Button, Card, Input, Stack, etc.
- [x] 🌍 i18n - Adapter pattern, translations, formatting
- [x] ⚡ Performance - Render tracking, memory monitoring
- [x] 🧪 Testing - Theme snapshots, mocks, DSL
- [x] 📡 SDUI - Server-driven UI engine
- [x] 🔑 Auth - Multi-provider authentication
- [x] 📊 Analytics - Event tracking with adapters
- [x] 🔗 Deeplink - Type-safe navigation
- [x] 🔔 Notifications - Push notifications
- [x] 🔐 Security - Secure storage, sanitization
- [x] 📱 Demo apps (scaffold + showcase-pro)

---

## 📄 License

- 🆓 **Free packages**: MIT License
- 💎 **Premium packages**: Available via [Patreon](https://patreon.com/SparkLabs343)

See [Package Tiers](./Docs/PACKAGE_TIERS.md) for details.

---

<div align="center">

### Built at [Spark Labs](https://patreon.com/SparkLabs343)

[![Patreon](https://img.shields.io/badge/Support_on-Patreon-FF424D?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/SparkLabs343)

**Made with ❤️ for React Native developers**

*Enterprise-ready. Adapter-based. Built for scale.*

---

[Patreon](https://patreon.com/SparkLabs343) · [GitHub](https://github.com/jrudydev)

</div>
