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
[![Tests](https://img.shields.io/badge/Tests-236%20passing-brightgreen)](./packages)

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
| 🔐 `@rn-toolkit/security` | Secure storage & validation | ✅ Ready | 💎 Paid |
| 🔑 `@rn-toolkit/auth` | Firebase authentication | 📋 Planned | 💎 Paid |
| 🔔 `@rn-toolkit/notifications` | Firebase push notifications | 📋 Planned | 💎 Paid |
| 📊 `@rn-toolkit/analytics` | Firebase analytics & metrics | 📋 Planned | 💎 Paid |
| 🔗 `@rn-toolkit/deeplink` | Type-safe navigation + badging | 📋 Planned | 💎 Paid |
| 🌍 `@rn-toolkit/i18n` | Localization & accessibility | 📋 Planned | 🆓 Free |
| ⚡ `@rn-toolkit/performance` | Memory leak detection | 📋 Planned | 🆓 Free |
| 🔬 `@rn-toolkit/testing/dsl` | Declarative test DSL | 📋 Planned | 💎 Paid |

---

## 📊 Stats

```
📊 Tests Passing:     236
📸 Theme Snapshots:    19
📦 Packages Built:      6
🎨 UI Components:      10
🔧 Claude Skills:       3
🔥 Firebase Powered:   Yes
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

### ✅ Complete
- [x] 🎨 Theming package (11 tests)
- [x] 🧪 Testing utilities (35 tests)
- [x] 🧩 Primitives package (60 tests, 16 snapshots)
- [x] 📡 SDUI engine (31 tests, 2 snapshots)
- [x] 🔐 Security package (99 tests)
- [x] 📱 Scaffold app with web support
- [x] 🤖 Claude skills (pre-commit, new-component, theme-test)

### 📋 Planned (Firebase-Powered)
- [ ] 🔑 Auth package (Firebase Authentication)
- [ ] 🔔 Notifications package (Firebase FCM)
- [ ] 📊 Analytics package (Firebase Analytics)
- [ ] 🔗 Deep linking + navigation badging
- [ ] ⚡ Performance (memory leak detection)
- [ ] 🌍 i18n & accessibility
- [ ] 📋 SDUIList (FlashList virtualization)
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
