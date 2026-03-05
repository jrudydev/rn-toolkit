/**
 * Notification Types
 *
 * Type definitions for the @rn-toolkit/notifications package.
 */

/**
 * Notification priority levels
 */
export type NotificationPriority = 'default' | 'low' | 'high' | 'max';

/**
 * Notification visibility on lock screen
 */
export type NotificationVisibility = 'private' | 'public' | 'secret';

/**
 * Notification category for actions
 */
export type NotificationCategory = 'default' | 'social' | 'promo' | 'transactional' | 'reminder';

/**
 * Remote notification data from FCM
 */
export interface RemoteNotification {
  /** Unique message ID */
  messageId: string;
  /** Notification title */
  title?: string;
  /** Notification body */
  body?: string;
  /** Image URL for rich notifications */
  imageUrl?: string;
  /** Custom data payload */
  data?: Record<string, string>;
  /** Notification category */
  category?: string;
  /** Thread ID for grouping */
  threadId?: string;
  /** Sound to play */
  sound?: string;
  /** Badge count to set */
  badge?: number;
  /** When the notification was sent */
  sentTime?: number;
  /** TTL in seconds */
  ttl?: number;
  /** Collapse key for replacing notifications */
  collapseKey?: string;
  /** Deep link URL */
  link?: string;
}

/**
 * Local notification configuration
 */
export interface LocalNotification {
  /** Unique notification ID */
  id: string;
  /** Notification title */
  title: string;
  /** Notification body */
  body: string;
  /** Custom data payload */
  data?: Record<string, unknown>;
  /** Image URL (Android only) */
  imageUrl?: string;
  /** Priority level */
  priority?: NotificationPriority;
  /** Visibility on lock screen */
  visibility?: NotificationVisibility;
  /** Category for actions */
  category?: NotificationCategory;
  /** Sound to play */
  sound?: string | boolean;
  /** Whether to vibrate */
  vibrate?: boolean;
  /** Badge count */
  badge?: number;
  /** Android channel ID */
  channelId?: string;
  /** Group/thread ID */
  groupId?: string;
  /** Whether this is a group summary */
  isGroupSummary?: boolean;
  /** When to fire (for scheduled notifications) */
  fireDate?: Date;
  /** Repeat interval */
  repeatInterval?: 'minute' | 'hour' | 'day' | 'week';
  /** Action buttons */
  actions?: NotificationAction[];
}

/**
 * Notification action button
 */
export interface NotificationAction {
  /** Action identifier */
  id: string;
  /** Button title */
  title: string;
  /** Whether action opens the app */
  foreground?: boolean;
  /** Whether action is destructive (iOS) */
  destructive?: boolean;
  /** Whether action requires authentication */
  authenticationRequired?: boolean;
  /** Text input placeholder (for reply actions) */
  textInput?: {
    buttonTitle: string;
    placeholder: string;
  };
}

/**
 * Android notification channel
 */
export interface NotificationChannel {
  /** Channel ID */
  id: string;
  /** Channel name (shown in settings) */
  name: string;
  /** Channel description */
  description?: string;
  /** Importance level */
  importance?: 'none' | 'min' | 'low' | 'default' | 'high' | 'max';
  /** Sound file */
  sound?: string;
  /** Whether to show badge */
  showBadge?: boolean;
  /** Whether to vibrate */
  vibration?: boolean;
  /** Vibration pattern */
  vibrationPattern?: number[];
  /** Whether to show lights */
  lights?: boolean;
  /** Light color */
  lightColor?: string;
  /** Whether channel is blocked by user */
  blocked?: boolean;
}

/**
 * Topic subscription
 */
export interface TopicSubscription {
  /** Topic name */
  topic: string;
  /** When subscribed */
  subscribedAt: number;
  /** Whether actively subscribed */
  isSubscribed: boolean;
}

/**
 * Notification permission status
 */
export interface NotificationPermission {
  /** Overall authorization status */
  status: 'granted' | 'denied' | 'not_determined' | 'provisional';
  /** Whether alerts are enabled */
  alert?: boolean;
  /** Whether badges are enabled */
  badge?: boolean;
  /** Whether sounds are enabled */
  sound?: boolean;
  /** Whether critical alerts are enabled (iOS) */
  criticalAlert?: boolean;
  /** Whether provisional auth granted (iOS) */
  provisional?: boolean;
  /** Whether announcement notifications enabled */
  announcement?: boolean;
  /** Whether car play enabled */
  carPlay?: boolean;
}

/**
 * Notification event handlers
 */
export interface NotificationHandlers {
  /** Called when notification received in foreground */
  onForegroundMessage?: (notification: RemoteNotification) => void;
  /** Called when notification opened */
  onNotificationOpened?: (notification: RemoteNotification) => void;
  /** Called when app opened from quit state via notification */
  onNotificationOpenedApp?: (notification: RemoteNotification) => void;
  /** Called when token refreshes */
  onTokenRefresh?: (token: string) => void;
  /** Called when notification action pressed */
  onAction?: (actionId: string, notification: RemoteNotification, input?: string) => void;
}

/**
 * Notification provider configuration
 */
export interface NotificationConfig {
  /** Event handlers */
  handlers?: NotificationHandlers;
  /** Android notification channels to create */
  channels?: NotificationChannel[];
  /** Topics to auto-subscribe on init */
  autoSubscribeTopics?: string[];
  /** Whether to request permission on init */
  requestPermissionOnInit?: boolean;
  /** Default notification sound */
  defaultSound?: string;
  /** Default channel ID (Android) */
  defaultChannelId?: string;
  /** Whether to show in-app notifications */
  showInAppNotifications?: boolean;
  /** In-app notification duration (ms) */
  inAppNotificationDuration?: number;
  /** Callback to send token to backend */
  onTokenReceived?: (token: string) => Promise<void>;
}

/**
 * Notification context value
 */
export interface NotificationContextValue {
  /** FCM token */
  token: string | null;
  /** Permission status */
  permission: NotificationPermission | null;
  /** Whether initialized */
  isInitialized: boolean;
  /** Whether permission granted */
  hasPermission: boolean;
  /** Request notification permission */
  requestPermission: () => Promise<NotificationPermission>;
  /** Get current FCM token */
  getToken: () => Promise<string | null>;
  /** Subscribe to topic */
  subscribeToTopic: (topic: string) => Promise<void>;
  /** Unsubscribe from topic */
  unsubscribeFromTopic: (topic: string) => Promise<void>;
  /** Get subscribed topics */
  getTopics: () => string[];
  /** Schedule a local notification */
  scheduleNotification: (notification: LocalNotification) => Promise<string>;
  /** Cancel a scheduled notification */
  cancelNotification: (id: string) => Promise<void>;
  /** Cancel all notifications */
  cancelAllNotifications: () => Promise<void>;
  /** Get badge count */
  getBadgeCount: () => Promise<number>;
  /** Set badge count */
  setBadgeCount: (count: number) => Promise<void>;
  /** Clear badge */
  clearBadge: () => Promise<void>;
  /** Last notification that opened the app */
  initialNotification: RemoteNotification | null;
}

/**
 * In-app notification display props
 */
export interface InAppNotificationProps {
  /** Notification to display */
  notification: RemoteNotification | null;
  /** Auto-dismiss duration (0 for manual) */
  duration?: number;
  /** Position on screen */
  position?: 'top' | 'bottom';
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Callback when pressed */
  onPress?: (notification: RemoteNotification) => void;
  /** Custom style for notification banner */
  style?: import('react-native').ViewStyle;
  /** Container style */
  containerStyle?: import('react-native').ViewStyle;
  /** Whether to show icon */
  showIcon?: boolean;
  /** Custom icon source */
  icon?: import('react-native').ImageSourcePropType;
  /** Whether swipe/tap dismiss button is shown */
  swipeToDismiss?: boolean;
  /** Custom render function */
  renderNotification?: (notification: RemoteNotification) => React.ReactNode;
}

/**
 * Notification inbox item
 */
export interface NotificationInboxItem extends RemoteNotification {
  /** Whether notification has been read */
  isRead: boolean;
  /** When received */
  receivedAt: number;
  /** When read (if read) */
  readAt?: number;
}

/**
 * Notification inbox configuration
 */
export interface NotificationInboxConfig {
  /** Maximum items to keep */
  maxItems?: number;
  /** Persistence key for AsyncStorage */
  storageKey?: string;
  /** Whether to persist inbox */
  persist?: boolean;
  /** Auto-mark as read on open */
  autoMarkRead?: boolean;
}
