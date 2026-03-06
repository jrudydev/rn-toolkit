/**
 * Notification Provider
 *
 * Provides notification context using the adapter pattern for swappable backends.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { NotificationContext } from './NotificationContext';
import type { NotificationAdapter } from './adapters/types';
import type {
  NotificationConfig,
  NotificationContextValue,
  NotificationPermission,
  RemoteNotification,
  LocalNotification,
} from './types';

export interface NotificationProviderProps {
  /** Child components */
  children: ReactNode;
  /** Notification adapter (required) */
  adapter: NotificationAdapter;
  /** Configuration options */
  config?: NotificationConfig;
}

/**
 * NotificationProvider component
 *
 * Provides notification context to the component tree using the adapter pattern.
 *
 * @example
 * ```tsx
 * import {
 *   NotificationProvider,
 *   FirebaseNotificationAdapter,
 *   ConsoleAdapter,
 *   NoOpAdapter,
 * } from '@rn-toolkit/notifications';
 *
 * // Production: Firebase Cloud Messaging
 * const adapter = new FirebaseNotificationAdapter();
 *
 * // Development: Console logging
 * const adapter = new ConsoleAdapter({ prefix: '[Notif]' });
 *
 * // Testing: NoOp
 * const adapter = new NoOpAdapter();
 *
 * function App() {
 *   return (
 *     <NotificationProvider adapter={adapter}>
 *       <MyApp />
 *     </NotificationProvider>
 *   );
 * }
 * ```
 */
export function NotificationProvider({
  children,
  adapter,
  config = {},
}: NotificationProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialNotification, setInitialNotification] = useState<RemoteNotification | null>(null);

  const topicsRef = useRef<Set<string>>(new Set());
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Request permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    const perm = await adapter.requestPermission();
    setPermission(perm);
    return perm;
  }, [adapter]);

  // Get token
  const getToken = useCallback(async (): Promise<string | null> => {
    const fcmToken = await adapter.getToken();
    if (fcmToken) {
      setToken(fcmToken);
      config.onTokenReceived?.(fcmToken);
    }
    return fcmToken;
  }, [adapter, config]);

  // Subscribe to topic
  const subscribeToTopic = useCallback(async (topic: string): Promise<void> => {
    await adapter.subscribeToTopic(topic);
    topicsRef.current.add(topic);
  }, [adapter]);

  // Unsubscribe from topic
  const unsubscribeFromTopic = useCallback(async (topic: string): Promise<void> => {
    await adapter.unsubscribeFromTopic(topic);
    topicsRef.current.delete(topic);
  }, [adapter]);

  // Get subscribed topics
  const getTopics = useCallback((): string[] => Array.from(topicsRef.current), []);

  // Schedule local notification
  const scheduleNotification = useCallback(async (notification: LocalNotification): Promise<string> => {
    return adapter.scheduleNotification(notification);
  }, [adapter]);

  // Cancel notification
  const cancelNotification = useCallback(async (id: string): Promise<void> => {
    await adapter.cancelNotification(id);
  }, [adapter]);

  // Cancel all notifications
  const cancelAllNotifications = useCallback(async (): Promise<void> => {
    await adapter.cancelAllNotifications();
  }, [adapter]);

  // Get badge count
  const getBadgeCount = useCallback(async (): Promise<number> => {
    return adapter.getBadgeCount();
  }, [adapter]);

  // Set badge count
  const setBadgeCount = useCallback(async (count: number): Promise<void> => {
    await adapter.setBadgeCount(count);
  }, [adapter]);

  // Clear badge
  const clearBadge = useCallback(async (): Promise<void> => {
    await setBadgeCount(0);
  }, [setBadgeCount]);

  // Initialize adapter
  useEffect(() => {
    const init = async () => {
      try {
        await adapter.initialize();

        // Check permission status
        const perm = await adapter.getPermissionStatus();
        setPermission(perm);

        // Request permission on init if configured
        if (config.requestPermissionOnInit && perm.status === 'not_determined') {
          await requestPermission();
        }

        // Get token if permission granted
        if (perm.status === 'granted' || perm.status === 'provisional') {
          await getToken();
        }

        // Get initial notification
        const initial = await adapter.getInitialNotification();
        if (initial) {
          setInitialNotification(initial);
          config.handlers?.onNotificationOpenedApp?.(initial);
        }

        // Auto-subscribe to topics
        if (config.autoSubscribeTopics) {
          for (const topic of config.autoSubscribeTopics) {
            await subscribeToTopic(topic);
          }
        }
      } catch (e) {
        console.warn('[@rn-toolkit/notifications] Initialization error:', e);
      }

      setIsInitialized(true);
    };

    init();
  }, [adapter, config, requestPermission, getToken, subscribeToTopic]);

  // Set up notification listeners
  useEffect(() => {
    // Foreground message listener
    const unsubForeground = adapter.onForegroundMessage((notification) => {
      config.handlers?.onForegroundMessage?.(notification);
    });

    // Notification opened listener
    const unsubOpened = adapter.onNotificationOpened((notification) => {
      config.handlers?.onNotificationOpened?.(notification);
    });

    // Token refresh listener
    const unsubToken = adapter.onTokenRefresh((newToken) => {
      setToken(newToken);
      config.handlers?.onTokenRefresh?.(newToken);
      config.onTokenReceived?.(newToken);
    });

    return () => {
      unsubForeground();
      unsubOpened();
      unsubToken();
    };
  }, [adapter, config]);

  // App state listener for token refresh
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appStateRef.current === 'background' &&
        nextAppState === 'active' &&
        permission?.status === 'granted'
      ) {
        getToken();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription?.remove?.();
    };
  }, [permission, getToken]);

  const contextValue = useMemo<NotificationContextValue>(() => ({
    token,
    permission,
    isInitialized,
    hasPermission: permission?.status === 'granted' || permission?.status === 'provisional',
    initialNotification,
    requestPermission,
    getToken,
    subscribeToTopic,
    unsubscribeFromTopic,
    getTopics,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    getBadgeCount,
    setBadgeCount,
    clearBadge,
  }), [
    token,
    permission,
    isInitialized,
    initialNotification,
    requestPermission,
    getToken,
    subscribeToTopic,
    unsubscribeFromTopic,
    getTopics,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    getBadgeCount,
    setBadgeCount,
    clearBadge,
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}
