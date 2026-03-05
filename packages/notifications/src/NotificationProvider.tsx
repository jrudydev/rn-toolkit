/**
 * Notification Provider
 *
 * Provides notification context with Firebase Cloud Messaging integration.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Platform, AppState, type AppStateStatus } from 'react-native';
import { NotificationContext } from './NotificationContext';
import type {
  NotificationConfig,
  NotificationContextValue,
  NotificationPermission,
  RemoteNotification,
  LocalNotification,
} from './types';

// Firebase types (optional peer dependency)
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

export interface NotificationProviderProps {
  children: ReactNode;
  config?: NotificationConfig;
  messaging?: FirebaseMessaging;
}

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

export function NotificationProvider({
  children,
  config = {},
  messaging: customMessaging,
}: NotificationProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialNotification, setInitialNotification] = useState<RemoteNotification | null>(null);

  const topicsRef = useRef<Set<string>>(new Set());
  const messagingRef = useRef<FirebaseMessaging | null>(customMessaging || null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const getMessaging = useCallback((): FirebaseMessaging | null => {
    if (messagingRef.current) return messagingRef.current;
    try {
      const fm = require('@react-native-firebase/messaging').default;
      messagingRef.current = fm();
      return messagingRef.current;
    } catch {
      return null;
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    const messaging = getMessaging();
    if (!messaging) {
      const denied: NotificationPermission = { status: 'denied', alert: false, badge: false, sound: false };
      setPermission(denied);
      return denied;
    }
    try {
      const authStatus = await messaging.requestPermission();
      const perm = toPermissionStatus(authStatus);
      setPermission(perm);
      return perm;
    } catch {
      const denied: NotificationPermission = { status: 'denied', alert: false, badge: false, sound: false };
      setPermission(denied);
      return denied;
    }
  }, [getMessaging]);

  const getToken = useCallback(async (): Promise<string | null> => {
    const messaging = getMessaging();
    if (!messaging) return null;
    try {
      const fcmToken = await messaging.getToken();
      setToken(fcmToken);
      config.onTokenReceived?.(fcmToken);
      return fcmToken;
    } catch {
      return null;
    }
  }, [getMessaging, config]);

  const subscribeToTopic = useCallback(async (topic: string): Promise<void> => {
    const messaging = getMessaging();
    if (!messaging) return;
    await messaging.subscribeToTopic(topic);
    topicsRef.current.add(topic);
  }, [getMessaging]);

  const unsubscribeFromTopic = useCallback(async (topic: string): Promise<void> => {
    const messaging = getMessaging();
    if (!messaging) return;
    await messaging.unsubscribeFromTopic(topic);
    topicsRef.current.delete(topic);
  }, [getMessaging]);

  const getTopics = useCallback((): string[] => Array.from(topicsRef.current), []);

  const scheduleNotification = useCallback(async (notification: LocalNotification): Promise<string> => {
    console.log('Schedule notification:', notification.id);
    return notification.id;
  }, []);

  const cancelNotification = useCallback(async (id: string): Promise<void> => {
    console.log('Cancel notification:', id);
  }, []);

  const cancelAllNotifications = useCallback(async (): Promise<void> => {
    console.log('Cancel all notifications');
  }, []);

  const getBadgeCount = useCallback(async (): Promise<number> => 0, []);

  const setBadgeCount = useCallback(async (count: number): Promise<void> => {
    console.log('Set badge:', count);
  }, []);

  const clearBadge = useCallback(async (): Promise<void> => {
    await setBadgeCount(0);
  }, [setBadgeCount]);

  useEffect(() => {
    const init = async () => {
      const messaging = getMessaging();
      if (!messaging) {
        setIsInitialized(true);
        return;
      }
      try {
        const authStatus = await messaging.hasPermission();
        const perm = toPermissionStatus(authStatus);
        setPermission(perm);
        if (config.requestPermissionOnInit && perm.status === 'not_determined') {
          await requestPermission();
        }
        if (perm.status === 'granted' || perm.status === 'provisional') {
          await getToken();
        }
        const initial = await messaging.getInitialNotification();
        if (initial) {
          const notif = toRemoteNotification(initial);
          setInitialNotification(notif);
          config.handlers?.onNotificationOpenedApp?.(notif);
        }
        if (config.autoSubscribeTopics) {
          for (const topic of config.autoSubscribeTopics) {
            await subscribeToTopic(topic);
          }
        }
      } catch (e) {
        console.warn('Notification init error:', e);
      }
      setIsInitialized(true);
    };
    init();
  }, [getMessaging, config, requestPermission, getToken, subscribeToTopic]);

  useEffect(() => {
    const messaging = getMessaging();
    if (!messaging) return;
    const unsub1 = messaging.onMessage((msg) => {
      config.handlers?.onForegroundMessage?.(toRemoteNotification(msg));
    });
    const unsub2 = messaging.onNotificationOpenedApp((msg) => {
      config.handlers?.onNotificationOpened?.(toRemoteNotification(msg));
    });
    const unsub3 = messaging.onTokenRefresh((t) => {
      setToken(t);
      config.handlers?.onTokenRefresh?.(t);
      config.onTokenReceived?.(t);
    });
    return () => { unsub1(); unsub2(); unsub3(); };
  }, [getMessaging, config]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (appStateRef.current === 'background' && next === 'active' && permission?.status === 'granted') {
        getToken();
      }
      appStateRef.current = next;
    });
    return () => sub?.remove?.();
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
  }), [token, permission, isInitialized, initialNotification, requestPermission, getToken, subscribeToTopic, unsubscribeFromTopic, getTopics, scheduleNotification, cancelNotification, cancelAllNotifications, getBadgeCount, setBadgeCount, clearBadge]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}
