/**
 * useTopics Hook
 *
 * Hook for managing topic subscriptions.
 */

import { useCallback, useState } from 'react';
import { useNotifications } from './useNotifications';

export interface UseTopicsResult {
  topics: string[];
  subscribe: (topic: string) => Promise<void>;
  unsubscribe: (topic: string) => Promise<void>;
  isSubscribed: (topic: string) => boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useTopics(): UseTopicsResult {
  const { subscribeToTopic, unsubscribeFromTopic, getTopics, hasPermission } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const subscribe = useCallback(async (topic: string): Promise<void> => {
    if (!hasPermission) {
      setError(new Error('Notification permission not granted'));
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await subscribeToTopic(topic);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to subscribe'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [subscribeToTopic, hasPermission]);

  const unsubscribe = useCallback(async (topic: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await unsubscribeFromTopic(topic);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to unsubscribe'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [unsubscribeFromTopic]);

  const isSubscribed = useCallback((topic: string): boolean => {
    return getTopics().includes(topic);
  }, [getTopics]);

  return {
    topics: getTopics(),
    subscribe,
    unsubscribe,
    isSubscribed,
    isLoading,
    error,
  };
}
