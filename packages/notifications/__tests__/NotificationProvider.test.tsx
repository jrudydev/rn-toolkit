/**
 * NotificationProvider Tests
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { NotificationProvider } from '../src/NotificationProvider';
import { useNotifications } from '../src/hooks/useNotifications';
import { NoOpAdapter } from '../src/adapters/NoOpAdapter';
import { ConsoleAdapter } from '../src/adapters/ConsoleAdapter';
import type { NotificationConfig } from '../src/types';
import type { NotificationAdapter } from '../src/adapters/types';

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

describe('NotificationProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('initializes_andSetsPermission', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.permission?.status).toBe('granted');
      expect(result.current.hasPermission).toBe(true);
    });

    it('fetchesToken_whenPermissionGranted', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // NoOpAdapter generates a mock token when permission is granted
      expect(result.current.token).toBeTruthy();
    });

    it('requestsPermission_whenConfigured', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'not_determined' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter, { requestPermissionOnInit: true }),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Should have requested and received permission
      expect(result.current.permission?.status).toBe('granted');
    });

    it('subscribesToTopics_whenConfigured', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter, { autoSubscribeTopics: ['news', 'updates'] }),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      const topics = result.current.getTopics();
      expect(topics).toContain('news');
      expect(topics).toContain('updates');
    });
  });

  describe('requestPermission', () => {
    it('requestsPermission_andReturnsStatus', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'not_determined' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        const permission = await result.current.requestPermission();
        expect(permission.status).toBe('granted');
      });
    });
  });

  describe('getToken', () => {
    it('fetchesAndReturns_token', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted', mockToken: 'test-token' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        const token = await result.current.getToken();
        expect(token).toBe('test-token');
      });
    });

    it('callsOnTokenReceived_handler', async () => {
      const onTokenReceived = jest.fn();
      const adapter = new NoOpAdapter({ initialPermission: 'granted', mockToken: 'test-token' });

      renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter, { onTokenReceived }),
      });

      await waitFor(() => {
        expect(onTokenReceived).toHaveBeenCalledWith('test-token');
      });
    });
  });

  describe('topics', () => {
    it('subscribesToTopic_successfully', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.subscribeToTopic('promo');
      });

      expect(result.current.getTopics()).toContain('promo');
    });

    it('unsubscribesFromTopic_successfully', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter, { autoSubscribeTopics: ['news'] }),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.unsubscribeFromTopic('news');
      });

      expect(result.current.getTopics()).not.toContain('news');
    });

    it('tracksSubscribedTopics', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
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

  describe('local notifications', () => {
    it('schedulesNotification', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        const id = await result.current.scheduleNotification({
          id: 'test-notif',
          title: 'Test',
          body: 'Test body',
        });
        expect(id).toBe('test-notif');
      });
    });

    it('cancelsNotification', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.scheduleNotification({
          id: 'test-notif',
          title: 'Test',
          body: 'Test body',
        });
        await result.current.cancelNotification('test-notif');
      });

      // Verify through adapter
      expect(adapter.getScheduledNotifications()).toHaveLength(0);
    });
  });

  describe('badge', () => {
    it('setsAndGetsBadgeCount', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.setBadgeCount(5);
        const count = await result.current.getBadgeCount();
        expect(count).toBe(5);
      });
    });

    it('clearsBadge', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      await act(async () => {
        await result.current.setBadgeCount(5);
        await result.current.clearBadge();
        const count = await result.current.getBadgeCount();
        expect(count).toBe(0);
      });
    });
  });

  describe('adapter pattern', () => {
    it('works_with_NoOpAdapter', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.hasPermission).toBe(true);
    });

    it('works_with_ConsoleAdapter', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const adapter = new ConsoleAdapter({ prefix: '[Test]', initialPermission: 'granted' });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Console adapter should have logged
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Test] INIT'),
        expect.anything()
      );

      consoleSpy.mockRestore();
    });

    it('simulates_foregroundNotification', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted' });
      const onForegroundMessage = jest.fn();

      renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter, { handlers: { onForegroundMessage } }),
      });

      // Wait for initialization
      await waitFor(() => {
        // Give time for listeners to be set up
      });

      // Simulate notification
      adapter.simulateForegroundNotification({
        messageId: 'msg-1',
        title: 'Test',
        body: 'Test body',
      });

      expect(onForegroundMessage).toHaveBeenCalledWith(
        expect.objectContaining({ messageId: 'msg-1' })
      );
    });

    it('simulates_tokenRefresh', async () => {
      const adapter = new NoOpAdapter({ initialPermission: 'granted', mockToken: 'old-token' });
      const onTokenRefresh = jest.fn();

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(adapter, { handlers: { onTokenRefresh } }),
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Simulate token refresh
      adapter.simulateTokenRefresh('new-token');

      await waitFor(() => {
        expect(result.current.token).toBe('new-token');
      });

      expect(onTokenRefresh).toHaveBeenCalledWith('new-token');
    });
  });
});
