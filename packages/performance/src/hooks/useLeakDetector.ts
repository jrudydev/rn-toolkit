/**
 * useLeakDetector Hook
 *
 * Hook for detecting memory leaks in components.
 * Tracks subscriptions, timers, and listeners to ensure proper cleanup.
 */

import { useContext, useEffect, useRef, useCallback } from 'react';
import { PerformanceContext } from '../PerformanceContext';
import type { LeakDetectorOptions, LeakDetectionResult, Severity } from '../types';

export interface UseLeakDetectorResult {
  /** Register a subscription for tracking */
  trackSubscription: (name: string, unsubscribe: () => void) => void;
  /** Register a timer for tracking */
  trackTimer: (name: string, timerId: ReturnType<typeof setTimeout>) => void;
  /** Register an event listener for tracking */
  trackListener: (name: string, cleanup: () => void) => void;
  /** Manually verify cleanup (useful for tests) */
  verifyCleanup: () => LeakDetectionResult[];
  /** Get count of tracked resources */
  getTrackedCount: () => { subscriptions: number; timers: number; listeners: number };
}

/**
 * Hook for detecting memory leaks in components
 *
 * @param options - Leak detector options
 * @returns Leak detector functions
 *
 * @example
 * ```tsx
 * import { useLeakDetector } from '@astacinco/rn-performance';
 *
 * function DataSubscriber() {
 *   const { trackSubscription, trackTimer, trackListener } = useLeakDetector({
 *     componentName: 'DataSubscriber',
 *   });
 *
 *   useEffect(() => {
 *     // Track subscription
 *     const unsubscribe = api.subscribe((data) => {
 *       setData(data);
 *     });
 *     trackSubscription('api_data', unsubscribe);
 *
 *     // Track timer
 *     const timerId = setInterval(() => {
 *       refresh();
 *     }, 5000);
 *     trackTimer('refresh_interval', timerId);
 *
 *     // Track event listener
 *     const handler = () => handleResize();
 *     window.addEventListener('resize', handler);
 *     trackListener('resize', () => window.removeEventListener('resize', handler));
 *
 *     // Cleanup is automatic when component unmounts!
 *   }, []);
 *
 *   return <View>...</View>;
 * }
 * ```
 */
export function useLeakDetector(options: LeakDetectorOptions = {}): UseLeakDetectorResult {
  const context = useContext(PerformanceContext);
  const componentName = options.componentName ?? 'UnknownComponent';

  // Track subscriptions
  const subscriptions = useRef<Map<string, () => void>>(new Map());
  // Track timers
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  // Track listeners
  const listeners = useRef<Map<string, () => void>>(new Map());

  // Track a subscription
  const trackSubscription = useCallback((name: string, unsubscribe: () => void): void => {
    subscriptions.current.set(name, unsubscribe);
  }, []);

  // Track a timer
  const trackTimer = useCallback((name: string, timerId: ReturnType<typeof setTimeout>): void => {
    timers.current.set(name, timerId);
  }, []);

  // Track a listener
  const trackListener = useCallback((name: string, cleanup: () => void): void => {
    listeners.current.set(name, cleanup);
  }, []);

  // Verify cleanup and return any leaks
  const verifyCleanup = useCallback((): LeakDetectionResult[] => {
    const leaks: LeakDetectionResult[] = [];

    // Check for subscription leaks
    if (options.checkSubscriptions !== false && subscriptions.current.size > 0) {
      subscriptions.current.forEach((_, name) => {
        leaks.push(createLeakResult(
          componentName,
          'subscription',
          name,
          'warning',
          `Subscription "${name}" was not cleaned up`
        ));
      });
    }

    // Check for timer leaks
    if (options.checkTimers !== false && timers.current.size > 0) {
      timers.current.forEach((_, name) => {
        leaks.push(createLeakResult(
          componentName,
          'timer',
          name,
          'warning',
          `Timer "${name}" was not cleaned up`
        ));
      });
    }

    // Check for listener leaks
    if (options.checkListeners !== false && listeners.current.size > 0) {
      listeners.current.forEach((_, name) => {
        leaks.push(createLeakResult(
          componentName,
          'listener',
          name,
          'warning',
          `Event listener "${name}" was not cleaned up`
        ));
      });
    }

    // Custom verification
    if (options.verifyCleanup && !options.verifyCleanup()) {
      leaks.push(createLeakResult(
        componentName,
        'unknown',
        'custom',
        'error',
        'Custom cleanup verification failed'
      ));
    }

    return leaks;
  }, [componentName, options]);

  // Get tracked resource counts
  const getTrackedCount = useCallback(() => ({
    subscriptions: subscriptions.current.size,
    timers: timers.current.size,
    listeners: listeners.current.size,
  }), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const leaks = verifyCleanup();

      // Clean up subscriptions
      subscriptions.current.forEach((unsubscribe, name) => {
        try {
          unsubscribe();
        } catch (error) {
          console.warn(`[Performance] Error cleaning up subscription "${name}":`, error);
        }
      });
      subscriptions.current.clear();

      // Clean up timers
      timers.current.forEach((timerId, name) => {
        try {
          clearTimeout(timerId);
          clearInterval(timerId);
        } catch (error) {
          console.warn(`[Performance] Error cleaning up timer "${name}":`, error);
        }
      });
      timers.current.clear();

      // Clean up listeners
      listeners.current.forEach((cleanup, name) => {
        try {
          cleanup();
        } catch (error) {
          console.warn(`[Performance] Error cleaning up listener "${name}":`, error);
        }
      });
      listeners.current.clear();

      // Report any leaks that were found
      leaks.forEach((leak) => {
        context.reportLeak(leak);
      });
    };
  }, [context, verifyCleanup]);

  return {
    trackSubscription,
    trackTimer,
    trackListener,
    verifyCleanup,
    getTrackedCount,
  };
}

/**
 * Helper to create leak detection results
 */
function createLeakResult(
  source: string,
  leakType: LeakDetectionResult['leakType'],
  resourceName: string,
  severity: Severity,
  message: string
): LeakDetectionResult {
  const suggestions: string[] = [];

  switch (leakType) {
    case 'subscription':
      suggestions.push('Call the unsubscribe function in useEffect cleanup');
      suggestions.push('Ensure the subscription is properly tracked');
      break;
    case 'timer':
      suggestions.push('Call clearTimeout/clearInterval in useEffect cleanup');
      suggestions.push('Store timer ID and clear it on unmount');
      break;
    case 'listener':
      suggestions.push('Call removeEventListener in useEffect cleanup');
      suggestions.push('Keep a reference to the handler function');
      break;
    case 'state':
      suggestions.push('Add isMounted check before setState calls');
      suggestions.push('Cancel async operations in useEffect cleanup');
      break;
    default:
      suggestions.push('Review component cleanup logic');
      suggestions.push('Use the React DevTools Profiler to investigate');
  }

  return {
    hasLeak: true,
    severity,
    message,
    source,
    leakType,
    suggestions,
  };
}
