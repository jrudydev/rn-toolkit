/**
 * @astacinco/rn-performance
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
 * - Debounce and throttle utilities
 * - Rate limiting for security
 * - TypeScript first
 *
 * @example
 * ```tsx
 * import {
 *   PerformanceProvider,
 *   ConsoleAdapter,
 *   usePerformance,
 *   useDebounce,
 *   useThrottledCallback,
 *   useRateLimiter,
 * } from '@astacinco/rn-performance';
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
 * // Search with debounce
 * function SearchInput() {
 *   const [term, setTerm] = useState('');
 *   const debouncedTerm = useDebounce(term, 300);
 *
 *   useEffect(() => {
 *     if (debouncedTerm) searchApi(debouncedTerm);
 *   }, [debouncedTerm]);
 *
 *   return <TextInput value={term} onChangeText={setTerm} />;
 * }
 *
 * // Login with rate limiting
 * function LoginForm() {
 *   const limiter = useRateLimiter({ maxAttempts: 5, windowMs: 60000 });
 *
 *   const handleLogin = () => {
 *     if (!limiter.canProceed('login')) return;
 *     limiter.record('login');
 *     attemptLogin();
 *   };
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
export {
  usePerformance,
  useLeakDetector,
  useRenderTracker,
  useDebounce,
  useDebouncedCallback,
  useThrottle,
  useThrottledCallback,
} from './hooks';
export type {
  UsePerformanceResult,
  UseLeakDetectorResult,
  UseRenderTrackerOptions,
  UseRenderTrackerResult,
  UseDebouncedCallbackOptions,
  UseThrottledCallbackOptions,
} from './hooks';

// Rate Limiter
export {
  createRateLimiter,
  useRateLimiter,
} from './rateLimiter';
export type {
  RateLimiter,
  RateLimiterOptions,
  RateLimitStatus,
  UseRateLimiterOptions,
  UseRateLimiterResult,
} from './rateLimiter';

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
