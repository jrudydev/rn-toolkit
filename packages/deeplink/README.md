# @rn-toolkit/deeplink

Type-safe deep linking and navigation for React Native with history tracking, state restoration, and SDUI-driven badge counts.

## Features

- **Type-Safe Routes**: Define routes with TypeScript for compile-time safety
- **Deep Link Handling**: Parse and handle incoming deep links automatically
- **History Stack**: Full navigation history with back/forward support
- **State Restoration**: Preserve screen state when navigating back
- **Badge Counts**: SDUI-driven badge counts with polling support
- **Smart Components**: Pre-built TabBar and Header components

## Installation

```bash
npm install @rn-toolkit/deeplink
```

### Peer Dependencies

```bash
npm install @rn-toolkit/theming react-native
```

## Quick Start

### 1. Define Routes

```typescript
// routes.ts
import type { RouteDefinition } from '@rn-toolkit/deeplink';

export const routes: Record<string, RouteDefinition> = {
  home: { path: '/', name: 'Home' },
  profile: { path: '/profile/:id', name: 'Profile' },
  settings: { path: '/settings', name: 'Settings' },
  notifications: { path: '/notifications', name: 'Notifications' },
};
```

### 2. Set Up Provider

```tsx
// App.tsx
import { DeepLinkProvider } from '@rn-toolkit/deeplink';
import { ThemeProvider } from '@rn-toolkit/theming';
import { routes } from './routes';

function App() {
  return (
    <ThemeProvider>
      <DeepLinkProvider
        routes={routes}
        initialRoute="home"
        config={{
          schemes: ['myapp', 'https'],
          fallbackRoute: 'home',
        }}
        badgeConfig={{
          endpoint: 'https://api.example.com/badges',
          pollInterval: 30000, // 30 seconds
        }}
      >
        <Navigator />
      </DeepLinkProvider>
    </ThemeProvider>
  );
}
```

### 3. Navigate

```tsx
import { useDeepLink } from '@rn-toolkit/deeplink';

function ProfileButton({ userId }: { userId: string }) {
  const { navigate } = useDeepLink();

  return (
    <Button
      title="View Profile"
      onPress={() => navigate('profile', { id: userId })}
    />
  );
}
```

## API Reference

### DeepLinkProvider

The main provider component that manages navigation state.

```tsx
<DeepLinkProvider
  routes={routes}           // Route definitions
  initialRoute="home"       // Initial route (optional)
  config={{
    schemes: ['myapp'],     // URL schemes to handle
    fallbackRoute: 'home',  // Route when deep link doesn't match
    maxHistorySize: 50,     // Maximum history entries
    onDeepLink: (url, route) => {}, // Callback on deep link
    onNavigate: (route, options) => {}, // Callback on navigation
  }}
  badgeConfig={{
    endpoint: 'https://...',      // Badge API endpoint
    fetchBadges: async () => [],  // Or custom fetch function
    pollInterval: 30000,          // Polling interval (ms)
    onBadgesUpdate: (badges) => {}, // Callback on badge update
  }}
>
  {children}
</DeepLinkProvider>
```

### useDeepLink

Main hook for navigation.

```tsx
const {
  // Navigation
  navigate,      // Navigate to route
  goBack,        // Go back in history
  goForward,     // Go forward in history
  reset,         // Reset history to route

  // State
  currentRoute,  // Current parsed route
  history,       // Navigation history
  canGoBack,     // Can navigate back

  // State management
  getState,      // Get current screen state
  setState,      // Update current screen state

  // Registry
  registry,      // Route registry

  // Badges
  badges,        // Badge counts map
  getBadge,      // Get badge for route
  refreshBadges, // Manually refresh badges
} = useDeepLink();
```

### useRoute

Access current route information with typed params.

```tsx
interface ProfileParams {
  id: string;
}

function ProfileScreen() {
  const { params, name, query, isActive, isRouteActive } = useRoute<ProfileParams>();

  return (
    <View>
      <Text>Profile ID: {params.id}</Text>
      <Text>Route Name: {name}</Text>
      <Text>Tab: {query.tab}</Text>
    </View>
  );
}
```

### useNavigationState

Manage state that persists across navigation.

```tsx
interface FormState {
  name: string;
  email: string;
}

function FormScreen() {
  const { state, setState, clearState, hasState } = useNavigationState<FormState>({
    name: '',
    email: '',
  });

  // State is restored when coming back to this screen
  return (
    <View>
      <TextInput
        value={state?.name || ''}
        onChangeText={(name) => setState({ ...state, name })}
      />
    </View>
  );
}
```

### useBadgeCount

Get badge count for a specific route.

```tsx
function NotificationIcon() {
  const { count, hasBadge, formattedCount, refresh } = useBadgeCount('notifications');

  return (
    <View>
      <BellIcon />
      {hasBadge && <Badge>{formattedCount}</Badge>}
    </View>
  );
}
```

### useAllBadges

Get all badge counts.

```tsx
function TabBar() {
  const { badges, totalCount, refresh } = useAllBadges();

  return (
    <View>
      {tabs.map(tab => (
        <Tab key={tab.id} badge={badges.get(tab.id) || 0} />
      ))}
      <Text>Total: {totalCount}</Text>
    </View>
  );
}
```

## Components

### SmartTabBar

Tab bar with deep link integration and badge support.

```tsx
import { SmartTabBar, type TabDefinition } from '@rn-toolkit/deeplink';

const tabs: TabDefinition[] = [
  { routeId: 'home', label: 'Home', icon: <HomeIcon /> },
  { routeId: 'notifications', label: 'Alerts', showBadge: true },
  { routeId: 'profile', label: 'Profile', params: { id: 'me' } },
];

function MyTabBar() {
  return (
    <SmartTabBar
      tabs={tabs}
      showLabels
      maxBadgeCount={99}
      onTabPress={(routeId) => console.log('Pressed:', routeId)}
    />
  );
}
```

### SmartHeader

Header with automatic back button.

```tsx
import { SmartHeader } from '@rn-toolkit/deeplink';

function ScreenHeader() {
  return (
    <SmartHeader
      title="Profile"
      showBackLabel
      backLabel="Back"
      rightActions={<SettingsButton />}
      transparent={false}
      centerTitle
    />
  );
}
```

## Route Patterns

### Basic Routes

```typescript
const routes = {
  home: { path: '/' },
  settings: { path: '/settings' },
};
```

### Routes with Parameters

```typescript
const routes = {
  profile: { path: '/profile/:id' },
  post: { path: '/users/:userId/posts/:postId' },
};

// Navigate
navigate('profile', { id: '123' });
navigate('post', { userId: '42', postId: '99' });
```

### Optional Parameters

```typescript
const routes = {
  category: { path: '/category/:id?' },
};

// Both work
navigate('category', { id: 'tech' }); // /category/tech
navigate('category');                  // /category
```

### Default Parameters

```typescript
const routes = {
  profile: {
    path: '/profile/:id',
    defaultParams: { id: 'me' },
  },
};

navigate('profile'); // /profile/me
```

### Route Metadata

```typescript
const routes = {
  settings: {
    path: '/settings',
    name: 'Settings',
    requiresAuth: true,
    meta: {
      icon: 'gear',
      analyticsId: 'settings_page',
    },
  },
};
```

## Deep Link Handling

### Supported URL Formats

```
myapp://profile/123
myapp://example.com/profile/123
https://example.com/profile/123?tab=posts#section
```

### Handling Deep Links

```tsx
<DeepLinkProvider
  config={{
    schemes: ['myapp', 'https'],
    onDeepLink: (url, route) => {
      console.log('Received deep link:', url);
      if (route) {
        console.log('Matched route:', route.name);
      }
    },
  }}
/>
```

### Testing Deep Links

```bash
# iOS Simulator
xcrun simctl openurl booted "myapp://profile/123"

# Android Emulator
adb shell am start -a android.intent.action.VIEW -d "myapp://profile/123"

# Expo
npx uri-scheme open "myapp://profile/123" --ios
```

## Navigation Options

```typescript
// Standard navigation (adds to history)
navigate('profile', { id: '123' });

// Replace current entry
navigate('profile', { id: '456' }, { replace: true });

// Reset entire history
navigate('home', undefined, { reset: true });
// or
reset('home');

// With state
navigate('profile', { id: '123' }, { state: { tab: 'posts' } });
```

## Badge Configuration

### From API Endpoint

```tsx
<DeepLinkProvider
  badgeConfig={{
    endpoint: 'https://api.example.com/badges',
    pollInterval: 30000, // Poll every 30 seconds
  }}
/>
```

Expected API response:
```json
[
  { "routeId": "notifications", "count": 5 },
  { "routeId": "messages", "count": 12 }
]
```

### Custom Fetch Function

```tsx
<DeepLinkProvider
  badgeConfig={{
    fetchBadges: async () => {
      const response = await fetch('/api/badges');
      return response.json();
    },
    onBadgesUpdate: (badges) => {
      console.log('Badges updated:', badges);
    },
  }}
/>
```

## TypeScript

### Typed Route Params

```typescript
// Define param types
interface ProfileParams {
  id: string;
}

interface PostParams {
  userId: string;
  postId: string;
}

// Use in components
const { params } = useRoute<ProfileParams>();
console.log(params.id); // TypeScript knows this is string

// Navigate with type checking
navigate<ProfileParams>('profile', { id: '123' });
```

### Typed Navigation State

```typescript
interface ScreenState {
  scrollPosition: number;
  selectedTab: string;
}

const { state, setState } = useNavigationState<ScreenState>();
```

## Testing

```tsx
import { render } from '@testing-library/react-native';
import { DeepLinkProvider } from '@rn-toolkit/deeplink';
import { ThemeProvider } from '@rn-toolkit/theming';

const routes = {
  home: { path: '/' },
  profile: { path: '/profile/:id' },
};

function renderWithNavigation(component: React.ReactElement) {
  return render(
    <ThemeProvider>
      <DeepLinkProvider routes={routes} initialRoute="home">
        {component}
      </DeepLinkProvider>
    </ThemeProvider>
  );
}

test('navigates to profile', async () => {
  const { getByText, findByText } = renderWithNavigation(<MyComponent />);

  fireEvent.press(getByText('View Profile'));

  expect(await findByText('Profile Screen')).toBeTruthy();
});
```

## License

MIT
