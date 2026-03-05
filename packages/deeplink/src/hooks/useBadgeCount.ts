/**
 * useBadgeCount Hook
 *
 * Hook for accessing badge counts for routes.
 */

import { useContext, useMemo } from 'react';
import { DeepLinkContext } from '../DeepLinkContext';

/**
 * Badge count result
 */
export interface UseBadgeCountResult {
  /** Badge count for the specified route */
  count: number;
  /** Whether there is a badge (count > 0) */
  hasBadge: boolean;
  /** Formatted count string (e.g., "99+" for large counts) */
  formattedCount: string;
  /** Refresh badge counts */
  refresh: () => Promise<void>;
}

/**
 * Hook to get badge count for a route
 *
 * @param routeId - Route ID to get badge count for
 * @param maxCount - Maximum count to display (default: 99)
 * @returns Badge count information
 *
 * @example
 * ```tsx
 * import { useBadgeCount } from '@rn-toolkit/deeplink';
 *
 * function NotificationIcon() {
 *   const { count, hasBadge, formattedCount } = useBadgeCount('notifications');
 *
 *   return (
 *     <View>
 *       <BellIcon />
 *       {hasBadge && (
 *         <Badge>{formattedCount}</Badge>
 *       )}
 *     </View>
 *   );
 * }
 * ```
 */
export function useBadgeCount(routeId: string, maxCount: number = 99): UseBadgeCountResult {
  const { getBadge, refreshBadges } = useContext(DeepLinkContext);

  const result = useMemo<UseBadgeCountResult>(() => {
    const count = getBadge(routeId);
    const hasBadge = count > 0;
    const formattedCount = count > maxCount ? `${maxCount}+` : String(count);

    return {
      count,
      hasBadge,
      formattedCount,
      refresh: refreshBadges,
    };
  }, [routeId, maxCount, getBadge, refreshBadges]);

  return result;
}

/**
 * Hook to get all badge counts
 *
 * @returns Map of route IDs to badge counts
 *
 * @example
 * ```tsx
 * import { useAllBadges } from '@rn-toolkit/deeplink';
 *
 * function TabBar() {
 *   const { badges, totalCount, refresh } = useAllBadges();
 *
 *   return (
 *     <View>
 *       {tabs.map(tab => (
 *         <Tab key={tab.id} badge={badges.get(tab.id) || 0} />
 *       ))}
 *       <Text>Total: {totalCount}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useAllBadges(): {
  badges: Map<string, number>;
  totalCount: number;
  refresh: () => Promise<void>;
} {
  const { badges, refreshBadges } = useContext(DeepLinkContext);

  const result = useMemo(() => {
    let totalCount = 0;
    for (const count of badges.values()) {
      totalCount += count;
    }

    return {
      badges,
      totalCount,
      refresh: refreshBadges,
    };
  }, [badges, refreshBadges]);

  return result;
}
