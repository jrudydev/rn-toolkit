/**
 * PerformanceProvider Tests
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { PerformanceProvider } from '../src/PerformanceProvider';
import { usePerformance } from '../src/hooks/usePerformance';
import { NoOpAdapter } from '../src/adapters/NoOpAdapter';
import { ConsoleAdapter } from '../src/adapters/ConsoleAdapter';
import type { PerformanceAdapter, PerformanceConfig } from '../src/types';

interface WrapperProps {
  children: React.ReactNode;
}

function createWrapper(adapter: PerformanceAdapter, config?: PerformanceConfig) {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <PerformanceProvider adapter={adapter} config={config}>
        {children}
      </PerformanceProvider>
    );
  };
}

describe('PerformanceProvider', () => {
  it('initializes_adapter_onMount', async () => {
    const adapter = new NoOpAdapter();
    const initSpy = jest.spyOn(adapter, 'initialize');

    renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(initSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('provides_isInitialized_state', async () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });
  });

  it('provides_adapterName', async () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter),
    });

    expect(result.current.adapterName).toBe('noop');
  });

  it('provides_isEnabled_state', async () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter, { enabled: true }),
    });

    expect(result.current.isEnabled).toBe(true);
  });

  it('setEnabled_updatesState', async () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter),
    });

    await act(async () => {
      await result.current.setEnabled(false);
    });

    expect(result.current.isEnabled).toBe(false);
  });
});

describe('usePerformance', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('startTrace_returnsHandle', async () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    const handle = await result.current.startTrace('test_trace');
    expect(handle).toHaveProperty('stop');
    expect(handle).toHaveProperty('putAttribute');
    expect(handle).toHaveProperty('putMetric');
  });

  it('recordMetric_callsAdapter', async () => {
    const adapter = new ConsoleAdapter({ timestamps: false });

    const { result } = renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await act(async () => {
      await result.current.recordMetric('test_metric', 'custom', 100, {
        key: 'value',
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('METRIC'),
      expect.objectContaining({ name: 'test_metric' })
    );
  });

  it('measure_recordsDuration', async () => {
    const adapter = new ConsoleAdapter({ timestamps: false });

    const { result } = renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    const returnValue = await result.current.measure('test_measure', () => {
      return 'result';
    });

    expect(returnValue).toBe('result');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('METRIC'),
      expect.objectContaining({ name: 'test_measure' })
    );
  });

  it('measure_recordsAsyncDuration', async () => {
    const adapter = new ConsoleAdapter({ timestamps: false });

    const { result } = renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    const returnValue = await result.current.measure('async_measure', async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return 'async_result';
    });

    expect(returnValue).toBe('async_result');
  });

  it('measure_marksAnomaly_onError', async () => {
    const adapter = new ConsoleAdapter({ timestamps: false });

    const { result } = renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await expect(
      result.current.measure('error_measure', () => {
        throw new Error('Test error');
      })
    ).rejects.toThrow('Test error');

    // Should have logged with isAnomaly
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('METRIC'),
      expect.objectContaining({ isAnomaly: true })
    );
  });
});

describe('PerformanceProvider config', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('debug_logsInitialization', async () => {
    const adapter = new ConsoleAdapter();

    renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter, { debug: true }),
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Performance] Initialized')
      );
    });
  });

  it('enabled_false_disablesMonitoring', async () => {
    const adapter = new ConsoleAdapter({ timestamps: false });

    const { result } = renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter, { enabled: false }),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    expect(result.current.isEnabled).toBe(false);

    // Metrics should not be recorded
    consoleSpy.mockClear();
    await result.current.recordMetric('test', 'custom');

    const metricCall = consoleSpy.mock.calls.find((call) =>
      call[0]?.includes?.('METRIC')
    );
    expect(metricCall).toBeUndefined();
  });

  it('sampleRate_filtersMetrics', async () => {
    // With sampleRate of 0, nothing should be recorded
    const adapter = new ConsoleAdapter({ timestamps: false });

    const { result } = renderHook(() => usePerformance(), {
      wrapper: createWrapper(adapter, { sampleRate: 0 }),
    });

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    consoleSpy.mockClear();

    // Record multiple metrics
    for (let i = 0; i < 10; i++) {
      await result.current.recordMetric(`metric_${i}`, 'custom');
    }

    // None should be recorded with sampleRate 0
    const metricCalls = consoleSpy.mock.calls.filter((call) =>
      call[0]?.includes?.('METRIC')
    );
    expect(metricCalls.length).toBe(0);
  });
});
