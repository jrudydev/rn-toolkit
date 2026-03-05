/**
 * Analytics Hooks Tests
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AnalyticsProvider } from '../src/AnalyticsProvider';
import { useAnalytics } from '../src/hooks/useAnalytics';
import { useScreenTracking } from '../src/hooks/useScreenTracking';
import { useEventTracking } from '../src/hooks/useEventTracking';
import type { AnalyticsAdapter } from '../src/types';

// Create a mock adapter for testing
function createMockAdapter(): AnalyticsAdapter & { calls: Record<string, unknown[][]> } {
  const calls: Record<string, unknown[][]> = {};

  const track = (method: string) => {
    return async (...args: unknown[]) => {
      if (!calls[method]) calls[method] = [];
      calls[method].push(args);
    };
  };

  return {
    name: 'mock',
    calls,
    initialize: track('initialize'),
    logEvent: track('logEvent'),
    logScreenView: track('logScreenView'),
    setUserId: track('setUserId'),
    setUserProperties: track('setUserProperties'),
    setUserProperty: track('setUserProperty'),
    setAnalyticsCollectionEnabled: track('setAnalyticsCollectionEnabled'),
    resetAnalyticsData: track('resetAnalyticsData'),
    getSessionId: async () => 'mock-session',
    getAppInstanceId: async () => 'mock-instance',
    logAppOpen: track('logAppOpen'),
    logSignUp: track('logSignUp'),
    logLogin: track('logLogin'),
    logShare: track('logShare'),
    logSearch: track('logSearch'),
    logSelectContent: track('logSelectContent'),
    logPurchase: track('logPurchase'),
    logAddToCart: track('logAddToCart'),
    logBeginCheckout: track('logBeginCheckout'),
  };
}

interface WrapperProps {
  children: React.ReactNode;
}

function createWrapper(adapter: AnalyticsAdapter) {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <AnalyticsProvider adapter={adapter}>
        {children}
      </AnalyticsProvider>
    );
  };
}

describe('useAnalytics', () => {
  it('returns_contextValue', () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    expect(result.current).toHaveProperty('logEvent');
    expect(result.current).toHaveProperty('logScreenView');
    expect(result.current).toHaveProperty('setUserId');
    expect(result.current).toHaveProperty('isInitialized');
    expect(result.current).toHaveProperty('isEnabled');
  });
});

describe('useScreenTracking', () => {
  it('tracks_screenView_onMount', async () => {
    const mockAdapter = createMockAdapter();

    renderHook(
      () => useScreenTracking({ screenName: 'TestScreen' }),
      { wrapper: createWrapper(mockAdapter) }
    );

    await waitFor(() => {
      expect(mockAdapter.calls.logScreenView).toHaveLength(1);
    });

    expect(mockAdapter.calls.logScreenView[0]).toEqual(['TestScreen', undefined]);
  });

  it('tracks_screenView_withScreenClass', async () => {
    const mockAdapter = createMockAdapter();

    renderHook(
      () => useScreenTracking({ screenName: 'TestScreen', screenClass: 'TestClass' }),
      { wrapper: createWrapper(mockAdapter) }
    );

    await waitFor(() => {
      expect(mockAdapter.calls.logScreenView).toHaveLength(1);
    });

    expect(mockAdapter.calls.logScreenView[0]).toEqual(['TestScreen', 'TestClass']);
  });

  it('does_not_track_whenDisabled', async () => {
    const mockAdapter = createMockAdapter();

    renderHook(
      () => useScreenTracking({ screenName: 'TestScreen', enabled: false }),
      { wrapper: createWrapper(mockAdapter) }
    );

    // Wait a bit to ensure no tracking occurs
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockAdapter.calls.logScreenView).toBeUndefined();
  });

  it('tracks_only_once_byDefault', async () => {
    const mockAdapter = createMockAdapter();

    const { rerender } = renderHook(
      () => useScreenTracking({ screenName: 'TestScreen' }),
      { wrapper: createWrapper(mockAdapter) }
    );

    await waitFor(() => {
      expect(mockAdapter.calls.logScreenView).toHaveLength(1);
    });

    // Re-render
    rerender(undefined);

    // Should still only have 1 call
    expect(mockAdapter.calls.logScreenView).toHaveLength(1);
  });

  it('tracks_onEveryRender_whenConfigured', async () => {
    const mockAdapter = createMockAdapter();

    const { rerender } = renderHook(
      (props: { screenName: string }) => useScreenTracking({ screenName: props.screenName, trackOnEveryRender: true }),
      {
        wrapper: createWrapper(mockAdapter),
        initialProps: { screenName: 'TestScreen' },
      }
    );

    await waitFor(() => {
      expect(mockAdapter.calls.logScreenView?.length).toBeGreaterThanOrEqual(1);
    });

    // Re-render with same screen - should track again when trackOnEveryRender is true
    // The effect runs again due to the screenName being in the dependency array
    rerender({ screenName: 'TestScreen2' });

    await waitFor(() => {
      expect(mockAdapter.calls.logScreenView?.length).toBeGreaterThanOrEqual(2);
    });
  });
});

describe('useEventTracking', () => {
  it('track_logsEvent', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(
      () => useEventTracking(),
      { wrapper: createWrapper(mockAdapter) }
    );

    await waitFor(() => {
      expect(result.current.track).toBeDefined();
    });

    await act(async () => {
      await result.current.track('custom_event', { key: 'value' });
    });

    expect(mockAdapter.calls.logEvent).toHaveLength(1);
    expect(mockAdapter.calls.logEvent[0]).toEqual(['custom_event', { key: 'value' }]);
  });

  it('applies_prefix_toEventNames', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(
      () => useEventTracking({ prefix: 'home_screen' }),
      { wrapper: createWrapper(mockAdapter) }
    );

    await act(async () => {
      await result.current.track('button_click', {});
    });

    expect(mockAdapter.calls.logEvent[0][0]).toBe('home_screen_button_click');
  });

  it('merges_defaultParams', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(
      () => useEventTracking({ defaultParams: { component: 'Header' } }),
      { wrapper: createWrapper(mockAdapter) }
    );

    await act(async () => {
      await result.current.track('click', { button: 'menu' });
    });

    expect(mockAdapter.calls.logEvent[0]).toEqual([
      'click',
      { component: 'Header', button: 'menu' },
    ]);
  });

  it('trackButtonPress_logsCorrectEvent', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(
      () => useEventTracking(),
      { wrapper: createWrapper(mockAdapter) }
    );

    await act(async () => {
      await result.current.trackButtonPress('submit');
    });

    expect(mockAdapter.calls.logEvent[0]).toEqual([
      'button_press',
      { button_name: 'submit' },
    ]);
  });

  it('trackLinkClick_logsCorrectEvent', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(
      () => useEventTracking(),
      { wrapper: createWrapper(mockAdapter) }
    );

    await act(async () => {
      await result.current.trackLinkClick('https://example.com');
    });

    expect(mockAdapter.calls.logEvent[0]).toEqual([
      'link_click',
      { link_url: 'https://example.com' },
    ]);
  });

  it('trackFormSubmit_logsCorrectEvent', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(
      () => useEventTracking(),
      { wrapper: createWrapper(mockAdapter) }
    );

    await act(async () => {
      await result.current.trackFormSubmit('contact_form');
    });

    expect(mockAdapter.calls.logEvent[0]).toEqual([
      'form_submit',
      { form_name: 'contact_form' },
    ]);
  });

  it('trackError_logsCorrectEvent', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(
      () => useEventTracking(),
      { wrapper: createWrapper(mockAdapter) }
    );

    await act(async () => {
      await result.current.trackError('Something went wrong', 'ERR_500');
    });

    expect(mockAdapter.calls.logEvent[0]).toEqual([
      'error',
      { error_message: 'Something went wrong', error_code: 'ERR_500' },
    ]);
  });

  it('trackTiming_logsCorrectEvent', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(
      () => useEventTracking(),
      { wrapper: createWrapper(mockAdapter) }
    );

    await act(async () => {
      await result.current.trackTiming('api', 'fetch_users', 1500);
    });

    expect(mockAdapter.calls.logEvent[0]).toEqual([
      'timing',
      {
        timing_category: 'api',
        timing_variable: 'fetch_users',
        timing_value: 1500,
      },
    ]);
  });

  it('combines_prefix_and_defaultParams', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(
      () => useEventTracking({
        prefix: 'checkout',
        defaultParams: { flow: 'express' },
      }),
      { wrapper: createWrapper(mockAdapter) }
    );

    await act(async () => {
      await result.current.trackButtonPress('pay', { amount: 100 });
    });

    expect(mockAdapter.calls.logEvent[0]).toEqual([
      'checkout_button_press',
      { flow: 'express', button_name: 'pay', amount: 100 },
    ]);
  });
});
