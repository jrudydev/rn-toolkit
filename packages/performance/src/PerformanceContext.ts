/**
 * Performance Context
 *
 * React context for performance monitoring functionality.
 */

import { createContext } from 'react';
import type { PerformanceContextValue, TraceHandle, MemorySnapshot } from './types';

/**
 * No-op trace handle
 */
const noopTraceHandle: TraceHandle = {
  stop: () => {},
  putAttribute: () => {},
  putMetric: () => {},
};

/**
 * Default context value (before initialization)
 */
const defaultContextValue: PerformanceContextValue = {
  isInitialized: false,
  adapterName: 'none',
  isEnabled: false,

  // Trace methods (return no-op)
  startTrace: async () => noopTraceHandle,
  recordMetric: async () => {},

  // Memory methods
  takeMemorySnapshot: async () => ({
    timestamp: Date.now(),
    componentCount: 0,
    subscriptionCount: 0,
  } as MemorySnapshot),
  reportLeak: async () => {},

  // Render methods
  recordRender: async () => {},

  // Configuration
  setEnabled: async () => {},
};

/**
 * Performance Context
 *
 * Provides performance monitoring functionality throughout the app.
 */
export const PerformanceContext = createContext<PerformanceContextValue>(defaultContextValue);
