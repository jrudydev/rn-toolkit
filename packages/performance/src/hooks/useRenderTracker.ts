/**
 * useRenderTracker Hook
 *
 * Hook for tracking component renders and detecting excessive re-renders.
 */

import { useContext, useEffect, useRef } from 'react';
import { PerformanceContext } from '../PerformanceContext';
import type { RenderInfo } from '../types';

export interface UseRenderTrackerOptions {
  /** Component name for tracking */
  componentName: string;
  /** Render count threshold for warnings */
  threshold?: number;
  /** Props to track for changes */
  trackedProps?: Record<string, unknown>;
  /** Whether to log renders to console */
  logToConsole?: boolean;
}

export interface UseRenderTrackerResult {
  /** Current render count */
  renderCount: number;
  /** Average render duration (ms) */
  averageRenderDuration: number;
  /** Last render duration (ms) */
  lastRenderDuration: number;
  /** Get render info */
  getRenderInfo: () => RenderInfo;
}

/**
 * Hook for tracking component renders
 *
 * @param options - Render tracker options
 * @returns Render tracking info
 *
 * @example
 * ```tsx
 * import { useRenderTracker } from '@astacinco/rn-performance';
 *
 * function ExpensiveComponent({ data, filter }) {
 *   const { renderCount, averageRenderDuration } = useRenderTracker({
 *     componentName: 'ExpensiveComponent',
 *     threshold: 5,
 *     trackedProps: { data, filter },
 *     logToConsole: __DEV__,
 *   });
 *
 *   // In dev, you'll see warnings if this component re-renders too much
 *
 *   return <View>...</View>;
 * }
 * ```
 */
export function useRenderTracker(options: UseRenderTrackerOptions): UseRenderTrackerResult {
  const context = useContext(PerformanceContext);
  const { componentName, threshold = 10, trackedProps, logToConsole = false } = options;

  // Track render count
  const renderCount = useRef(0);
  // Track render durations
  const renderDurations = useRef<number[]>([]);
  // Track render start time
  const renderStartTime = useRef(Date.now());
  // Track previous props
  const prevProps = useRef<Record<string, unknown>>({});

  // Increment render count and track start time
  renderCount.current += 1;
  renderStartTime.current = Date.now();

  // Calculate which props changed (only after first render)
  const changedProps: string[] = [];
  const isFirstRender = renderCount.current === 1;
  if (trackedProps && !isFirstRender) {
    Object.entries(trackedProps).forEach(([key, value]) => {
      if (prevProps.current[key] !== value) {
        changedProps.push(key);
      }
    });
  }
  // Always update prevProps for next render comparison
  if (trackedProps) {
    prevProps.current = { ...trackedProps };
  }

  // Track render completion
  useEffect(() => {
    const renderDuration = Date.now() - renderStartTime.current;
    renderDurations.current.push(renderDuration);

    // Keep only last 20 durations
    if (renderDurations.current.length > 20) {
      renderDurations.current.shift();
    }

    const avgDuration = renderDurations.current.reduce((a, b) => a + b, 0) / renderDurations.current.length;
    const isRerender = renderCount.current > 1;

    const renderInfo: RenderInfo = {
      componentName,
      renderCount: renderCount.current,
      lastRenderDuration: renderDuration,
      averageRenderDuration: avgDuration,
      isRerender,
      changedProps: changedProps.length > 0 ? changedProps : undefined,
    };

    // Log to console if enabled
    if (logToConsole) {
      console.log(
        `[Render] ${componentName} #${renderCount.current}`,
        `(${renderDuration.toFixed(2)}ms)`,
        changedProps.length > 0 ? `Changed: ${changedProps.join(', ')}` : ''
      );
    }

    // Report to context
    context.recordRender(renderInfo);

    // Check threshold
    if (renderCount.current > threshold) {
      if (logToConsole) {
        console.warn(
          `[Performance] ${componentName} has rendered ${renderCount.current} times (threshold: ${threshold})`
        );
      }
    }
  });

  // Calculate average duration
  const averageRenderDuration =
    renderDurations.current.length > 0
      ? renderDurations.current.reduce((a, b) => a + b, 0) / renderDurations.current.length
      : 0;

  const lastRenderDuration =
    renderDurations.current.length > 0
      ? renderDurations.current[renderDurations.current.length - 1]
      : 0;

  // Get render info
  const getRenderInfo = (): RenderInfo => ({
    componentName,
    renderCount: renderCount.current,
    lastRenderDuration,
    averageRenderDuration,
    isRerender: renderCount.current > 1,
    changedProps: changedProps.length > 0 ? changedProps : undefined,
  });

  return {
    renderCount: renderCount.current,
    averageRenderDuration,
    lastRenderDuration,
    getRenderInfo,
  };
}
