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

### ⚠️ Current Limitation: Firebase Coupling

The toolkit is currently **"Firebase-flavored"** - packages directly integrate with Firebase services without an abstraction layer.

**Tightly coupled packages:**
| Package | Firebase Service | Alternative Providers |
|---------|------------------|----------------------|
| `@astacinco/rn-auth` | Firebase Auth | Auth0, Cognito, Supabase, Custom |
| `@astacinco/rn-notifications` | Firebase FCM | OneSignal, Expo Notifications, AWS SNS |
| `@astacinco/rn-analytics` | Firebase Analytics | Mixpanel, Amplitude, Segment, PostHog |

**Current architecture (direct coupling):**
```
┌─────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Component  │ ───▶ │   useAuth()     │ ───▶ │  Firebase Auth  │
│             │      │                 │      │   (hardcoded)   │
└─────────────┘      └─────────────────┘      └─────────────────┘
```

---

## 🔮 Future Enhancement: Adapter Pattern (MVVM-like)

A future refactor could introduce an adapter/provider pattern to allow swapping implementations without changing app code.

**Proposed architecture (with adapters):**
```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Component  │ ───▶ │  useAuth()   │ ───▶ │  AuthAdapter    │ ───▶ │  FirebaseAdapter│
│             │      │              │      │   (interface)   │      │  Auth0Adapter   │
└─────────────┘      └──────────────┘      └─────────────────┘      │  CognitoAdapter │
                                                                     │  CustomAdapter  │
                                                                     └─────────────────┘
```

### Proposed Adapter Interfaces

**Authentication:**
```typescript
interface AuthAdapter {
  signIn(email: string, password: string): Promise<User>;
  signUp(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  signInWithProvider(provider: 'google' | 'apple' | 'facebook'): Promise<User>;
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

// Usage: swap providers without changing app code
<AuthProvider adapter={new FirebaseAuthAdapter()}>
// or
<AuthProvider adapter={new Auth0Adapter(clientId)}>
```

**Notifications:**
```typescript
interface NotificationAdapter {
  getToken(): Promise<string>;
  requestPermission(): Promise<NotificationPermission>;
  subscribeToTopic(topic: string): Promise<void>;
  unsubscribeFromTopic(topic: string): Promise<void>;
  onMessage(callback: (message: RemoteNotification) => void): () => void;
  onTokenRefresh(callback: (token: string) => void): () => void;
}

// Usage
<NotificationProvider adapter={new FCMAdapter()}>
// or
<NotificationProvider adapter={new OneSignalAdapter(appId)}>
```

**Analytics:**
```typescript
interface AnalyticsAdapter {
  logEvent(name: string, params?: Record<string, unknown>): void;
  setUserId(id: string | null): void;
  setUserProperties(props: Record<string, unknown>): void;
  logScreenView(screenName: string, screenClass?: string): void;
  setAnalyticsCollectionEnabled(enabled: boolean): void;
}

// Usage
<AnalyticsProvider adapter={new FirebaseAnalyticsAdapter()}>
// or
<AnalyticsProvider adapter={new MixpanelAdapter(token)}>
```

### Packages That Would Benefit

| Package | Benefit | Priority |
|---------|---------|----------|
| `@astacinco/rn-auth` | **High** - Most likely to swap providers |  ⭐⭐⭐ |
| `@astacinco/rn-analytics` | **High** - Analytics provider choice varies by project | ⭐⭐⭐ |
| `@astacinco/rn-notifications` | **Medium** - FCM is common, but OneSignal popular | ⭐⭐ |
| `@astacinco/rn-security` | **Low** - Could abstract keychain providers | ⭐ |
| `@astacinco/rn-deeplink` | **Low** - Could abstract nav libraries | ⭐ |

### Migration Path

1. **Phase 1**: Continue with Firebase-flavored implementation ✅ (current)
2. **Phase 2**: Define adapter interfaces
3. **Phase 3**: Refactor existing packages to use adapters internally
4. **Phase 4**: Create adapters for alternative providers
5. **Phase 5**: Make adapter selection configurable at provider level

> **Note**: This refactor is planned for after the initial toolkit is complete and battle-tested.

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
rn-sdui-toolkit/
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
