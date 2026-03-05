/**
 * @rn-toolkit/performance
 *
 * Performance monitoring with adapter pattern for swappable backends.
 *
 * Features:
 * - Adapter pattern for backend flexibility (Firebase Performance, Sentry, etc.)
 * - Built-in adapters: Firebase, Console, NoOp
 * - Performance traces and metrics
 * - Memory leak detection
 * - Render tracking and excessive re-render warnings
 * - Network request tracing
 * - TypeScript first
 *
 * @example
 * ```tsx
 * import {
 *   PerformanceProvider,
 *   ConsoleAdapter,
 *   usePerformance,
 *   useLeakDetector,
 *   useRenderTracker,
 * } from '@rn-toolkit/performance';
 *
 * // Use Console adapter for debugging
 * const adapter = new ConsoleAdapter({ prefix: '[Perf]' });
 *
 * function App() {
 *   return (
 *     <PerformanceProvider adapter={adapter} config={{ debug: __DEV__ }}>
 *       <MyApp />
 *     </PerformanceProvider>
 *   );
 * }
 *
 * // In components
 * function DataLoader() {
 *   const { measure, startTrace } = usePerformance();
 *   const { trackSubscription } = useLeakDetector({ componentName: 'DataLoader' });
 *
 *   useEffect(() => {
 *     const fetchData = async () => {
 *       const data = await measure('fetch_data', () => api.getData(), 'network');
 *       setData(data);
 *     };
 *
 *     fetchData();
 *
 *     // Track subscription for leak detection
 *     const unsubscribe = api.subscribe(handleUpdate);
 *     trackSubscription('api_updates', unsubscribe);
 *   }, []);
 *
 *   return <View>...</View>;
 * }
 * ```
 */

// Context and Provider
export { PerformanceContext } from './PerformanceContext';
export { PerformanceProvider } from './PerformanceProvider';
export type { PerformanceProviderProps } from './PerformanceProvider';

// Adapters
export { NoOpAdapter, ConsoleAdapter, FirebaseAdapter } from './adapters';
export type { ConsoleAdapterOptions } from './adapters';

// Hooks
export { usePerformance, useLeakDetector, useRenderTracker } from './hooks';
export type {
  UsePerformanceResult,
  UseLeakDetectorResult,
  UseRenderTrackerOptions,
  UseRenderTrackerResult,
} from './hooks';

// Types
export type {
  PerformanceAdapter,
  PerformanceConfig,
  PerformanceContextValue,
  PerformanceMetric,
  MetricType,
  Severity,
  MemorySnapshot,
  LeakDetectionResult,
  RenderInfo,
  NetworkTrace,
  TraceHandle,
  LeakDetectorOptions,
} from './types';
