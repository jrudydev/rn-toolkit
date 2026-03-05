/**
 * AnalyticsProvider Tests
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AnalyticsProvider } from '../src/AnalyticsProvider';
import { useAnalytics } from '../src/hooks/useAnalytics';
import { NoOpAdapter } from '../src/adapters/NoOpAdapter';
import type { AnalyticsAdapter, AnalyticsConfig } from '../src/types';

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

function createWrapper(adapter: AnalyticsAdapter, config?: AnalyticsConfig) {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <AnalyticsProvider adapter={adapter} config={config}>
        {children}
      </AnalyticsProvider>
    );
  };
}

describe('AnalyticsProvider', () => {
  it('initializes_adapter_onMount', async () => {
    const mockAdapter = createMockAdapter();

    renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    await waitFor(() => {
      expect(mockAdapter.calls.initialize).toHaveLength(1);
    });
  });

  it('provides_isInitialized_state', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });
  });

  it('provides_adapterName', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    expect(result.current.adapterName).toBe('mock');
  });

  it('logEvent_callsAdapter', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await act(async () => {
      await result.current.logEvent('test_event', { key: 'value' });
    });

    expect(mockAdapter.calls.logEvent).toHaveLength(1);
    expect(mockAdapter.calls.logEvent[0]).toEqual(['test_event', { key: 'value' }]);
  });

  it('logScreenView_callsAdapter', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await act(async () => {
      await result.current.logScreenView('HomeScreen', 'HomeClass');
    });

    expect(mockAdapter.calls.logScreenView).toHaveLength(1);
    expect(mockAdapter.calls.logScreenView[0]).toEqual(['HomeScreen', 'HomeClass']);
  });

  it('setUserId_callsAdapter', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    await act(async () => {
      await result.current.setUserId('user123');
    });

    expect(mockAdapter.calls.setUserId).toHaveLength(1);
    expect(mockAdapter.calls.setUserId[0]).toEqual(['user123']);
  });

  it('setEnabled_disables_eventLogging', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    await act(async () => {
      await result.current.setEnabled(false);
    });

    expect(result.current.isEnabled).toBe(false);

    // Events should not be logged when disabled
    await act(async () => {
      await result.current.logEvent('test_event', {});
    });

    // logEvent should not have been called (only setAnalyticsCollectionEnabled)
    expect(mockAdapter.calls.logEvent).toBeUndefined();
  });

  it('reset_callsAdapter', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    await act(async () => {
      await result.current.reset();
    });

    expect(mockAdapter.calls.resetAnalyticsData).toHaveLength(1);
  });

  it('merges_defaultParams_withEventParams', async () => {
    const mockAdapter = createMockAdapter();
    const config: AnalyticsConfig = {
      defaultParams: { app_version: '1.0.0', platform: 'ios' },
    };

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter, config),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await act(async () => {
      await result.current.logEvent('test_event', { custom: 'param' });
    });

    expect(mockAdapter.calls.logEvent[0]).toEqual([
      'test_event',
      { app_version: '1.0.0', platform: 'ios', custom: 'param' },
    ]);
  });

  it('logPurchase_callsAdapter_withCorrectParams', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    const items = [{ itemId: 'item1', itemName: 'Product', price: 10, quantity: 1 }];

    await act(async () => {
      await result.current.logPurchase(10, 'USD', items, 'txn123');
    });

    expect(mockAdapter.calls.logPurchase).toHaveLength(1);
    expect(mockAdapter.calls.logPurchase[0]).toEqual([10, 'USD', items, 'txn123']);
  });

  it('logLogin_callsAdapter', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await act(async () => {
      await result.current.logLogin('google');
    });

    expect(mockAdapter.calls.logLogin).toHaveLength(1);
    expect(mockAdapter.calls.logLogin[0]).toEqual(['google']);
  });

  it('logSignUp_callsAdapter', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await act(async () => {
      await result.current.logSignUp('email');
    });

    expect(mockAdapter.calls.logSignUp).toHaveLength(1);
    expect(mockAdapter.calls.logSignUp[0]).toEqual(['email']);
  });

  it('logSearch_callsAdapter', async () => {
    const mockAdapter = createMockAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(mockAdapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await act(async () => {
      await result.current.logSearch('test query');
    });

    expect(mockAdapter.calls.logSearch).toHaveLength(1);
    expect(mockAdapter.calls.logSearch[0]).toEqual(['test query']);
  });
});

describe('AnalyticsProvider with NoOpAdapter', () => {
  it('works_withNoOpAdapter', async () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    // Should not throw
    await act(async () => {
      await result.current.logEvent('test', {});
      await result.current.logScreenView('Test');
      await result.current.setUserId('user1');
    });

    expect(result.current.adapterName).toBe('noop');
  });
});
