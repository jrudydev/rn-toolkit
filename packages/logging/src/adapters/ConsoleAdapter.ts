/**
 * Console Adapter
 *
 * Logs to console with formatting. Great for development.
 */

import type { LogAdapter, LogLevel, LogConfig } from '../types';
import { shouldLog, redactMeta } from '../types';

export interface ConsoleAdapterConfig extends LogConfig {
  /**
   * Prefix for all log messages
   * @default '[Log]'
   */
  prefix?: string;

  /**
   * Use colors in console output
   * @default true
   */
  useColors?: boolean;

  /**
   * Include timestamp in output
   * @default true
   */
  showTimestamp?: boolean;
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[90m', // Gray
  info: '\x1b[36m',  // Cyan
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
};

const RESET = '\x1b[0m';

export class ConsoleAdapter implements LogAdapter {
  name = 'console';

  private config: Required<ConsoleAdapterConfig>;

  constructor(config: ConsoleAdapterConfig = {}) {
    this.config = {
      minLevel: config.minLevel ?? 'debug',
      defaultSource: config.defaultSource ?? 'app',
      enabled: config.enabled ?? true,
      redactFields: config.redactFields ?? [],
      prefix: config.prefix ?? '[Log]',
      useColors: config.useColors ?? true,
      showTimestamp: config.showTimestamp ?? true,
    };
  }

  log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (!this.config.enabled) return;
    if (!shouldLog(level, this.config.minLevel)) return;

    const redactedMeta = redactMeta(meta, this.config.redactFields);
    const timestamp = this.config.showTimestamp
      ? new Date().toISOString().split('T')[1].slice(0, 12)
      : '';

    const levelStr = level.toUpperCase().padEnd(5);
    const prefix = this.config.prefix;

    let output: string;
    if (this.config.useColors) {
      const color = LEVEL_COLORS[level];
      output = `${color}${prefix} ${timestamp} ${levelStr}${RESET} ${message}`;
    } else {
      output = `${prefix} ${timestamp} ${levelStr} ${message}`;
    }

    // Use appropriate console method
    const consoleFn = level === 'error' ? console.error
      : level === 'warn' ? console.warn
      : level === 'debug' ? console.debug
      : console.log;

    if (redactedMeta && Object.keys(redactedMeta).length > 0) {
      consoleFn(output, redactedMeta);
    } else {
      consoleFn(output);
    }
  }

  async flush(): Promise<void> {
    // Console is synchronous, nothing to flush
  }
}
