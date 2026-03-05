# 🏗️ Architecture

## 📐 System Overview

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                   ┃
┃                     🚀 apps/scaffold                              ┃
┃                    (Expo Demo Application)                        ┃
┃                                                                   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                   ┃
┃   ┌─────────────────────────┐    ┌─────────────────────────┐     ┃
┃   │    📡 @rn-toolkit/sdui  │    │  🔗 @rn-toolkit/deeplink│     ┃
┃   │     (SDUI Engine)       │    │     (Navigation)        │     ┃
┃   │        💎 PAID          │    │        💎 PAID          │     ┃
┃   └───────────┬─────────────┘    └─────────────────────────┘     ┃
┃               │                                                   ┃
┃               ▼                                                   ┃
┃   ┌───────────────────────────────────────────────────────────┐  ┃
┃   │                🧩 @rn-toolkit/primitives                   │  ┃
┃   │                   (UI Components)                          │  ┃
┃   │                      🆓 FREE                               │  ┃
┃   └───────────────────────────┬───────────────────────────────┘  ┃
┃                               │                                   ┃
┃                               ▼                                   ┃
┃   ┌───────────────────────────────────────────────────────────┐  ┃
┃   │                 🎨 @rn-toolkit/theming                     │  ┃
┃   │                   (Theme System)                           │  ┃
┃   │                      🆓 FREE                               │  ┃
┃   └───────────────────────────────────────────────────────────┘  ┃
┃                                                                   ┃
┃   ┌───────────────────────────────────────────────────────────┐  ┃
┃   │                 🧪 @rn-toolkit/testing                     │  ┃
┃   │          Basic Utils 🆓 FREE  │  DSL 💎 PAID              │  ┃
┃   └───────────────────────────────────────────────────────────┘  ┃
┃                                                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🔄 Package Dependencies

```
📡 @rn-toolkit/sdui
 └──▶ 🧩 @rn-toolkit/primitives
       └──▶ 🎨 @rn-toolkit/theming

🔗 @rn-toolkit/deeplink
 └──▶ (standalone, optional theming integration)

🧪 @rn-toolkit/testing
 ├──▶ 🎨 @rn-toolkit/theming (for theme snapshots)
 └──▶ 🧩 @rn-toolkit/primitives (for component testing)
```

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

### 4️⃣ Navigation UI Strategy

Navigation components are split between free and paid:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Navigation UI Split                          │
├─────────────────────────────────┬───────────────────────────────────┤
│     🆓 FREE (Primitives)        │      💎 PAID (Deeplink)           │
├─────────────────────────────────┼───────────────────────────────────┤
│  • Header                       │  • SmartHeader                    │
│  • TabBar                       │  • SmartTabBar                    │
│  • BottomNav                    │  • NavigationContainer            │
│  • NavDrawer                    │  • useNavigationUI                │
├─────────────────────────────────┼───────────────────────────────────┤
│  Visual only, manual control    │  Route-aware, auto-integrated     │
│  Works with React Navigation    │  Deep linking built-in            │
│  No deep link support           │  History & state restoration      │
└─────────────────────────────────┴───────────────────────────────────┘
```

**Free Usage (with any navigation library):**
```typescript
import { TabBar } from '@rn-toolkit/primitives';

// YOU manage active state and navigation
<TabBar
  items={[
    { icon: 'home', label: 'Home' },
    { icon: 'profile', label: 'Profile' },
  ]}
  activeIndex={currentIndex}
  onPress={(index) => navigation.navigate(screens[index])}
/>
```

**Paid Usage (integrated with deeplink):**
```typescript
import { SmartTabBar } from '@rn-toolkit/deeplink';

// Automatic! Knows current route, handles deep links
<SmartTabBar routes={[Routes.Home, Routes.Profile, Routes.Settings]} />
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

### 5️⃣ Automatic Theme Testing

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
│   ├── 🎨 theming/              # Theme system [FREE]
│   │   ├── src/
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── ThemeContext.ts
│   │   │   ├── useTheme.ts
│   │   │   ├── useColorScheme.ts
│   │   │   ├── types.ts
│   │   │   └── themes/default.ts
│   │   └── __tests__/
│   │
│   ├── 🧩 primitives/           # UI components [FREE]
│   │   ├── src/
│   │   │   ├── Text/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Header/          # Basic app bar
│   │   │   ├── TabBar/          # Bottom tabs (visual)
│   │   │   ├── BottomNav/       # Bottom navigation
│   │   │   ├── NavDrawer/       # Side drawer
│   │   │   └── ...
│   │   └── __tests__/
│   │
│   ├── 🧪 testing/              # Test utilities
│   │   ├── src/              # Basic utils [FREE]
│   │   │   ├── renderWithTheme.ts
│   │   │   ├── createThemeSnapshot.ts
│   │   │   └── mocks/
│   │   └── src/dsl/          # DSL [PAID]
│   │       ├── screen.ts
│   │       ├── component.ts
│   │       └── matchers.ts
│   │
│   ├── 📡 sdui/                 # SDUI engine [PAID]
│   │   ├── src/
│   │   │   ├── SDUIRenderer.tsx
│   │   │   ├── ComponentRegistry.ts
│   │   │   └── ActionHandler.ts
│   │   └── __tests__/
│   │
│   └── 🔗 deeplink/             # Navigation [PAID]
│       ├── src/
│       │   ├── DeepLinkProvider.tsx
│       │   ├── useDeepLink.ts
│       │   ├── RouteRegistry.ts
│       │   ├── SmartHeader.tsx      # Route-aware header
│       │   ├── SmartTabBar.tsx      # Auto-active tabs
│       │   ├── NavigationContainer.tsx
│       │   └── useNavigationUI.ts
│       └── __tests__/
│
└── 📁 apps/
    └── 🚀 scaffold/             # Demo app
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
| Packages | `@rn-toolkit/<name>` | `@rn-toolkit/theming` |
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
