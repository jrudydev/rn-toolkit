/**
 * Console Performance Adapter
 *
 * A debugging adapter that logs all performance events to console.
 * Useful for development and debugging.
 */

import type {
  PerformanceAdapter,
  TraceHandle,
  PerformanceMetric,
  MemorySnapshot,
  LeakDetectionResult,
  RenderInfo,
  Severity,
} from '../types';

export interface ConsoleAdapterOptions {
  /** Log prefix */
  prefix?: string;
  /** Include timestamps in logs */
  timestamps?: boolean;
  /** Minimum severity to log */
  minSeverity?: Severity;
  /** Enable colorized output (for terminals that support it) */
  colorize?: boolean;
}

const SEVERITY_ORDER: Record<Severity, number> = {
  info: 0,
  warning: 1,
  error: 2,
  critical: 3,
};

export class ConsoleAdapter implements PerformanceAdapter {
  readonly name = 'console';

  private prefix: string;
  private timestamps: boolean;
  private minSeverity: Severity;
  private colorize: boolean;
  private enabled = true;
  private attributes: Record<string, string> = {};
  private activeTraces: Map<string, { startTime: number; attributes: Record<string, string>; metrics: Record<string, number> }> = new Map();
  private traceCounter = 0;

  constructor(options: ConsoleAdapterOptions = {}) {
    this.prefix = options.prefix ?? '[Perf]';
    this.timestamps = options.timestamps ?? false;
    this.minSeverity = options.minSeverity ?? 'info';
    this.colorize = options.colorize ?? true;
  }

  private log(level: Severity, action: string, data: Record<string, unknown>): void {
    if (!this.enabled) return;
    if (SEVERITY_ORDER[level] < SEVERITY_ORDER[this.minSeverity]) return;

    const timestamp = this.timestamps ? `${new Date().toISOString()} ` : '';
    const emoji = this.getEmoji(level);

    console.log(`${timestamp}${this.prefix} ${emoji} ${action}:`, data);
  }

  private getEmoji(severity: Severity): string {
    if (!this.colorize) return '';
    switch (severity) {
      case 'info': return '📊';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'critical': return '🚨';
    }
  }

  async initialize(): Promise<void> {
    this.log('info', 'INIT', { adapter: this.name });
  }

  // ============================================
  // TRACES & METRICS
  // ============================================

  async startTrace(traceName: string): Promise<TraceHandle> {
    const traceId = `${traceName}_${++this.traceCounter}`;
    const startTime = Date.now();

    this.activeTraces.set(traceId, {
      startTime,
      attributes: {},
      metrics: {},
    });

    this.log('info', 'TRACE_START', { traceName, traceId });

    return {
      stop: (attrs?: Record<string, string | number | boolean>) => {
        const trace = this.activeTraces.get(traceId);
        if (trace) {
          const duration = Date.now() - trace.startTime;
          this.log('info', 'TRACE_STOP', {
            traceName,
            traceId,
            duration: `${duration}ms`,
            attributes: { ...trace.attributes, ...attrs },
            metrics: trace.metrics,
          });
          this.activeTraces.delete(traceId);
        }
      },
      putAttribute: (name: string, value: string) => {
        const trace = this.activeTraces.get(traceId);
        if (trace) {
          trace.attributes[name] = value;
        }
      },
      putMetric: (name: string, value: number) => {
        const trace = this.activeTraces.get(traceId);
        if (trace) {
          trace.metrics[name] = value;
        }
      },
    };
  }

  async recordMetric(metric: PerformanceMetric): Promise<void> {
    const severity = metric.isAnomaly ? 'warning' : 'info';
    this.log(severity, 'METRIC', {
      name: metric.name,
      type: metric.type,
      duration: metric.duration ? `${metric.duration}ms` : undefined,
      attributes: metric.attributes,
      isAnomaly: metric.isAnomaly,
    });
  }

  async startNetworkTrace(url: string, method: string): Promise<TraceHandle> {
    const traceId = `network_${++this.traceCounter}`;
    const startTime = Date.now();

    this.log('info', 'NETWORK_START', { url, method, traceId });

    return {
      stop: (attrs?: Record<string, string | number | boolean>) => {
        const duration = Date.now() - startTime;
        this.log('info', 'NETWORK_COMPLETE', {
          url,
          method,
          traceId,
          duration: `${duration}ms`,
          ...attrs,
        });
      },
      putAttribute: () => {},
      putMetric: () => {},
    };
  }

  // ============================================
  // MEMORY MONITORING
  // ============================================

  async takeMemorySnapshot(): Promise<MemorySnapshot> {
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      componentCount: 0,
      subscriptionCount: 0,
    };

    // Try to get memory info if available (web/node environment)
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      if (memory) {
        snapshot.usedJSHeapSize = memory.usedJSHeapSize;
        snapshot.totalJSHeapSize = memory.totalJSHeapSize;
        snapshot.jsHeapSizeLimit = memory.jsHeapSizeLimit;
      }
    }

    this.log('info', 'MEMORY_SNAPSHOT', snapshot as unknown as Record<string, unknown>);
    return snapshot;
  }

  async reportLeak(leak: LeakDetectionResult): Promise<void> {
    this.log(leak.severity, 'LEAK_DETECTED', {
      source: leak.source,
      leakType: leak.leakType,
      message: leak.message,
      suggestions: leak.suggestions,
    });
  }

  // ============================================
  // RENDER TRACKING
  // ============================================

  async recordRender(info: RenderInfo): Promise<void> {
    const severity = info.lastRenderDuration > 16 ? 'warning' : 'info';
    this.log(severity, 'RENDER', {
      component: info.componentName,
      renderCount: info.renderCount,
      duration: `${info.lastRenderDuration.toFixed(2)}ms`,
      avgDuration: `${info.averageRenderDuration.toFixed(2)}ms`,
      isRerender: info.isRerender,
      changedProps: info.changedProps,
    });
  }

  async reportExcessiveRenders(
    componentName: string,
    renderCount: number,
    threshold: number
  ): Promise<void> {
    this.log('warning', 'EXCESSIVE_RENDERS', {
      component: componentName,
      renderCount,
      threshold,
      message: `Component rendered ${renderCount} times (threshold: ${threshold})`,
    });
  }

  // ============================================
  // CONFIGURATION
  // ============================================

  async setEnabled(enabled: boolean): Promise<void> {
    // Log before changing state (so we can log even when disabling)
    this.enabled = true; // Temporarily enable to log
    this.log('info', 'SET_ENABLED', { enabled });
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async setAttributes(attributes: Record<string, string>): Promise<void> {
    this.attributes = { ...this.attributes, ...attributes };
    this.log('info', 'SET_ATTRIBUTES', { attributes });
  }
}
