/**
 * Log Provider
 *
 * Provides logging context to the app.
 */

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import type { LogAdapter, LogConfig, LogLevel, LoggerInstance } from './types';
import { shouldLog, redactMeta } from './types';
import { NoOpAdapter } from './adapters/NoOpAdapter';

interface LogContextValue {
  adapter: LogAdapter;
  config: Required<LogConfig>;
  createLogger: (component?: string) => LoggerInstance;
}

const LogContext = createContext<LogContextValue | undefined>(undefined);

interface LogProviderProps {
  adapter: LogAdapter;
  config?: LogConfig;
  children: React.ReactNode;
}

export function LogProvider({ adapter, config = {}, children }: LogProviderProps) {
  const resolvedConfig: Required<LogConfig> = useMemo(() => ({
    minLevel: config.minLevel ?? 'debug',
    defaultSource: config.defaultSource ?? 'app',
    enabled: config.enabled ?? true,
    redactFields: config.redactFields ?? [],
  }), [config.minLevel, config.defaultSource, config.enabled, config.redactFields]);

  const createLogger = useCallback((component?: string): LoggerInstance => {
    const log = (level: LogLevel, message: string, meta?: Record<string, unknown>) => {
      if (!resolvedConfig.enabled) return;
      if (!shouldLog(level, resolvedConfig.minLevel)) return;

      const redactedMeta = redactMeta(
        { ...meta, component, source: resolvedConfig.defaultSource },
        resolvedConfig.redactFields
      );

      adapter.log(level, message, redactedMeta);
    };

    return {
      debug: (message, meta) => log('debug', message, meta),
      info: (message, meta) => log('info', message, meta),
      warn: (message, meta) => log('warn', message, meta),
      error: (message, meta) => log('error', message, meta),
      log,
    };
  }, [adapter, resolvedConfig]);

  const value = useMemo(() => ({
    adapter,
    config: resolvedConfig,
    createLogger,
  }), [adapter, resolvedConfig, createLogger]);

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  );
}

/**
 * Get the log context
 * @throws if used outside LogProvider
 */
export function useLogContext(): LogContextValue {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogContext must be used within a LogProvider');
  }
  return context;
}

/**
 * Create a logger instance for a component
 *
 * @param component - Component name for log identification
 * @returns Logger instance with debug, info, warn, error methods
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const logger = useLogger('MyComponent');
 *
 *   useEffect(() => {
 *     logger.info('Component mounted');
 *     return () => logger.debug('Component unmounted');
 *   }, []);
 *
 *   const handleError = (error: Error) => {
 *     logger.error('Operation failed', { error: error.message });
 *   };
 * }
 * ```
 */
export function useLogger(component?: string): LoggerInstance {
  const context = useContext(LogContext);

  // Return a no-op logger if not in provider (graceful fallback)
  if (!context) {
    const noopAdapter = new NoOpAdapter();
    return {
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      log: () => {},
    };
  }

  return context.createLogger(component);
}

/**
 * Flush all buffered logs
 * Useful before app shutdown or navigation
 */
export async function flushLogs(): Promise<void> {
  // This would need access to the adapter
  // In practice, call adapter.flush() directly or expose via context
}
