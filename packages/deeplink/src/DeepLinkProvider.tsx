/**
 * Deep Link Provider
 *
 * Provides deep linking context to the component tree.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Linking } from 'react-native';
import { DeepLinkContext } from './DeepLinkContext';
import { HistoryStack } from './HistoryStack';
import { createRouteRegistry } from './RouteRegistry';
import type {
  BadgeConfig,
  DeepLinkConfig,
  DeepLinkContextValue,
  HistoryEntry,
  NavigateOptions,
  ParsedRoute,
  RouteBadge,
  RouteDefinition,
  RouteParams,
  RouteRegistry,
} from './types';

/**
 * DeepLinkProvider props
 */
export interface DeepLinkProviderProps {
  /** Child components */
  children: ReactNode;
  /** Deep link configuration */
  config?: DeepLinkConfig;
  /** Route definitions to register */
  routes?: Record<string, RouteDefinition>;
  /** Initial route (if no deep link) */
  initialRoute?: string;
  /** Badge configuration */
  badgeConfig?: BadgeConfig;
}

/**
 * DeepLinkProvider component
 *
 * Provides deep linking and navigation context to the component tree.
 *
 * @example
 * ```tsx
 * import { DeepLinkProvider, useDeepLink } from '@rn-toolkit/deeplink';
 *
 * const routes = {
 *   home: { path: '/', name: 'Home' },
 *   profile: { path: '/profile/:id', name: 'Profile' },
 *   settings: { path: '/settings', name: 'Settings' },
 * };
 *
 * function App() {
 *   return (
 *     <DeepLinkProvider
 *       routes={routes}
 *       initialRoute="home"
 *       config={{ schemes: ['myapp'] }}
 *     >
 *       <Navigator />
 *     </DeepLinkProvider>
 *   );
 * }
 * ```
 */
export function DeepLinkProvider({
  children,
  config = { schemes: [] },
  routes = {},
  initialRoute,
  badgeConfig,
}: DeepLinkProviderProps) {
  // Create route registry
  const registry = useMemo(() => {
    const reg = createRouteRegistry();
    // Register provided routes
    for (const [id, definition] of Object.entries(routes)) {
      reg.register(id, definition);
    }
    return reg;
  }, [routes]);

  // Create history stack
  const historyRef = useRef(
    new HistoryStack({
      maxSize: config.maxHistorySize ?? 50,
    })
  );

  // State
  const [currentRoute, setCurrentRoute] = useState<ParsedRoute | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [badges, setBadges] = useState<Map<string, number>>(new Map());

  // Sync history state
  useEffect(() => {
    historyRef.current = new HistoryStack({
      maxSize: config.maxHistorySize ?? 50,
      onChange: (newHistory, index) => {
        setHistory([...newHistory]);
        setCurrentRoute(newHistory[index]?.route ?? null);
      },
    });
  }, [config.maxHistorySize]);

  // Handle initial route
  useEffect(() => {
    if (initialRoute && !currentRoute) {
      const route = registry.match(registry.build(initialRoute) || `/${initialRoute}`);
      if (route) {
        historyRef.current.push(route);
      }
    }
  }, [initialRoute, registry, currentRoute]);

  // Handle deep links
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      const route = registry.match(url);

      config.onDeepLink?.(url, route);

      if (route) {
        historyRef.current.push(route);
      } else if (config.fallbackRoute) {
        const fallbackPath = registry.build(config.fallbackRoute);
        const fallbackRoute = registry.match(fallbackPath);
        if (fallbackRoute) {
          historyRef.current.push(fallbackRoute);
        }
      }
    };

    // Check for initial URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Listen for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription?.remove?.();
    };
  }, [registry, config]);

  // Badge fetching
  useEffect(() => {
    if (!badgeConfig) return;

    const fetchBadges = async () => {
      try {
        let badgeData: RouteBadge[] = [];

        if (badgeConfig.fetchBadges) {
          badgeData = await badgeConfig.fetchBadges();
        } else if (badgeConfig.endpoint) {
          const response = await fetch(badgeConfig.endpoint);
          badgeData = await response.json();
        }

        const newBadges = new Map<string, number>();
        for (const badge of badgeData) {
          newBadges.set(badge.routeId, badge.count);
        }
        setBadges(newBadges);
        badgeConfig.onBadgesUpdate?.(badgeData);
      } catch (error) {
        console.warn('Failed to fetch badges:', error);
      }
    };

    // Initial fetch
    fetchBadges();

    // Polling
    if (badgeConfig.pollInterval && badgeConfig.pollInterval > 0) {
      const interval = setInterval(fetchBadges, badgeConfig.pollInterval);
      return () => clearInterval(interval);
    }
  }, [badgeConfig]);

  // Navigate function
  const navigate = useCallback(
    <P extends RouteParams>(
      routeOrPath: string,
      params?: P,
      options?: NavigateOptions
    ) => {
      let path: string;
      let route: ParsedRoute | null;

      // Check if it's a route ID or a path
      if (registry.has(routeOrPath)) {
        path = registry.build(routeOrPath, params);
        route = registry.match(path);
      } else {
        // Treat as path
        path = routeOrPath;
        route = registry.match(path);
      }

      if (!route) {
        console.warn(`No route found for: ${routeOrPath}`);
        return;
      }

      config.onNavigate?.(route, options);

      if (options?.reset) {
        historyRef.current.reset(route, options.state);
      } else if (options?.replace) {
        historyRef.current.replace(route, options.state);
      } else {
        historyRef.current.push(route, options?.state);
      }
    },
    [registry, config]
  );

  // Go back
  const goBack = useCallback(() => {
    historyRef.current.goBack();
  }, []);

  // Go forward
  const goForward = useCallback(() => {
    historyRef.current.goForward();
  }, []);

  // Reset to route
  const reset = useCallback(
    <P extends RouteParams>(routeOrPath: string, params?: P) => {
      navigate(routeOrPath, params, { reset: true });
    },
    [navigate]
  );

  // Get state
  const getState = useCallback(<S = unknown>(): S | undefined => {
    return historyRef.current.getState<S>();
  }, []);

  // Set state
  const setState = useCallback(<S = unknown>(state: S): void => {
    historyRef.current.setState(state);
  }, []);

  // Get badge
  const getBadge = useCallback(
    (routeId: string): number => {
      return badges.get(routeId) ?? 0;
    },
    [badges]
  );

  // Refresh badges
  const refreshBadges = useCallback(async (): Promise<void> => {
    if (!badgeConfig) return;

    try {
      let badgeData: RouteBadge[] = [];

      if (badgeConfig.fetchBadges) {
        badgeData = await badgeConfig.fetchBadges();
      } else if (badgeConfig.endpoint) {
        const response = await fetch(badgeConfig.endpoint);
        badgeData = await response.json();
      }

      const newBadges = new Map<string, number>();
      for (const badge of badgeData) {
        newBadges.set(badge.routeId, badge.count);
      }
      setBadges(newBadges);
      badgeConfig.onBadgesUpdate?.(badgeData);
    } catch (error) {
      console.warn('Failed to refresh badges:', error);
    }
  }, [badgeConfig]);

  // Context value
  const contextValue = useMemo<DeepLinkContextValue>(
    () => ({
      currentRoute,
      history,
      canGoBack: historyRef.current.canGoBack,
      navigate,
      goBack,
      goForward,
      reset,
      getState,
      setState,
      registry,
      badges,
      getBadge,
      refreshBadges,
    }),
    [
      currentRoute,
      history,
      navigate,
      goBack,
      goForward,
      reset,
      getState,
      setState,
      registry,
      badges,
      getBadge,
      refreshBadges,
    ]
  );

  return (
    <DeepLinkContext.Provider value={contextValue}>
      {children}
    </DeepLinkContext.Provider>
  );
}
