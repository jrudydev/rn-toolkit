/**
 * @rn-toolkit/notifications
 *
 * Push notifications with **adapter pattern** for React Native - swap notification backends without code changes.
 *
 * Features:
 * - **Adapter Pattern** - Swap notification backends (Firebase, OneSignal, etc.) without changing app code
 * - **Built-in Adapters** - Firebase, Console (debug), NoOp (testing)
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
 *   FirebaseNotificationAdapter,
 *   ConsoleAdapter,
 *   NoOpAdapter,
 *   useNotifications,
 *   usePushToken,
 *   useTopics,
 * } from '@rn-toolkit/notifications';
 *
 * // Choose adapter
 * const adapter = __DEV__
 *   ? new ConsoleAdapter({ prefix: '[Notif]' })
 *   : new FirebaseNotificationAdapter();
 *
 * // Wrap your app
 * function App() {
 *   return (
 *     <NotificationProvider
 *       adapter={adapter}
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

// Adapters
export {
  NoOpAdapter,
  ConsoleAdapter,
  FirebaseNotificationAdapter,
  type NotificationAdapter,
  type NoOpAdapterOptions,
  type ConsoleAdapterOptions,
} from './adapters';

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
