/**
 * Notification Adapter Types
 *
 * Interface definitions for notification adapters.
 */

import type {
  LocalNotification,
  NotificationPermission,
  RemoteNotification,
} from '../types';

/**
 * Callback for permission status changes
 */
export type PermissionCallback = (permission: NotificationPermission) => void;

/**
 * Callback for token changes
 */
export type TokenCallback = (token: string) => void;

/**
 * Callback for notification received
 */
export type NotificationCallback = (notification: RemoteNotification) => void;

/**
 * Notification Adapter Interface
 *
 * Implement this interface to create a custom notification backend.
 */
export interface NotificationAdapter {
  /** Adapter name for identification */
  readonly name: string;

  /**
   * Initialize the adapter
   */
  initialize(): Promise<void>;

  // ============================================
  // PERMISSION
  // ============================================

  /**
   * Check current permission status
   */
  getPermissionStatus(): Promise<NotificationPermission>;

  /**
   * Request notification permission
   */
  requestPermission(): Promise<NotificationPermission>;

  // ============================================
  // TOKEN
  // ============================================

  /**
   * Get the push token
   */
  getToken(): Promise<string | null>;

  /**
   * Delete the push token
   */
  deleteToken(): Promise<void>;

  /**
   * Subscribe to token refresh events
   * @returns Unsubscribe function
   */
  onTokenRefresh(callback: TokenCallback): () => void;

  // ============================================
  // TOPICS
  // ============================================

  /**
   * Subscribe to a topic
   */
  subscribeToTopic(topic: string): Promise<void>;

  /**
   * Unsubscribe from a topic
   */
  unsubscribeFromTopic(topic: string): Promise<void>;

  // ============================================
  // NOTIFICATIONS
  // ============================================

  /**
   * Subscribe to foreground notifications
   * @returns Unsubscribe function
   */
  onForegroundMessage(callback: NotificationCallback): () => void;

  /**
   * Subscribe to notification opened events
   * @returns Unsubscribe function
   */
  onNotificationOpened(callback: NotificationCallback): () => void;

  /**
   * Get initial notification (when app opened from quit state)
   */
  getInitialNotification(): Promise<RemoteNotification | null>;

  // ============================================
  // LOCAL NOTIFICATIONS
  // ============================================

  /**
   * Schedule a local notification
   */
  scheduleNotification(notification: LocalNotification): Promise<string>;

  /**
   * Cancel a scheduled notification
   */
  cancelNotification(id: string): Promise<void>;

  /**
   * Cancel all scheduled notifications
   */
  cancelAllNotifications(): Promise<void>;

  // ============================================
  // BADGE
  // ============================================

  /**
   * Get current badge count
   */
  getBadgeCount(): Promise<number>;

  /**
   * Set badge count
   */
  setBadgeCount(count: number): Promise<void>;
}
