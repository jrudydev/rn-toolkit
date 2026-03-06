# Roadmap

## Overview

This toolkit is being built to support rapid React Native app development, with a focus on:
- Server-Driven UI (SDUI) for dynamic interfaces
- Robust theming with dark/light mode
- Type-safe navigation and deep linking
- Enterprise-grade security and authentication
- Comprehensive testing with snapshot and DSL support
- **Adapter pattern for zero vendor lock-in**

---

## Current Stats

| Metric | Count |
|--------|-------|
| Tests Passing | 500+ |
| Theme Snapshots | 19 |
| Packages Built | 11 |
| Packages with Adapters | 5 |
| UI Components | 10 |
| Claude Skills | 3 |

---

## Completed Phases

### Phase 0: Environment Verification ✅
**Status: COMPLETE**

- [x] Node.js >= 18 verified
- [x] npm workspaces configured
- [x] Expo CLI working
- [x] Web preview functional
- [x] WSL + Windows dev environment tested

---

### Phase 1: Foundation ✅
**Status: COMPLETE**

- [x] Monorepo setup (npm workspaces, TypeScript)
- [x] `@rn-toolkit/theming` package (FREE)
  - [x] ThemeProvider with scope support
  - [x] useTheme hook
  - [x] Dark/light mode detection
  - [x] Color, spacing, typography, shadow tokens
  - [x] 11 passing tests
- [x] `apps/scaffold` Expo app
  - [x] Web support
  - [x] Theme demo screen

---

### Phase 2: Testing Infrastructure ✅
**Status: COMPLETE**

- [x] `@rn-toolkit/testing` package
  - [x] `renderWithTheme()` - Render with theme provider (FREE)
  - [x] `renderWithProviders()` - Render with all providers (FREE)
  - [x] `createThemeSnapshot()` - Snapshot both light/dark modes (FREE)
  - [x] Mock utilities for navigation, SDUI (FREE)
  - [x] **DSL (Fluent Testing API)** (PAID)
    - [x] `dsl.component()` - Fluent component testing
    - [x] `dsl.matrix()` - Generate 24+ tests from 3 lines
    - [x] `dsl.hook()` - Hook testing with provider presets
    - [x] `dsl.sdui()` - SDUI schema testing
    - [x] Assertion chain (`.visible()`, `.text()`, `.enabled()`)
    - [x] Theme assertions (`expectThemeDifference`)
  - [x] 35 passing tests

---

### Phase 3: Core UI Components ✅
**Status: COMPLETE**

- [x] `@rn-toolkit/primitives` package (FREE)
  - [x] Text (with variants: title, body, caption, etc.)
  - [x] Button (with variants: primary, secondary, outline, ghost)
  - [x] Card (with variants: filled, outlined, elevated)
  - [x] Stack (VStack, HStack)
  - [x] Container
  - [x] Input (with label, error, focus states)
  - [x] Divider
  - [x] All components theme-aware
  - [x] 60 tests passing, 16 snapshots

---

### Phase 4: SDUI Engine ✅
**Status: COMPLETE**

- [x] `@rn-toolkit/sdui` package (PAID)
  - [x] SDUIRenderer component
  - [x] ComponentRegistry for custom components
  - [x] Built-in components (text, button, card, stack, input, divider, image, container)
  - [x] Action handling (navigate, API calls, setState, custom)
  - [x] 31 tests passing, 2 snapshots

---

### Phase 5: Security ✅
**Status: COMPLETE**

- [x] `@rn-toolkit/security` package (PAID)
  - [x] Secure Storage (Keychain/Keystore wrapper)
  - [x] Input Sanitization (XSS, SQL injection, path traversal)
  - [x] Schema Validation with dangerous pattern detection
  - [x] `useSecureInput()` hook
  - [x] `<SecureTextInput />` component
  - [x] 99 tests passing

---

### Phase 6: Authentication ✅
**Status: COMPLETE** (with Adapter Pattern!)

- [x] `@rn-toolkit/auth` package (PAID)
  - [x] **Adapter Pattern** - Zero vendor lock-in!
    - [x] `FirebaseAuthAdapter` (production)
    - [x] `ConsoleAdapter` (development/debug)
    - [x] `NoOpAdapter` (testing)
  - [x] Social login (Apple, Google, Facebook)
  - [x] Email/Password authentication
  - [x] Phone/SMS authentication
  - [x] Two-factor authentication (2FA)
  - [x] Session management
  - [x] Hooks: `useAuth()`, `useUser()`, `useSession()`
  - [x] `<AuthProvider adapter={...} />` component

---

### Phase 7: Internationalization ✅
**Status: COMPLETE** (with Adapter Pattern!)

- [x] `@rn-toolkit/i18n` package (FREE)
  - [x] **Adapter Pattern**
    - [x] `I18nextAdapter` (production)
    - [x] `ConsoleAdapter` (debug)
    - [x] `NoOpAdapter` (testing)
  - [x] Localization: translations, pluralization, date/time/number formatting
  - [x] Accessibility: screen reader labels, focus management, contrast support
  - [x] RTL layout support
  - [x] Hooks: `useTranslation()`, `useLocale()`, `useAccessibility()`

---

### Phase 8: Deep Linking ✅
**Status: COMPLETE**

- [x] `@rn-toolkit/deeplink` package (PAID)
  - [x] Type-safe route definitions (enums)
  - [x] DeepLinkProvider with history tracking
  - [x] `useDeepLink()` hook
  - [x] State restoration on back navigation
  - [x] Smart Navigation UI
    - [x] SmartHeader (auto back button, route-aware title)
    - [x] SmartTabBar (auto-highlights active route)
  - [x] Navigation Badging (SDUI-driven)
    - [x] `useBadgeCount()` hook
    - [x] Auto-updating badge UI

---

### Phase 9: Push Notifications ✅
**Status: COMPLETE** (with Adapter Pattern!)

- [x] `@rn-toolkit/notifications` package (PAID)
  - [x] **Adapter Pattern**
    - [x] `FirebaseNotificationAdapter` (production)
    - [x] `ConsoleAdapter` (debug - logs all calls)
    - [x] `NoOpAdapter` (testing - configurable responses)
  - [x] Push notification handling (foreground, background, data-only)
  - [x] Local notifications with scheduling
  - [x] Deep link handling from notifications
  - [x] Topic subscription
  - [x] Hooks: `useNotifications()`, `usePushToken()`, `useTopics()`

---

### Phase 10: Analytics ✅
**Status: COMPLETE** (with Adapter Pattern!)

- [x] `@rn-toolkit/analytics` package (PAID)
  - [x] **Adapter Pattern**
    - [x] `FirebaseAnalyticsAdapter` (production)
    - [x] `ConsoleAdapter` (debug - logs events)
    - [x] `NoOpAdapter` (testing)
  - [x] Event tracking (screen views, user actions, custom events)
  - [x] User properties and conversion tracking
  - [x] SDUI Integration (schema-driven tracking)
  - [x] Hooks: `useAnalytics()`, `useScreenTracking()`

---

### Phase 11: Performance ✅
**Status: COMPLETE** (with Adapter Pattern!)

- [x] `@rn-toolkit/performance` package (FREE)
  - [x] **Adapter Pattern**
    - [x] `FirebasePerformanceAdapter` (production)
    - [x] `ConsoleAdapter` (debug - logs metrics)
    - [x] `NoOpAdapter` (testing)
  - [x] Memory leak detection
  - [x] Render time tracking
  - [x] Re-render detection
  - [x] `useLeakDetector()` hook
  - [x] `<PerformanceMonitor />` component

---

## Planned Phases

### Phase 12: Experience Container System 📋
**Status: PLANNED**
**Design Doc**: [EXPERIENCE_CONTAINER_SYSTEM.md](./EXPERIENCE_CONTAINER_SYSTEM.md)

A comprehensive, server-driven layout system for building dynamic dashboards and feed-based UIs.

**Staged Implementation**:

| Stage | Component | Description |
|-------|-----------|-------------|
| 1 | SDUIList | Virtualized vertical list (FlashList) |
| 2 | SDUIGrid | Grid layout with configurable columns |
| 3 | SDUICarousel | Horizontal scroll with snap/autoplay |
| 4 | SDUISection | Header/footer wrapper for sections |
| 5 | Card Templates | Pre-built card layouts (MediaCard, ListItemCard, etc.) |
| 6 | Experience Registry | Domain team registration system |

**Key Features**:
- [ ] Domain team experience registration
- [ ] Configurable containers (list, grid, carousel)
- [ ] Section headers and footers
- [ ] Multiple card templates
- [ ] Server-driven configuration
- [ ] 10,000+ item virtualization

**Checkpoint**: Dashboard renders from schema with mixed container types

---

### Phase 13: Polish & Documentation 📋
**Status: PLANNED**

- [ ] API reference for each package
- [ ] Code examples and tutorials
- [ ] Migration guides
- [ ] Performance optimization guide
- [ ] Prepare for public release
  - [ ] Split free packages to public repo
  - [ ] Set up npm publishing
  - [ ] License files

**Final Checkpoint**:
- [ ] >80% test coverage
- [ ] No lint errors
- [ ] Full demo working
- [ ] Repo ready for public

---

## Adapter Pattern Summary

All Firebase-dependent packages now support swappable backends:

| Package | Adapters Available |
|---------|-------------------|
| Auth | Firebase, Console, NoOp |
| Notifications | Firebase FCM, Console, NoOp |
| Analytics | Firebase, Console, NoOp |
| i18n | i18next, Console, NoOp |
| Performance | Firebase Perf, Console, NoOp |

```typescript
// Example: Swap providers without changing app code
const authAdapter = __DEV__
  ? new ConsoleAdapter()
  : new FirebaseAuthAdapter();

<AuthProvider adapter={authAdapter}>
  <App />
</AuthProvider>
```

---

## Package Breakdown

### FREE Tier (MIT License)
| Package | Description |
|---------|-------------|
| `@rn-toolkit/theming` | Dark/light mode, tokens, scoped themes |
| `@rn-toolkit/primitives` | Text, Button, Card, Stack, Input |
| `@rn-toolkit/testing` | renderWithTheme, snapshots, mocks |
| `@rn-toolkit/i18n` | Translations, accessibility |
| `@rn-toolkit/performance` | Memory leak detection |

### PAID Tier (Commercial License)
| Package | Description |
|---------|-------------|
| `@rn-toolkit/sdui` | JSON → Native UI, Actions |
| `@rn-toolkit/security` | SecureStorage, Sanitize, Validate |
| `@rn-toolkit/auth` | Social login, 2FA, adapters |
| `@rn-toolkit/notifications` | Push, local, topics, adapters |
| `@rn-toolkit/analytics` | Events, tracking, adapters |
| `@rn-toolkit/deeplink` | Type-safe routes, badging |
| `@rn-toolkit/testing/dsl` | Fluent test DSL, matrix testing |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-05 | Use npm instead of Yarn | More familiar, no permission issues |
| 2026-03-05 | Testing basic utils FREE, DSL PAID | Users need to test free packages |
| 2026-03-05 | Theming + Primitives FREE | Table stakes for adoption |
| 2026-03-05 | SDUI + Deeplink PAID | Core value proposition |
| 2026-03-05 | Add Security package (PAID) | PayPal background, enterprise focus |
| 2026-03-05 | i18n FREE | Accessibility is a right, not a feature |
| 2026-03-05 | Performance FREE | Helps all developers |
| 2026-03-05 | **Adapter Pattern for all Firebase services** | Zero vendor lock-in, testability |
| 2026-03-05 | Experience Container System as staged rollout | Complex feature, build incrementally |
