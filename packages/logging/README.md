# @astacinco/rn-logging

Unified logging for React Native with pluggable adapters.

## Installation

```bash
npm install @astacinco/rn-logging
```

## Quick Start

```tsx
import { LogProvider, useLogger, ConsoleAdapter } from '@astacinco/rn-logging';

// Create adapter
const adapter = new ConsoleAdapter({
  prefix: '[MyApp]',
  minLevel: 'debug',
});

// Wrap your app
function App() {
  return (
    <LogProvider adapter={adapter}>
      <MyScreen />
    </LogProvider>
  );
}

// Use in components
function MyScreen() {
  const logger = useLogger('MyScreen');

  useEffect(() => {
    logger.info('Screen mounted');
    return () => logger.debug('Screen unmounted');
  }, []);

  const handleSubmit = async () => {
    logger.debug('Submitting form', { formId: '123' });
    try {
      await submitForm();
      logger.info('Form submitted successfully');
    } catch (error) {
      logger.error('Form submission failed', { error: error.message });
    }
  };
}
```

## Adapters

### ConsoleAdapter

Logs to console with colors and formatting:

```tsx
const adapter = new ConsoleAdapter({
  prefix: '[App]',      // Prefix for all logs
  minLevel: 'info',     // Minimum level to log
  useColors: true,      // Colorized output
  showTimestamp: true,  // Include timestamps
  redactFields: ['password', 'token'], // PII protection
});
```

### NoOpAdapter

Silently discards all logs:

```tsx
const adapter = new NoOpAdapter();
```

### CompositeAdapter

Forward logs to multiple adapters:

```tsx
const adapter = new CompositeAdapter({
  adapters: [
    new ConsoleAdapter({ prefix: '[Dev]' }),
    new SentryAdapter({ dsn: '...' }), // (custom adapter)
  ],
  // Optional: route specific levels to specific adapters
  routing: [
    { adapter: sentryAdapter, levels: ['error', 'warn'] },
  ],
});
```

## Log Levels

| Level | Use Case |
|-------|----------|
| `debug` | Verbose debugging info |
| `info` | General information |
| `warn` | Warning conditions |
| `error` | Error conditions |

## API

### LogProvider

```tsx
<LogProvider
  adapter={adapter}
  config={{
    minLevel: 'info',
    defaultSource: 'app',
    enabled: true,
    redactFields: ['password'],
  }}
>
  {children}
</LogProvider>
```

### useLogger

```tsx
const logger = useLogger('ComponentName');

logger.debug('Debug message', { meta: 'data' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', { error: err.message });
```

## Creating Custom Adapters

Implement the `LogAdapter` interface:

```tsx
import type { LogAdapter, LogLevel } from '@astacinco/rn-logging';

class MyCustomAdapter implements LogAdapter {
  name = 'custom';

  log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    // Send to your logging service
    myService.send({ level, message, ...meta });
  }

  async flush(): Promise<void> {
    // Flush any buffered logs
    await myService.flush();
  }

  destroy(): void {
    // Clean up resources
    myService.disconnect();
  }
}
```

## Integration with Other Packages

Other @astacinco packages can accept an optional logger:

```tsx
// Future integration
const perfAdapter = new PerfAdapter({
  logger: myLogger, // Performance metrics logged here
});
```

## License

MIT
