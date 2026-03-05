/**
 * usePushToken Hook
 *
 * Hook for managing FCM push token.
 */

import { useCallback, useEffect, useState } from 'react';
import { useNotifications } from './useNotifications';

export interface UsePushTokenResult {
  token: string | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<string | null>;
  hasToken: boolean;
}

export function usePushToken(): UsePushTokenResult {
  const { token: contextToken, getToken, hasPermission, isInitialized } = useNotifications();
  const [isLoading, setIsLoading] = useState(!isInitialized);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isInitialized) setIsLoading(false);
  }, [isInitialized]);

  const refresh = useCallback(async (): Promise<string | null> => {
    if (!hasPermission) {
      setError(new Error('Notification permission not granted'));
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      return await getToken();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to get token'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getToken, hasPermission]);

  return {
    token: contextToken,
    isLoading,
    error,
    refresh,
    hasToken: contextToken !== null,
  };
}
