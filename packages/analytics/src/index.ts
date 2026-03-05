/**
 * @rn-toolkit/analytics
 *
 * Analytics tracking with adapter pattern for swappable providers.
 *
 * Features:
 * - Adapter pattern for provider flexibility (Firebase, Mixpanel, etc.)
 * - Built-in adapters: Firebase, Console, NoOp
 * - Screen view tracking
 * - Custom event tracking
 * - User identification and properties
 * - E-commerce event support
 * - TypeScript first
 *
 * @example
 * ```tsx
 * import {
 *   AnalyticsProvider,
 *   FirebaseAdapter,
 *   ConsoleAdapter,
 *   useAnalytics,
 *   useScreenTracking,
 * } from '@rn-toolkit/analytics';
 *
 * // Use Firebase in production
 * const adapter = __DEV__
 *   ? new ConsoleAdapter()
 *   : new FirebaseAdapter();
 *
 * function App() {
 *   return (
 *     <AnalyticsProvider adapter={adapter}>
 *       <MyApp />
 *     </AnalyticsProvider>
 *   );
 * }
 *
 * // In components
 * function HomeScreen() {
 *   const { logEvent, setUserId } = useAnalytics();
 *
 *   // Auto-track screen views
 *   useScreenTracking({ screenName: 'HomeScreen' });
 *
 *   const handlePurchase = async () => {
 *     await logEvent('purchase', { value: 99.99, currency: 'USD' });
 *   };
 *
 *   return <Button onPress={handlePurchase} title="Buy" />;
 * }
 * ```
 */

// Context and Provider
export { AnalyticsContext } from './AnalyticsContext';
export { AnalyticsProvider } from './AnalyticsProvider';
export type { AnalyticsProviderProps } from './AnalyticsProvider';

// Adapters
export { NoOpAdapter, ConsoleAdapter, FirebaseAdapter } from './adapters';
export type { ConsoleAdapterOptions } from './adapters';

// Hooks
export { useAnalytics, useScreenTracking, useEventTracking } from './hooks';
export type { UseScreenTrackingOptions, UseEventTrackingOptions, EventTracker } from './hooks';

// Types
export type {
  AnalyticsAdapter,
  AnalyticsConfig,
  AnalyticsContextValue,
  EventParams,
  UserProperties,
  ScreenViewEvent,
  AnalyticsEvent,
  EcommerceItem,
} from './types';
