/**
 * Composite Adapter
 *
 * Forwards logs to multiple adapters. Useful for:
 * - Console + Sentry in development
 * - Multiple analytics providers
 * - Conditional routing based on log level
 */

import type { LogAdapter, LogLevel } from '../types';

export interface CompositeAdapterConfig {
  /**
   * Adapters to forward logs to
   */
  adapters: LogAdapter[];

  /**
   * Optional filter: only forward certain levels to certain adapters
   * If not provided, all logs go to all adapters
   */
  routing?: {
    adapter: LogAdapter;
    levels: LogLevel[];
  }[];
}

export class CompositeAdapter implements LogAdapter {
  name = 'composite';

  private adapters: LogAdapter[];
  private routing?: Map<LogAdapter, Set<LogLevel>>;

  constructor(config: CompositeAdapterConfig) {
    this.adapters = config.adapters;

    if (config.routing) {
      this.routing = new Map();
      for (const route of config.routing) {
        this.routing.set(route.adapter, new Set(route.levels));
      }
    }
  }

  log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    for (const adapter of this.adapters) {
      // Check routing if configured
      if (this.routing) {
        const allowedLevels = this.routing.get(adapter);
        if (allowedLevels && !allowedLevels.has(level)) {
          continue;
        }
      }

      try {
        adapter.log(level, message, meta);
      } catch (error) {
        // Don't let one adapter failure break others
        console.error(`[CompositeAdapter] ${adapter.name} failed:`, error);
      }
    }
  }

  async flush(): Promise<void> {
    await Promise.all(
      this.adapters.map(adapter =>
        adapter.flush?.().catch(error => {
          console.error(`[CompositeAdapter] ${adapter.name} flush failed:`, error);
        })
      )
    );
  }

  destroy(): void {
    for (const adapter of this.adapters) {
      adapter.destroy?.();
    }
  }
}
