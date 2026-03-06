/**
 * Notification Hooks Tests
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { NotificationProvider } from '../src/NotificationProvider';
import { usePushToken } from '../src/hooks/usePushToken';
import { useTopics } from '../src/hooks/useTopics';
import { useNotificationPermission } from '../src/hooks/useNotificationPermission';
import { NoOpAdapter } from '../src/adapters/NoOpAdapter';
import type { NotificationAdapter } from '../src/adapters/types';
import type { NotificationConfig, NotificationPermission } from '../src/types';

interface WrapperProps {
  children: React.ReactNode;
}

function createWrapper(adapter: NotificationAdapter, config?: NotificationConfig) {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <NotificationProvider adapter={adapter} config={config}>
        {children}
      </NotificationProvider>
    );
  };
}

describe('usePushToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returnsToken_whenInitialized', async () => {
    const adapter = new NoOpAdapter({ initialPermission: 'granted', mockToken: 'mock-fcm-token' });
    const { result } = renderHook(() => usePushToken(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.token).toBe('mock-fcm-token');
    expect(result.current.hasToken).toBe(true);
  });

  it('refreshes_token_successfully', async () => {
    const adapter = new NoOpAdapter({ initialPermission: 'granted', mockToken: 'initial-token' });
    const { result } = renderHook(() => usePushToken(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      const token = await result.current.refresh();
      expect(token).toBe('initial-token');
    });
  });

  it('setsError_whenRefreshFails', async () => {
    // Create adapter that throws on getToken
    const errorAdapter: NotificationAdapter = {
      name: 'error-adapter',
      async initialize() {},
      async getPermissionStatus(): Promise<NotificationPermission> {
        return { status: 'granted', alert: true, badge: true, sound: true };
      },
      async requestPermission(): Promise<NotificationPermission> {
        return { status: 'granted', alert: true, badge: true, sound: true };
      },
      async getToken() {
        throw new Error('Token error');
      },
      async deleteToken() {},
      onTokenRefresh() { return () => {}; },
      async subscribeToTopic() {},
      async unsubscribeFromTopic() {},
      onForegroundMessage() { return () => {}; },
      onNotificationOpened() { return () => {}; },
      async getInitialNotification() { return null; },
      async scheduleNotification(n) { return n.id; },
      async cancelNotification() {},
      async cancelAllNotifications() {},
      async getBadgeCount() { return 0; },
      async setBadgeCount() {},
    };

    const { result } = renderHook(() => usePushToken(), {
      wrapper: createWrapper(errorAdapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      const token = await result.current.refresh();
      expect(token).toBeNull();
    });

    expect(result.current.error?.message).toBe('Token error');
  });

  it('returnsNull_whenNoPermission', async () => {
    const adapter = new NoOpAdapter({ initialPermission: 'denied' });
    const { result } = renderHook(() => usePushToken(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      const token = await result.current.refresh();
      expect(token).toBeNull();
    });

    expect(result.current.error?.message).toBe('Notification permission not granted');
  });
});

describe('useTopics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('subscribes_toTopic_successfully', async () => {
    const adapter = new NoOpAdapter({ initialPermission: 'granted' });
    const { result } = renderHook(() => useTopics(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.subscribe('news');
    });

    expect(result.current.isSubscribed('news')).toBe(true);
    expect(result.current.topics).toContain('news');
  });

  it('unsubscribes_fromTopic_successfully', async () => {
    const adapter = new NoOpAdapter({ initialPermission: 'granted' });
    const { result } = renderHook(() => useTopics(), {
      wrapper: createWrapper(adapter, { autoSubscribeTopics: ['updates'] }),
    });

    await waitFor(() => {
      expect(result.current.isSubscribed('updates')).toBe(true);
    });

    await act(async () => {
      await result.current.unsubscribe('updates');
    });

    expect(result.current.isSubscribed('updates')).toBe(false);
  });

  it('setsError_whenSubscribeFails', async () => {
    // Create adapter that throws on subscribe
    const errorAdapter: NotificationAdapter = {
      name: 'error-adapter',
      async initialize() {},
      async getPermissionStatus(): Promise<NotificationPermission> {
        return { status: 'granted', alert: true, badge: true, sound: true };
      },
      async requestPermission(): Promise<NotificationPermission> {
        return { status: 'granted', alert: true, badge: true, sound: true };
      },
      async getToken() { return 'token'; },
      async deleteToken() {},
      onTokenRefresh() { return () => {}; },
      async subscribeToTopic() {
        throw new Error('Subscribe error');
      },
      async unsubscribeFromTopic() {},
      onForegroundMessage() { return () => {}; },
      onNotificationOpened() { return () => {}; },
      async getInitialNotification() { return null; },
      async scheduleNotification(n) { return n.id; },
      async cancelNotification() {},
      async cancelAllNotifications() {},
      async getBadgeCount() { return 0; },
      async setBadgeCount() {},
    };

    const { result } = renderHook(() => useTopics(), {
      wrapper: createWrapper(errorAdapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.subscribe('bad-topic');
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error?.message).toBe('Subscribe error');
  });

  it('requiresPermission_toSubscribe', async () => {
    const adapter = new NoOpAdapter({ initialPermission: 'denied' });
    const { result } = renderHook(() => useTopics(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.subscribe('news');
    });

    expect(result.current.error?.message).toBe('Notification permission not granted');
  });

  it('tracksLoadingState', async () => {
    let resolveSubscribe: () => void;

    // Create adapter with delayed subscribe
    const delayAdapter: NotificationAdapter = {
      name: 'delay-adapter',
      async initialize() {},
      async getPermissionStatus(): Promise<NotificationPermission> {
        return { status: 'granted', alert: true, badge: true, sound: true };
      },
      async requestPermission(): Promise<NotificationPermission> {
        return { status: 'granted', alert: true, badge: true, sound: true };
      },
      async getToken() { return 'token'; },
      async deleteToken() {},
      onTokenRefresh() { return () => {}; },
      async subscribeToTopic() {
        await new Promise<void>((resolve) => {
          resolveSubscribe = resolve;
        });
      },
      async unsubscribeFromTopic() {},
      onForegroundMessage() { return () => {}; },
      onNotificationOpened() { return () => {}; },
      async getInitialNotification() { return null; },
      async scheduleNotification(n) { return n.id; },
      async cancelNotification() {},
      async cancelAllNotifications() {},
      async getBadgeCount() { return 0; },
      async setBadgeCount() {},
    };

    const { result } = renderHook(() => useTopics(), {
      wrapper: createWrapper(delayAdapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.subscribe('slow-topic');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      resolveSubscribe!();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});

describe('useNotificationPermission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returnsPermission_status', async () => {
    const adapter = new NoOpAdapter({ initialPermission: 'granted' });
    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.permission?.status).toBe('granted');
    expect(result.current.hasPermission).toBe(true);
    expect(result.current.isGranted).toBe(true);
    expect(result.current.isDenied).toBe(false);
  });

  it('requests_permission_successfully', async () => {
    const adapter = new NoOpAdapter({ initialPermission: 'not_determined' });
    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      const permission = await result.current.request();
      expect(permission.status).toBe('granted');
    });
  });

  it('handlesRequestError', async () => {
    // Create adapter that throws on requestPermission
    const errorAdapter: NotificationAdapter = {
      name: 'error-adapter',
      async initialize() {},
      async getPermissionStatus(): Promise<NotificationPermission> {
        return { status: 'not_determined', alert: false, badge: false, sound: false };
      },
      async requestPermission(): Promise<NotificationPermission> {
        throw new Error('Permission error');
      },
      async getToken() { return null; },
      async deleteToken() {},
      onTokenRefresh() { return () => {}; },
      async subscribeToTopic() {},
      async unsubscribeFromTopic() {},
      onForegroundMessage() { return () => {}; },
      onNotificationOpened() { return () => {}; },
      async getInitialNotification() { return null; },
      async scheduleNotification(n) { return n.id; },
      async cancelNotification() {},
      async cancelAllNotifications() {},
      async getBadgeCount() { return 0; },
      async setBadgeCount() {},
    };

    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(errorAdapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.request();
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error?.message).toBe('Permission error');
  });

  it('detectsDenied_status', async () => {
    const adapter = new NoOpAdapter({ initialPermission: 'denied' });
    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isDenied).toBe(true);
    expect(result.current.isGranted).toBe(false);
    expect(result.current.hasPermission).toBe(false);
  });

  it('detectsProvisional_status', async () => {
    const adapter = new NoOpAdapter({ initialPermission: 'provisional' });
    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isProvisional).toBe(true);
    expect(result.current.hasPermission).toBe(true); // provisional counts as having permission
  });

  it('detectsNotDetermined_status', async () => {
    const adapter = new NoOpAdapter({ initialPermission: 'not_determined' });
    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isNotDetermined).toBe(true);
    expect(result.current.hasPermission).toBe(false);
  });
});
