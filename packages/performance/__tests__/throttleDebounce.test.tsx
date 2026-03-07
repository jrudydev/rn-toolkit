/**
 * Throttle, Debounce, and Rate Limiter Tests
 */

import { renderHook, act } from '@testing-library/react-native';
import {
  useDebounce,
  useDebouncedCallback,
  useThrottle,
  useThrottledCallback,
} from '../src/hooks';
import { createRateLimiter, useRateLimiter } from '../src/rateLimiter';

// Mock timers
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    );

    expect(result.current).toBe('first');

    // Change value
    rerender({ value: 'second' });
    expect(result.current).toBe('first'); // Still old value

    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('first'); // Still waiting

    // Complete the delay
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('second'); // Now updated
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    // Rapid changes
    rerender({ value: 'b' });
    act(() => jest.advanceTimersByTime(100));

    rerender({ value: 'c' });
    act(() => jest.advanceTimersByTime(100));

    rerender({ value: 'd' });
    act(() => jest.advanceTimersByTime(100));

    expect(result.current).toBe('a'); // Still original

    // Wait for final debounce
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe('d'); // Final value
  });
});

describe('useDebouncedCallback', () => {
  it('debounces callback execution', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 300 })
    );

    // Call multiple times rapidly
    act(() => {
      result.current.call('arg1');
      result.current.call('arg2');
      result.current.call('arg3');
    });

    expect(callback).not.toHaveBeenCalled();

    // Wait for debounce
    act(() => jest.advanceTimersByTime(300));
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg3');
  });

  it('supports leading edge', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 300, leading: true, trailing: false })
    );

    act(() => {
      result.current.call('first');
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('first');

    // Subsequent calls ignored
    act(() => {
      result.current.call('second');
      result.current.call('third');
    });

    act(() => jest.advanceTimersByTime(300));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('cancel prevents execution', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 300 })
    );

    act(() => {
      result.current.call('test');
    });

    act(() => {
      result.current.cancel();
    });

    act(() => jest.advanceTimersByTime(300));
    expect(callback).not.toHaveBeenCalled();
  });

  it('flush executes immediately', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 300 })
    );

    act(() => {
      result.current.call('test');
    });

    act(() => {
      result.current.flush();
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test');
  });

  it('isPending returns correct state', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 300 })
    );

    expect(result.current.isPending()).toBe(false);

    act(() => {
      result.current.call('test');
    });

    expect(result.current.isPending()).toBe(true);

    act(() => jest.advanceTimersByTime(300));
    expect(result.current.isPending()).toBe(false);
  });
});

describe('useThrottle', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useThrottle('initial', 100));
    expect(result.current).toBe('initial');
  });

  it('throttles value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 100),
      { initialProps: { value: 'first' } }
    );

    expect(result.current).toBe('first');

    // Change value - updates after throttle interval
    rerender({ value: 'second' });

    // Rapid changes should be throttled
    rerender({ value: 'third' });
    rerender({ value: 'fourth' });

    // Still first value until throttle fires
    expect(result.current).toBe('first');

    // After throttle period, should have latest value
    act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe('fourth');
  });
});

describe('useThrottledCallback', () => {
  it('executes immediately on first call', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useThrottledCallback(callback, { interval: 100 })
    );

    act(() => {
      result.current.call('first');
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('first');
  });

  it('throttles subsequent calls', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useThrottledCallback(callback, { interval: 100 })
    );

    act(() => {
      result.current.call('first');
      result.current.call('second');
      result.current.call('third');
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('first');

    // Wait for throttle period
    act(() => jest.advanceTimersByTime(100));

    // Trailing call should execute
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('third');
  });

  it('cancel prevents trailing execution', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useThrottledCallback(callback, { interval: 100 })
    );

    act(() => {
      result.current.call('first');
      result.current.call('second');
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.cancel();
    });

    act(() => jest.advanceTimersByTime(100));
    expect(callback).toHaveBeenCalledTimes(1); // No trailing call
  });

  it('isThrottled returns correct state', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useThrottledCallback(callback, { interval: 100 })
    );

    expect(result.current.isThrottled()).toBe(false);

    act(() => {
      result.current.call('test');
    });

    expect(result.current.isThrottled()).toBe(true);

    act(() => jest.advanceTimersByTime(100));
    expect(result.current.isThrottled()).toBe(false);
  });
});

describe('createRateLimiter', () => {
  it('allows requests within limit', () => {
    const limiter = createRateLimiter({ maxAttempts: 3, windowMs: 1000 });

    expect(limiter.canProceed('key')).toBe(true);
    limiter.record('key');

    expect(limiter.canProceed('key')).toBe(true);
    limiter.record('key');

    expect(limiter.canProceed('key')).toBe(true);
    limiter.record('key');

    // Now at limit
    expect(limiter.canProceed('key')).toBe(false);
  });

  it('resets after window expires', () => {
    const limiter = createRateLimiter({ maxAttempts: 2, windowMs: 1000 });

    limiter.record('key');
    limiter.record('key');
    expect(limiter.canProceed('key')).toBe(false);

    // Advance time past window
    jest.advanceTimersByTime(1001);

    expect(limiter.canProceed('key')).toBe(true);
  });

  it('calls onLimitReached when limit hit', () => {
    const onLimitReached = jest.fn();
    const limiter = createRateLimiter({
      maxAttempts: 2,
      windowMs: 1000,
      onLimitReached,
    });

    limiter.record('key');
    expect(onLimitReached).not.toHaveBeenCalled();

    limiter.record('key');
    expect(onLimitReached).toHaveBeenCalledWith('key', 2);
  });

  it('tracks different keys separately', () => {
    const limiter = createRateLimiter({ maxAttempts: 1, windowMs: 1000 });

    limiter.record('key1');
    expect(limiter.canProceed('key1')).toBe(false);
    expect(limiter.canProceed('key2')).toBe(true);
  });

  it('getStatus returns correct info', () => {
    const limiter = createRateLimiter({ maxAttempts: 3, windowMs: 1000 });

    limiter.record('key');
    limiter.record('key');

    const status = limiter.getStatus('key');
    expect(status.attempts).toBe(2);
    expect(status.remaining).toBe(1);
    expect(status.isLimited).toBe(false);
    expect(status.allowed).toBe(true);
  });

  it('reset clears attempts for key', () => {
    const limiter = createRateLimiter({ maxAttempts: 1, windowMs: 1000 });

    limiter.record('key');
    expect(limiter.canProceed('key')).toBe(false);

    limiter.reset('key');
    expect(limiter.canProceed('key')).toBe(true);
  });

  it('resetAll clears all keys', () => {
    const limiter = createRateLimiter({ maxAttempts: 1, windowMs: 1000 });

    limiter.record('key1');
    limiter.record('key2');

    limiter.resetAll();

    expect(limiter.canProceed('key1')).toBe(true);
    expect(limiter.canProceed('key2')).toBe(true);
  });
});

describe('useRateLimiter', () => {
  it('provides rate limiting in hook form', () => {
    const { result } = renderHook(() =>
      useRateLimiter({ maxAttempts: 2, windowMs: 1000 })
    );

    expect(result.current.canProceed('login')).toBe(true);

    act(() => {
      result.current.record('login');
      result.current.record('login');
    });

    expect(result.current.canProceed('login')).toBe(false);
  });

  it('cleans up on unmount', () => {
    const { result, unmount } = renderHook(() =>
      useRateLimiter({ maxAttempts: 2, windowMs: 1000 })
    );

    act(() => {
      result.current.record('key');
    });

    // Should not throw on unmount
    expect(() => unmount()).not.toThrow();
  });
});
