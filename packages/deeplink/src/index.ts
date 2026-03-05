/**
 * @rn-toolkit/deeplink
 *
 * Type-safe deep linking and navigation for React Native
 * with history tracking, state restoration, and SDUI-driven badge counts.
 */

// Context & Provider
export { DeepLinkContext } from './DeepLinkContext';
export { DeepLinkProvider, type DeepLinkProviderProps } from './DeepLinkProvider';

// Hooks
export {
  useDeepLink,
  useRoute,
  useBadgeCount,
  useAllBadges,
  useNavigationState,
  type UseRouteResult,
  type UseBadgeCountResult,
  type UseNavigationStateResult,
} from './hooks';

// Components
export {
  SmartTabBar,
  SmartHeader,
  type SmartTabBarProps,
  type SmartHeaderProps,
  type TabDefinition,
} from './components';

// Core utilities
export { createRouteRegistry } from './RouteRegistry';
export { HistoryStack, type HistoryStackOptions } from './HistoryStack';

// Types
export type {
  RouteParams,
  RouteDefinition,
  ParsedRoute,
  DeepLinkConfig,
  NavigateOptions,
  NavigateFunction,
  DeepLinkContextValue,
  HistoryEntry,
  BadgeConfig,
  RouteBadge,
  RouteRegistry,
} from './types';
