/**
 * Notification Adapters
 *
 * Export all notification adapters and types.
 */

export type {
  NotificationAdapter,
  PermissionCallback,
  TokenCallback,
  NotificationCallback,
} from './types';
export { NoOpAdapter, type NoOpAdapterOptions } from './NoOpAdapter';
export { ConsoleAdapter, type ConsoleAdapterOptions } from './ConsoleAdapter';
export { FirebaseNotificationAdapter } from './FirebaseNotificationAdapter';
