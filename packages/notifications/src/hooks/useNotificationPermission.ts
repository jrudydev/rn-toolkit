/**
 * useNotificationPermission Hook
 *
 * Hook for managing notification permissions.
 */

import { useCallback, useState } from 'react';
import { useNotifications } from './useNotifications';
import type { NotificationPermission } from '../types';

export interface UseNotificationPermissionResult {
  permission: NotificationPermission | null;
  hasPermission: boolean;
  isLoading: boolean;
  error: Error | null;
  request: () => Promise<NotificationPermission>;
  isDenied: boolean;
  isGranted: boolean;
  isProvisional: boolean;
  isNotDetermined: boolean;
}

export function useNotificationPermission(): UseNotificationPermissionResult {
  const { permission, hasPermission, requestPermission, isInitialized } = useNotifications();
  const [isLoading, setIsLoading] = useState(!isInitialized);
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(async (): Promise<NotificationPermission> => {
    setIsLoading(true);
    setError(null);
    try {
      return await requestPermission();
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to request permission');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [requestPermission]);

  return {
    permission,
    hasPermission,
    isLoading,
    error,
    request,
    isDenied: permission?.status === 'denied',
    isGranted: permission?.status === 'granted',
    isProvisional: permission?.status === 'provisional',
    isNotDetermined: permission?.status === 'not_determined',
  };
}
