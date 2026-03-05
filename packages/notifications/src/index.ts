/**
 * @rn-toolkit/notifications
 *
 * Push notification management with Firebase Cloud Messaging integration.
 *
 * Features:
 * - FCM push notifications
 * - Topic-based subscriptions
 * - Local notifications
 * - In-app notification display
 * - Badge management
 * - Permission handling
 *
 * @example
 * ```tsx
 * import {
 *   NotificationProvider,
 *   useNotifications,
 *   usePushToken,
 *   useTopics,
 * } from '@rn-toolkit/notifications';
 *
 * // Wrap your app
 * function App() {
 *   return (
 *     <NotificationProvider
 *       config={{
 *         requestPermissionOnInit: true,
 *         autoSubscribeTopics: ['general'],
 *         handlers: {
 *           onForegroundMessage: (notification) => {
 *             console.log('Received:', notification);
 *           },
 *         },
 *       }}
 *     >
 *       <MyApp />
 *     </NotificationProvider>
 *   );
 * }
 *
 * // Use in components
 * function NotificationSettings() {
 *   const { token, hasPermission, requestPermission } = useNotifications();
 *   const { subscribe, unsubscribe, isSubscribed } = useTopics();
 *
 *   return (
 *     <View>
 *       <Text>Token: {token}</Text>
 *       <Button
 *         title={isSubscribed('promo') ? 'Unsubscribe' : 'Subscribe'}
 *         onPress={() =>
 *           isSubscribed('promo')
 *             ? unsubscribe('promo')
 *             : subscribe('promo')
 *         }
 *       />
 *     </View>
 *   );
 * }
 * ```
 */

// Context and Provider
export { NotificationContext } from './NotificationContext';
export { NotificationProvider } from './NotificationProvider';
export type { NotificationProviderProps } from './NotificationProvider';

// Hooks
export {
  useNotifications,
  usePushToken,
  useTopics,
  useNotificationPermission,
} from './hooks';
export type {
  UsePushTokenResult,
  UseTopicsResult,
  UseNotificationPermissionResult,
} from './hooks';

// Components
export { InAppNotification } from './components';

// Types
export type {
  RemoteNotification,
  LocalNotification,
  NotificationAction,
  NotificationChannel,
  NotificationPermission,
  NotificationConfig,
  NotificationHandlers,
  NotificationContextValue,
  NotificationInboxItem,
  InAppNotificationProps,
} from './types';
