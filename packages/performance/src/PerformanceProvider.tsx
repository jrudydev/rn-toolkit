/**
 * Performance Provider
 *
 * React provider component for performance monitoring with adapter pattern.
 */

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { PerformanceContext } from './PerformanceContext';
import type {
  PerformanceAdapter,
  PerformanceConfig,
  PerformanceContextValue,
  PerformanceMetric,
  TraceHandle,
  MemorySnapshot,
  LeakDetectionResult,
  RenderInfo,
} from './types';

export interface PerformanceProviderProps {
  /** Performance adapter instance */
  adapter: PerformanceAdapter;
  /** Configuration options */
  config?: PerformanceConfig;
  /** Children components */
  children: React.ReactNode;
}

/**
 * Performance Provider Component
 *
 * Wraps your app and provides performance monitoring through context.
 *
 * @example
 * ```tsx
 * import { PerformanceProvider, ConsoleAdapter } from '@rn-toolkit/performance';
 *
 * const adapter = new ConsoleAdapter({ prefix: '[Perf]' });
 *
 * function App() {
 *   return (
 *     <PerformanceProvider adapter={adapter} config={{ debug: __DEV__ }}>
 *       <MyApp />
 *     </PerformanceProvider>
 *   );
 * }
 * ```
 */
export function PerformanceProvider({
  adapter,
  config = {},
  children,
}: PerformanceProviderProps): React.ReactElement {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isEnabled, setIsEnabledState] = useState(config.enabled !== false);

  const adapterRef = useRef(adapter);
  const configRef = useRef(config);

  // Initialize adapter
  useEffect(() => {
    const initializeAdapter = async () => {
      try {
        await adapterRef.current.initialize();

        // Apply initial enabled state
        await adapterRef.current.setEnabled(configRef.current.enabled !== false);

        if (configRef.current.debug) {
          console.log(`[Performance] Initialized with ${adapterRef.current.name} adapter`);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('[Performance] Failed to initialize:', error);
      }
    };

    initializeAdapter();
  }, []);

  // Start trace
  const startTrace = useCallback(async (traceName: string): Promise<TraceHandle> => {
    if (!isEnabled) {
      return {
        stop: () => {},
        putAttribute: () => {},
        putMetric: () => {},
      };
    }

    // Apply sample rate
    if (configRef.current.sampleRate !== undefined && configRef.current.sampleRate < 1) {
      if (Math.random() > configRef.current.sampleRate) {
        return {
          stop: () => {},
          putAttribute: () => {},
          putMetric: () => {},
        };
      }
    }

    return adapterRef.current.startTrace(traceName);
  }, [isEnabled]);

  // Record metric
  const recordMetric = useCallback(async (metric: PerformanceMetric): Promise<void> => {
    if (!isEnabled) return;

    // Apply sample rate
    if (configRef.current.sampleRate !== undefined && configRef.current.sampleRate < 1) {
      if (Math.random() > configRef.current.sampleRate) return;
    }

    await adapterRef.current.recordMetric(metric);
  }, [isEnabled]);

  // Take memory snapshot
  const takeMemorySnapshot = useCallback(async (): Promise<MemorySnapshot> => {
    return adapterRef.current.takeMemorySnapshot();
  }, []);

  // Report leak
  const reportLeak = useCallback(async (leak: LeakDetectionResult): Promise<void> => {
    if (!isEnabled) return;

    if (configRef.current.debug) {
      console.warn(`[Performance] Leak detected in ${leak.source}:`, leak.message);
    }

    await adapterRef.current.reportLeak(leak);
  }, [isEnabled]);

  // Record render
  const recordRender = useCallback(async (info: RenderInfo): Promise<void> => {
    if (!isEnabled || !configRef.current.trackRenders) return;

    // Check thresholds
    const durationThreshold = configRef.current.renderDurationThreshold ?? 16;
    const countThreshold = configRef.current.renderCountThreshold ?? 10;

    // Report excessive renders
    if (info.renderCount > countThreshold) {
      await adapterRef.current.reportExcessiveRenders(
        info.componentName,
        info.renderCount,
        countThreshold
      );
    }

    // Only record slow renders by default
    if (info.lastRenderDuration >= durationThreshold) {
      await adapterRef.current.recordRender(info);
    }
  }, [isEnabled]);

  // Set enabled
  const setEnabled = useCallback(async (enabled: boolean): Promise<void> => {
    setIsEnabledState(enabled);
    await adapterRef.current.setEnabled(enabled);

    if (configRef.current.debug) {
      console.log(`[Performance] Monitoring ${enabled ? 'enabled' : 'disabled'}`);
    }
  }, []);

  // Create context value
  const contextValue = useMemo<PerformanceContextValue>(
    () => ({
      isInitialized,
      adapterName: adapterRef.current.name,
      isEnabled,
      startTrace,
      recordMetric,
      takeMemorySnapshot,
      reportLeak,
      recordRender,
      setEnabled,
    }),
    [
      isInitialized,
      isEnabled,
      startTrace,
      recordMetric,
      takeMemorySnapshot,
      reportLeak,
      recordRender,
      setEnabled,
    ]
  );

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
}
