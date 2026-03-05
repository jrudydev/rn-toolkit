/**
 * Notification Hooks Tests
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { NotificationProvider } from '../src/NotificationProvider';
import { usePushToken } from '../src/hooks/usePushToken';
import { useTopics } from '../src/hooks/useTopics';
import { useNotificationPermission } from '../src/hooks/useNotificationPermission';
import type { NotificationConfig } from '../src/types';

// Mock Firebase messaging
const mockMessaging = {
  getToken: jest.fn().mockResolvedValue('mock-fcm-token'),
  deleteToken: jest.fn().mockResolvedValue(undefined),
  hasPermission: jest.fn().mockResolvedValue(1), // 1 = granted
  requestPermission: jest.fn().mockResolvedValue(1),
  subscribeToTopic: jest.fn().mockResolvedValue(undefined),
  unsubscribeFromTopic: jest.fn().mockResolvedValue(undefined),
  onMessage: jest.fn().mockReturnValue(() => {}),
  onNotificationOpenedApp: jest.fn().mockReturnValue(() => {}),
  getInitialNotification: jest.fn().mockResolvedValue(null),
  onTokenRefresh: jest.fn().mockReturnValue(() => {}),
};

interface WrapperProps {
  children: React.ReactNode;
}

function createWrapper(config?: NotificationConfig) {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <NotificationProvider config={config} messaging={mockMessaging}>
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
    const { result } = renderHook(() => usePushToken(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.token).toBe('mock-fcm-token');
    expect(result.current.hasToken).toBe(true);
  });

  it('refreshes_token_successfully', async () => {
    const { result } = renderHook(() => usePushToken(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockMessaging.getToken.mockResolvedValueOnce('new-token');

    await act(async () => {
      const token = await result.current.refresh();
      expect(token).toBe('new-token');
    });
  });

  it('setsError_whenRefreshFails', async () => {
    const { result } = renderHook(() => usePushToken(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockMessaging.getToken.mockRejectedValueOnce(new Error('Token error'));

    await act(async () => {
      const token = await result.current.refresh();
      expect(token).toBeNull();
    });

    expect(result.current.error?.message).toBe('Token error');
  });

  it('returnsNull_whenNoPermission', async () => {
    mockMessaging.hasPermission.mockResolvedValueOnce(0); // denied

    const { result } = renderHook(() => usePushToken(), {
      wrapper: createWrapper(),
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
    mockMessaging.hasPermission.mockResolvedValue(1); // Reset to granted
  });

  it('subscribes_toTopic_successfully', async () => {
    const { result } = renderHook(() => useTopics(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.subscribe('news');
    });

    expect(mockMessaging.subscribeToTopic).toHaveBeenCalledWith('news');
    expect(result.current.isSubscribed('news')).toBe(true);
    expect(result.current.topics).toContain('news');
  });

  it('unsubscribes_fromTopic_successfully', async () => {
    const { result } = renderHook(() => useTopics(), {
      wrapper: createWrapper({ autoSubscribeTopics: ['updates'] }),
    });

    await waitFor(() => {
      expect(result.current.isSubscribed('updates')).toBe(true);
    });

    await act(async () => {
      await result.current.unsubscribe('updates');
    });

    expect(mockMessaging.unsubscribeFromTopic).toHaveBeenCalledWith('updates');
    expect(result.current.isSubscribed('updates')).toBe(false);
  });

  it('setsError_whenSubscribeFails', async () => {
    mockMessaging.subscribeToTopic.mockRejectedValueOnce(new Error('Subscribe error'));

    const { result } = renderHook(() => useTopics(), {
      wrapper: createWrapper(),
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
    mockMessaging.hasPermission.mockResolvedValueOnce(0); // denied

    const { result } = renderHook(() => useTopics(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.subscribe('news');
    });

    expect(mockMessaging.subscribeToTopic).not.toHaveBeenCalled();
    expect(result.current.error?.message).toBe('Notification permission not granted');
  });

  it('tracksLoadingState', async () => {
    let resolveSubscribe: () => void;
    mockMessaging.subscribeToTopic.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveSubscribe = resolve;
        })
    );

    const { result } = renderHook(() => useTopics(), {
      wrapper: createWrapper(),
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
    mockMessaging.hasPermission.mockResolvedValue(1);
  });

  it('returnsPermission_status', async () => {
    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(),
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
    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      const permission = await result.current.request();
      expect(permission.status).toBe('granted');
    });

    expect(mockMessaging.requestPermission).toHaveBeenCalled();
  });

  it('handlesRequestError', async () => {
    mockMessaging.requestPermission.mockRejectedValueOnce(new Error('Permission error'));

    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(),
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
    mockMessaging.hasPermission.mockResolvedValueOnce(0); // denied

    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isDenied).toBe(true);
    expect(result.current.isGranted).toBe(false);
    expect(result.current.hasPermission).toBe(false);
  });

  it('detectsProvisional_status', async () => {
    mockMessaging.hasPermission.mockResolvedValueOnce(2); // provisional

    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isProvisional).toBe(true);
    expect(result.current.hasPermission).toBe(true); // provisional counts as having permission
  });

  it('detectsNotDetermined_status', async () => {
    mockMessaging.hasPermission.mockResolvedValueOnce(-1); // not_determined

    const { result } = renderHook(() => useNotificationPermission(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isNotDetermined).toBe(true);
    expect(result.current.hasPermission).toBe(false);
  });
});
