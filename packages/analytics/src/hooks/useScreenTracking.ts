/**
 * useScreenTracking Hook
 *
 * Hook for automatic screen view tracking.
 */

import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

export interface UseScreenTrackingOptions {
  /** Screen name to track */
  screenName: string;
  /** Optional screen class */
  screenClass?: string;
  /** Whether tracking is enabled (default: true) */
  enabled?: boolean;
  /** Track on every render vs only on mount (default: false = mount only) */
  trackOnEveryRender?: boolean;
}

/**
 * Hook to automatically track screen views
 *
 * @param options - Screen tracking options
 *
 * @example
 * ```tsx
 * import { useScreenTracking } from '@rn-toolkit/analytics';
 *
 * function HomeScreen() {
 *   useScreenTracking({ screenName: 'HomeScreen' });
 *
 *   return <View>...</View>;
 * }
 *
 * // With screen class
 * function ProfileScreen() {
 *   useScreenTracking({
 *     screenName: 'ProfileScreen',
 *     screenClass: 'ProfileScreenClass',
 *   });
 *
 *   return <View>...</View>;
 * }
 *
 * // Conditional tracking
 * function ConditionalScreen({ isVisible }) {
 *   useScreenTracking({
 *     screenName: 'ConditionalScreen',
 *     enabled: isVisible,
 *   });
 *
 *   return <View>...</View>;
 * }
 * ```
 */
export function useScreenTracking({
  screenName,
  screenClass,
  enabled = true,
  trackOnEveryRender = false,
}: UseScreenTrackingOptions): void {
  const { logScreenView, isInitialized } = useAnalytics();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!enabled || !isInitialized) return;

    // If only tracking on mount, check if already tracked
    if (!trackOnEveryRender && hasTracked.current) return;

    logScreenView(screenName, screenClass);
    hasTracked.current = true;
  }, [enabled, isInitialized, logScreenView, screenName, screenClass, trackOnEveryRender]);

  // Reset tracking state when screen name changes
  useEffect(() => {
    hasTracked.current = false;
  }, [screenName]);
}
