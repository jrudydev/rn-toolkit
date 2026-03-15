# 🏗️ Architecture

## 📐 System Overview

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                               ┃
┃                           🚀 apps/scaffold                                    ┃
┃                          (Expo Demo Application)                              ┃
┃                                                                               ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                               ┃
┃   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              ┃
┃   │ 🔐 security     │  │ 🔑 auth         │  │ 🌍 i18n         │              ┃
┃   │    💎 PAID      │  │    💎 PAID      │  │    🆓 FREE      │              ┃
┃   └────────┬────────┘  └─────────────────┘  └─────────────────┘              ┃
┃            │                                                                  ┃
┃            ▼                                                                  ┃
┃   ┌─────────────────────────┐    ┌─────────────────────────┐                 ┃
┃   │    📡 @astacinco/rn-sdui  │    │  🔗 @astacinco/rn-deeplink│                 ┃
┃   │     (SDUI Engine)       │    │     (Navigation)        │                 ┃
┃   │        💎 PAID          │    │        💎 PAID          │                 ┃
┃   └───────────┬─────────────┘    └─────────────────────────┘                 ┃
┃               │                                                               ┃
┃               ▼                                                               ┃
┃   ┌───────────────────────────────────────────────────────────────────────┐  ┃
┃   │                    🧩 @astacinco/rn-primitives                          │  ┃
┃   │                       (UI Components)                                  │  ┃
┃   │                          🆓 FREE                                       │  ┃
┃   └───────────────────────────────┬───────────────────────────────────────┘  ┃
┃                                   │                                           ┃
┃                                   ▼                                           ┃
┃   ┌───────────────────────────────────────────────────────────────────────┐  ┃
┃   │                     🎨 @astacinco/rn-theming                            │  ┃
┃   │                       (Theme System)                                   │  ┃
┃   │                          🆓 FREE                                       │  ┃
┃   └───────────────────────────────────────────────────────────────────────┘  ┃
┃                                                                               ┃
┃   ┌───────────────────────────────────────────────────────────────────────┐  ┃
┃   │                     🧪 @astacinco/rn-testing                            │  ┃
┃   │          Basic Utils 🆓 FREE  │  DSL 💎 PAID                          │  ┃
┃   └───────────────────────────────────────────────────────────────────────┘  ┃
┃                                                                               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🔄 Package Dependencies

```
📡 @astacinco/rn-sdui
 ├──▶ 🧩 @astacinco/rn-primitives
 ├──▶ 🔐 @astacinco/rn-security (for schema validation)
 └──▶ 🎨 @astacinco/rn-theming

🔑 @astacinco/rn-auth (Firebase Authentication)
 └──▶ 🔐 @astacinco/rn-security (for secure token storage)

🔔 @astacinco/rn-notifications (Firebase FCM)
 └──▶ 🔗 @astacinco/rn-deeplink (for notification deep links)

📊 @astacinco/rn-analytics (Firebase Analytics)
 └──▶ (standalone)

🔗 @astacinco/rn-deeplink
 └──▶ (standalone, optional theming integration)

🧩 @astacinco/rn-primitives
 └──▶ 🎨 @astacinco/rn-theming

🧪 @astacinco/rn-testing
 ├──▶ 🎨 @astacinco/rn-theming (for theme snapshots)
 └──▶ 🧩 @astacinco/rn-primitives (for component testing)

⚡ @astacinco/rn-performance
 └──▶ (standalone, dev-only)

🌍 @astacinco/rn-i18n
 └──▶ (standalone)
```

---

## 🔥 Firebase Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│                       FIREBASE SERVICES                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│   │  Authentication │  │  Cloud Messaging│  │    Analytics    │    │
│   │                 │  │      (FCM)      │  │                 │    │
│   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘    │
│            │                    │                    │              │
│            ▼                    ▼                    ▼              │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│   │ @astacinco/rn-    │  │ @astacinco/rn-    │  │ @astacinco/rn-    │    │
│   │     auth        │  │  notifications  │  │   analytics     │    │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                     │
│   • Social login        • Push notifications   • Event tracking    │
│   • Email/Phone auth    • Local notifications  • Screen views      │
│   • 2FA support         • Deep link handling   • User properties   │
│   • Session mgmt        • Badge updates        • Conversions       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### ✅ ADAPTER PATTERN - ZERO VENDOR LOCK-IN!

The toolkit uses the **Adapter Pattern** across all Firebase-dependent packages. No vendor lock-in!

**Architecture (with adapters):**
```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Component  │ ───▶ │  useAuth()   │ ───▶ │  AuthAdapter    │ ───▶ │  FirebaseAdapter│
│             │      │              │      │   (interface)   │      │  Auth0Adapter   │
└─────────────┘      └──────────────┘      └─────────────────┘      │  CognitoAdapter │
                                                                     │  ConsoleAdapter │
                                                                     │  NoOpAdapter    │
                                                                     └─────────────────┘
```

**Packages with Adapter Pattern:**
| Package | Built-in Adapters | Status |
|---------|-------------------|--------|
| `@astacinco/rn-auth` | Firebase, Console, NoOp | ✅ |
| `@astacinco/rn-notifications` | Firebase FCM, Console, NoOp | ✅ |
| `@astacinco/rn-analytics` | Firebase, Mixpanel, Console, NoOp | ✅ |
| `@astacinco/rn-i18n` | i18next, Console, NoOp | ✅ |
| `@astacinco/rn-performance` | Firebase Perf, Console, NoOp | ✅ |
| `@astacinco/rn-logging` | Console, NoOp, Composite | ✅ |

**Firebase adapters are separate imports (optional):**
```typescript
// Core package - no Firebase dependency
import { AuthProvider, useAuth, ConsoleAdapter } from '@astacinco/rn-auth';

// Firebase adapter - separate entry point
import { FirebaseAuthAdapter } from '@astacinco/rn-auth/firebase';
```

### 🚧 Planned Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@astacinco/rn-orchestration` | Unified Route Model (screens, modals, flows, interstitials) | 📋 Planned |
| `@astacinco/rn-links` | URL shortening (adapter pattern), QR codes, Clipboard | 📋 Planned |

---

### 9️⃣ Unified Route Model (PayPal-Inspired)

**Key Insight:** Everything is a route! Screens, modals, wizards, interstitials - they're all just routes with different presentations.

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNIFIED ROUTE MODEL                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   myapp://home           → Route { presentation: 'screen' }     │
│   myapp://profile/123    → Route { presentation: 'screen' }     │
│   myapp://onboarding     → Route { presentation: 'wizard' }     │
│   myapp://promo/upgrade  → Route { presentation: 'interstitial'}│
│   myapp://tour/search    → Route { presentation: 'tooltip' }    │
│                                                                 │
│   ONE system. Routes are self-contained.                        │
│   They know HOW to present, WHEN to show, and their PRIORITY.   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```typescript
const routes = [
  { id: 'home', path: '/', presentation: 'screen', component: Home },
  { id: 'onboarding', path: '/onboarding', presentation: 'wizard', priority: 5, steps: [...] },
  { id: 'upgrade', path: '/promo/upgrade', presentation: 'interstitial', priority: 10 },
];

<RouteProvider routes={routes}>
  <App />
</RouteProvider>
```

**Presentation Types:**
| Presentation | Description |
|--------------|-------------|
| `'screen'` | Full page navigation |
| `'modal'` | Dismissable overlay |
| `'tooltip'` | Floating bubble (CoachTip) |
| `'wizard'` | Panel + markers (Linktree) |
| `'spotlight'` | Dim + highlight |
| `'interstitial'` | Blocking modal |
| `'fullscreen'` | Critical takeover |

---

## 🎯 Design Patterns

### 1️⃣ Scope-Based Theming

Inspired by SolarRacer3D's UIThemeManager, themes can be scoped:

```typescript
// 🌍 Global theme
<ThemeProvider mode="light">
  <App />

  {/* 🌙 Scoped theme for modal (dark regardless of global) */}
  <ThemeProvider scope="modal" mode="dark">
    <Modal />
  </ThemeProvider>
</ThemeProvider>
```

```
┌─────────────────────────────────────────┐
│  🌍 Global Theme: Light                 │
│  ┌───────────────────────────────────┐  │
│  │           Main App                │  │
│  │       (uses light theme)          │  │
│  │                                   │  │
│  │   ┌───────────────────────────┐   │  │
│  │   │  🌙 Modal Scope: Dark     │   │  │
│  │   │   (overrides to dark)     │   │  │
│  │   └───────────────────────────┘   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 2️⃣ Theme-Aware Components

All primitives use the `useTheme()` hook:

```typescript
function Button({ children }) {
  const { colors, spacing } = useTheme();

  return (
    <Pressable style={{
      backgroundColor: colors.primary,  // 🎨 Auto-themed
      padding: spacing.md               // 📏 Consistent spacing
    }}>
      {children}
    </Pressable>
  );
}
```

### 3️⃣ Server-Driven UI Schema

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Backend    │ ───▶ │    Schema    │ ───▶ │   Native UI  │
│   (JSON)     │      │   Renderer   │      │  Components  │
└──────────────┘      └──────────────┘      └──────────────┘

     📡                    🔄                    📱
   Server               SDUIRenderer          React Native
```

```typescript
// 📡 Schema from backend
const schema = {
  type: 'screen',
  children: [
    { type: 'text', props: { variant: 'title', content: 'Hello' } },
    { type: 'button', props: {
        label: 'Click',
        onPress: { action: 'navigate', to: '/home' }
      }
    }
  ]
};

// 🎯 Renders native components
<SDUIRenderer schema={schema} />
```

### 4️⃣ Defense in Depth Security

```
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────┐                                       │
│   │     Layer 1     │  INPUT VALIDATION                     │
│   │   ═══════════   │  • Sanitize all user input            │
│   │                 │  • Validate SDUI schemas              │
│   └────────┬────────┘  • Reject malicious payloads          │
│            │                                                │
│            ▼                                                │
│   ┌─────────────────┐                                       │
│   │     Layer 2     │  SECURE STORAGE                       │
│   │   ═══════════   │  • Keychain (iOS) / Keystore (Android)│
│   │                 │  • Encrypted token storage            │
│   └────────┬────────┘  • Biometric protection               │
│            │                                                │
│            ▼                                                │
│   ┌─────────────────┐                                       │
│   │     Layer 3     │  AUTHENTICATION                       │
│   │   ═══════════   │  • Multi-factor authentication        │
│   │                 │  • Session management                 │
│   └─────────────────┘  • Secure token refresh               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5️⃣ Type-Safe Navigation

Route definitions using enums (inspired by SolarRacer3D's SceneId):

```typescript
// 🗺️ Define routes
enum Routes {
  Home = 'home',
  Profile = 'profile/:id',
  Settings = 'settings',
}

// 🧭 Type-safe navigation
const { navigate } = useDeepLink();
navigate(Routes.Profile, { id: '123' });  // ✅ TypeScript validated
navigate(Routes.Profile);                  // ❌ Error: missing 'id'
```

### 6️⃣ Automatic Theme Testing

```
┌─────────────────┐
│   Component     │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Render  │
    │ in both │
    │ themes  │
    └────┬────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│ ☀️    │ │ 🌙    │
│ Light │ │ Dark  │
│ .snap │ │ .snap │
└───────┘ └───────┘
```

```typescript
// 📸 Snapshots generated for both themes
createThemeSnapshot(<ProfileCard user={mockUser} />);
// Creates: ProfileCard.light.snap, ProfileCard.dark.snap
```

---

## 📂 File Structure

```
rn-toolkit/
├── 📄 package.json              # Workspace root
├── 📄 tsconfig.json             # Shared TypeScript config
├── 📄 jest.config.js            # Shared Jest config
├── 📄 CLAUDE.md                 # Claude context
├── 📄 README.md                 # Project overview
│
├── 📁 Docs/
│   ├── 📍 ROADMAP.md            # Development phases
│   ├── 🏗️ ARCHITECTURE.md       # This file
│   ├── 💰 PACKAGE_TIERS.md      # Free vs Paid
│   └── 🧪 TESTING_STRATEGY.md   # Testing approach
│
├── 📁 packages/
│   │
│   ├── 🎨 theming/              # Theme system [FREE] ✅
│   │   ├── src/
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── ThemeContext.ts
│   │   │   ├── useTheme.ts
│   │   │   ├── useColorScheme.ts
│   │   │   ├── types.ts
│   │   │   └── themes/default.ts
│   │   └── __tests__/           # 11 tests
│   │
│   ├── 🧩 primitives/           # UI components [FREE] ✅
│   │   ├── src/
│   │   │   ├── Text/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Stack/
│   │   │   ├── Container/
│   │   │   ├── Input/
│   │   │   └── Divider/
│   │   └── __tests__/           # 60 tests, 16 snapshots
│   │
│   ├── 🧪 testing/              # Test utilities [FREE] ✅
│   │   ├── src/
│   │   │   ├── renderWithTheme.tsx
│   │   │   ├── createThemeSnapshot.tsx
│   │   │   └── mocks/
│   │   └── __tests__/           # 35 tests
│   │
│   ├── 📡 sdui/                 # SDUI engine [PAID] ✅
│   │   ├── src/
│   │   │   ├── SDUIRenderer.tsx
│   │   │   ├── ComponentRegistry.ts
│   │   │   ├── ActionHandler.ts
│   │   │   ├── types.ts
│   │   │   └── components/
│   │   │       ├── SDUIText.tsx
│   │   │       ├── SDUIButton.tsx
│   │   │       ├── SDUICard.tsx
│   │   │       ├── SDUIStack.tsx
│   │   │       ├── SDUIInput.tsx
│   │   │       ├── SDUIDivider.tsx
│   │   │       ├── SDUIImage.tsx
│   │   │       └── SDUIContainer.tsx
│   │   └── __tests__/           # 31 tests, 2 snapshots
│   │
│   ├── 🔐 security/             # Security [PAID] 🚧
│   │   ├── src/
│   │   │   ├── storage/
│   │   │   │   ├── SecureStorage.ts
│   │   │   │   └── types.ts
│   │   │   ├── validation/
│   │   │   │   ├── schemaValidator.ts
│   │   │   │   └── sanitize.ts
│   │   │   └── components/
│   │   │       └── SecureTextInput.tsx
│   │   └── __tests__/
│   │
│   ├── 🔑 auth/                 # Authentication [PAID] 📋
│   │   ├── src/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── useAuth.ts
│   │   │   ├── useUser.ts
│   │   │   ├── useSession.ts
│   │   │   ├── providers/
│   │   │   │   ├── google.ts
│   │   │   │   ├── apple.ts
│   │   │   │   └── facebook.ts
│   │   │   └── mfa/
│   │   │       ├── sms.ts
│   │   │       └── totp.ts
│   │   └── __tests__/
│   │
│   ├── 🌍 i18n/                 # Internationalization [FREE] 📋
│   │   ├── src/
│   │   │   ├── I18nProvider.tsx
│   │   │   ├── useTranslation.ts
│   │   │   ├── useLocale.ts
│   │   │   ├── useAccessibility.ts
│   │   │   └── formatters/
│   │   └── __tests__/
│   │
│   └── 🔗 deeplink/             # Navigation [PAID] 📋
│       ├── src/
│       │   ├── DeepLinkProvider.tsx
│       │   ├── useDeepLink.ts
│       │   ├── RouteRegistry.ts
│       │   ├── SmartHeader.tsx
│       │   ├── SmartTabBar.tsx
│       │   └── NavigationContainer.tsx
│       └── __tests__/
│
└── 📁 apps/
    └── 🚀 scaffold/             # Demo app ✅
        ├── App.tsx
        ├── app.json
        └── assets/
```

---

## 🔀 Data Flow

### 🎨 Theme Flow
```
┌──────────────┐    ┌─────────────────┐    ┌───────────────┐    ┌───────────┐    ┌───────────┐
│    System    │───▶│ useColorScheme()│───▶│ ThemeProvider │───▶│ useTheme()│───▶│ Component │
│  Preference  │    │                 │    │   (Context)   │    │   (Hook)  │    │           │
└──────────────┘    └─────────────────┘    └───────────────┘    └───────────┘    └───────────┘
      🌓                   🔍                     🎨                  🪝               📱
```

### 📡 SDUI Flow
```
┌──────────────┐    ┌─────────────────┐    ┌───────────────┐    ┌───────────┐
│ Backend JSON │───▶│  SDUIRenderer   │───▶│ComponentRegistry───▶│ Primitives│
│              │    │                 │    │               │    │           │
└──────────────┘    └─────────────────┘    └───────────────┘    └───────────┘
      📄                   🔄                     📚                 🧩
```

### 🔐 Security Flow
```
┌──────────────┐    ┌─────────────────┐    ┌───────────────┐    ┌───────────┐
│  User Input  │───▶│    sanitize()   │───▶│  Validated    │───▶│   Store/  │
│              │    │                 │    │    Input      │    │   Render  │
└──────────────┘    └─────────────────┘    └───────────────┘    └───────────┘
      ⌨️                   🛡️                     ✅                 💾

┌──────────────┐    ┌─────────────────┐    ┌───────────────┐    ┌───────────┐
│  SDUI Schema │───▶│validateSchema() │───▶│    Valid?     │───▶│  Render/  │
│              │    │                 │    │               │    │   Reject  │
└──────────────┘    └─────────────────┘    └───────────────┘    └───────────┘
      📄                   🔍                     ✅/❌               📱
```

### 🔑 Auth Flow
```
┌──────────────┐    ┌─────────────────┐    ┌───────────────┐    ┌───────────┐
│  User Login  │───▶│   Firebase      │───▶│  Auth Token   │───▶│  Secure   │
│              │    │                 │    │               │    │  Storage  │
└──────────────┘    └─────────────────┘    └───────────────┘    └───────────┘
      👤                   🔥                     🎫                 🔐
```

### 🔗 Navigation Flow
```
┌──────────────┐    ┌─────────────────┐    ┌───────────────┐    ┌───────────┐
│Deep Link URL │───▶│   parseUrl()    │───▶│ RouteRegistry │───▶│  Screen   │
│              │    │                 │    │               │    │           │
└──────────────┘    └─────────────────┘    └───────────────┘    └───────────┘
      🔗                   🔍                     🗺️                 📱
```

---

## 📋 Conventions

### 📛 Naming
| Type | Convention | Example |
|------|------------|---------|
| Packages | `@astacinco/rn-<name>` | `@astacinco/rn-theming` |
| Components | PascalCase | `ThemeProvider`, `SDUIRenderer` |
| Hooks | camelCase with `use` | `useTheme`, `useDeepLink` |
| Tests | `Method_Condition_Expected` | `returns_dark_whenModeIsDark` |

### 📤 Exports
Each package exports from `src/index.ts`:
```typescript
// packages/theming/src/index.ts
export { ThemeProvider } from './ThemeProvider';
export { useTheme } from './useTheme';
export type { ThemeTokens, ColorTokens } from './types';
```

### 🧪 Testing
- ✅ Unit tests in `__tests__/` directory
- 📸 Snapshot tests for visual components
- 🌓 Both light and dark mode coverage required

---

## 📊 Test Coverage

| Package | Tests | Snapshots | Status |
|---------|-------|-----------|--------|
| theming | 11 | 0 | ✅ |
| testing | 35 | 0 | ✅ |
| primitives | 60 | 16 | ✅ |
| sdui | 31 | 2 | ✅ |
| security | 99 | 1 | ✅ |
| auth | - | - | 📋 Firebase |
| notifications | - | - | 📋 Firebase |
| analytics | - | - | 📋 Firebase |
| performance | - | - | 📋 |
| i18n | - | - | 📋 |
| deeplink | - | - | 📋 |
| **Total** | **236** | **19** | |
