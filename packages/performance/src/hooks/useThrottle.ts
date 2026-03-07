/**
 * useThrottle Hook
 *
 * Limits how often a value can update or a callback can be called.
 * Useful for scroll handlers, resize events, button spam prevention.
 *
 * @example
 * ```tsx
 * function ScrollHandler() {
 *   const [scrollY, setScrollY] = useState(0);
 *   const throttledScrollY = useThrottle(scrollY, 100);
 *
 *   // throttledScrollY updates at most every 100ms
 *   useEffect(() => {
 *     analytics.trackScroll(throttledScrollY);
 *   }, [throttledScrollY]);
 * }
 * ```
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Throttle a value - limits how often the value can update.
 *
 * @param value - The value to throttle
 * @param interval - Minimum time between updates in milliseconds (default: 100)
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, interval = 100): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdatedRef = useRef<number>(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdatedRef.current;

    if (timeSinceLastUpdate >= interval) {
      // Enough time has passed, update immediately
      lastUpdatedRef.current = now;
      setThrottledValue(value);
    } else {
      // Schedule an update for when the interval has passed
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastUpdatedRef.current = Date.now();
        setThrottledValue(value);
        timeoutRef.current = null;
      }, interval - timeSinceLastUpdate);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, interval]);

  return throttledValue;
}

/**
 * Options for useThrottledCallback
 */
export interface UseThrottledCallbackOptions {
  /** Minimum interval between calls in milliseconds (default: 100) */
  interval?: number;
  /** Fire immediately on first call (default: true) */
  leading?: boolean;
  /** Fire on the trailing edge after throttle period (default: true) */
  trailing?: boolean;
}

/**
 * Throttle a callback function.
 *
 * @example
 * ```tsx
 * function SubmitButton() {
 *   const throttledSubmit = useThrottledCallback(
 *     () => submitForm(),
 *     { interval: 1000 } // Prevent double-submit for 1 second
 *   );
 *
 *   return <Button onPress={throttledSubmit.call} title="Submit" />;
 * }
 * ```
 */
export function useThrottledCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  options: UseThrottledCallbackOptions = {}
): {
  /** The throttled function */
  call: (...args: Parameters<T>) => void;
  /** Cancel pending trailing execution */
  cancel: () => void;
  /** Whether currently in throttle period */
  isThrottled: () => boolean;
} {
  const { interval = 100, leading = true, trailing = true } = options;

  const callbackRef = useRef(callback);
  const lastCallTimeRef = useRef<number | null>(null);
  const trailingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const isThrottledRef = useRef(false);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (trailingTimeoutRef.current) {
      clearTimeout(trailingTimeoutRef.current);
      trailingTimeoutRef.current = null;
    }
    lastArgsRef.current = null;
  }, []);

  const isThrottled = useCallback(() => {
    return isThrottledRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  const call = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      lastArgsRef.current = args;

      // First call or enough time has passed
      if (lastCallTimeRef.current === null || now - lastCallTimeRef.current >= interval) {
        if (leading) {
          lastCallTimeRef.current = now;
          isThrottledRef.current = true;
          callbackRef.current(...args);

          // Set up trailing timeout
          if (trailing) {
            if (trailingTimeoutRef.current) {
              clearTimeout(trailingTimeoutRef.current);
            }
            trailingTimeoutRef.current = setTimeout(() => {
              isThrottledRef.current = false;
              trailingTimeoutRef.current = null;
            }, interval);
          } else {
            // Reset throttle after interval
            setTimeout(() => {
              isThrottledRef.current = false;
            }, interval);
          }
        }
      } else if (trailing) {
        // We're in throttle period, schedule trailing call
        if (trailingTimeoutRef.current) {
          clearTimeout(trailingTimeoutRef.current);
        }

        const remainingTime = interval - (now - lastCallTimeRef.current);
        trailingTimeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            lastCallTimeRef.current = Date.now();
            callbackRef.current(...(lastArgsRef.current as Parameters<T>));
          }
          isThrottledRef.current = false;
          trailingTimeoutRef.current = null;
        }, remainingTime);
      }
    },
    [interval, leading, trailing]
  );

  return { call, cancel, isThrottled };
}
