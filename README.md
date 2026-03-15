# THE ASTACINCO RN-SDUI TOOLKIT

```
 █████╗ ███████╗████████╗ █████╗  ██████╗██╗███╗   ██╗ ██████╗ ██████╗
██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║████╗  ██║██╔════╝██╔═══██╗
███████║███████╗   ██║   ███████║██║     ██║██╔██╗ ██║██║     ██║   ██║
██╔══██║╚════██║   ██║   ██╔══██║██║     ██║██║╚██╗██║██║     ██║   ██║
██║  ██║███████║   ██║   ██║  ██║╚██████╗██║██║ ╚████║╚██████╗╚██████╔╝
╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═════╝
```

<div align="center">

### A [Spark Labs](https://patreon.com/SparkLabs343) Project

**BUILT FOR SPEED. DESIGNED FOR EXCELLENCE. SECURED BY PAYPAL EXPERIENCE.**

A modular React Native toolkit that makes building apps feel like assembling LEGO blocks.

[![npm](https://img.shields.io/npm/v/@astacinco/rn-theming?label=theming)](https://www.npmjs.com/package/@astacinco/rn-theming)
[![npm](https://img.shields.io/npm/v/@astacinco/rn-primitives?label=primitives)](https://www.npmjs.com/package/@astacinco/rn-primitives)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Patreon](https://img.shields.io/badge/Premium-Patreon-FF424D?style=flat&logo=patreon&logoColor=white)](https://patreon.com/SparkLabs343)

</div>

---

## THE STATS DON'T LIE

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   📊 TESTS PASSING:       500+  ✅                               ║
║   📸 THEME SNAPSHOTS:       19  🌓                               ║
║   📦 PACKAGES BUILT:        12  📚  (+2 planned: orchestration, links)
║   🎨 UI COMPONENTS:         20+ 🧩  (10 built + 10 planned)      ║
║   🔐 SECURITY LAYERS:        3  🛡️  ✅                           ║
║   🔥 FIREBASE SERVICES:      3  (Auth, Notif, Analytics)         ║
║   🔄 ADAPTER PATTERN:        6  ✅ (ALL SERVICES DECOUPLED!)     ║
║   🎯 ASSESSMENTS:            1  🏆  (+8 challenges, 2 planned)   ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## ADAPTER PATTERN - ZERO VENDOR LOCK-IN!

```
╔════════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║   🎯 FULLY IMPLEMENTED ACROSS ALL FIREBASE-DEPENDENT PACKAGES                  ║
║                                                                                ║
║   ┌─────────────┐      ┌──────────────┐      ┌─────────────────┐               ║
║   │  Component  │ ───▶ │  useHook()   │ ───▶ │    Adapter      │               ║
║   │             │      │              │      │   (interface)   │               ║
║   └─────────────┘      └──────────────┘      └────────┬────────┘               ║
║                                                       │                        ║
║                                           ┌───────────┼───────────┐            ║
║                                           ▼           ▼           ▼            ║
║                                    ┌──────────┐ ┌──────────┐ ┌──────────┐      ║
║                                    │ Firebase │ │  Other   │ │  NoOp/   │      ║
║                                    │ Adapter  │ │ Provider │ │ Console  │      ║
║                                    └──────────┘ └──────────┘ └──────────┘      ║
║                                                                                ║
║   ┌────────────────────────────────────────────────────────────────────────┐   ║
║   │                                                                        │   ║
║   │   ✅ PACKAGES WITH ADAPTER PATTERN:                                   │   ║
║   │                                                                        │   ║
║   │   🔑 Auth          → Firebase, Auth0, Cognito, Supabase, Custom   ✅   │   ║
║   │   📊 Analytics     → Firebase, Mixpanel, Amplitude, Segment       ✅   │   ║
║   │   🔔 Notifications → Firebase FCM, OneSignal, Expo, AWS SNS       ✅   │   ║
║   │   🌍 i18n          → i18next, react-intl, custom                  ✅   │   ║
║   │   ⚡ Performance   → Firebase Perf, custom metrics                ✅   │   ║
║   │   📝 Logging       → Console, NoOp, Composite, Custom             ✅   │   ║
║   │                                                                        │   ║
║   └────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                ║
║   🎉 NO MORE FIREBASE LOCK-IN! SWAP PROVIDERS WITHOUT CHANGING APP CODE!      ║
║                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════╝
```

```typescript
// Example usage:
<AuthProvider adapter={new FirebaseAuthAdapter()}>
<NotificationProvider adapter={new ConsoleAdapter()}>
<LogProvider adapter={new CompositeAdapter([...])}>
```

---

## PACKAGE BREAKDOWN

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   🆓 FREE TIER (MIT License)                                            │
│   ══════════════════════════                                            │
│                                                                         │
│   ├── 🎨 @astacinco/rn-theming      Dark/light, tokens, scoped themes✅ │
│   ├── 🧩 @astacinco/rn-primitives   Text, Button, Card, Stack, Input ✅ │
│   ├── 🧪 @astacinco/rn-testing      renderWithTheme, snapshots       ✅ │
│   ├── 🌍 @astacinco/rn-i18n         Translations & Accessibility     ✅ │
│   ├── ⚡ @astacinco/rn-performance  Memory leak, useDebounce         ✅ │
│   └── 📝 @astacinco/rn-logging      Console, NoOp, Composite adapters✅ │
│                                                                         │
│   Perfect for: Learning, prototypes, personal projects                  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   💎 PAID TIER (Patreon)                                                │
│   ═══════════════════════                                               │
│                                                                         │
│   ├── 📡 @astacinco/rn-sdui         JSON → Native UI, Actions        ✅ │
│   ├── 🔐 @astacinco/rn-security     SecureStorage, Sanitize, Validate✅ │
│   ├── 🔑 @astacinco/rn-auth         🔄 ADAPTERS! Swappable backends  ✅ │
│   ├── 🔔 @astacinco/rn-notifications 🔄 ADAPTERS! FCM, OneSignal     ✅ │
│   ├── 📊 @astacinco/rn-analytics    🔄 ADAPTERS! Firebase, Mixpanel  ✅ │
│   ├── 🔗 @astacinco/rn-deeplink     Type-safe routes, Badging        ✅ │
│   ├── 🔬 @astacinco/rn-testing/dsl  Fluent test DSL, Matrix testing  ✅ │
│   ├── 🎭 @astacinco/rn-orchestration Unified Route Model             📋 │
│   └── ✂️ @astacinco/rn-links        URL shortening, QR codes         📋 │
│                                                                         │
│   Perfect for: Production apps, enterprise, startups                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## QUICK START

```bash
# Install from npm
npm install @astacinco/rn-theming @astacinco/rn-primitives

# Or clone the demo
git clone https://github.com/jrudydev/rn-toolkit.git
cd rn-toolkit && npm install
cd apps/scaffold && npx expo start --web
```

---

## USAGE PREVIEW

```typescript
import { ThemeProvider } from '@astacinco/rn-theming';
import { Text, Button, Card, VStack } from '@astacinco/rn-primitives';
import { AuthProvider, ConsoleAdapter } from '@astacinco/rn-auth';

// Choose your adapters - ZERO VENDOR LOCK-IN!
const authAdapter = __DEV__
  ? new ConsoleAdapter()
  : new FirebaseAuthAdapter();

function App() {
  return (
    <AuthProvider adapter={authAdapter}>
      <ThemeProvider mode="auto">
        <VStack spacing="md" align="center">
          <Text variant="title">Welcome!</Text>
          <Card variant="elevated">
            <Text>Dark mode works. Auth works. It's beautiful.</Text>
          </Card>
          <Button label="Get Started" variant="primary" />
        </VStack>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

---

## UNIFIED ROUTE MODEL (PayPal-Inspired!)

```
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   🎯 EVERYTHING IS A ROUTE!                                           ║
║   ═════════════════════════                                           ║
║                                                                       ║
║   Screens, modals, wizards, interstitials - all routes with          ║
║   different presentations. ONE system to rule them all.               ║
║                                                                       ║
║   myapp://home           → Route { presentation: 'screen' }           ║
║   myapp://profile/123    → Route { presentation: 'screen' }           ║
║   myapp://onboarding     → Route { presentation: 'wizard' }           ║
║   myapp://promo/upgrade  → Route { presentation: 'interstitial' }     ║
║   myapp://tour/search    → Route { presentation: 'tooltip' }          ║
║                                                                       ║
║   ┌─────────────────────────────────────────────────────────────┐     ║
║   │                                                             │     ║
║   │   🎨 PRESENTATION TYPES                                     │     ║
║   │                                                             │     ║
║   │   'screen'       → Full page navigation                     │     ║
║   │   'modal'        → Dismissable overlay                      │     ║
║   │   'tooltip'      → Floating bubble (CoachTip)               │     ║
║   │   'wizard'       → Panel with step markers                  │     ║
║   │   'spotlight'    → Dim + highlight element                  │     ║
║   │   'interstitial' → Blocking modal                           │     ║
║   │   'fullscreen'   → Critical takeover                        │     ║
║   │                                                             │     ║
║   └─────────────────────────────────────────────────────────────┘     ║
║                                                                       ║
║   ✨ Self-contained routes know:                                      ║
║      • HOW to present (presentation type)                             ║
║      • WHEN to show (conditions, triggers)                            ║
║      • PRIORITY (who wins when multiple trigger)                      ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
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

---

## SECURITY-FIRST MINDSET

```
╔════════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║   💼 BUILT WITH PAYPAL-GRADE SECURITY THINKING                                 ║
║                                                                                ║
║   ┌────────────────────────────────────────────────────────────────────────┐   ║
║   │                                                                        │   ║
║   │   🛡️ DEFENSE IN DEPTH                                                  │   ║
║   │                                                                        │   ║
║   │   ┌──────────────┐                                                     │   ║
║   │   │   Layer 1    │  INPUT VALIDATION                                   │   ║
║   │   │   ════════   │  • Sanitize all user input (XSS, SQL injection)     │   ║
║   │   └──────┬───────┘  • Validate SDUI schemas before render              │   ║
║   │          │                                                             │   ║
║   │          ▼                                                             │   ║
║   │   ┌──────────────┐                                                     │   ║
║   │   │   Layer 2    │  SECURE STORAGE                                     │   ║
║   │   │   ════════   │  • Keychain (iOS) / Keystore (Android)              │   ║
║   │   └──────┬───────┘  • Encrypted token storage                          │   ║
║   │          │                                                             │   ║
║   │          ▼                                                             │   ║
║   │   ┌──────────────┐                                                     │   ║
║   │   │   Layer 3    │  AUTHENTICATION                                     │   ║
║   │   │   ════════   │  • Multi-factor authentication                      │   ║
║   │   └──────────────┘  • Session management & token refresh               │   ║
║   │                                                                        │   ║
║   └────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                ║
║   "Security is not a feature. It's a foundation."                              ║
║                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════╝
```

---

## CHALLENGE HUB - ASSESSMENT PRACTICE

```
╔════════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║   🏆 PRACTICE FOR CODESIGNAL-STYLE ASSESSMENTS                                 ║
║                                                                                ║
║   ┌────────────────────────────────────────────────────────────────────────┐   ║
║   │                                                                        │   ║
║   │   📋 FULL ASSESSMENTS (60-90 min timed challenges)                     │   ║
║   │   • Link Management Screen (Linktree-aligned)                     ✅   │   ║
║   │                                                                        │   ║
║   │   🧩 GENERIC CHALLENGES (10-60 min reusable features)                  │   ║
║   │   ├── 🔍 Debounced Search (15 min, Easy)                          ✅   │   ║
║   │   ├── 🌓 Dark Mode Toggle (10 min, Easy)                          ✅   │   ║
║   │   ├── ✅ Form Validation (15 min, Easy)                           ✅   │   ║
║   │   ├── ⏳ Loading States (10 min, Easy)                            ✅   │   ║
║   │   ├── 📭 Empty States (10 min, Easy)                              ✅   │   ║
║   │   ├── ⚙️ Settings Screen (45 min, Easy)                           ✅   │   ║
║   │   ├── 🔐 Login Form (45 min, Medium)                              ✅   │   ║
║   │   ├── 📊 Analytics Dashboard (60 min, Hard)                       ✅   │   ║
║   │   ├── ✂️ Link Shortener (20 min, Medium)                          📋   │   ║
║   │   └── 🧙 Onboarding Wizard (45 min, Hard)                         📋   │   ║
║   │                                                                        │   ║
║   └────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                ║
║   💡 Try it: https://astacinco.com/hub                                         ║
║                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════╝
```

---

## THE INTERVIEW ADVANTAGE

```
╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║   WITHOUT THIS TOOLKIT              WITH THIS TOOLKIT                  ║
║   ══════════════════════            ═══════════════════                ║
║                                                                        ║
║   😰 "Let me set up theming..."     😎 import { ThemeProvider }        ║
║   😰 "Dark mode? Um..."             😎 mode="auto" (done!)             ║
║   😰 "Let me build a button..."     😎 <Button variant="primary" />    ║
║   😰 "Tests for both themes?!"      😎 createThemeSnapshot(<Comp />)   ║
║   😰 "Navigation from scratch..."   😎 <SmartTabBar routes={...} />    ║
║   😰 "SDUI? What's that?"           😎 <SDUIRenderer schema={json} />  ║
║   😰 "Secure storage? Uh..."        😎 SecureStorage.set('token', x)   ║
║   😰 "Auth system?!"                😎 <AuthProvider adapter={...} />  ║
║   😰 "Firebase lock-in?"            😎 adapter={new Auth0Adapter()}    ║
║                                                                        ║
║   ┌────────────────────────────────────────────────────────────────┐   ║
║   │                                                                │   ║
║   │   ⏱️  TIME SAVED:  ~60 minutes of boilerplate                  │   ║
║   │   🎯  FOCUS ON:    Product logic & business requirements       │   ║
║   │   💅  BONUS:       Professional architecture out of the box    │   ║
║   │   🔐  SECURITY:    Enterprise-grade patterns built-in          │   ║
║   │   🔄  ADAPTERS:    Zero vendor lock-in!                        │   ║
║   │                                                                │   ║
║   └────────────────────────────────────────────────────────────────┘   ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## CLAUDE SKILLS (AUTOMATION)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   🤖 BUILT-IN DEVELOPMENT WORKFLOWS                            │
│                                                                │
│   ┌──────────────────┐                                         │
│   │  /pre-commit     │  ✓ TypeCheck  ✓ Lint  ✓ Test           │
│   │  ══════════════  │  ✓ No console.logs  ✓ Git ready        │
│   └──────────────────┘                                         │
│                                                                │
│   ┌──────────────────┐                                         │
│   │  /new-component  │  → Component.tsx                        │
│   │  ══════════════  │  → types.ts                             │
│   │                  │  → Component.test.tsx (themed!)         │
│   └──────────────────┘  → SDUI registration                    │
│                                                                │
│   ┌──────────────────┐                                         │
│   │  /theme-test     │  → Run tests in ☀️ light mode           │
│   │  ══════════════  │  → Run tests in 🌙 dark mode            │
│   └──────────────────┘  → Generate dual snapshots              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## DEVELOPMENT

```bash
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm test             # Run tests
npm run test:coverage # Tests with coverage
```

---

## LICENSE

MIT License - Use freely in personal and commercial projects.

Premium packages available via [Patreon](https://patreon.com/SparkLabs343).

---

<div align="center">

## YOU'VE GOT THIS!

```
     ██╗   ██╗ ██████╗ ██╗   ██╗██████╗ ███████╗
     ╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗██╔════╝
      ╚████╔╝ ██║   ██║██║   ██║██████╔╝█████╗
       ╚██╔╝  ██║   ██║██║   ██║██╔══██╗██╔══╝
        ██║   ╚██████╔╝╚██████╔╝██║  ██║███████╗
        ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝

    ██████╗ ███████╗ █████╗ ██████╗ ██╗   ██╗██╗
    ██╔══██╗██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝██║
    ██████╔╝█████╗  ███████║██║  ██║ ╚████╔╝ ██║
    ██╔══██╗██╔══╝  ██╔══██║██║  ██║  ╚██╔╝  ╚═╝
    ██║  ██║███████╗██║  ██║██████╔╝   ██║   ██╗
    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝    ╚═╝   ╚═╝
```

### 500+ Tests | 19 Snapshots | 12 Packages Built | 6 With Adapters | ZERO Vendor Lock-In!

**Go crush that interview!**

*Built with love at [Spark Labs](https://patreon.com/SparkLabs343)*

[Patreon](https://patreon.com/SparkLabs343) | [GitHub](https://github.com/jrudydev)

</div>
