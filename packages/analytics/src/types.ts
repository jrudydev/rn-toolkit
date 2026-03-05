/**
 * Analytics Types
 *
 * Type definitions for the @rn-toolkit/analytics package.
 * Designed with adapter pattern for swappable providers.
 */

/**
 * Analytics event parameters
 */
export type EventParams = Record<string, string | number | boolean | null | undefined>;

/**
 * User properties for segmentation
 */
export type UserProperties = Record<string, string | number | boolean | null>;

/**
 * Screen view event data
 */
export interface ScreenViewEvent {
  /** Screen name */
  screenName: string;
  /** Screen class (optional, for native apps) */
  screenClass?: string;
  /** Additional parameters */
  params?: EventParams;
}

/**
 * Analytics event data
 */
export interface AnalyticsEvent {
  /** Event name */
  name: string;
  /** Event parameters */
  params?: EventParams;
  /** Timestamp (auto-set if not provided) */
  timestamp?: number;
}

/**
 * E-commerce item for purchase/cart events
 */
export interface EcommerceItem {
  /** Item ID */
  itemId: string;
  /** Item name */
  itemName: string;
  /** Item category */
  itemCategory?: string;
  /** Item brand */
  itemBrand?: string;
  /** Item variant */
  itemVariant?: string;
  /** Item price */
  price?: number;
  /** Item quantity */
  quantity?: number;
  /** Currency code */
  currency?: string;
}

/**
 * Analytics adapter interface
 *
 * Implement this interface to create a custom analytics adapter.
 * This allows swapping providers (Firebase, Mixpanel, etc.) without
 * changing application code.
 *
 * @example
 * ```typescript
 * class MyCustomAdapter implements AnalyticsAdapter {
 *   async initialize() { ... }
 *   async logEvent(name, params) { ... }
 *   // ... implement all methods
 * }
 *
 * <AnalyticsProvider adapter={new MyCustomAdapter()}>
 *   <App />
 * </AnalyticsProvider>
 * ```
 */
export interface AnalyticsAdapter {
  /** Provider name for debugging */
  readonly name: string;

  /**
   * Initialize the analytics provider
   * Called automatically by AnalyticsProvider on mount
   */
  initialize(): Promise<void>;

  /**
   * Log a custom event
   * @param name - Event name (e.g., 'button_click', 'purchase')
   * @param params - Optional event parameters
   */
  logEvent(name: string, params?: EventParams): Promise<void>;

  /**
   * Log a screen view event
   * @param screenName - Name of the screen
   * @param screenClass - Optional screen class name
   */
  logScreenView(screenName: string, screenClass?: string): Promise<void>;

  /**
   * Set the user ID for analytics
   * @param userId - User ID or null to clear
   */
  setUserId(userId: string | null): Promise<void>;

  /**
   * Set user properties for segmentation
   * @param properties - Key-value pairs of user properties
   */
  setUserProperties(properties: UserProperties): Promise<void>;

  /**
   * Set a single user property
   * @param name - Property name
   * @param value - Property value
   */
  setUserProperty(name: string, value: string | null): Promise<void>;

  /**
   * Enable or disable analytics collection
   * @param enabled - Whether to enable collection
   */
  setAnalyticsCollectionEnabled(enabled: boolean): Promise<void>;

  /**
   * Reset analytics data (clear user ID and properties)
   */
  resetAnalyticsData(): Promise<void>;

  /**
   * Get the current session ID (if supported)
   */
  getSessionId(): Promise<string | null>;

  /**
   * Get the app instance ID (if supported)
   */
  getAppInstanceId(): Promise<string | null>;

  /**
   * Log app open event
   */
  logAppOpen(): Promise<void>;

  /**
   * Log sign up event
   * @param method - Sign up method (e.g., 'email', 'google')
   */
  logSignUp(method: string): Promise<void>;

  /**
   * Log login event
   * @param method - Login method
   */
  logLogin(method: string): Promise<void>;

  /**
   * Log share event
   * @param contentType - Type of content shared
   * @param itemId - ID of item shared
   * @param method - Share method (optional)
   */
  logShare(contentType: string, itemId: string, method?: string): Promise<void>;

  /**
   * Log search event
   * @param searchTerm - Search query
   */
  logSearch(searchTerm: string): Promise<void>;

  /**
   * Log select content event
   * @param contentType - Type of content
   * @param itemId - ID of item selected
   */
  logSelectContent(contentType: string, itemId: string): Promise<void>;

  /**
   * Log purchase event (e-commerce)
   * @param value - Purchase value
   * @param currency - Currency code
   * @param items - Items purchased
   * @param transactionId - Optional transaction ID
   */
  logPurchase(
    value: number,
    currency: string,
    items: EcommerceItem[],
    transactionId?: string
  ): Promise<void>;

  /**
   * Log add to cart event (e-commerce)
   * @param value - Cart value
   * @param currency - Currency code
   * @param items - Items added
   */
  logAddToCart(value: number, currency: string, items: EcommerceItem[]): Promise<void>;

  /**
   * Log begin checkout event (e-commerce)
   * @param value - Checkout value
   * @param currency - Currency code
   * @param items - Items in checkout
   */
  logBeginCheckout(value: number, currency: string, items: EcommerceItem[]): Promise<void>;
}

/**
 * Analytics provider configuration
 */
export interface AnalyticsConfig {
  /** Whether to enable debug mode */
  debug?: boolean;
  /** Whether to auto-track screen views */
  autoTrackScreenViews?: boolean;
  /** Whether to log to console in debug mode */
  logToConsole?: boolean;
  /** Default event parameters to include with all events */
  defaultParams?: EventParams;
}

/**
 * Analytics context value
 */
export interface AnalyticsContextValue {
  /** Whether analytics is initialized */
  isInitialized: boolean;
  /** Whether analytics collection is enabled */
  isEnabled: boolean;
  /** The current adapter name */
  adapterName: string;
  /** Log a custom event */
  logEvent: (name: string, params?: EventParams) => Promise<void>;
  /** Log a screen view */
  logScreenView: (screenName: string, screenClass?: string) => Promise<void>;
  /** Set user ID */
  setUserId: (userId: string | null) => Promise<void>;
  /** Set user properties */
  setUserProperties: (properties: UserProperties) => Promise<void>;
  /** Set a single user property */
  setUserProperty: (name: string, value: string | null) => Promise<void>;
  /** Enable or disable analytics */
  setEnabled: (enabled: boolean) => Promise<void>;
  /** Reset analytics data */
  reset: () => Promise<void>;
  /** Log app open */
  logAppOpen: () => Promise<void>;
  /** Log sign up */
  logSignUp: (method: string) => Promise<void>;
  /** Log login */
  logLogin: (method: string) => Promise<void>;
  /** Log share */
  logShare: (contentType: string, itemId: string, method?: string) => Promise<void>;
  /** Log search */
  logSearch: (searchTerm: string) => Promise<void>;
  /** Log select content */
  logSelectContent: (contentType: string, itemId: string) => Promise<void>;
  /** Log purchase */
  logPurchase: (
    value: number,
    currency: string,
    items: EcommerceItem[],
    transactionId?: string
  ) => Promise<void>;
  /** Log add to cart */
  logAddToCart: (value: number, currency: string, items: EcommerceItem[]) => Promise<void>;
  /** Log begin checkout */
  logBeginCheckout: (value: number, currency: string, items: EcommerceItem[]) => Promise<void>;
}
