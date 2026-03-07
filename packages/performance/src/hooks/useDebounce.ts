/**
 * useDebounce Hook
 *
 * Delays updating a value until after a specified delay has passed
 * since the last change. Useful for search inputs, form validation, etc.
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       searchApi(debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 *
 *   return <TextInput value={searchTerm} onChangeText={setSearchTerm} />;
 * }
 * ```
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Debounce a value - returns the value after it has stopped changing for `delay` ms.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Options for useDebouncedCallback
 */
export interface UseDebouncedCallbackOptions {
  /** Delay in milliseconds (default: 300) */
  delay?: number;
  /** Fire immediately on first call, then debounce subsequent calls */
  leading?: boolean;
  /** Fire on the trailing edge (default: true) */
  trailing?: boolean;
  /** Maximum time to wait before forcing execution */
  maxWait?: number;
}

/**
 * Debounce a callback function.
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const debouncedSearch = useDebouncedCallback(
 *     (term: string) => searchApi(term),
 *     { delay: 300 }
 *   );
 *
 *   return <TextInput onChangeText={debouncedSearch} />;
 * }
 * ```
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  options: UseDebouncedCallbackOptions = {}
): {
  /** The debounced function */
  call: (...args: Parameters<T>) => void;
  /** Cancel pending execution */
  cancel: () => void;
  /** Immediately execute pending callback */
  flush: () => void;
  /** Whether there's a pending execution */
  isPending: () => boolean;
} {
  const { delay = 300, leading = false, trailing = true, maxWait } = options;

  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWaitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);
  const leadingCalledRef = useRef(false);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (maxWaitTimerRef.current) {
      clearTimeout(maxWaitTimerRef.current);
      maxWaitTimerRef.current = null;
    }
    lastArgsRef.current = null;
    leadingCalledRef.current = false;
  }, []);

  const flush = useCallback(() => {
    if (lastArgsRef.current) {
      callbackRef.current(...(lastArgsRef.current as Parameters<T>));
      cancel();
    }
  }, [cancel]);

  const isPending = useCallback(() => {
    return timerRef.current !== null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  const call = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;
      const now = Date.now();

      // Handle leading edge
      if (leading && !leadingCalledRef.current) {
        leadingCalledRef.current = true;
        callbackRef.current(...args);
        lastCallTimeRef.current = now;
      }

      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Handle maxWait
      if (maxWait && !maxWaitTimerRef.current && lastCallTimeRef.current) {
        const timeSinceLastCall = now - lastCallTimeRef.current;
        const remainingMaxWait = Math.max(0, maxWait - timeSinceLastCall);

        maxWaitTimerRef.current = setTimeout(() => {
          if (lastArgsRef.current && trailing) {
            callbackRef.current(...(lastArgsRef.current as Parameters<T>));
            lastCallTimeRef.current = Date.now();
          }
          maxWaitTimerRef.current = null;
          leadingCalledRef.current = false;
        }, remainingMaxWait);
      }

      // Set trailing edge timer
      if (trailing) {
        timerRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            callbackRef.current(...(lastArgsRef.current as Parameters<T>));
            lastCallTimeRef.current = Date.now();
          }
          timerRef.current = null;
          leadingCalledRef.current = false;

          if (maxWaitTimerRef.current) {
            clearTimeout(maxWaitTimerRef.current);
            maxWaitTimerRef.current = null;
          }
        }, delay);
      }
    },
    [delay, leading, trailing, maxWait]
  );

  return { call, cancel, flush, isPending };
}
