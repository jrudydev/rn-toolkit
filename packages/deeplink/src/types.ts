/**
 * Deep Link Types
 *
 * Type definitions for the @rn-toolkit/deeplink package.
 */

/**
 * Route parameter types
 */
export type RouteParams = Record<string, string | number | boolean | undefined>;

/**
 * Route definition
 */
export interface RouteDefinition<P extends RouteParams = RouteParams> {
  /** Route path pattern (e.g., 'profile/:id') */
  path: string;
  /** Route name for display */
  name?: string;
  /** Default parameters */
  defaultParams?: Partial<P>;
  /** Whether this route requires authentication */
  requiresAuth?: boolean;
  /** Custom metadata */
  meta?: Record<string, unknown>;
}

/**
 * Parsed route with extracted parameters
 */
export interface ParsedRoute<P extends RouteParams = RouteParams> {
  /** Original path pattern */
  pattern: string;
  /** Resolved path with parameters filled in */
  path: string;
  /** Route name */
  name: string;
  /** Extracted parameters */
  params: P;
  /** Query string parameters */
  query: Record<string, string>;
  /** Hash fragment */
  hash: string;
}

/**
 * Navigation state for a route
 */
export interface NavigationState<S = unknown> {
  /** Unique state ID */
  id: string;
  /** Custom state data */
  data: S;
  /** Timestamp when state was saved */
  timestamp: number;
}

/**
 * History entry
 */
export interface HistoryEntry<P extends RouteParams = RouteParams, S = unknown> {
  /** Unique entry ID */
  id: string;
  /** Route information */
  route: ParsedRoute<P>;
  /** Navigation state */
  state?: NavigationState<S>;
  /** Entry timestamp */
  timestamp: number;
}

/**
 * Navigation options
 */
export interface NavigateOptions<S = unknown> {
  /** Replace current entry instead of pushing */
  replace?: boolean;
  /** State to save with this navigation */
  state?: S;
  /** Custom transition animation */
  transition?: 'push' | 'pop' | 'replace' | 'reset' | 'none';
  /** Whether to reset history stack */
  reset?: boolean;
}

/**
 * Deep link configuration
 */
export interface DeepLinkConfig {
  /** URL scheme(s) for the app (e.g., ['myapp', 'https']) */
  schemes: string[];
  /** Prefix paths to strip (e.g., ['/app']) */
  prefixes?: string[];
  /** Default route when no match found */
  fallbackRoute?: string;
  /** Maximum history stack size */
  maxHistorySize?: number;
  /** Whether to persist history */
  persistHistory?: boolean;
  /** Storage key for persisted history */
  historyStorageKey?: string;
  /** Callback when navigation occurs */
  onNavigate?: (route: ParsedRoute, options?: NavigateOptions) => void;
  /** Callback when deep link is received */
  onDeepLink?: (url: string, route: ParsedRoute | null) => void;
}

/**
 * Route registry for type-safe routes
 */
export interface RouteRegistry {
  /** Register a route */
  register: <P extends RouteParams>(
    id: string,
    definition: RouteDefinition<P>
  ) => void;
  /** Unregister a route */
  unregister: (id: string) => void;
  /** Get a route by ID */
  get: (id: string) => RouteDefinition | undefined;
  /** Check if route exists */
  has: (id: string) => boolean;
  /** Get all routes */
  getAll: () => Map<string, RouteDefinition>;
  /** Match a path to a route */
  match: (path: string) => ParsedRoute | null;
  /** Build a path from route ID and params */
  build: <P extends RouteParams>(id: string, params?: P) => string | null;
}

/**
 * Badge count for a route
 */
export interface RouteBadge {
  /** Route ID or path */
  routeId: string;
  /** Badge count (0 to hide) */
  count: number;
  /** Badge color override */
  color?: string;
  /** Maximum count to display (e.g., 99+) */
  maxCount?: number;
}

/**
 * Badge configuration
 */
export interface BadgeConfig {
  /** Endpoint to fetch badge counts */
  endpoint?: string;
  /** Polling interval in milliseconds (0 to disable) */
  pollInterval?: number;
  /** Custom fetch function */
  fetchBadges?: () => Promise<RouteBadge[]>;
  /** Callback when badges update */
  onBadgesUpdate?: (badges: RouteBadge[]) => void;
}

/**
 * Deep link context value
 */
export interface DeepLinkContextValue {
  /** Current route */
  currentRoute: ParsedRoute | null;
  /** History stack */
  history: HistoryEntry[];
  /** Whether can go back */
  canGoBack: boolean;
  /** Navigate to a route */
  navigate: <P extends RouteParams>(
    routeOrPath: string,
    params?: P,
    options?: NavigateOptions
  ) => void;
  /** Go back in history */
  goBack: () => void;
  /** Go forward in history (if available) */
  goForward: () => void;
  /** Reset history to a single route */
  reset: <P extends RouteParams>(routeOrPath: string, params?: P) => void;
  /** Get state for current route */
  getState: <S = unknown>() => S | undefined;
  /** Set state for current route */
  setState: <S = unknown>(state: S) => void;
  /** Route registry */
  registry: RouteRegistry;
  /** Badge counts by route ID */
  badges: Map<string, number>;
  /** Get badge count for a route */
  getBadge: (routeId: string) => number;
  /** Manually refresh badges */
  refreshBadges: () => Promise<void>;
}

/**
 * Tab bar item configuration
 */
export interface TabBarItem {
  /** Route ID to navigate to */
  routeId: string;
  /** Display label */
  label: string;
  /** Icon name or component */
  icon?: string | React.ReactNode;
  /** Active icon (optional) */
  activeIcon?: string | React.ReactNode;
  /** Whether to show badge */
  showBadge?: boolean;
  /** Custom badge color */
  badgeColor?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Smart tab bar props
 */
export interface SmartTabBarProps {
  /** Tab items */
  items: TabBarItem[];
  /** Position of the tab bar */
  position?: 'bottom' | 'top';
  /** Show labels */
  showLabels?: boolean;
  /** Custom styles */
  style?: object;
  /** Active tab color */
  activeColor?: string;
  /** Inactive tab color */
  inactiveColor?: string;
}

/**
 * Smart header props
 */
export interface SmartHeaderProps {
  /** Custom title (overrides route name) */
  title?: string;
  /** Show back button */
  showBackButton?: boolean;
  /** Custom back button handler */
  onBackPress?: () => void;
  /** Right side actions */
  rightActions?: React.ReactNode;
  /** Left side actions (besides back button) */
  leftActions?: React.ReactNode;
  /** Whether header is transparent */
  transparent?: boolean;
  /** Custom styles */
  style?: object;
}
