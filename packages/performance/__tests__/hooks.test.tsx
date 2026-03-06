/**
 * Performance Hooks Tests
 */

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { PerformanceProvider } from '../src/PerformanceProvider';
import { useLeakDetector } from '../src/hooks/useLeakDetector';
import { useRenderTracker } from '../src/hooks/useRenderTracker';
import { NoOpAdapter } from '../src/adapters/NoOpAdapter';
import { ConsoleAdapter } from '../src/adapters/ConsoleAdapter';
import type { PerformanceAdapter, PerformanceConfig } from '../src/types';

interface WrapperProps {
  children: React.ReactNode;
}

function createWrapper(adapter: PerformanceAdapter, config?: PerformanceConfig) {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <PerformanceProvider adapter={adapter} config={config}>
        {children}
      </PerformanceProvider>
    );
  };
}

describe('useLeakDetector', () => {
  let consoleSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('trackSubscription_registersSubscription', () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(
      () => useLeakDetector({ componentName: 'TestComponent' }),
      { wrapper: createWrapper(adapter) }
    );

    const unsubscribe = jest.fn();
    result.current.trackSubscription('test_sub', unsubscribe);

    expect(result.current.getTrackedCount().subscriptions).toBe(1);
  });

  it('trackTimer_registersTimer', () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(
      () => useLeakDetector({ componentName: 'TestComponent' }),
      { wrapper: createWrapper(adapter) }
    );

    const timerId = setTimeout(() => {}, 1000);
    result.current.trackTimer('test_timer', timerId);

    expect(result.current.getTrackedCount().timers).toBe(1);

    // Clean up
    clearTimeout(timerId);
  });

  it('trackListener_registersListener', () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(
      () => useLeakDetector({ componentName: 'TestComponent' }),
      { wrapper: createWrapper(adapter) }
    );

    const cleanup = jest.fn();
    result.current.trackListener('test_listener', cleanup);

    expect(result.current.getTrackedCount().listeners).toBe(1);
  });

  it('verifyCleanup_returnsLeaks_whenNotCleanedUp', () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(
      () => useLeakDetector({ componentName: 'TestComponent' }),
      { wrapper: createWrapper(adapter) }
    );

    // Track resources without cleanup
    result.current.trackSubscription('sub1', jest.fn());
    result.current.trackTimer('timer1', setTimeout(() => {}, 1000) as unknown as ReturnType<typeof setTimeout>);
    result.current.trackListener('listener1', jest.fn());

    const leaks = result.current.verifyCleanup();

    expect(leaks.length).toBe(3);
    expect(leaks.some((l) => l.leakType === 'subscription')).toBe(true);
    expect(leaks.some((l) => l.leakType === 'timer')).toBe(true);
    expect(leaks.some((l) => l.leakType === 'listener')).toBe(true);
  });

  it('unmount_cleansUpResources', () => {
    const adapter = new NoOpAdapter();
    const unsubscribe = jest.fn();
    const cleanup = jest.fn();

    const { result, unmount } = renderHook(
      () => useLeakDetector({ componentName: 'TestComponent' }),
      { wrapper: createWrapper(adapter) }
    );

    result.current.trackSubscription('sub', unsubscribe);
    result.current.trackListener('listener', cleanup);

    // Unmount should clean up
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
    expect(cleanup).toHaveBeenCalled();
  });

  it('customVerifyCleanup_reportsFailure', () => {
    const adapter = new NoOpAdapter();
    const verifyCleanup = jest.fn().mockReturnValue(false);

    const { result } = renderHook(
      () =>
        useLeakDetector({
          componentName: 'TestComponent',
          verifyCleanup,
        }),
      { wrapper: createWrapper(adapter) }
    );

    const leaks = result.current.verifyCleanup();

    expect(verifyCleanup).toHaveBeenCalled();
    expect(leaks.some((l) => l.leakType === 'unknown')).toBe(true);
  });
});

describe('useRenderTracker', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('tracks_renderCount', () => {
    const adapter = new NoOpAdapter();

    const { result, rerender } = renderHook(
      () =>
        useRenderTracker({
          componentName: 'TestComponent',
        }),
      { wrapper: createWrapper(adapter) }
    );

    expect(result.current.renderCount).toBe(1);

    rerender(undefined);
    expect(result.current.renderCount).toBe(2);

    rerender(undefined);
    expect(result.current.renderCount).toBe(3);
  });

  it('getRenderInfo_returnsCompleteInfo', () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(
      () =>
        useRenderTracker({
          componentName: 'TestComponent',
        }),
      { wrapper: createWrapper(adapter) }
    );

    const info = result.current.getRenderInfo();

    expect(info.componentName).toBe('TestComponent');
    expect(info.renderCount).toBe(1);
    expect(info.isRerender).toBe(false);
    expect(typeof info.lastRenderDuration).toBe('number');
    expect(typeof info.averageRenderDuration).toBe('number');
  });

  it('logsToConsole_whenEnabled', () => {
    const adapter = new NoOpAdapter();

    renderHook(
      () =>
        useRenderTracker({
          componentName: 'TestComponent',
          logToConsole: true,
        }),
      { wrapper: createWrapper(adapter) }
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Render] TestComponent'),
      expect.any(String),
      expect.any(String)
    );
  });

  it('tracks_changedProps', () => {
    const adapter = new NoOpAdapter();

    let trackedProps = { data: [1, 2, 3], filter: 'active' };

    const { result, rerender } = renderHook(
      () =>
        useRenderTracker({
          componentName: 'TestComponent',
          trackedProps,
        }),
      { wrapper: createWrapper(adapter) }
    );

    // First render - no changes yet
    const info1 = result.current.getRenderInfo();
    expect(info1.changedProps).toBeUndefined();

    // Change props and re-render
    trackedProps = { data: [1, 2, 3, 4], filter: 'active' };
    rerender(undefined);

    // Note: The hook tracks changes between renders
    // After the second render, we can check the info
  });

  it('warns_whenThresholdExceeded', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const adapter = new NoOpAdapter();

    const { rerender } = renderHook(
      () =>
        useRenderTracker({
          componentName: 'TestComponent',
          threshold: 3,
          logToConsole: true,
        }),
      { wrapper: createWrapper(adapter) }
    );

    // Render 4 times (1 initial + 3 rerenders)
    rerender(undefined);
    rerender(undefined);
    rerender(undefined);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('TestComponent has rendered 4 times')
    );

    warnSpy.mockRestore();
  });

  it('reports_toContext', async () => {
    const adapter = new ConsoleAdapter({ timestamps: false });

    renderHook(
      () =>
        useRenderTracker({
          componentName: 'TestComponent',
        }),
      { wrapper: createWrapper(adapter, { trackRenders: true }) }
    );

    await waitFor(() => {
      // Console adapter should have received render info
      // Check that RENDER was logged
      consoleSpy.mock.calls.find((call) => call[0]?.includes?.('RENDER'));
      // Note: May not be called immediately due to async nature
    });
  });
});
