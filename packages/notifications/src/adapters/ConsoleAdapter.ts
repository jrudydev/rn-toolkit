/**
 * Console Notification Adapter
 *
 * A debugging adapter that logs all notification events to console.
 * Extends NoOpAdapter to simulate actual behavior while logging.
 */

import type {
  LocalNotification,
  NotificationPermission,
  RemoteNotification,
} from '../types';
import type { TokenCallback, NotificationCallback } from './types';
import { NoOpAdapter, NoOpAdapterOptions } from './NoOpAdapter';

export interface ConsoleAdapterOptions extends NoOpAdapterOptions {
  /** Log prefix */
  prefix?: string;
  /** Include timestamps in logs */
  timestamps?: boolean;
}

/**
 * Console Notification Adapter
 *
 * A debugging adapter that logs all notification operations to console.
 * Useful for development and debugging.
 *
 * @example
 * ```tsx
 * import { NotificationProvider, ConsoleAdapter } from '@rn-toolkit/notifications';
 *
 * // In development
 * <NotificationProvider adapter={new ConsoleAdapter({ prefix: '[Notif]' })}>
 *   <App />
 * </NotificationProvider>
 * ```
 */
export class ConsoleAdapter extends NoOpAdapter {
  override readonly name = 'console';

  private prefix: string;
  private timestamps: boolean;

  constructor(options: ConsoleAdapterOptions = {}) {
    super(options);
    this.prefix = options.prefix ?? '[Notifications]';
    this.timestamps = options.timestamps ?? false;
  }

  private log(action: string, data?: Record<string, unknown>): void {
    const timestamp = this.timestamps ? `${new Date().toISOString()} ` : '';
    console.log(`${timestamp}${this.prefix} ${action}`, data ?? '');
  }

  override async initialize(): Promise<void> {
    this.log('INIT', { adapter: this.name });
    await super.initialize();
  }

  // ============================================
  // PERMISSION
  // ============================================

  override async getPermissionStatus(): Promise<NotificationPermission> {
    this.log('GET_PERMISSION');
    const perm = await super.getPermissionStatus();
    this.log('PERMISSION_STATUS', { status: perm.status });
    return perm;
  }

  override async requestPermission(): Promise<NotificationPermission> {
    this.log('REQUEST_PERMISSION');
    const perm = await super.requestPermission();
    this.log('PERMISSION_RESULT', { status: perm.status });
    return perm;
  }

  // ============================================
  // TOKEN
  // ============================================

  override async getToken(): Promise<string | null> {
    this.log('GET_TOKEN');
    const token = await super.getToken();
    this.log('TOKEN_RESULT', { token: token ? `${token.substring(0, 20)}...` : null });
    return token;
  }

  override async deleteToken(): Promise<void> {
    this.log('DELETE_TOKEN');
    await super.deleteToken();
    this.log('TOKEN_DELETED');
  }

  override onTokenRefresh(callback: TokenCallback): () => void {
    this.log('SUBSCRIBE_TOKEN_REFRESH');
    const wrappedCallback: TokenCallback = (token) => {
      this.log('TOKEN_REFRESHED', { token: `${token.substring(0, 20)}...` });
      callback(token);
    };
    return super.onTokenRefresh(wrappedCallback);
  }

  // ============================================
  // TOPICS
  // ============================================

  override async subscribeToTopic(topic: string): Promise<void> {
    this.log('SUBSCRIBE_TOPIC', { topic });
    await super.subscribeToTopic(topic);
    this.log('TOPIC_SUBSCRIBED', { topic });
  }

  override async unsubscribeFromTopic(topic: string): Promise<void> {
    this.log('UNSUBSCRIBE_TOPIC', { topic });
    await super.unsubscribeFromTopic(topic);
    this.log('TOPIC_UNSUBSCRIBED', { topic });
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================

  override onForegroundMessage(callback: NotificationCallback): () => void {
    this.log('SUBSCRIBE_FOREGROUND');
    const wrappedCallback: NotificationCallback = (notification) => {
      this.log('FOREGROUND_MESSAGE', {
        messageId: notification.messageId,
        title: notification.title,
      });
      callback(notification);
    };
    return super.onForegroundMessage(wrappedCallback);
  }

  override onNotificationOpened(callback: NotificationCallback): () => void {
    this.log('SUBSCRIBE_OPENED');
    const wrappedCallback: NotificationCallback = (notification) => {
      this.log('NOTIFICATION_OPENED', {
        messageId: notification.messageId,
        title: notification.title,
      });
      callback(notification);
    };
    return super.onNotificationOpened(wrappedCallback);
  }

  override async getInitialNotification(): Promise<RemoteNotification | null> {
    this.log('GET_INITIAL_NOTIFICATION');
    const notification = await super.getInitialNotification();
    this.log('INITIAL_NOTIFICATION', {
      hasNotification: !!notification,
      messageId: notification?.messageId,
    });
    return notification;
  }

  // ============================================
  // LOCAL NOTIFICATIONS
  // ============================================

  override async scheduleNotification(notification: LocalNotification): Promise<string> {
    this.log('SCHEDULE_NOTIFICATION', {
      id: notification.id,
      title: notification.title,
      fireDate: notification.fireDate?.toISOString(),
    });
    const id = await super.scheduleNotification(notification);
    this.log('NOTIFICATION_SCHEDULED', { id });
    return id;
  }

  override async cancelNotification(id: string): Promise<void> {
    this.log('CANCEL_NOTIFICATION', { id });
    await super.cancelNotification(id);
    this.log('NOTIFICATION_CANCELLED', { id });
  }

  override async cancelAllNotifications(): Promise<void> {
    this.log('CANCEL_ALL_NOTIFICATIONS');
    await super.cancelAllNotifications();
    this.log('ALL_NOTIFICATIONS_CANCELLED');
  }

  // ============================================
  // BADGE
  // ============================================

  override async getBadgeCount(): Promise<number> {
    this.log('GET_BADGE_COUNT');
    const count = await super.getBadgeCount();
    this.log('BADGE_COUNT', { count });
    return count;
  }

  override async setBadgeCount(count: number): Promise<void> {
    this.log('SET_BADGE_COUNT', { count });
    await super.setBadgeCount(count);
    this.log('BADGE_COUNT_SET', { count });
  }
}
