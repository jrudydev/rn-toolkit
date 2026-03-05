/**
 * useRoute Hook
 *
 * Hook for accessing current route information and params.
 */

import { useContext, useMemo } from 'react';
import { DeepLinkContext } from '../DeepLinkContext';
import type { ParsedRoute, RouteParams } from '../types';

/**
 * Route result with typed params
 */
export interface UseRouteResult<P extends RouteParams = RouteParams> {
  /** Current route or null */
  route: ParsedRoute<P> | null;
  /** Route params */
  params: P;
  /** Query parameters */
  query: Record<string, string>;
  /** Route name */
  name: string;
  /** Route path */
  path: string;
  /** Whether route is active */
  isActive: boolean;
  /** Check if a specific route is active */
  isRouteActive: (routeId: string) => boolean;
}

/**
 * Hook to access current route information
 *
 * @returns Route information with typed params
 *
 * @example
 * ```tsx
 * import { useRoute } from '@rn-toolkit/deeplink';
 *
 * interface ProfileParams {
 *   id: string;
 * }
 *
 * function ProfileScreen() {
 *   const { params, name, isActive } = useRoute<ProfileParams>();
 *
 *   return (
 *     <View>
 *       <Text>Profile ID: {params.id}</Text>
 *       <Text>Route Name: {name}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useRoute<P extends RouteParams = RouteParams>(): UseRouteResult<P> {
  const { currentRoute, registry } = useContext(DeepLinkContext);

  const result = useMemo<UseRouteResult<P>>(() => {
    const params = (currentRoute?.params ?? {}) as P;
    const query = currentRoute?.query ?? {};
    const name = currentRoute?.name ?? '';
    const path = currentRoute?.path ?? '';

    const isRouteActive = (routeId: string): boolean => {
      if (!currentRoute) return false;
      const definition = registry.get(routeId);
      if (!definition) return false;
      return currentRoute.pattern === definition.path;
    };

    return {
      route: currentRoute as ParsedRoute<P> | null,
      params,
      query,
      name,
      path,
      isActive: currentRoute !== null,
      isRouteActive,
    };
  }, [currentRoute, registry]);

  return result;
}
