/**
 * NoOp Performance Adapter
 *
 * A silent adapter that does nothing.
 * Useful for testing or when performance monitoring is disabled.
 */

import type {
  PerformanceAdapter,
  TraceHandle,
  PerformanceMetric,
  MemorySnapshot,
  LeakDetectionResult,
  RenderInfo,
} from '../types';

/**
 * No-op trace handle
 */
const noopTraceHandle: TraceHandle = {
  stop: () => {},
  putAttribute: () => {},
  putMetric: () => {},
};

export class NoOpAdapter implements PerformanceAdapter {
  readonly name = 'noop';

  private enabled = true;

  async initialize(): Promise<void> {
    // No-op
  }

  // ============================================
  // TRACES & METRICS
  // ============================================

  async startTrace(_traceName: string): Promise<TraceHandle> {
    return noopTraceHandle;
  }

  async recordMetric(_metric: PerformanceMetric): Promise<void> {
    // No-op
  }

  async startNetworkTrace(_url: string, _method: string): Promise<TraceHandle> {
    return noopTraceHandle;
  }

  // ============================================
  // MEMORY MONITORING
  // ============================================

  async takeMemorySnapshot(): Promise<MemorySnapshot> {
    return {
      timestamp: Date.now(),
      componentCount: 0,
      subscriptionCount: 0,
    };
  }

  async reportLeak(_leak: LeakDetectionResult): Promise<void> {
    // No-op
  }

  // ============================================
  // RENDER TRACKING
  // ============================================

  async recordRender(_info: RenderInfo): Promise<void> {
    // No-op
  }

  async reportExcessiveRenders(
    _componentName: string,
    _renderCount: number,
    _threshold: number
  ): Promise<void> {
    // No-op
  }

  // ============================================
  // CONFIGURATION
  // ============================================

  async setEnabled(enabled: boolean): Promise<void> {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async setAttributes(_attributes: Record<string, string>): Promise<void> {
    // No-op
  }
}
