/**
 * Firebase Performance Adapter
 *
 * Production adapter using Firebase Performance Monitoring.
 * Requires: npm install @react-native-firebase/perf
 */

import type {
  PerformanceAdapter,
  TraceHandle,
  PerformanceMetric,
  MemorySnapshot,
  LeakDetectionResult,
  RenderInfo,
} from '../types';

export class FirebaseAdapter implements PerformanceAdapter {
  readonly name = 'firebase';

  private perf: {
    startTrace: (name: string) => Promise<{
      start: () => Promise<void>;
      stop: () => Promise<void>;
      putAttribute: (name: string, value: string) => void;
      putMetric: (name: string, value: number) => void;
    }>;
    newHttpMetric: (url: string, method: string) => {
      start: () => Promise<void>;
      stop: () => Promise<void>;
      setHttpResponseCode: (code: number) => void;
      setResponseContentType: (type: string) => void;
      setResponsePayloadSize: (size: number) => void;
      setRequestPayloadSize: (size: number) => void;
    };
    setPerformanceCollectionEnabled: (enabled: boolean) => Promise<void>;
  } | null = null;

  private enabled = true;
  private attributes: Record<string, string> = {};

  async initialize(): Promise<void> {
    try {
      // Dynamic import to avoid hard dependency
      const firebasePerf = require('@react-native-firebase/perf').default;
      this.perf = firebasePerf();
    } catch (error) {
      console.warn(
        '[@rn-toolkit/performance] Firebase Performance not available.',
        'Install @react-native-firebase/perf for production monitoring.'
      );
    }
  }

  // ============================================
  // TRACES & METRICS
  // ============================================

  async startTrace(traceName: string): Promise<TraceHandle> {
    if (!this.perf || !this.enabled) {
      return {
        stop: () => {},
        putAttribute: () => {},
        putMetric: () => {},
      };
    }

    const trace = await this.perf.startTrace(traceName);
    await trace.start();

    // Apply global attributes
    Object.entries(this.attributes).forEach(([key, value]) => {
      trace.putAttribute(key, value);
    });

    return {
      stop: async (attrs?: Record<string, string | number | boolean>) => {
        if (attrs) {
          Object.entries(attrs).forEach(([key, value]) => {
            if (typeof value === 'string') {
              trace.putAttribute(key, value);
            } else if (typeof value === 'number') {
              trace.putMetric(key, value);
            }
          });
        }
        await trace.stop();
      },
      putAttribute: (name: string, value: string) => {
        trace.putAttribute(name, value);
      },
      putMetric: (name: string, value: number) => {
        trace.putMetric(name, value);
      },
    };
  }

  async recordMetric(metric: PerformanceMetric): Promise<void> {
    if (!this.perf || !this.enabled) return;

    // Create a trace for the metric
    const trace = await this.perf.startTrace(metric.name);
    await trace.start();

    // Add type as attribute
    trace.putAttribute('type', metric.type);

    // Add duration as metric
    if (metric.duration !== undefined) {
      trace.putMetric('duration_ms', metric.duration);
    }

    // Add custom attributes
    if (metric.attributes) {
      Object.entries(metric.attributes).forEach(([key, value]) => {
        if (typeof value === 'string') {
          trace.putAttribute(key, value);
        } else if (typeof value === 'number') {
          trace.putMetric(key, value);
        }
      });
    }

    // Mark anomalies
    if (metric.isAnomaly) {
      trace.putAttribute('is_anomaly', 'true');
    }

    await trace.stop();
  }

  async startNetworkTrace(url: string, method: string): Promise<TraceHandle> {
    if (!this.perf || !this.enabled) {
      return {
        stop: () => {},
        putAttribute: () => {},
        putMetric: () => {},
      };
    }

    const httpMetric = this.perf.newHttpMetric(url, method.toUpperCase());
    await httpMetric.start();

    return {
      stop: async (attrs?: Record<string, string | number | boolean>) => {
        if (attrs) {
          if (typeof attrs.statusCode === 'number') {
            httpMetric.setHttpResponseCode(attrs.statusCode);
          }
          if (typeof attrs.responseSize === 'number') {
            httpMetric.setResponsePayloadSize(attrs.responseSize);
          }
          if (typeof attrs.requestSize === 'number') {
            httpMetric.setRequestPayloadSize(attrs.requestSize);
          }
        }
        await httpMetric.stop();
      },
      putAttribute: () => {},
      putMetric: () => {},
    };
  }

  // ============================================
  // MEMORY MONITORING
  // ============================================

  async takeMemorySnapshot(): Promise<MemorySnapshot> {
    // Firebase Performance doesn't have memory APIs
    // Return basic snapshot
    return {
      timestamp: Date.now(),
      componentCount: 0,
      subscriptionCount: 0,
    };
  }

  async reportLeak(leak: LeakDetectionResult): Promise<void> {
    if (!this.perf || !this.enabled) return;

    // Report leaks as custom traces
    const trace = await this.perf.startTrace('memory_leak_detected');
    await trace.start();

    trace.putAttribute('source', leak.source);
    trace.putAttribute('leak_type', leak.leakType);
    trace.putAttribute('severity', leak.severity);
    trace.putAttribute('message', leak.message.substring(0, 100)); // Truncate for Firebase limits

    await trace.stop();
  }

  // ============================================
  // RENDER TRACKING
  // ============================================

  async recordRender(info: RenderInfo): Promise<void> {
    if (!this.perf || !this.enabled) return;

    // Only record slow renders to avoid noise
    if (info.lastRenderDuration < 16) return; // Skip if faster than 1 frame

    const trace = await this.perf.startTrace(`render_${info.componentName}`);
    await trace.start();

    trace.putMetric('render_count', info.renderCount);
    trace.putMetric('duration_ms', info.lastRenderDuration);
    trace.putMetric('avg_duration_ms', info.averageRenderDuration);
    trace.putAttribute('is_rerender', info.isRerender ? 'true' : 'false');

    await trace.stop();
  }

  async reportExcessiveRenders(
    componentName: string,
    renderCount: number,
    threshold: number
  ): Promise<void> {
    if (!this.perf || !this.enabled) return;

    const trace = await this.perf.startTrace('excessive_renders');
    await trace.start();

    trace.putAttribute('component', componentName);
    trace.putMetric('render_count', renderCount);
    trace.putMetric('threshold', threshold);

    await trace.stop();
  }

  // ============================================
  // CONFIGURATION
  // ============================================

  async setEnabled(enabled: boolean): Promise<void> {
    this.enabled = enabled;
    if (this.perf) {
      await this.perf.setPerformanceCollectionEnabled(enabled);
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async setAttributes(attributes: Record<string, string>): Promise<void> {
    this.attributes = { ...this.attributes, ...attributes };
  }
}
