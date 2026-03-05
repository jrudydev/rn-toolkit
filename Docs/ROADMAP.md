# Roadmap

## Overview

This toolkit is being built to support rapid React Native app development, with a focus on:
- Server-Driven UI (SDUI) for dynamic interfaces
- Robust theming with dark/light mode
- Type-safe navigation and deep linking
- Enterprise-grade security and authentication
- Comprehensive testing with snapshot and DSL support

---

## Phases

### Phase 0: Environment Verification ✅
**Status: COMPLETE**

- [x] Node.js >= 18 verified
- [x] npm workspaces configured
- [x] Expo CLI working
- [x] Web preview functional
- [x] WSL + Windows dev environment tested

---

### Phase 1: Foundation + First Device Test ✅
**Status: COMPLETE**

- [x] Monorepo setup (npm workspaces, TypeScript)
- [x] `@rn-toolkit/theming` package
  - [x] ThemeProvider with scope support
  - [x] useTheme hook
  - [x] Dark/light mode detection
  - [x] Color, spacing, typography, shadow tokens
  - [x] 11 passing tests
- [x] `apps/scaffold` Expo app
  - [x] Web support
  - [x] Theme demo screen
  - [x] Toggle functionality

**Checkpoint**: App runs in browser at localhost:8081 ✅

---

### Phase 2: Testing Infrastructure ✅
**Status: COMPLETE**

- [x] `@rn-toolkit/testing` package
  - [x] `renderWithTheme()` - Render with theme provider
  - [x] `renderWithProviders()` - Render with all providers
  - [x] `createThemeSnapshot()` - Snapshot both light/dark modes
  - [x] Mock utilities for navigation, SDUI
  - [x] 35 passing tests

**Checkpoint**: `npm test` runs all theming tests with theme snapshots ✅

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

**Checkpoint**: Scaffold app shows primitives showcase ✅

---

### Phase 4: SDUI Engine ✅
**Status: COMPLETE**

- [x] `@rn-toolkit/sdui` package (PAID)
  - [x] SDUIRenderer component
  - [x] ComponentRegistry for custom components
  - [x] Built-in components (text, button, card, stack, input, divider, image, container)
  - [x] Action handling (navigate, API calls, setState, custom)
  - [x] 31 tests passing, 2 snapshots

**Checkpoint**: Change JSON schema → UI updates ✅

---

### Phase 5: Security ✅
**Status: COMPLETE**

- [x] `@rn-toolkit/security` package (PAID)
  - [x] Secure Storage (Keychain/Keystore wrapper)
    - [x] `SecureStorage.set(key, value)`
    - [x] `SecureStorage.get(key)`
    - [x] `SecureStorage.delete(key)`
    - [x] `SecureStorage.has(key)`
    - [x] `SecureStorage.setJSON()` / `getJSON()`
  - [x] Input Sanitization
    - [x] `sanitize.text()` - XSS prevention
    - [x] `sanitize.html()` - HTML/script stripping
    - [x] `sanitize.url()` - URL validation
    - [x] `sanitize.email()` - Email validation
    - [x] `sanitize.sql()` - SQL injection prevention
    - [x] `sanitize.filename()` - Path traversal prevention
    - [x] `sanitize.phone()` - Phone number sanitization
  - [x] Schema Validation
    - [x] `validateSchema()` - SDUI schema validation
    - [x] `SchemaValidator` class with options
    - [x] Dangerous pattern detection (XSS, prototype pollution)
    - [x] Max depth/nodes/children limits
  - [x] Security utilities
    - [x] `useSecureInput()` hook
    - [x] `<SecureTextInput />` component
  - [x] 99 tests passing

**Checkpoint**: Secure storage works, schemas validated before render ✅

---

### Phase 6: Authentication 📋
**Status: PLANNED**

- [ ] `@rn-toolkit/auth` package (PAID) - **Firebase Powered**
  - [ ] Firebase Authentication integration
  - [ ] Social login
    - [ ] Apple Sign-In
    - [ ] Google Sign-In
    - [ ] Facebook Login
  - [ ] Email/Password authentication
  - [ ] Phone/SMS authentication
  - [ ] Magic link authentication
  - [ ] Two-factor authentication (2FA)
    - [ ] SMS verification
    - [ ] Email verification
    - [ ] TOTP (authenticator apps)
  - [ ] Session management
    - [ ] Token refresh
    - [ ] Session tracking
    - [ ] Activity monitoring
  - [ ] Hooks
    - [ ] `useAuth()` - Authentication state
    - [ ] `useUser()` - Current user
    - [ ] `useSession()` - Session management
  - [ ] Components
    - [ ] `<AuthProvider />` - Auth context
    - [ ] `<SignInButton />` - Social sign-in buttons
    - [ ] `<ProtectedRoute />` - Auth-gated routes

**Checkpoint**: Social login works, 2FA configurable

---

### Phase 7: Internationalization 📋
**Status: PLANNED**

- [ ] `@rn-toolkit/i18n` package (FREE)
  - [ ] Localization
    - [ ] `useTranslation()` hook
    - [ ] String translations
    - [ ] Pluralization
    - [ ] Date/time formatting
    - [ ] Number/currency formatting
  - [ ] Accessibility (a11y)
    - [ ] `useAccessibility()` hook
    - [ ] Screen reader labels
    - [ ] Accessible actions
    - [ ] Focus management
    - [ ] Contrast/scaling support
  - [ ] `<I18nProvider />` component
  - [ ] RTL layout support

**Checkpoint**: App works in multiple languages with full accessibility

---

### Phase 8: Deep Linking 📋
**Status: PLANNED**

- [ ] `@rn-toolkit/deeplink` package (PAID)
  - [ ] Type-safe route definitions (enums)
  - [ ] DeepLinkProvider with history tracking
  - [ ] useDeepLink() hook
  - [ ] State restoration on back navigation
  - [ ] URL parsing and building utilities
  - [ ] **Smart Navigation UI (route-integrated)**
    - [ ] SmartHeader (auto back button, route-aware title)
    - [ ] SmartTabBar (auto-highlights active route)
    - [ ] NavigationContainer (wraps app, manages state)
    - [ ] useNavigationUI() hook for custom nav components
  - [ ] **Navigation Badging (SDUI-driven)**
    - [ ] Badge count endpoint integration
    - [ ] `useBadgeCount()` hook
    - [ ] Auto-updating badge UI
    - [ ] Tab bar badge support

**Checkpoint**: Open deep link URL → Navigate to correct screen, badges update from backend

---

### Phase 9: Push Notifications 📋
**Status: PLANNED**

- [ ] `@rn-toolkit/notifications` package (PAID) - **Firebase Powered**
  - [ ] Firebase Cloud Messaging (FCM) integration
  - [ ] Push notification handling
    - [ ] Foreground notifications
    - [ ] Background notifications
    - [ ] Data-only notifications
  - [ ] Local notifications
  - [ ] Notification scheduling
  - [ ] Deep link handling from notifications
  - [ ] Hooks
    - [ ] `useNotifications()` - Permission & token management
    - [ ] `useNotificationListener()` - Handle incoming notifications
  - [ ] Components
    - [ ] `<NotificationProvider />` - Notification context
  - [ ] SDUI Integration
    - [ ] Notification-triggered UI updates

**Checkpoint**: Push notifications work on iOS/Android with deep linking

---

### Phase 10: Analytics & Metrics 📋
**Status: PLANNED**

- [ ] `@rn-toolkit/analytics` package (PAID) - **Firebase Powered**
  - [ ] Firebase Analytics integration
  - [ ] Event tracking
    - [ ] Screen views
    - [ ] User actions
    - [ ] Custom events
  - [ ] User properties
  - [ ] Conversion tracking
  - [ ] Session tracking
  - [ ] Hooks
    - [ ] `useAnalytics()` - Track events
    - [ ] `useScreenTracking()` - Auto screen tracking
  - [ ] Components
    - [ ] `<AnalyticsProvider />` - Analytics context
    - [ ] `<TrackedButton />` - Auto-tracked button
  - [ ] SDUI Integration
    - [ ] Schema-driven event tracking
    - [ ] Action analytics

**Checkpoint**: Events tracked, dashboards populated

---

### Phase 11: Performance Testing 📋
**Status: PLANNED**

- [ ] `@rn-toolkit/performance` package (FREE)
  - [ ] Memory leak detection
    - [ ] Component unmount tracking
    - [ ] Subscription cleanup verification
    - [ ] Event listener cleanup
  - [ ] Performance profiling
    - [ ] Render time tracking
    - [ ] Re-render detection
    - [ ] Bundle size analysis
  - [ ] Development tools
    - [ ] `useLeakDetector()` hook
    - [ ] `<PerformanceMonitor />` component
    - [ ] Console warnings for issues
  - [ ] Test utilities
    - [ ] `expectNoLeaks()` matcher
    - [ ] `measureRenderTime()` helper

**Checkpoint**: Leak detection works, performance warnings in dev mode

---

### Phase 12: Virtualized Lists (FlashList) 📋
**Status: PLANNED**

- [ ] `SDUIList` component (PAID) - Add to @rn-toolkit/sdui
  - [ ] FlashList integration for virtualization
  - [ ] High-performance list rendering
  - [ ] Automatic item recycling
  - [ ] Schema-driven list configuration
    - [ ] `estimatedItemSize`
    - [ ] `numColumns`
    - [ ] Pull-to-refresh
    - [ ] Infinite scroll / pagination
  - [ ] Carousel mode
    - [ ] Horizontal scrolling
    - [ ] Snap behavior
    - [ ] Auto-play support
  - [ ] SDUI schema support
    - [ ] `type: 'list'` with FlashList backend
    - [ ] Dynamic item rendering

**Checkpoint**: Lists render 10,000+ items smoothly

---

### Phase 13: Testing DSL 📋
**Status: PLANNED**

- [ ] `@rn-toolkit/testing/dsl` submodule (PAID)
  - [ ] `dsl.screen()` - Screen-level assertions
  - [ ] `dsl.component()` - Component-level assertions
  - [ ] Fluent API for readable tests
  - [ ] Automatic theme variant testing

**Checkpoint**: Declarative tests running in both theme modes

---

### Phase 14: Polish & Documentation 📋
**Status: PLANNED**

- [ ] Documentation
  - [ ] API reference for each package
  - [ ] Code examples
  - [ ] Migration guides
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

## Test Stats

| Package | Tests | Snapshots |
|---------|-------|-----------|
| theming | 11 | 0 |
| testing | 35 | 0 |
| primitives | 60 | 16 |
| sdui | 31 | 2 |
| security | 99 | 1 |
| **Total** | **236** | **19** |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-05 | Use npm instead of Yarn | More familiar, no permission issues |
| 2026-03-05 | Remove expo-router temporarily | Monorepo resolution issues |
| 2026-03-05 | Option A for repo structure (separate repos) | Clean separation of free/paid |
| 2026-03-05 | Testing basic utils FREE, DSL PAID | Users need to test free packages |
| 2026-03-05 | Theming + Primitives FREE | Table stakes for adoption |
| 2026-03-05 | SDUI + Deeplink + DSL PAID | Core value proposition |
| 2026-03-05 | Split Navigation UI: visual FREE, smart PAID | Free users can use with React Navigation; paid gets routing integration |
| 2026-03-05 | Add Security package (PAID) | PayPal background, enterprise focus |
| 2026-03-05 | Add Auth package with Firebase (PAID) | Common need, quick setup |
| 2026-03-05 | Add i18n package (FREE) | Accessibility is a right, not a feature |
| 2026-03-05 | Firebase as backend provider | Unified backend, quick setup for auth/notifications/analytics |
| 2026-03-05 | Add Notifications package (PAID) | Firebase FCM, enterprise need for push |
| 2026-03-05 | Add Analytics package (PAID) | Firebase Analytics, usage metrics tracking |
| 2026-03-05 | Add Performance package (FREE) | Memory leak detection helps all developers |
| 2026-03-05 | Add SDUIList with FlashList (PAID) | High-performance virtualized lists |
| 2026-03-05 | Add Navigation Badging to deeplink (PAID) | SDUI-driven badge counts |
