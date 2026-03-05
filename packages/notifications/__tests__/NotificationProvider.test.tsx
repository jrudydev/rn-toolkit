/**
 * NotificationProvider Tests
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { NotificationProvider } from '../src/NotificationProvider';
import { useNotifications } from '../src/hooks/useNotifications';
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
  config?: NotificationConfig;
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

describe('NotificationProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('initializes_withFirebaseMessaging_andSetsPermission', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.permission?.status).toBe('granted');
      expect(result.current.hasPermission).toBe(true);
    });

    it('fetchesToken_whenPermissionGranted', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.token).toBe('mock-fcm-token');
      expect(mockMessaging.getToken).toHaveBeenCalled();
    });

    it('requestsPermission_whenConfigured', async () => {
      mockMessaging.hasPermission.mockResolvedValueOnce(-1); // not_determined

      renderHook(() => useNotifications(), {
        wrapper: createWrapper({ requestPermissionOnInit: true }),
      });

      await waitFor(() => {
        expect(mockMessaging.requestPermission).toHaveBeenCalled();
      });
    });

    it('subscribesToTopics_whenConfigured', async () => {
      renderHook(() => useNotifications(), {
        wrapper: createWrapper({ autoSubscribeTopics: ['news', 'updates'] }),
      });

      await waitFor(() => {
        expect(mockMessaging.subscribeToTopic).toHaveBeenCalledWith('news');
        expect(mockMessaging.subscribeToTopic).toHaveBeenCalledWith('updates');
      });
    });
  });

  describe('requestPermission', () => {
    it('requestsPermission_andReturnsStatus', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        const permission = await result.current.requestPermission();
        expect(permission.status).toBe('granted');
      });
    });

    it('handlesDenied_permissionGracefully', async () => {
      mockMessaging.requestPermission.mockResolvedValueOnce(0); // denied

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        const permission = await result.current.requestPermission();
        expect(permission.status).toBe('denied');
      });
    });
  });

  describe('getToken', () => {
    it('fetchesAndReturns_fcmToken', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        const token = await result.current.getToken();
        expect(token).toBe('mock-fcm-token');
      });
    });

    it('callsOnTokenReceived_handler', async () => {
      const onTokenReceived = jest.fn();

      renderHook(() => useNotifications(), {
        wrapper: createWrapper({ onTokenReceived }),
      });

      await waitFor(() => {
        expect(onTokenReceived).toHaveBeenCalledWith('mock-fcm-token');
      });
    });
  });

  describe('topics', () => {
    it('subscribesToTopic_successfully', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.subscribeToTopic('promo');
      });

      expect(mockMessaging.subscribeToTopic).toHaveBeenCalledWith('promo');
      expect(result.current.getTopics()).toContain('promo');
    });

    it('unsubscribesFromTopic_successfully', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper({ autoSubscribeTopics: ['news'] }),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.unsubscribeFromTopic('news');
      });

      expect(mockMessaging.unsubscribeFromTopic).toHaveBeenCalledWith('news');
      expect(result.current.getTopics()).not.toContain('news');
    });

    it('tracksSubscribedTopics', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.subscribeToTopic('topic1');
        await result.current.subscribeToTopic('topic2');
      });

      const topics = result.current.getTopics();
      expect(topics).toContain('topic1');
      expect(topics).toContain('topic2');
    });
  });

  describe('message handlers', () => {
    it('registersOnMessage_handler', async () => {
      const onForegroundMessage = jest.fn();

      renderHook(() => useNotifications(), {
        wrapper: createWrapper({
          handlers: { onForegroundMessage },
        }),
      });

      await waitFor(() => {
        expect(mockMessaging.onMessage).toHaveBeenCalled();
      });
    });

    it('registersOnNotificationOpenedApp_handler', async () => {
      const onNotificationOpened = jest.fn();

      renderHook(() => useNotifications(), {
        wrapper: createWrapper({
          handlers: { onNotificationOpened },
        }),
      });

      await waitFor(() => {
        expect(mockMessaging.onNotificationOpenedApp).toHaveBeenCalled();
      });
    });

    it('registersOnTokenRefresh_handler', async () => {
      renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockMessaging.onTokenRefresh).toHaveBeenCalled();
      });
    });
  });

  describe('initial notification', () => {
    it('handlesInitialNotification_whenAppOpenedFromNotification', async () => {
      const mockInitialNotification = {
        messageId: 'msg-123',
        notification: {
          title: 'Welcome',
          body: 'Welcome back!',
        },
        data: { screen: 'home' },
      };
      mockMessaging.getInitialNotification.mockResolvedValueOnce(mockInitialNotification);

      const onNotificationOpenedApp = jest.fn();

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper({
          handlers: { onNotificationOpenedApp },
        }),
      });

      await waitFor(() => {
        expect(result.current.initialNotification).not.toBeNull();
      });

      expect(result.current.initialNotification?.messageId).toBe('msg-123');
      expect(result.current.initialNotification?.title).toBe('Welcome');
      expect(onNotificationOpenedApp).toHaveBeenCalled();
    });
  });

  describe('permission status mapping', () => {
    it.each([
      [-1, 'not_determined'],
      [0, 'denied'],
      [1, 'granted'],
      [2, 'provisional'],
    ])('maps_authStatus_%i_to_%s', async (authStatus, expectedStatus) => {
      mockMessaging.hasPermission.mockResolvedValueOnce(authStatus);

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.permission?.status).toBe(expectedStatus);
    });
  });

  describe('without Firebase', () => {
    it('initializes_withoutFirebase_gracefully', async () => {
      const WrapperNoFirebase = ({ children }: { children: React.ReactNode }) => (
        <NotificationProvider>{children}</NotificationProvider>
      );

      // Mock require to fail
      jest.doMock('@react-native-firebase/messaging', () => {
        throw new Error('Module not found');
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: WrapperNoFirebase,
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.token).toBeNull();
      expect(result.current.permission).toBeNull();
    });
  });
});
