/**
 * Firebase Notification Adapter
 *
 * Production adapter using Firebase Cloud Messaging.
 * Requires @react-native-firebase/messaging to be installed.
 */

import type {
  LocalNotification,
  NotificationPermission,
  RemoteNotification,
} from '../types';
import type {
  NotificationAdapter,
  TokenCallback,
  NotificationCallback,
} from './types';

// Firebase types
type FirebaseMessaging = {
  getToken: () => Promise<string>;
  deleteToken: () => Promise<void>;
  hasPermission: () => Promise<number>;
  requestPermission: () => Promise<number>;
  subscribeToTopic: (topic: string) => Promise<void>;
  unsubscribeFromTopic: (topic: string) => Promise<void>;
  onMessage: (callback: (message: FirebaseRemoteMessage) => void) => () => void;
  onNotificationOpenedApp: (callback: (message: FirebaseRemoteMessage) => void) => () => void;
  getInitialNotification: () => Promise<FirebaseRemoteMessage | null>;
  onTokenRefresh: (callback: (token: string) => void) => () => void;
};

type FirebaseRemoteMessage = {
  messageId?: string;
  notification?: {
    title?: string;
    body?: string;
    imageUrl?: string;
  };
  data?: Record<string, string>;
  sentTime?: number;
  ttl?: number;
  collapseKey?: string;
};

let firebaseMessaging: FirebaseMessaging | null = null;

/**
 * Load Firebase Messaging
 */
function loadFirebaseMessaging(): FirebaseMessaging | null {
  if (firebaseMessaging) return firebaseMessaging;
  try {
    const module = require('@react-native-firebase/messaging');
    firebaseMessaging = module.default();
    return firebaseMessaging;
  } catch {
    console.warn(
      '[@rn-toolkit/notifications] Firebase Messaging not installed. Install @react-native-firebase/messaging for full functionality.'
    );
    return null;
  }
}

/**
 * Convert Firebase message to RemoteNotification
 */
function toRemoteNotification(message: FirebaseRemoteMessage): RemoteNotification {
  return {
    messageId: message.messageId || '',
    title: message.notification?.title,
    body: message.notification?.body,
    imageUrl: message.notification?.imageUrl,
    data: message.data,
    sentTime: message.sentTime,
    ttl: message.ttl,
    collapseKey: message.collapseKey,
    link: message.data?.link,
  };
}

/**
 * Convert Firebase auth status to NotificationPermission
 */
function toPermissionStatus(authStatus: number): NotificationPermission {
  const statusMap: Record<number, NotificationPermission['status']> = {
    [-1]: 'not_determined',
    0: 'denied',
    1: 'granted',
    2: 'provisional',
  };
  return {
    status: statusMap[authStatus] || 'not_determined',
    alert: authStatus === 1,
    badge: authStatus === 1,
    sound: authStatus === 1,
  };
}

/**
 * Firebase Notification Adapter
 *
 * Production adapter that integrates with Firebase Cloud Messaging.
 *
 * @example
 * ```tsx
 * import { NotificationProvider, FirebaseNotificationAdapter } from '@rn-toolkit/notifications';
 *
 * // In production
 * <NotificationProvider adapter={new FirebaseNotificationAdapter()}>
 *   <App />
 * </NotificationProvider>
 * ```
 */
export class FirebaseNotificationAdapter implements NotificationAdapter {
  readonly name = 'firebase';

  async initialize(): Promise<void> {
    loadFirebaseMessaging();
  }

  // ============================================
  // PERMISSION
  // ============================================

  async getPermissionStatus(): Promise<NotificationPermission> {
    const messaging = loadFirebaseMessaging();
    if (!messaging) {
      return { status: 'denied', alert: false, badge: false, sound: false };
    }
    try {
      const authStatus = await messaging.hasPermission();
      return toPermissionStatus(authStatus);
    } catch {
      return { status: 'denied', alert: false, badge: false, sound: false };
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    const messaging = loadFirebaseMessaging();
    if (!messaging) {
      return { status: 'denied', alert: false, badge: false, sound: false };
    }
    try {
      const authStatus = await messaging.requestPermission();
      return toPermissionStatus(authStatus);
    } catch {
      return { status: 'denied', alert: false, badge: false, sound: false };
    }
  }

  // ============================================
  // TOKEN
  // ============================================

  async getToken(): Promise<string | null> {
    const messaging = loadFirebaseMessaging();
    if (!messaging) return null;
    try {
      return await messaging.getToken();
    } catch {
      return null;
    }
  }

  async deleteToken(): Promise<void> {
    const messaging = loadFirebaseMessaging();
    if (!messaging) return;
    await messaging.deleteToken();
  }

  onTokenRefresh(callback: TokenCallback): () => void {
    const messaging = loadFirebaseMessaging();
    if (!messaging) return () => {};
    return messaging.onTokenRefresh(callback);
  }

  // ============================================
  // TOPICS
  // ============================================

  async subscribeToTopic(topic: string): Promise<void> {
    const messaging = loadFirebaseMessaging();
    if (!messaging) return;
    await messaging.subscribeToTopic(topic);
  }

  async unsubscribeFromTopic(topic: string): Promise<void> {
    const messaging = loadFirebaseMessaging();
    if (!messaging) return;
    await messaging.unsubscribeFromTopic(topic);
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================

  onForegroundMessage(callback: NotificationCallback): () => void {
    const messaging = loadFirebaseMessaging();
    if (!messaging) return () => {};
    return messaging.onMessage((msg) => callback(toRemoteNotification(msg)));
  }

  onNotificationOpened(callback: NotificationCallback): () => void {
    const messaging = loadFirebaseMessaging();
    if (!messaging) return () => {};
    return messaging.onNotificationOpenedApp((msg) => callback(toRemoteNotification(msg)));
  }

  async getInitialNotification(): Promise<RemoteNotification | null> {
    const messaging = loadFirebaseMessaging();
    if (!messaging) return null;
    try {
      const msg = await messaging.getInitialNotification();
      return msg ? toRemoteNotification(msg) : null;
    } catch {
      return null;
    }
  }

  // ============================================
  // LOCAL NOTIFICATIONS
  // ============================================

  async scheduleNotification(notification: LocalNotification): Promise<string> {
    // Note: Firebase Messaging doesn't handle local notifications
    // You would need @notifee/react-native for local notifications
    // This is a placeholder implementation
    console.warn(
      '[@rn-toolkit/notifications] Local notifications require @notifee/react-native. Consider using NotifeeNotificationAdapter.'
    );
    return notification.id;
  }

  async cancelNotification(_id: string): Promise<void> {
    // Placeholder - requires @notifee/react-native
  }

  async cancelAllNotifications(): Promise<void> {
    // Placeholder - requires @notifee/react-native
  }

  // ============================================
  // BADGE
  // ============================================

  async getBadgeCount(): Promise<number> {
    // Badge management requires @notifee/react-native or react-native-push-notification
    return 0;
  }

  async setBadgeCount(_count: number): Promise<void> {
    // Placeholder - requires @notifee/react-native or react-native-push-notification
  }
}
