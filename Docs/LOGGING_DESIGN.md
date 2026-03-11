# Logging Architecture Design

## Current State

Each package has its own console-based adapters:
- `I18nConsoleAdapter` - logs translations
- `PerfConsoleAdapter` - logs performance metrics

This works for development but doesn't scale for production monitoring.

## Proposed: Unified Logging Package

### Package: `@astacinco/rn-logging`

```typescript
// Core interface
interface LogAdapter {
  name: string;
  log(level: LogLevel, message: string, meta?: Record<string, unknown>): void;
  flush?(): Promise<void>;
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Provider
<LogProvider adapter={adapter} config={{ minLevel: 'info' }}>
  {children}
</LogProvider>

// Hook
const { log, debug, info, warn, error } = useLogger('ComponentName');
```

### Adapters

| Adapter | Use Case |
|---------|----------|
| `ConsoleAdapter` | Development |
| `SentryAdapter` | Error tracking in production |
| `DataDogAdapter` | Full observability |
| `LogRocketAdapter` | Session replay + logs |
| `NoOpAdapter` | Silent / disabled |
| `CompositeAdapter` | Multiple adapters at once |

### Integration with Existing Packages

Other packages would accept an optional logger:

```typescript
// Before
const perfAdapter = new PerfConsoleAdapter({ prefix: '[Perf]' });

// After
const logger = new DataDogAdapter({ apiKey: '...' });
const perfAdapter = new PerfAdapter({ logger });
```

Or use a shared context:

```typescript
<LogProvider adapter={dataDogAdapter}>
  <PerformanceProvider adapter={perfAdapter}> {/* auto-uses LogProvider */}
    <App />
  </PerformanceProvider>
</LogProvider>
```

### Log Format

Structured logs for external services:

```typescript
{
  timestamp: '2024-01-15T10:30:00Z',
  level: 'info',
  source: 'rn-performance',
  component: 'PerformanceScreen',
  message: 'Render completed',
  meta: {
    duration: 12.5,
    renderCount: 3
  }
}
```

## Implementation Priority

1. **Phase 1**: Create `@astacinco/rn-logging` with Console + NoOp adapters
2. **Phase 2**: Add Sentry adapter (most common for RN)
3. **Phase 3**: Update existing packages to accept logger
4. **Phase 4**: Add DataDog, LogRocket adapters

## Considerations

- **Bundle size**: Adapters should be tree-shakeable
- **Async batching**: Production adapters should batch logs
- **Offline support**: Queue logs when offline, flush when connected
- **PII filtering**: Auto-redact sensitive data before sending
