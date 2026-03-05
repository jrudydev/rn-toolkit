# @rn-toolkit/analytics

Analytics tracking with **adapter pattern** for React Native - swap providers without code changes.

## Features

- **Adapter Pattern** - Swap analytics providers (Firebase, Mixpanel, etc.) without changing app code
- **Built-in Adapters** - Firebase, Console (debug), NoOp (testing)
- **Screen Tracking** - Automatic screen view tracking with `useScreenTracking`
- **Event Tracking** - Custom events with `useEventTracking` helper
- **E-commerce** - Built-in purchase, cart, and checkout tracking
- **User Identification** - User ID and properties for segmentation
- **TypeScript** - Full type safety with comprehensive interfaces

## Installation

```bash
npm install @rn-toolkit/analytics
```

### For Firebase Analytics

```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
```

## Quick Start

### 1. Choose your adapter

```tsx
import {
  AnalyticsProvider,
  FirebaseAdapter,
  ConsoleAdapter,
  NoOpAdapter,
} from '@rn-toolkit/analytics';

// Production: Firebase
const adapter = new FirebaseAdapter();

// Development: Console logging
const adapter = new ConsoleAdapter();

// Testing: No-op (silent)
const adapter = new NoOpAdapter();
```

### 2. Wrap your app

```tsx
function App() {
  // Use Console adapter in dev, Firebase in production
  const adapter = __DEV__
    ? new ConsoleAdapter()
    : new FirebaseAdapter();

  return (
    <AnalyticsProvider
      adapter={adapter}
      config={{
        debug: __DEV__,
        logToConsole: __DEV__,
        defaultParams: { app_version: '1.0.0' },
      }}
    >
      <MyApp />
    </AnalyticsProvider>
  );
}
```

### 3. Track events in components

```tsx
import { useAnalytics, useScreenTracking, useEventTracking } from '@rn-toolkit/analytics';

function HomeScreen() {
  // Auto-track screen views
  useScreenTracking({ screenName: 'HomeScreen' });

  // Basic analytics access
  const { logEvent, setUserId } = useAnalytics();

  // Pre-configured event tracker
  const { trackButtonPress, trackError } = useEventTracking({
    prefix: 'home',
    defaultParams: { screen: 'home' },
  });

  const handleLogin = async () => {
    try {
      await login();
      await setUserId(user.id);
      trackButtonPress('login_success');
    } catch (error) {
      trackError(error.message, 'LOGIN_ERROR');
    }
  };

  return (
    <Button onPress={handleLogin} title="Login" />
  );
}
```

## API Reference

### AnalyticsProvider

Provider component that wraps your app with analytics context.

```tsx
<AnalyticsProvider
  adapter={adapter}        // Required: Analytics adapter
  config={{
    debug: false,          // Enable debug mode
    logToConsole: false,   // Log events to console
    defaultParams: {},     // Default params for all events
  }}
>
  {children}
</AnalyticsProvider>
```

### Built-in Adapters

#### FirebaseAdapter

```typescript
import { FirebaseAdapter } from '@rn-toolkit/analytics';

const adapter = new FirebaseAdapter();
// Requires @react-native-firebase/analytics
```

#### ConsoleAdapter

```typescript
import { ConsoleAdapter } from '@rn-toolkit/analytics';

const adapter = new ConsoleAdapter({
  prefix: '[Analytics]',  // Log prefix
  timestamps: true,       // Include timestamps
});
```

#### NoOpAdapter

```typescript
import { NoOpAdapter } from '@rn-toolkit/analytics';

const adapter = new NoOpAdapter();
// Silent - does nothing (useful for testing)
```

### Creating Custom Adapters

Implement the `AnalyticsAdapter` interface:

```typescript
import type { AnalyticsAdapter } from '@rn-toolkit/analytics';

class MixpanelAdapter implements AnalyticsAdapter {
  readonly name = 'mixpanel';

  async initialize() {
    // Initialize Mixpanel SDK
  }

  async logEvent(name: string, params?: EventParams) {
    mixpanel.track(name, params);
  }

  async logScreenView(screenName: string) {
    mixpanel.track('Screen View', { screen_name: screenName });
  }

  async setUserId(userId: string | null) {
    if (userId) {
      mixpanel.identify(userId);
    } else {
      mixpanel.reset();
    }
  }

  // ... implement all other methods
}
```

### Hooks

#### useAnalytics

Main hook for analytics operations.

```typescript
const {
  isInitialized,    // Provider ready
  isEnabled,        // Collection enabled
  adapterName,      // Current adapter name
  logEvent,         // Log custom event
  logScreenView,    // Log screen view
  setUserId,        // Set user ID
  setUserProperties, // Set user properties
  setEnabled,       // Enable/disable collection
  reset,            // Reset analytics data
  logLogin,         // Log login event
  logSignUp,        // Log sign up event
  logSearch,        // Log search event
  logPurchase,      // Log purchase event
  logAddToCart,     // Log add to cart
  logBeginCheckout, // Log begin checkout
} = useAnalytics();
```

#### useScreenTracking

Automatic screen view tracking.

```typescript
useScreenTracking({
  screenName: 'HomeScreen',     // Required
  screenClass: 'HomeClass',     // Optional
  enabled: true,                // Enable/disable
  trackOnEveryRender: false,    // Track once vs every render
});
```

#### useEventTracking

Pre-configured event tracker with helpers.

```typescript
const {
  track,              // Custom event
  trackButtonPress,   // Button press
  trackLinkClick,     // Link click
  trackFormSubmit,    // Form submission
  trackError,         // Error event
  trackTiming,        // Timing event
} = useEventTracking({
  prefix: 'checkout',           // Event name prefix
  defaultParams: { flow: 'web' }, // Default params
});

// Example
await trackButtonPress('pay');
// Logs: "checkout_button_press" with { flow: 'web', button_name: 'pay' }
```

## E-commerce Tracking

```typescript
const { logPurchase, logAddToCart, logBeginCheckout } = useAnalytics();

// Add to cart
await logAddToCart(29.99, 'USD', [
  { itemId: 'SKU123', itemName: 'T-Shirt', price: 29.99, quantity: 1 },
]);

// Begin checkout
await logBeginCheckout(59.98, 'USD', [
  { itemId: 'SKU123', itemName: 'T-Shirt', price: 29.99, quantity: 2 },
]);

// Complete purchase
await logPurchase(59.98, 'USD', [
  { itemId: 'SKU123', itemName: 'T-Shirt', price: 29.99, quantity: 2 },
], 'ORDER-12345');
```

## User Identification

```typescript
const { setUserId, setUserProperties, setUserProperty, reset } = useAnalytics();

// After login
await setUserId('user-123');
await setUserProperties({
  plan: 'premium',
  signup_date: '2024-01-15',
});

// Update single property
await setUserProperty('theme', 'dark');

// On logout
await setUserId(null);
await reset();
```

## Adapter Pattern Benefits

The adapter pattern allows you to:

1. **Swap providers easily** - Change from Firebase to Mixpanel with one line
2. **Test without real analytics** - Use `NoOpAdapter` or `ConsoleAdapter`
3. **A/B test providers** - Try different analytics services
4. **Create custom adapters** - Build adapters for any service

```typescript
// Switch providers without changing any component code:

// Before (Firebase)
<AnalyticsProvider adapter={new FirebaseAdapter()}>

// After (Mixpanel)
<AnalyticsProvider adapter={new MixpanelAdapter(token)}>

// Your components don't change at all!
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  AnalyticsAdapter,
  AnalyticsConfig,
  EventParams,
  UserProperties,
  EcommerceItem,
  ScreenViewEvent,
} from '@rn-toolkit/analytics';
```

## License

MIT
