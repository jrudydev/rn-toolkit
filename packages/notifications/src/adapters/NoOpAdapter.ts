/**
 * NoOp Notification Adapter
 *
 * A silent adapter that does nothing - useful for testing.
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

export interface NoOpAdapterOptions {
  /** Initial permission status */
  initialPermission?: NotificationPermission['status'];
  /** Mock token to return */
  mockToken?: string;
}

/**
 * NoOp Notification Adapter
 *
 * A silent adapter for testing that simulates notifications
 * without actually connecting to any backend.
 *
 * @example
 * ```tsx
 * import { NotificationProvider, NoOpAdapter } from '@rn-toolkit/notifications';
 *
 * // In tests
 * <NotificationProvider adapter={new NoOpAdapter()}>
 *   <App />
 * </NotificationProvider>
 * ```
 */
export class NoOpAdapter implements NotificationAdapter {
  readonly name = 'noop';

  private permission: NotificationPermission;
  private token: string | null;
  private topics: Set<string> = new Set();
  private tokenListeners: Set<TokenCallback> = new Set();
  private foregroundListeners: Set<NotificationCallback> = new Set();
  private openedListeners: Set<NotificationCallback> = new Set();
  private badgeCount: number = 0;
  private scheduledNotifications: Map<string, LocalNotification> = new Map();

  constructor(options: NoOpAdapterOptions = {}) {
    this.permission = {
      status: options.initialPermission ?? 'not_determined',
      alert: options.initialPermission === 'granted',
      badge: options.initialPermission === 'granted',
      sound: options.initialPermission === 'granted',
    };
    this.token = options.mockToken ?? null;
  }

  async initialize(): Promise<void> {
    // No-op
  }

  // ============================================
  // PERMISSION
  // ============================================

  async getPermissionStatus(): Promise<NotificationPermission> {
    return this.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    this.permission = {
      status: 'granted',
      alert: true,
      badge: true,
      sound: true,
    };
    return this.permission;
  }

  // ============================================
  // TOKEN
  // ============================================

  async getToken(): Promise<string | null> {
    if (!this.token && this.permission.status === 'granted') {
      this.token = 'mock-fcm-token-' + Date.now();
    }
    return this.token;
  }

  async deleteToken(): Promise<void> {
    this.token = null;
  }

  onTokenRefresh(callback: TokenCallback): () => void {
    this.tokenListeners.add(callback);
    return () => {
      this.tokenListeners.delete(callback);
    };
  }

  // Helper to simulate token refresh (for testing)
  simulateTokenRefresh(newToken: string): void {
    this.token = newToken;
    this.tokenListeners.forEach((cb) => cb(newToken));
  }

  // ============================================
  // TOPICS
  // ============================================

  async subscribeToTopic(topic: string): Promise<void> {
    this.topics.add(topic);
  }

  async unsubscribeFromTopic(topic: string): Promise<void> {
    this.topics.delete(topic);
  }

  // Helper to check subscribed topics (for testing)
  getSubscribedTopics(): string[] {
    return Array.from(this.topics);
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================

  onForegroundMessage(callback: NotificationCallback): () => void {
    this.foregroundListeners.add(callback);
    return () => {
      this.foregroundListeners.delete(callback);
    };
  }

  onNotificationOpened(callback: NotificationCallback): () => void {
    this.openedListeners.add(callback);
    return () => {
      this.openedListeners.delete(callback);
    };
  }

  async getInitialNotification(): Promise<RemoteNotification | null> {
    return null;
  }

  // Helper to simulate receiving a notification (for testing)
  simulateForegroundNotification(notification: RemoteNotification): void {
    this.foregroundListeners.forEach((cb) => cb(notification));
  }

  // Helper to simulate notification opened (for testing)
  simulateNotificationOpened(notification: RemoteNotification): void {
    this.openedListeners.forEach((cb) => cb(notification));
  }

  // ============================================
  // LOCAL NOTIFICATIONS
  // ============================================

  async scheduleNotification(notification: LocalNotification): Promise<string> {
    this.scheduledNotifications.set(notification.id, notification);
    return notification.id;
  }

  async cancelNotification(id: string): Promise<void> {
    this.scheduledNotifications.delete(id);
  }

  async cancelAllNotifications(): Promise<void> {
    this.scheduledNotifications.clear();
  }

  // Helper to get scheduled notifications (for testing)
  getScheduledNotifications(): LocalNotification[] {
    return Array.from(this.scheduledNotifications.values());
  }

  // ============================================
  // BADGE
  // ============================================

  async getBadgeCount(): Promise<number> {
    return this.badgeCount;
  }

  async setBadgeCount(count: number): Promise<void> {
    this.badgeCount = count;
  }
}
