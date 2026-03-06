# @rn-toolkit/notifications

Push notification management for React Native with **adapter pattern** for swappable backends.

## Features

- **Adapter Pattern** - Swap notification backends (Firebase, OneSignal, Expo, etc.) without changing app code
- **Built-in Adapters** - Firebase, Console (debug), NoOp (testing)
- **Topic Subscriptions** - Subscribe/unsubscribe to notification topics
- **Permission Handling** - Request and track notification permissions
- **Token Management** - Automatic push token retrieval and refresh
- **In-App Notifications** - Display notifications within the app
- **Local Notifications** - Schedule local notifications
- **Badge Management** - Control app badge count
- **TypeScript** - Full type safety

## Installation

```bash
npm install @rn-toolkit/notifications
```

### Peer Dependencies (Optional)

Only install peer dependencies for the adapter you're using:

```bash
# For FirebaseNotificationAdapter
npm install @react-native-firebase/app @react-native-firebase/messaging

# For other adapters (OneSignal, Expo, etc.)
# Install their respective SDKs
```

## Quick Start

### 1. Choose an adapter

```tsx
import {
  NotificationProvider,
  FirebaseNotificationAdapter,
  ConsoleAdapter,
  NoOpAdapter,
} from '@rn-toolkit/notifications';

// Production: Firebase Cloud Messaging
const adapter = new FirebaseNotificationAdapter();

// Development: Console logging (logs all calls to console)
const adapter = new ConsoleAdapter({ prefix: '[Notifications]' });

// Testing: NoOp (does nothing, configurable responses)
const adapter = new NoOpAdapter({ initialPermission: 'granted' });

// Environment-based selection
const adapter = __DEV__
  ? new ConsoleAdapter({ prefix: '[Notif]' })
  : new FirebaseNotificationAdapter();
```

### 2. Wrap your app with NotificationProvider

```tsx
function App() {
  return (
    <NotificationProvider
      adapter={adapter}
      config={{
        requestPermissionOnInit: true,
        autoSubscribeTopics: ['general', 'updates'],
        handlers: {
          onForegroundMessage: (notification) => {
            console.log('Received:', notification);
          },
          onNotificationOpened: (notification) => {
            // Handle navigation when app opened from notification
            console.log('Opened from notification:', notification);
          },
        },
        onTokenReceived: (token) => {
          // Send token to your backend
          console.log('Push Token:', token);
        },
      }}
    >
      <MyApp />
    </NotificationProvider>
  );
}
```

### 3. Use hooks in components

```tsx
import {
  useNotifications,
  usePushToken,
  useTopics,
  useNotificationPermission,
} from '@rn-toolkit/notifications';

function NotificationSettings() {
  const { hasPermission, initialNotification } = useNotifications();
  const { token, refresh: refreshToken } = usePushToken();
  const { topics, subscribe, unsubscribe, isSubscribed } = useTopics();
  const { request, isGranted, isDenied } = useNotificationPermission();

  if (isDenied) {
    return (
      <View>
        <Text>Notifications are disabled</Text>
        <Button title="Open Settings" onPress={openSettings} />
      </View>
    );
  }

  return (
    <View>
      <Text>Token: {token}</Text>

      <Text>Subscribed Topics:</Text>
      {topics.map(topic => (
        <Text key={topic}>{topic}</Text>
      ))}

      <Button
        title={isSubscribed('promo') ? 'Unsubscribe from Promos' : 'Subscribe to Promos'}
        onPress={() =>
          isSubscribed('promo')
            ? unsubscribe('promo')
            : subscribe('promo')
        }
      />
    </View>
  );
}
```

### 4. Display in-app notifications

```tsx
import { InAppNotification, useNotifications } from '@rn-toolkit/notifications';

function AppWithNotifications() {
  const [currentNotification, setCurrentNotification] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <InAppNotification
        notification={currentNotification}
        position="top"
        duration={4000}
        onPress={(notification) => {
          // Navigate based on notification data
          navigation.navigate(notification.data?.screen);
        }}
        onDismiss={() => setCurrentNotification(null)}
      />
      <MainApp />
    </View>
  );
}
```

## Adapters

### FirebaseNotificationAdapter

Production adapter using Firebase Cloud Messaging.

```tsx
import { FirebaseNotificationAdapter } from '@rn-toolkit/notifications';

const adapter = new FirebaseNotificationAdapter();
```

**Requirements:**
- `@react-native-firebase/app` and `@react-native-firebase/messaging` installed
- Firebase configured in your project

### ConsoleAdapter

Debug adapter that logs all notification operations to the console.

```tsx
import { ConsoleAdapter } from '@rn-toolkit/notifications';

const adapter = new ConsoleAdapter({
  prefix: '[Notifications]',  // Log prefix
  mockToken: 'debug-token',   // Token to return
  initialPermission: 'granted', // Initial permission state
});
```

### NoOpAdapter

Testing adapter with configurable behavior. Does nothing by default.

```tsx
import { NoOpAdapter } from '@rn-toolkit/notifications';

const adapter = new NoOpAdapter({
  initialPermission: 'granted',  // 'granted' | 'denied' | 'not_determined' | 'provisional'
  mockToken: 'test-fcm-token',   // Token to return from getToken()
});
```

### Custom Adapters

Implement the `NotificationAdapter` interface to create custom adapters:

```tsx
import type { NotificationAdapter } from '@rn-toolkit/notifications';

class OneSignalAdapter implements NotificationAdapter {
  readonly name = 'onesignal';

  async initialize() {
    // Initialize OneSignal SDK
  }

  async getPermissionStatus() {
    // Return permission status
  }

  async requestPermission() {
    // Request permission
  }

  async getToken() {
    // Return push token
  }

  // ... implement all interface methods
}
```

## API Reference

### NotificationProvider

Provider component that manages notification state.

```tsx
<NotificationProvider
  adapter={adapter}     // Required: NotificationAdapter
  config={config}       // Optional: NotificationConfig
>
  {children}
</NotificationProvider>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `adapter` | `NotificationAdapter` | Yes | Notification backend adapter |
| `config` | `NotificationConfig` | No | Configuration options |
| `children` | `ReactNode` | Yes | Child components |

#### NotificationConfig

```typescript
interface NotificationConfig {
  // Request permission when provider mounts
  requestPermissionOnInit?: boolean;

  // Topics to auto-subscribe after permission granted
  autoSubscribeTopics?: string[];

  // Callback when push token is received/refreshed
  onTokenReceived?: (token: string) => void;

  // Notification handlers
  handlers?: {
    onForegroundMessage?: (notification: RemoteNotification) => void;
    onNotificationOpened?: (notification: RemoteNotification) => void;
    onNotificationOpenedApp?: (notification: RemoteNotification) => void;
    onTokenRefresh?: (token: string) => void;
  };
}
```

### Hooks

#### useNotifications

Main hook providing full notification context access.

```typescript
const {
  token,              // Push token (string | null)
  permission,         // Permission object
  isInitialized,      // Provider initialization state
  hasPermission,      // Quick permission check
  initialNotification, // Notification that opened the app
  requestPermission,  // Request notification permission
  getToken,           // Fetch/refresh push token
  subscribeToTopic,   // Subscribe to a topic
  unsubscribeFromTopic, // Unsubscribe from a topic
  getTopics,          // Get subscribed topics
  scheduleNotification, // Schedule local notification
  cancelNotification, // Cancel scheduled notification
  cancelAllNotifications, // Cancel all notifications
  getBadgeCount,      // Get badge count
  setBadgeCount,      // Set badge count
  clearBadge,         // Clear badge
} = useNotifications();
```

#### usePushToken

Focused hook for push token management.

```typescript
const {
  token,      // Current push token
  isLoading,  // Loading state
  error,      // Error if any
  refresh,    // Refresh token
  hasToken,   // Quick token existence check
} = usePushToken();
```

#### useTopics

Hook for topic subscription management.

```typescript
const {
  topics,        // Array of subscribed topics
  subscribe,     // Subscribe to topic
  unsubscribe,   // Unsubscribe from topic
  isSubscribed,  // Check if subscribed to topic
  isLoading,     // Loading state
  error,         // Error if any
} = useTopics();
```

#### useNotificationPermission

Hook for permission management.

```typescript
const {
  permission,       // Full permission object
  hasPermission,    // Has any permission
  isLoading,        // Loading state
  error,            // Error if any
  request,          // Request permission
  isDenied,         // Permission denied
  isGranted,        // Permission granted
  isProvisional,    // Provisional permission (iOS)
  isNotDetermined,  // Not yet requested
} = useNotificationPermission();
```

### Components

#### InAppNotification

Displays in-app notification banners.

```tsx
<InAppNotification
  notification={notification}  // RemoteNotification | null
  onPress={handlePress}        // (notification) => void
  onDismiss={handleDismiss}    // () => void
  duration={4000}              // Auto-dismiss duration (0 = no auto-dismiss)
  position="top"               // "top" | "bottom"
  showIcon={true}              // Show notification icon
  icon={customIcon}            // Custom icon source
  swipeToDismiss={true}        // Show dismiss button
  style={customStyle}          // Custom notification style
  containerStyle={containerStyle} // Custom container style
/>
```

### NotificationAdapter Interface

```typescript
interface NotificationAdapter {
  readonly name: string;

  // Lifecycle
  initialize(): Promise<void>;

  // Permission
  getPermissionStatus(): Promise<NotificationPermission>;
  requestPermission(): Promise<NotificationPermission>;

  // Token
  getToken(): Promise<string | null>;
  deleteToken(): Promise<void>;
  onTokenRefresh(callback: (token: string) => void): () => void;

  // Topics
  subscribeToTopic(topic: string): Promise<void>;
  unsubscribeFromTopic(topic: string): Promise<void>;

  // Notifications
  onForegroundMessage(callback: (notification: RemoteNotification) => void): () => void;
  onNotificationOpened(callback: (notification: RemoteNotification) => void): () => void;
  getInitialNotification(): Promise<RemoteNotification | null>;

  // Local Notifications
  scheduleNotification(notification: LocalNotification): Promise<string>;
  cancelNotification(id: string): Promise<void>;
  cancelAllNotifications(): Promise<void>;

  // Badge
  getBadgeCount(): Promise<number>;
  setBadgeCount(count: number): Promise<void>;
}
```

## Types

```typescript
interface RemoteNotification {
  messageId: string;
  title?: string;
  body?: string;
  imageUrl?: string;
  data?: Record<string, string>;
  sentTime?: number;
  ttl?: number;
  collapseKey?: string;
  link?: string;
}

interface LocalNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  schedule?: {
    at?: Date;
    repeats?: boolean;
    interval?: 'minute' | 'hour' | 'day' | 'week';
  };
  android?: {
    channelId?: string;
    smallIcon?: string;
    color?: string;
    priority?: 'default' | 'high' | 'low' | 'max' | 'min';
  };
  ios?: {
    sound?: string;
    badge?: number;
    categoryId?: string;
  };
}

interface NotificationPermission {
  status: 'granted' | 'denied' | 'not_determined' | 'provisional';
  alert: boolean;
  badge: boolean;
  sound: boolean;
}
```

## Migration from v1 (Firebase-coupled)

If upgrading from the Firebase-coupled version:

```tsx
// Before (v1)
<NotificationProvider
  messaging={messaging}  // Direct Firebase dependency
  config={config}
>

// After (v2 - Adapter Pattern)
import { FirebaseNotificationAdapter } from '@rn-toolkit/notifications';

const adapter = new FirebaseNotificationAdapter();

<NotificationProvider
  adapter={adapter}  // Adapter abstraction
  config={config}
>
```

## Platform Notes

### iOS

- Requires physical device for push notifications (simulator doesn't support)
- Add Push Notifications capability in Xcode
- Configure APNs in your push provider (Firebase, OneSignal, etc.)
- Provisional permission allows "quiet" notifications

### Android

- Notifications work on both emulator and device
- Create notification channels for Android 8+
- Configure your push provider

## Testing

Use `NoOpAdapter` for unit tests:

```tsx
import { NoOpAdapter, NotificationProvider } from '@rn-toolkit/notifications';

const testAdapter = new NoOpAdapter({
  initialPermission: 'granted',
  mockToken: 'test-token',
});

render(
  <NotificationProvider adapter={testAdapter}>
    <ComponentUnderTest />
  </NotificationProvider>
);
```

## License

MIT
