# @astacinco/rn-performance

Performance monitoring with **adapter pattern** for React Native - swap monitoring backends without code changes.

## Features

- **Adapter Pattern** - Swap monitoring backends (Firebase Performance, Sentry, etc.) without changing app code
- **Built-in Adapters** - Firebase, Console (debug), NoOp (testing)
- **Performance Traces** - Track operation durations with attributes and metrics
- **Memory Leak Detection** - Track subscriptions, timers, and listeners for cleanup verification
- **Render Tracking** - Monitor component renders and detect excessive re-renders
- **Network Tracing** - Track API request performance
- **Debounce & Throttle** - Control execution frequency for search, scroll, resize handlers
- **Rate Limiting** - Prevent abuse for login attempts, API calls, form submissions
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

## Throttle, Debounce & Rate Limiting

Utilities for controlling execution frequency - essential for performance, security, and UX.

### When to Use What?

| Utility | Best For | Example |
|---------|----------|---------|
| **Debounce** | Wait for user to stop | Search input, form validation |
| **Throttle** | Limit frequency | Scroll handlers, resize events |
| **Rate Limiter** | Prevent abuse | Login attempts, API calls |

### Debounce

**Waits for a pause** - delays execution until the value stops changing.

```
User types: H...e...l...l...o
Debounce:   ─────────────────────► "Hello" (fires once)
```

#### useDebounce (value)

```tsx
import { useDebounce } from '@astacinco/rn-performance';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useDebounce(searchTerm, 300); // 300ms delay

  useEffect(() => {
    if (debouncedTerm) {
      // Only fires after user stops typing for 300ms
      searchApi(debouncedTerm);
    }
  }, [debouncedTerm]);

  return (
    <TextInput
      value={searchTerm}
      onChangeText={setSearchTerm}
      placeholder="Search..."
    />
  );
}
```

#### useDebouncedCallback (function)

For more control over callback execution:

```tsx
import { useDebouncedCallback } from '@astacinco/rn-performance';

function AutoSaveForm() {
  const debouncedSave = useDebouncedCallback(
    (data: FormData) => saveToServer(data),
    {
      delay: 1000,      // Wait 1 second after last change
      leading: false,   // Don't fire immediately (default)
      trailing: true,   // Fire after delay (default)
      maxWait: 5000,    // Force save every 5 seconds max
    }
  );

  const handleChange = (field: string, value: string) => {
    updateForm(field, value);
    debouncedSave.call(formData);
  };

  // Manual controls
  const handleSubmit = () => {
    debouncedSave.flush();  // Save immediately
  };

  const handleCancel = () => {
    debouncedSave.cancel(); // Cancel pending save
  };

  return (
    <View>
      <TextInput onChangeText={(v) => handleChange('name', v)} />
      {debouncedSave.isPending() && <Text>Saving...</Text>}
    </View>
  );
}
```

**Options:**
- `delay` - Milliseconds to wait (default: 300)
- `leading` - Fire on first call, then debounce (default: false)
- `trailing` - Fire after delay (default: true)
- `maxWait` - Maximum time to wait before forcing execution

### Throttle

**Limits frequency** - executes at most once per interval.

```
Events:    ●●●●●●●●●●●●●●●●●●●●
Throttle:  ●─────●─────●─────●── (fires every 100ms)
```

#### useThrottle (value)

```tsx
import { useThrottle } from '@astacinco/rn-performance';

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 100); // Max once per 100ms

  useEffect(() => {
    // Analytics fires at most 10 times per second
    analytics.trackScroll(throttledScrollY);
  }, [throttledScrollY]);

  const handleScroll = (event) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };

  return <ScrollView onScroll={handleScroll} />;
}
```

#### useThrottledCallback (function)

```tsx
import { useThrottledCallback } from '@astacinco/rn-performance';

function SubmitButton() {
  const throttledSubmit = useThrottledCallback(
    () => submitForm(),
    {
      interval: 1000,  // Max once per second
      leading: true,   // Fire immediately (default)
      trailing: true,  // Fire again after interval if called (default)
    }
  );

  return (
    <Button
      onPress={throttledSubmit.call}
      disabled={throttledSubmit.isThrottled()}
      title="Submit"
    />
  );
}
```

**Options:**
- `interval` - Minimum time between calls (default: 100)
- `leading` - Fire on first call (default: true)
- `trailing` - Fire pending call after interval (default: true)

### Rate Limiter

**Prevents abuse** - limits attempts within a time window.

```
Window: 60 seconds, Max: 5 attempts
Attempts: ●●●●● (5 allowed) ✗✗✗ (blocked until window resets)
```

#### useRateLimiter (hook)

```tsx
import { useRateLimiter } from '@astacinco/rn-performance';

function LoginForm() {
  const [error, setError] = useState('');

  const limiter = useRateLimiter({
    maxAttempts: 5,      // 5 attempts
    windowMs: 60000,     // Per minute
    onLimitReached: (key, attempts) => {
      setError(`Too many attempts (${attempts}). Wait 1 minute.`);
      analytics.track('rate_limit_hit', { action: key });
    },
  });

  const handleLogin = async () => {
    // Check before attempting
    if (!limiter.canProceed('login')) {
      const status = limiter.getStatus('login');
      setError(`Try again in ${Math.ceil(status.resetIn / 1000)} seconds`);
      return;
    }

    // Record the attempt
    const status = limiter.record('login');

    try {
      await loginApi(credentials);
      limiter.reset('login'); // Clear on success
    } catch (err) {
      setError(`Login failed. ${status.remaining} attempts remaining.`);
    }
  };

  return (
    <View>
      <Button
        onPress={handleLogin}
        disabled={!limiter.canProceed('login')}
        title="Login"
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
```

#### createRateLimiter (standalone)

For non-component usage:

```typescript
import { createRateLimiter } from '@astacinco/rn-performance';

// Create limiter (e.g., in a service)
const apiLimiter = createRateLimiter({
  maxAttempts: 100,
  windowMs: 60000,  // 100 requests per minute
});

async function fetchData(endpoint: string) {
  if (!apiLimiter.canProceed(endpoint)) {
    throw new Error('Rate limited');
  }

  apiLimiter.record(endpoint);
  return fetch(endpoint);
}

// Cleanup old entries periodically
setInterval(() => apiLimiter.cleanup(), 30000);
```

**Options:**
- `maxAttempts` - Max attempts per window (default: 5)
- `windowMs` - Time window in milliseconds (default: 60000)
- `onLimitReached` - Callback when limit is hit
- `onReset` - Callback when limit resets

**Methods:**
- `canProceed(key)` - Check if action is allowed
- `record(key)` - Record an attempt, returns status
- `getStatus(key)` - Get current status without recording
- `reset(key)` - Clear attempts for a key
- `resetAll()` - Clear all keys
- `cleanup()` - Remove expired entries

### Use Case Cheat Sheet

| Use Case | Solution | Config |
|----------|----------|--------|
| Search autocomplete | `useDebounce` | 300ms delay |
| Form autosave | `useDebouncedCallback` | 1000ms + maxWait |
| Scroll analytics | `useThrottle` | 100ms interval |
| Resize handler | `useThrottle` | 200ms interval |
| Button spam prevention | `useThrottledCallback` | 1000ms interval |
| Login rate limiting | `useRateLimiter` | 5 attempts / 60s |
| API abuse prevention | `createRateLimiter` | 100 requests / 60s |
| Form submission spam | `useRateLimiter` | 3 attempts / 10s |

### How They Work

All utilities use React's built-in patterns:

```typescript
// Debounce: useEffect cleanup cancels pending timer
useEffect(() => {
  const timer = setTimeout(() => setValue(newValue), delay);
  return () => clearTimeout(timer);  // Cancel if value changes
}, [value]);

// Throttle: refs track last execution time
const lastCall = useRef(Date.now());
if (Date.now() - lastCall.current >= interval) {
  execute();
  lastCall.current = Date.now();
}

// Rate Limiter: Map tracks attempts with timestamps
attempts.set(key, [...timestamps.filter(t => Date.now() - t < windowMs), Date.now()]);
```

No external dependencies (RxJS, lodash) - pure React.

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
  // Monitoring
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

  // Throttle/Debounce
  UseDebouncedCallbackOptions,
  UseThrottledCallbackOptions,

  // Rate Limiting
  RateLimiter,
  RateLimiterOptions,
  RateLimitStatus,
  UseRateLimiterOptions,
  UseRateLimiterResult,
} from '@astacinco/rn-performance';
```

## License

MIT
