/**
 * @rn-toolkit/performance Types
 *
 * Core types for the performance monitoring adapter pattern.
 */

/**
 * Metric types for performance tracking
 */
export type MetricType = 'render' | 'network' | 'custom' | 'memory' | 'lifecycle';

/**
 * Severity levels for performance issues
 */
export type Severity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Performance metric data
 */
export interface PerformanceMetric {
  /** Metric name */
  name: string;
  /** Metric type */
  type: MetricType;
  /** Duration in milliseconds */
  duration?: number;
  /** Start timestamp */
  startTime: number;
  /** End timestamp */
  endTime?: number;
  /** Additional attributes */
  attributes?: Record<string, string | number | boolean>;
  /** Whether this metric indicates a problem */
  isAnomaly?: boolean;
}

/**
 * Memory usage snapshot
 */
export interface MemorySnapshot {
  /** Timestamp of snapshot */
  timestamp: number;
  /** Used JS heap size (if available) */
  usedJSHeapSize?: number;
  /** Total JS heap size (if available) */
  totalJSHeapSize?: number;
  /** JS heap size limit (if available) */
  jsHeapSizeLimit?: number;
  /** Component count at snapshot */
  componentCount?: number;
  /** Subscription count at snapshot */
  subscriptionCount?: number;
}

/**
 * Memory leak detection result
 */
export interface LeakDetectionResult {
  /** Whether a potential leak was detected */
  hasLeak: boolean;
  /** Severity of the leak */
  severity: Severity;
  /** Description of the issue */
  message: string;
  /** Component or resource name */
  source: string;
  /** Type of leak */
  leakType: 'subscription' | 'listener' | 'timer' | 'ref' | 'state' | 'unknown';
  /** Stack trace if available */
  stackTrace?: string;
  /** Suggestions for fixing */
  suggestions: string[];
}

/**
 * Render tracking info
 */
export interface RenderInfo {
  /** Component name */
  componentName: string;
  /** Render count */
  renderCount: number;
  /** Last render duration (ms) */
  lastRenderDuration: number;
  /** Average render duration (ms) */
  averageRenderDuration: number;
  /** Whether this is a re-render (not initial) */
  isRerender: boolean;
  /** Props that changed (if tracked) */
  changedProps?: string[];
}

/**
 * Network request trace
 */
export interface NetworkTrace {
  /** Request URL */
  url: string;
  /** HTTP method */
  method: string;
  /** Request start time */
  startTime: number;
  /** Request end time */
  endTime?: number;
  /** Duration in ms */
  duration?: number;
  /** HTTP status code */
  statusCode?: number;
  /** Response size in bytes */
  responseSize?: number;
  /** Request size in bytes */
  requestSize?: number;
  /** Whether request succeeded */
  success?: boolean;
}

/**
 * Trace handle for stopping traces
 */
export interface TraceHandle {
  /** Stop the trace and record duration */
  stop: (attributes?: Record<string, string | number | boolean>) => void;
  /** Add attribute to the trace */
  putAttribute: (name: string, value: string) => void;
  /** Add metric to the trace */
  putMetric: (name: string, value: number) => void;
}

/**
 * Performance Adapter Interface
 *
 * Implement this interface to create a custom performance adapter.
 * This allows swapping between different monitoring backends
 * (Firebase Performance, Sentry, New Relic, etc.) without changing app code.
 */
export interface PerformanceAdapter {
  /** Unique adapter name */
  readonly name: string;

  /**
   * Initialize the adapter
   * Called once when the PerformanceProvider mounts
   */
  initialize(): Promise<void>;

  // ============================================
  // TRACES & METRICS
  // ============================================

  /**
   * Start a performance trace
   * @param traceName - Name of the trace
   * @returns Handle to stop the trace
   */
  startTrace(traceName: string): Promise<TraceHandle>;

  /**
   * Record a metric
   * @param metric - Metric data to record
   */
  recordMetric(metric: PerformanceMetric): Promise<void>;

  /**
   * Start a network trace
   * @param url - Request URL
   * @param method - HTTP method
   * @returns Handle to complete the trace
   */
  startNetworkTrace(url: string, method: string): Promise<TraceHandle>;

  // ============================================
  // MEMORY MONITORING
  // ============================================

  /**
   * Take a memory snapshot
   * @returns Memory snapshot data
   */
  takeMemorySnapshot(): Promise<MemorySnapshot>;

  /**
   * Report a memory leak detection
   * @param leak - Leak detection result
   */
  reportLeak(leak: LeakDetectionResult): Promise<void>;

  // ============================================
  // RENDER TRACKING
  // ============================================

  /**
   * Record render information
   * @param info - Render info to record
   */
  recordRender(info: RenderInfo): Promise<void>;

  /**
   * Report excessive re-renders
   * @param componentName - Component name
   * @param renderCount - Number of renders
   * @param threshold - Threshold that was exceeded
   */
  reportExcessiveRenders(
    componentName: string,
    renderCount: number,
    threshold: number
  ): Promise<void>;

  // ============================================
  // CONFIGURATION
  // ============================================

  /**
   * Enable or disable performance collection
   * @param enabled - Whether to enable collection
   */
  setEnabled(enabled: boolean): Promise<void>;

  /**
   * Check if performance collection is enabled
   * @returns Whether collection is enabled
   */
  isEnabled(): boolean;

  /**
   * Set custom attributes for all traces
   * @param attributes - Attributes to set
   */
  setAttributes(attributes: Record<string, string>): Promise<void>;
}

/**
 * Performance Provider configuration
 */
export interface PerformanceConfig {
  /** Enable performance monitoring */
  enabled?: boolean;
  /** Enable debug logging */
  debug?: boolean;
  /** Render count threshold for warnings */
  renderCountThreshold?: number;
  /** Render duration threshold for warnings (ms) */
  renderDurationThreshold?: number;
  /** Enable automatic network tracing */
  traceNetwork?: boolean;
  /** Enable automatic render tracking */
  trackRenders?: boolean;
  /** Sample rate (0-1) for metrics */
  sampleRate?: number;
}

/**
 * Performance Context value
 */
export interface PerformanceContextValue {
  /** Whether the adapter is initialized */
  isInitialized: boolean;
  /** Current adapter name */
  adapterName: string;
  /** Whether monitoring is enabled */
  isEnabled: boolean;

  // Trace methods
  startTrace: (traceName: string) => Promise<TraceHandle>;
  recordMetric: (metric: PerformanceMetric) => Promise<void>;

  // Memory methods
  takeMemorySnapshot: () => Promise<MemorySnapshot>;
  reportLeak: (leak: LeakDetectionResult) => Promise<void>;

  // Render methods
  recordRender: (info: RenderInfo) => Promise<void>;

  // Configuration
  setEnabled: (enabled: boolean) => Promise<void>;
}

/**
 * Leak detector options
 */
export interface LeakDetectorOptions {
  /** Check for subscription leaks */
  checkSubscriptions?: boolean;
  /** Check for timer leaks */
  checkTimers?: boolean;
  /** Check for event listener leaks */
  checkListeners?: boolean;
  /** Custom cleanup verification function */
  verifyCleanup?: () => boolean;
  /** Component name for reporting */
  componentName?: string;
}
