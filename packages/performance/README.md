# @astacinco/rn-performance

Performance monitoring with **adapter pattern** for React Native - swap monitoring backends without code changes.

## Features

- **Adapter Pattern** - Swap monitoring backends (Firebase Performance, Sentry, etc.) without changing app code
- **Built-in Adapters** - Firebase, Console (debug), NoOp (testing)
- **Performance Traces** - Track operation durations with attributes and metrics
- **Memory Leak Detection** - Track subscriptions, timers, and listeners for cleanup verification
- **Render Tracking** - Monitor component renders and detect excessive re-renders
- **Network Tracing** - Track API request performance
- **TypeScript** - Full type safety with comprehensive interfaces

## Installation

```bash
npm install @astacinco/rn-performance
```

### For Firebase Performance (production)

```bash
npm install @react-native-firebase/perf
```

## Quick Start

### 1. Choose your adapter

```tsx
import {
  PerformanceProvider,
  FirebaseAdapter,
  ConsoleAdapter,
  NoOpAdapter,
} from '@astacinco/rn-performance';

// Production: Firebase Performance
const adapter = new FirebaseAdapter();

// Development: Console logging
const adapter = new ConsoleAdapter({ prefix: '[Perf]' });

// Testing: No-op (silent)
const adapter = new NoOpAdapter();
```

### 2. Wrap your app

```tsx
function App() {
  const adapter = __DEV__
    ? new ConsoleAdapter({ prefix: '[Perf]' })
    : new FirebaseAdapter();

  return (
    <PerformanceProvider
      adapter={adapter}
      config={{
        debug: __DEV__,
        trackRenders: __DEV__,
        renderCountThreshold: 10,
      }}
    >
      <MyApp />
    </PerformanceProvider>
  );
}
```

### 3. Use in components

```tsx
import {
  usePerformance,
  useLeakDetector,
  useRenderTracker,
} from '@astacinco/rn-performance';

function DataLoader() {
  // Performance monitoring
  const { measure, startTrace, recordMetric } = usePerformance();

  // Memory leak detection
  const { trackSubscription, trackTimer } = useLeakDetector({
    componentName: 'DataLoader',
  });

  // Render tracking
  const { renderCount } = useRenderTracker({
    componentName: 'DataLoader',
    threshold: 5,
  });

  useEffect(() => {
    // Measure async operations
    const loadData = async () => {
      const data = await measure('load_data', async () => {
        return api.fetchData();
      }, 'network');

      setData(data);
    };

    loadData();

    // Track subscription for leak detection
    const unsubscribe = api.subscribe(handleUpdate);
    trackSubscription('data_updates', unsubscribe);

    // Track timer
    const timerId = setInterval(refresh, 5000);
    trackTimer('refresh_interval', timerId);

    // Cleanup happens automatically on unmount!
  }, []);

  return <View>...</View>;
}
```

## API Reference

### PerformanceProvider

Provider component that wraps your app with performance context.

```tsx
<PerformanceProvider
  adapter={adapter}        // Required: Performance adapter
  config={{
    enabled: true,         // Enable monitoring
    debug: false,          // Debug logging
    trackRenders: false,   // Track component renders
    renderCountThreshold: 10,      // Re-render warning threshold
    renderDurationThreshold: 16,   // Slow render threshold (ms)
    traceNetwork: false,   // Auto-trace network requests
    sampleRate: 1.0,       // Metric sampling rate (0-1)
  }}
>
  {children}
</PerformanceProvider>
```

### Built-in Adapters

#### ConsoleAdapter (Development)

```typescript
import { ConsoleAdapter } from '@astacinco/rn-performance';

const adapter = new ConsoleAdapter({
  prefix: '[Perf]',       // Log prefix
  timestamps: true,       // Include timestamps
  minSeverity: 'info',    // Minimum log level
  colorize: true,         // Use emoji indicators
});
```

#### NoOpAdapter (Testing)

```typescript
import { NoOpAdapter } from '@astacinco/rn-performance';

const adapter = new NoOpAdapter();
// Silent - does nothing (useful for testing)
```

#### FirebaseAdapter (Production)

```typescript
import { FirebaseAdapter } from '@astacinco/rn-performance';

const adapter = new FirebaseAdapter();
// Requires @react-native-firebase/perf
```

### Creating Custom Adapters

Implement the `PerformanceAdapter` interface:

```typescript
import type { PerformanceAdapter } from '@astacinco/rn-performance';

class SentryAdapter implements PerformanceAdapter {
  readonly name = 'sentry';

  async initialize() {
    // Initialize Sentry
  }

  async startTrace(traceName: string): Promise<TraceHandle> {
    const transaction = Sentry.startTransaction({ name: traceName });
    return {
      stop: () => transaction.finish(),
      putAttribute: (name, value) => transaction.setTag(name, value),
      putMetric: (name, value) => transaction.setMeasurement(name, value),
    };
  }

  // ... implement all other methods
}
```

### Hooks

#### usePerformance

Main hook for performance monitoring.

```typescript
const {
  isInitialized,  // Provider ready
  isEnabled,      // Monitoring enabled
  adapterName,    // Current adapter name
  startTrace,     // Start a trace
  recordMetric,   // Record a metric
  measure,        // Measure function execution
  setEnabled,     // Enable/disable monitoring
} = usePerformance();
```

#### useLeakDetector

Memory leak detection hook.

```typescript
const {
  trackSubscription,  // Track subscription cleanup
  trackTimer,         // Track timer cleanup
  trackListener,      // Track listener cleanup
  verifyCleanup,      // Manual cleanup verification
  getTrackedCount,    // Get tracked resource counts
} = useLeakDetector({
  componentName: 'MyComponent',
  checkSubscriptions: true,
  checkTimers: true,
  checkListeners: true,
  verifyCleanup: () => customVerification(),
});
```

#### useRenderTracker

Component render tracking.

```typescript
const {
  renderCount,          // Number of renders
  lastRenderDuration,   // Last render time (ms)
  averageRenderDuration, // Average render time (ms)
  getRenderInfo,        // Get full render info
} = useRenderTracker({
  componentName: 'MyComponent',
  threshold: 10,                    // Warn after this many renders
  trackedProps: { data, filter },   // Track which props changed
  logToConsole: __DEV__,            // Log to console
});
```

## Measuring Performance

### Traces

```typescript
const { startTrace } = usePerformance();

// Manual trace control
const trace = await startTrace('process_data');
trace.putAttribute('count', data.length.toString());

// ... do work ...

trace.putMetric('items_processed', data.length);
trace.stop();
```

### Measure Function

```typescript
const { measure } = usePerformance();

// Measure sync operations
const result = await measure('compute', () => {
  return expensiveComputation();
}, 'custom');

// Measure async operations
const data = await measure('fetch_users', async () => {
  return api.getUsers();
}, 'network');

// Errors are automatically marked as anomalies
```

### Custom Metrics

```typescript
const { recordMetric } = usePerformance();

await recordMetric('button_press', 'custom', undefined, {
  button_name: 'submit',
  screen: 'checkout',
});

await recordMetric('list_scroll', 'render', 16.5, {
  item_count: 100,
});
```

## Leak Detection

```tsx
function SubscriptionComponent() {
  const { trackSubscription, trackTimer, trackListener } = useLeakDetector({
    componentName: 'SubscriptionComponent',
  });

  useEffect(() => {
    // Track subscription
    const unsubscribe = store.subscribe(handleChange);
    trackSubscription('store', unsubscribe);

    // Track interval
    const timerId = setInterval(refresh, 5000);
    trackTimer('refresh', timerId);

    // Track event listener
    const handler = () => handleResize();
    window.addEventListener('resize', handler);
    trackListener('resize', () => window.removeEventListener('resize', handler));

    // On unmount:
    // 1. Leak detector calls all cleanup functions
    // 2. Reports any uncleared resources as potential leaks
  }, []);

  return <View>...</View>;
}
```

## Render Tracking

```tsx
function ExpensiveList({ data, filter }) {
  const { renderCount, averageRenderDuration } = useRenderTracker({
    componentName: 'ExpensiveList',
    threshold: 5,
    trackedProps: { data, filter },
    logToConsole: __DEV__,
  });

  // Console output (in dev):
  // [Render] ExpensiveList #1 (5.23ms)
  // [Render] ExpensiveList #2 (3.12ms) Changed: filter
  // [Render] ExpensiveList #3 (2.87ms) Changed: data
  // ⚠️ [Performance] ExpensiveList has rendered 6 times (threshold: 5)

  return <FlatList data={data} ... />;
}
```

## Adapter Pattern Benefits

The adapter pattern allows you to:

1. **Swap backends easily** - Change from Console to Firebase with one line
2. **Test without real monitoring** - Use `NoOpAdapter`
3. **Debug with visibility** - Use `ConsoleAdapter` to see all events
4. **Create custom adapters** - Build adapters for Sentry, New Relic, etc.

```typescript
// Switch providers without changing any component code:

// Development
<PerformanceProvider adapter={new ConsoleAdapter()}>

// Production
<PerformanceProvider adapter={new FirebaseAdapter()}>

// Testing
<PerformanceProvider adapter={new NoOpAdapter()}>

// Custom (Sentry)
<PerformanceProvider adapter={new SentryAdapter()}>
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  PerformanceAdapter,
  PerformanceConfig,
  PerformanceMetric,
  MetricType,
  Severity,
  TraceHandle,
  MemorySnapshot,
  LeakDetectionResult,
  RenderInfo,
  LeakDetectorOptions,
} from '@astacinco/rn-performance';
```

## License

MIT
