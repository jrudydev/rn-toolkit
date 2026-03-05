# Roadmap

## Overview

This toolkit is being built to support rapid React Native app development, with a focus on:
- Server-Driven UI (SDUI) for dynamic interfaces
- Robust theming with dark/light mode
- Type-safe navigation and deep linking
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

### Phase 2: Testing Infrastructure ⏳
**Status: PENDING**

#### 2a: Basic Testing Utilities (FREE)
- [ ] `@rn-toolkit/testing` package
  - [ ] `renderWithTheme()` - Render with theme provider
  - [ ] `renderWithProviders()` - Render with all providers
  - [ ] `createThemeSnapshot()` - Snapshot both light/dark modes
  - [ ] Mock utilities for navigation, SDUI
  - [ ] Custom Jest matchers

#### 2b: Testing DSL (PAID)
- [ ] `@rn-toolkit/testing/dsl` submodule
  - [ ] `dsl.screen()` - Screen-level assertions
  - [ ] `dsl.component()` - Component-level assertions
  - [ ] Fluent API for readable tests
  - [ ] Automatic theme variant testing

**Checkpoint**: `npm test` runs all theming tests with theme snapshots

---

### Phase 3: Core UI Components ⏳
**Status: PENDING**

- [ ] `@rn-toolkit/primitives` package (FREE)
  - [ ] Text (with variants: title, body, caption, etc.)
  - [ ] Button (with variants: primary, secondary, outline)
  - [ ] Card
  - [ ] Avatar
  - [ ] Stack (VStack, HStack, ZStack)
  - [ ] Container
  - [ ] Input
  - [ ] Divider
  - [ ] **Navigation UI (visual only)**
    - [ ] Header (app bar with title, back button, actions)
    - [ ] TabBar (bottom tabs)
    - [ ] BottomNav (bottom navigation bar)
    - [ ] NavDrawer (side drawer menu)
  - [ ] All components theme-aware
  - [ ] Snapshot tests for light/dark modes

**Checkpoint**: Scaffold app shows primitives showcase

---

### Phase 4: SDUI Engine ⏳
**Status: PENDING**

- [ ] `@rn-toolkit/sdui` package (PAID)
  - [ ] SDUIRenderer component
  - [ ] ComponentRegistry for custom components
  - [ ] Built-in components map to primitives
  - [ ] Action handling (navigate, API calls)
  - [ ] Schema validation
  - [ ] Mock data utilities

**Checkpoint**: Change JSON schema → UI updates in browser

---

### Phase 5: Deep Linking ⏳
**Status: PENDING**

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

**Checkpoint**: Open deep link URL → Navigate to correct screen

---

### Phase 6: Polish & Documentation ⏳
**Status: PENDING**

- [ ] Claude skills setup
  - [ ] `/new-component` - Create SDUI-compatible component
  - [ ] `/pre-commit` - Run checks before commit
  - [ ] `/theme-test` - Run tests in both theme modes
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

## Timeline

| Phase | Target |
|-------|--------|
| Phase 0-1 | ✅ Complete |
| Phase 2 | Before assessment |
| Phase 3 | Before assessment |
| Phase 4-5 | Before assessment (core features) |
| Phase 6 | Post-assessment polish |

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
