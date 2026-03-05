/**
 * usePerformance Hook
 *
 * Main hook for accessing performance monitoring functions.
 */

import { useContext, useCallback } from 'react';
import { PerformanceContext } from '../PerformanceContext';
import type { PerformanceMetric, TraceHandle, MetricType } from '../types';

export interface UsePerformanceResult {
  /** Whether the adapter is initialized */
  isInitialized: boolean;
  /** Current adapter name */
  adapterName: string;
  /** Whether monitoring is enabled */
  isEnabled: boolean;

  /** Start a performance trace */
  startTrace: (traceName: string) => Promise<TraceHandle>;

  /** Record a custom metric */
  recordMetric: (
    name: string,
    type: MetricType,
    duration?: number,
    attributes?: Record<string, string | number | boolean>
  ) => Promise<void>;

  /** Measure a function's execution time */
  measure: <T>(
    name: string,
    fn: () => T | Promise<T>,
    type?: MetricType
  ) => Promise<T>;

  /** Enable or disable monitoring */
  setEnabled: (enabled: boolean) => Promise<void>;
}

/**
 * Hook for accessing performance monitoring functions
 *
 * @returns Performance monitoring functions
 *
 * @example
 * ```tsx
 * import { usePerformance } from '@rn-toolkit/performance';
 *
 * function DataFetcher() {
 *   const { measure, recordMetric, startTrace } = usePerformance();
 *
 *   // Measure async operations
 *   const fetchData = async () => {
 *     const data = await measure('fetch_users', async () => {
 *       return api.getUsers();
 *     }, 'network');
 *
 *     return data;
 *   };
 *
 *   // Manual trace control
 *   const processData = async () => {
 *     const trace = await startTrace('process_data');
 *     trace.putAttribute('count', data.length.toString());
 *
 *     // ... do work ...
 *
 *     trace.putMetric('items_processed', data.length);
 *     trace.stop();
 *   };
 *
 *   // Record custom metrics
 *   const handleButtonPress = () => {
 *     recordMetric('button_press', 'custom', undefined, {
 *       button_name: 'submit',
 *     });
 *   };
 * }
 * ```
 */
export function usePerformance(): UsePerformanceResult {
  const context = useContext(PerformanceContext);

  // Record a custom metric with simpler API
  const recordMetric = useCallback(
    async (
      name: string,
      type: MetricType,
      duration?: number,
      attributes?: Record<string, string | number | boolean>
    ): Promise<void> => {
      const metric: PerformanceMetric = {
        name,
        type,
        duration,
        startTime: Date.now() - (duration ?? 0),
        endTime: Date.now(),
        attributes,
      };

      await context.recordMetric(metric);
    },
    [context]
  );

  // Measure a function's execution time
  const measure = useCallback(
    async <T>(
      name: string,
      fn: () => T | Promise<T>,
      type: MetricType = 'custom'
    ): Promise<T> => {
      const startTime = Date.now();

      try {
        const result = await fn();
        const duration = Date.now() - startTime;

        await context.recordMetric({
          name,
          type,
          duration,
          startTime,
          endTime: Date.now(),
          isAnomaly: false,
        });

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        await context.recordMetric({
          name,
          type,
          duration,
          startTime,
          endTime: Date.now(),
          isAnomaly: true,
          attributes: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });

        throw error;
      }
    },
    [context]
  );

  return {
    isInitialized: context.isInitialized,
    adapterName: context.adapterName,
    isEnabled: context.isEnabled,
    startTrace: context.startTrace,
    recordMetric,
    measure,
    setEnabled: context.setEnabled,
  };
}
