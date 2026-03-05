/**
 * Deep Link Hooks Tests
 */

import React, { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ThemeProvider } from '@rn-toolkit/theming';
import { DeepLinkProvider } from '../src/DeepLinkProvider';
import { useDeepLink } from '../src/hooks/useDeepLink';
import { useRoute } from '../src/hooks/useRoute';
import { useBadgeCount, useAllBadges } from '../src/hooks/useBadgeCount';
import { useNavigationState } from '../src/hooks/useNavigationState';
import type { RouteDefinition, RouteBadge } from '../src/types';

// Test routes
const routes: Record<string, RouteDefinition> = {
  home: { path: '/', name: 'Home' },
  profile: { path: '/profile/:id', name: 'Profile' },
  settings: { path: '/settings', name: 'Settings' },
  notifications: { path: '/notifications', name: 'Notifications' },
};

// Mock badges
const mockBadges: RouteBadge[] = [
  { routeId: 'notifications', count: 5 },
  { routeId: 'messages', count: 100 },
];

// Wrapper with providers
function createWrapper(
  options: {
    routes?: Record<string, RouteDefinition>;
    initialRoute?: string;
    fetchBadges?: () => Promise<RouteBadge[]>;
  } = {}
) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider>
        <DeepLinkProvider
          routes={options.routes ?? routes}
          initialRoute={options.initialRoute}
          badgeConfig={
            options.fetchBadges
              ? { fetchBadges: options.fetchBadges }
              : undefined
          }
        >
          {children}
        </DeepLinkProvider>
      </ThemeProvider>
    );
  };
}

describe('useDeepLink', () => {
  it('provides_navigate_function', () => {
    const { result } = renderHook(() => useDeepLink(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.navigate).toBe('function');
  });

  it('provides_goBack_function', () => {
    const { result } = renderHook(() => useDeepLink(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.goBack).toBe('function');
  });

  it('provides_reset_function', () => {
    const { result } = renderHook(() => useDeepLink(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.reset).toBe('function');
  });

  it('provides_registry', () => {
    const { result } = renderHook(() => useDeepLink(), {
      wrapper: createWrapper(),
    });

    expect(result.current.registry).toBeDefined();
    expect(result.current.registry.has('home')).toBe(true);
  });

  it('tracks_currentRoute', async () => {
    const { result } = renderHook(() => useDeepLink(), {
      wrapper: createWrapper({ initialRoute: 'home' }),
    });

    // Wait for initial route to be set
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.currentRoute?.name).toBe('Home');
  });

  it('navigates_byRouteId', async () => {
    const { result } = renderHook(() => useDeepLink(), {
      wrapper: createWrapper({ initialRoute: 'home' }),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.navigate('profile', { id: '123' });
    });

    expect(result.current.currentRoute?.name).toBe('Profile');
    expect(result.current.currentRoute?.params.id).toBe('123');
  });

  it('navigates_byPath', async () => {
    const { result } = renderHook(() => useDeepLink(), {
      wrapper: createWrapper({ initialRoute: 'home' }),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.navigate('/settings');
    });

    expect(result.current.currentRoute?.name).toBe('Settings');
  });

  it('tracks_canGoBack', async () => {
    const { result } = renderHook(() => useDeepLink(), {
      wrapper: createWrapper({ initialRoute: 'home' }),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.canGoBack).toBe(false);

    act(() => {
      result.current.navigate('profile', { id: '123' });
    });

    expect(result.current.canGoBack).toBe(true);
  });
});

describe('useRoute', () => {
  it('returns_routeInfo', async () => {
    const { result } = renderHook(() => useRoute(), {
      wrapper: createWrapper({ initialRoute: 'home' }),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.name).toBe('Home');
    expect(result.current.path).toBe('/');
    expect(result.current.isActive).toBe(true);
  });

  it('returns_typedParams', async () => {
    interface ProfileParams {
      id: string;
    }

    const { result } = renderHook(
      () => {
        const deepLink = useDeepLink();
        const route = useRoute<ProfileParams>();
        return { deepLink, route };
      },
      { wrapper: createWrapper({ initialRoute: 'home' }) }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.deepLink.navigate('profile', { id: '456' });
    });

    expect(result.current.route.params.id).toBe('456');
  });

  it('provides_isRouteActive_check', async () => {
    const { result } = renderHook(() => useRoute(), {
      wrapper: createWrapper({ initialRoute: 'home' }),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isRouteActive('home')).toBe(true);
    expect(result.current.isRouteActive('profile')).toBe(false);
  });
});

describe('useBadgeCount', () => {
  it('returns_badgeCount', async () => {
    const { result } = renderHook(() => useBadgeCount('notifications'), {
      wrapper: createWrapper({
        fetchBadges: async () => mockBadges,
      }),
    });

    // Wait for badges to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.count).toBe(5);
  });

  it('returns_hasBadge', async () => {
    const { result } = renderHook(() => useBadgeCount('notifications'), {
      wrapper: createWrapper({
        fetchBadges: async () => mockBadges,
      }),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.hasBadge).toBe(true);
  });

  it('formats_largeCount', async () => {
    const { result } = renderHook(() => useBadgeCount('messages', 99), {
      wrapper: createWrapper({
        fetchBadges: async () => mockBadges,
      }),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.formattedCount).toBe('99+');
  });

  it('returns_zero_whenNoBadge', () => {
    const { result } = renderHook(() => useBadgeCount('unknown'), {
      wrapper: createWrapper(),
    });

    expect(result.current.count).toBe(0);
    expect(result.current.hasBadge).toBe(false);
  });
});

describe('useAllBadges', () => {
  it('returns_allBadges', async () => {
    const { result } = renderHook(() => useAllBadges(), {
      wrapper: createWrapper({
        fetchBadges: async () => mockBadges,
      }),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.badges.get('notifications')).toBe(5);
    expect(result.current.badges.get('messages')).toBe(100);
  });

  it('calculates_totalCount', async () => {
    const { result } = renderHook(() => useAllBadges(), {
      wrapper: createWrapper({
        fetchBadges: async () => mockBadges,
      }),
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.totalCount).toBe(105);
  });

  it('provides_refresh_function', () => {
    const { result } = renderHook(() => useAllBadges(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.refresh).toBe('function');
  });
});

describe('useNavigationState', () => {
  it('returns_defaultState', () => {
    const defaultState = { filter: 'all' };

    const { result } = renderHook(() => useNavigationState(defaultState), {
      wrapper: createWrapper({ initialRoute: 'home' }),
    });

    expect(result.current.state).toEqual(defaultState);
  });

  it('provides_setState', async () => {
    const { result } = renderHook(
      () => {
        const deepLink = useDeepLink();
        const navState = useNavigationState<{ count: number }>({ count: 0 });
        return { deepLink, navState };
      },
      { wrapper: createWrapper({ initialRoute: 'home' }) }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.navState.setState({ count: 42 });
    });

    expect(result.current.navState.state?.count).toBe(42);
  });

  it('supports_functionUpdates', async () => {
    const { result } = renderHook(
      () => {
        const deepLink = useDeepLink();
        const navState = useNavigationState<{ count: number }>({ count: 0 });
        return { deepLink, navState };
      },
      { wrapper: createWrapper({ initialRoute: 'home' }) }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.navState.setState((prev) => ({
        count: (prev?.count ?? 0) + 1,
      }));
    });

    expect(result.current.navState.state?.count).toBe(1);
  });

  it('provides_clearState', async () => {
    const { result } = renderHook(
      () => {
        const deepLink = useDeepLink();
        const navState = useNavigationState<{ data: string }>({ data: 'test' });
        return { deepLink, navState };
      },
      { wrapper: createWrapper({ initialRoute: 'home' }) }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.navState.clearState();
    });

    // After clearing, should return default
    expect(result.current.navState.state).toEqual({ data: 'test' });
  });

  it('tracks_hasState', () => {
    const { result } = renderHook(() => useNavigationState(undefined), {
      wrapper: createWrapper({ initialRoute: 'home' }),
    });

    expect(result.current.hasState).toBe(false);
  });
});
