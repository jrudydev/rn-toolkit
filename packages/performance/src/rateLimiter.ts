/**
 * Rate Limiter
 *
 * Limits the number of operations within a time window.
 * Useful for preventing brute force attacks, API abuse, form spam.
 *
 * @example
 * ```tsx
 * const loginLimiter = createRateLimiter({
 *   maxAttempts: 5,
 *   windowMs: 60000, // 1 minute
 *   onLimitReached: () => showError('Too many attempts. Try again later.'),
 * });
 *
 * async function handleLogin() {
 *   if (!loginLimiter.canProceed('login')) {
 *     return; // Rate limited
 *   }
 *
 *   loginLimiter.record('login');
 *   await attemptLogin();
 * }
 * ```
 */

/**
 * Configuration options for rate limiter
 */
export interface RateLimiterOptions {
  /** Maximum number of attempts allowed in the window (default: 5) */
  maxAttempts?: number;
  /** Time window in milliseconds (default: 60000 = 1 minute) */
  windowMs?: number;
  /** Callback when rate limit is reached */
  onLimitReached?: (key: string, attemptsCount: number) => void;
  /** Callback when rate limit resets */
  onReset?: (key: string) => void;
}

/**
 * Rate limit status for a specific key
 */
export interface RateLimitStatus {
  /** Whether the action can proceed */
  allowed: boolean;
  /** Number of attempts made in current window */
  attempts: number;
  /** Remaining attempts before limit */
  remaining: number;
  /** Time in ms until the window resets */
  resetIn: number;
  /** Whether currently rate limited */
  isLimited: boolean;
}

/**
 * Entry tracking attempts for a key
 */
interface RateLimitEntry {
  attempts: number[];
  limited: boolean;
}

/**
 * Rate limiter instance
 */
export interface RateLimiter {
  /** Check if action can proceed (doesn't record attempt) */
  canProceed: (key: string) => boolean;
  /** Record an attempt for a key */
  record: (key: string) => RateLimitStatus;
  /** Get current status for a key */
  getStatus: (key: string) => RateLimitStatus;
  /** Reset attempts for a key */
  reset: (key: string) => void;
  /** Reset all keys */
  resetAll: () => void;
  /** Clean up expired entries */
  cleanup: () => void;
}

/**
 * Create a rate limiter instance.
 *
 * @param options - Configuration options
 * @returns Rate limiter instance
 *
 * @example
 * ```tsx
 * // Login rate limiting
 * const loginLimiter = createRateLimiter({
 *   maxAttempts: 5,
 *   windowMs: 60000,
 *   onLimitReached: (key) => {
 *     analytics.track('rate_limit_hit', { action: key });
 *     showToast('Too many attempts. Please wait.');
 *   },
 * });
 *
 * // API rate limiting
 * const apiLimiter = createRateLimiter({
 *   maxAttempts: 100,
 *   windowMs: 60000, // 100 requests per minute
 * });
 *
 * // Form spam prevention
 * const formLimiter = createRateLimiter({
 *   maxAttempts: 3,
 *   windowMs: 10000, // 3 submissions per 10 seconds
 * });
 * ```
 */
export function createRateLimiter(options: RateLimiterOptions = {}): RateLimiter {
  const {
    maxAttempts = 5,
    windowMs = 60000,
    onLimitReached,
    onReset,
  } = options;

  const entries = new Map<string, RateLimitEntry>();

  /**
   * Clean old attempts from entry
   */
  const cleanEntry = (entry: RateLimitEntry): void => {
    const now = Date.now();
    entry.attempts = entry.attempts.filter((time) => now - time < windowMs);
  };

  /**
   * Get or create entry for key
   */
  const getEntry = (key: string): RateLimitEntry => {
    let entry = entries.get(key);
    if (!entry) {
      entry = { attempts: [], limited: false };
      entries.set(key, entry);
    }
    cleanEntry(entry);
    return entry;
  };

  /**
   * Calculate status for entry
   */
  const calculateStatus = (entry: RateLimitEntry): RateLimitStatus => {
    const attempts = entry.attempts.length;
    const remaining = Math.max(0, maxAttempts - attempts);
    const isLimited = attempts >= maxAttempts;

    let resetIn = 0;
    if (entry.attempts.length > 0) {
      const oldestAttempt = Math.min(...entry.attempts);
      resetIn = Math.max(0, windowMs - (Date.now() - oldestAttempt));
    }

    return {
      allowed: !isLimited,
      attempts,
      remaining,
      resetIn,
      isLimited,
    };
  };

  const canProceed = (key: string): boolean => {
    const entry = getEntry(key);
    return entry.attempts.length < maxAttempts;
  };

  const record = (key: string): RateLimitStatus => {
    const entry = getEntry(key);
    const wasLimited = entry.limited;

    entry.attempts.push(Date.now());
    const status = calculateStatus(entry);

    // Check if we just hit the limit
    if (status.isLimited && !wasLimited) {
      entry.limited = true;
      onLimitReached?.(key, status.attempts);
    }

    return status;
  };

  const getStatus = (key: string): RateLimitStatus => {
    const entry = getEntry(key);
    return calculateStatus(entry);
  };

  const reset = (key: string): void => {
    const entry = entries.get(key);
    if (entry?.limited) {
      onReset?.(key);
    }
    entries.delete(key);
  };

  const resetAll = (): void => {
    entries.forEach((entry, key) => {
      if (entry.limited) {
        onReset?.(key);
      }
    });
    entries.clear();
  };

  const cleanup = (): void => {
    entries.forEach((entry, key) => {
      cleanEntry(entry);
      if (entry.attempts.length === 0) {
        if (entry.limited) {
          onReset?.(key);
        }
        entries.delete(key);
      } else if (entry.limited && entry.attempts.length < maxAttempts) {
        // No longer limited after cleanup
        entry.limited = false;
        onReset?.(key);
      }
    });
  };

  return {
    canProceed,
    record,
    getStatus,
    reset,
    resetAll,
    cleanup,
  };
}

/**
 * Hook for using rate limiter with automatic cleanup
 */
import { useRef, useEffect, useCallback } from 'react';

export interface UseRateLimiterOptions extends RateLimiterOptions {
  /** Interval for automatic cleanup in ms (default: 30000 = 30 seconds, 0 to disable) */
  cleanupInterval?: number;
}

export interface UseRateLimiterResult {
  /** Check if action can proceed */
  canProceed: (key: string) => boolean;
  /** Record an attempt and get status */
  record: (key: string) => RateLimitStatus;
  /** Get current status without recording */
  getStatus: (key: string) => RateLimitStatus;
  /** Reset attempts for a key */
  reset: (key: string) => void;
  /** Reset all keys */
  resetAll: () => void;
}

/**
 * React hook for rate limiting with automatic cleanup.
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const limiter = useRateLimiter({
 *     maxAttempts: 5,
 *     windowMs: 60000,
 *     onLimitReached: () => setError('Too many attempts'),
 *   });
 *
 *   const handleSubmit = async () => {
 *     const status = limiter.record('login');
 *     if (!status.allowed) {
 *       return;
 *     }
 *     await login();
 *   };
 *
 *   return (
 *     <Button
 *       onPress={handleSubmit}
 *       disabled={!limiter.canProceed('login')}
 *     />
 *   );
 * }
 * ```
 */
export function useRateLimiter(
  options: UseRateLimiterOptions = {}
): UseRateLimiterResult {
  const { cleanupInterval = 30000, ...limiterOptions } = options;

  const limiterRef = useRef<RateLimiter | null>(null);

  // Create limiter once
  if (!limiterRef.current) {
    limiterRef.current = createRateLimiter(limiterOptions);
  }

  // Auto cleanup
  useEffect(() => {
    if (cleanupInterval <= 0) return;

    const timer = setInterval(() => {
      limiterRef.current?.cleanup();
    }, cleanupInterval);

    return () => {
      clearInterval(timer);
    };
  }, [cleanupInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      limiterRef.current?.resetAll();
    };
  }, []);

  const canProceed = useCallback((key: string) => {
    return limiterRef.current?.canProceed(key) ?? true;
  }, []);

  const record = useCallback((key: string) => {
    return (
      limiterRef.current?.record(key) ?? {
        allowed: true,
        attempts: 0,
        remaining: Infinity,
        resetIn: 0,
        isLimited: false,
      }
    );
  }, []);

  const getStatus = useCallback((key: string) => {
    return (
      limiterRef.current?.getStatus(key) ?? {
        allowed: true,
        attempts: 0,
        remaining: Infinity,
        resetIn: 0,
        isLimited: false,
      }
    );
  }, []);

  const reset = useCallback((key: string) => {
    limiterRef.current?.reset(key);
  }, []);

  const resetAll = useCallback(() => {
    limiterRef.current?.resetAll();
  }, []);

  return {
    canProceed,
    record,
    getStatus,
    reset,
    resetAll,
  };
}
