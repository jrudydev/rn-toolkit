/**
 * Notification Context
 *
 * React context for notification state and methods.
 */

import { createContext } from 'react';
import type { NotificationContextValue, NotificationPermission, LocalNotification, RemoteNotification } from './types';

/**
 * Default context value (throws if used outside provider)
 */
const defaultContextValue: NotificationContextValue = {
  token: null,
  permission: null,
  isInitialized: false,
  hasPermission: false,
  initialNotification: null,
  requestPermission: async () => {
    throw new Error('NotificationProvider not found');
  },
  getToken: async () => {
    throw new Error('NotificationProvider not found');
  },
  subscribeToTopic: async () => {
    throw new Error('NotificationProvider not found');
  },
  unsubscribeFromTopic: async () => {
    throw new Error('NotificationProvider not found');
  },
  getTopics: () => {
    throw new Error('NotificationProvider not found');
  },
  scheduleNotification: async () => {
    throw new Error('NotificationProvider not found');
  },
  cancelNotification: async () => {
    throw new Error('NotificationProvider not found');
  },
  cancelAllNotifications: async () => {
    throw new Error('NotificationProvider not found');
  },
  getBadgeCount: async () => {
    throw new Error('NotificationProvider not found');
  },
  setBadgeCount: async () => {
    throw new Error('NotificationProvider not found');
  },
  clearBadge: async () => {
    throw new Error('NotificationProvider not found');
  },
};

/**
 * Notification context
 */
export const NotificationContext = createContext<NotificationContextValue>(defaultContextValue);
