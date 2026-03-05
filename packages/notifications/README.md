# @rn-toolkit/notifications

Push notification management with Firebase Cloud Messaging integration for React Native.

## Features

- **FCM Integration** - Full Firebase Cloud Messaging support
- **Topic Subscriptions** - Subscribe/unsubscribe to notification topics
- **Permission Handling** - Request and track notification permissions
- **Token Management** - Automatic FCM token retrieval and refresh
- **In-App Notifications** - Display notifications within the app
- **Local Notifications** - Schedule local notifications
- **Badge Management** - Control app badge count
- **TypeScript** - Full type safety

## Installation

```bash
npm install @rn-toolkit/notifications
```

### Peer Dependencies

```bash
# Required for push notifications
npm install @react-native-firebase/app @react-native-firebase/messaging
```

Follow the [Firebase setup guide](https://rnfirebase.io/) to configure your project.

## Quick Start

### 1. Wrap your app with NotificationProvider

```tsx
import { NotificationProvider } from '@rn-toolkit/notifications';

function App() {
  return (
    <NotificationProvider
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
          console.log('FCM Token:', token);
        },
      }}
    >
      <MyApp />
    </NotificationProvider>
  );
}
```

### 2. Use hooks in components

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

### 3. Display in-app notifications

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

## API Reference

### NotificationProvider

Provider component that manages notification state and Firebase integration.

```tsx
<NotificationProvider config={config} messaging={customMessaging}>
  {children}
</NotificationProvider>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `config` | `NotificationConfig` | Configuration options |
| `messaging` | `FirebaseMessaging` | Custom messaging instance (optional) |
| `children` | `ReactNode` | Child components |

#### NotificationConfig

```typescript
interface NotificationConfig {
  // Request permission when provider mounts
  requestPermissionOnInit?: boolean;

  // Topics to auto-subscribe after permission granted
  autoSubscribeTopics?: string[];

  // Callback when FCM token is received/refreshed
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
  token,              // FCM token (string | null)
  permission,         // Permission object
  isInitialized,      // Provider initialization state
  hasPermission,      // Quick permission check
  initialNotification, // Notification that opened the app
  requestPermission,  // Request notification permission
  getToken,           // Fetch/refresh FCM token
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

Focused hook for FCM token management.

```typescript
const {
  token,      // Current FCM token
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

## Platform Notes

### iOS

- Requires physical device for push notifications (simulator doesn't support)
- Add Push Notifications capability in Xcode
- Configure APNs in Firebase Console
- Provisional permission allows "quiet" notifications

### Android

- Notifications work on both emulator and device
- Create notification channels for Android 8+
- Configure Firebase in `google-services.json`

## Testing

The package works without Firebase installed - methods will gracefully return null/empty values. This allows for testing without Firebase setup.

```tsx
// Mock for testing
const mockMessaging = {
  getToken: jest.fn().mockResolvedValue('mock-token'),
  hasPermission: jest.fn().mockResolvedValue(1),
  // ... other methods
};

<NotificationProvider messaging={mockMessaging}>
  <App />
</NotificationProvider>
```

## License

MIT
