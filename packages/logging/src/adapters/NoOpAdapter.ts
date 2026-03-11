/**
 * NoOp Adapter
 *
 * Silently discards all logs. Useful for:
 * - Production builds where logging is disabled
 * - Testing without log noise
 * - Feature flags that disable logging
 */

import type { LogAdapter, LogLevel } from '../types';

export class NoOpAdapter implements LogAdapter {
  name = 'noop';

  log(_level: LogLevel, _message: string, _meta?: Record<string, unknown>): void {
    // Intentionally empty - discard all logs
  }

  async flush(): Promise<void> {
    // Nothing to flush
  }
}
