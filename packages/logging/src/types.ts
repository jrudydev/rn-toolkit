/**
 * Logging types and interfaces
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  source: string;
  component?: string;
  message: string;
  meta?: Record<string, unknown>;
}

export interface LogAdapter {
  /**
   * Adapter name for identification
   */
  name: string;

  /**
   * Log a message
   */
  log(level: LogLevel, message: string, meta?: Record<string, unknown>): void;

  /**
   * Flush any buffered logs (for async adapters)
   */
  flush?(): Promise<void>;

  /**
   * Clean up resources
   */
  destroy?(): void;
}

export interface LogConfig {
  /**
   * Minimum log level to record
   * @default 'debug'
   */
  minLevel?: LogLevel;

  /**
   * Default source name
   * @default 'app'
   */
  defaultSource?: string;

  /**
   * Enable/disable logging
   * @default true
   */
  enabled?: boolean;

  /**
   * Fields to redact from meta (PII protection)
   */
  redactFields?: string[];
}

export interface LoggerInstance {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  log(level: LogLevel, message: string, meta?: Record<string, unknown>): void;
}

/**
 * Log level priority (higher = more severe)
 */
export const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Check if a log level should be recorded
 */
export function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[minLevel];
}

/**
 * Redact sensitive fields from metadata
 */
export function redactMeta(
  meta: Record<string, unknown> | undefined,
  redactFields: string[]
): Record<string, unknown> | undefined {
  if (!meta || redactFields.length === 0) return meta;

  const redacted = { ...meta };
  for (const field of redactFields) {
    if (field in redacted) {
      redacted[field] = '[REDACTED]';
    }
  }
  return redacted;
}
