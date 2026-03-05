/**
 * Performance Adapters Tests
 */

import { NoOpAdapter } from '../src/adapters/NoOpAdapter';
import { ConsoleAdapter } from '../src/adapters/ConsoleAdapter';

describe('NoOpAdapter', () => {
  let adapter: NoOpAdapter;

  beforeEach(() => {
    adapter = new NoOpAdapter();
  });

  it('has_correct_name', () => {
    expect(adapter.name).toBe('noop');
  });

  it('initialize_resolvesWithoutError', async () => {
    await expect(adapter.initialize()).resolves.toBeUndefined();
  });

  // Trace tests
  describe('traces', () => {
    it('startTrace_returnsHandle', async () => {
      const handle = await adapter.startTrace('test_trace');
      expect(handle).toHaveProperty('stop');
      expect(handle).toHaveProperty('putAttribute');
      expect(handle).toHaveProperty('putMetric');
    });

    it('traceHandle_stop_doesNotThrow', async () => {
      const handle = await adapter.startTrace('test_trace');
      expect(() => handle.stop()).not.toThrow();
    });

    it('traceHandle_putAttribute_doesNotThrow', async () => {
      const handle = await adapter.startTrace('test_trace');
      expect(() => handle.putAttribute('key', 'value')).not.toThrow();
    });

    it('traceHandle_putMetric_doesNotThrow', async () => {
      const handle = await adapter.startTrace('test_trace');
      expect(() => handle.putMetric('count', 10)).not.toThrow();
    });

    it('recordMetric_resolvesWithoutError', async () => {
      await expect(
        adapter.recordMetric({
          name: 'test_metric',
          type: 'custom',
          startTime: Date.now(),
          duration: 100,
        })
      ).resolves.toBeUndefined();
    });

    it('startNetworkTrace_returnsHandle', async () => {
      const handle = await adapter.startNetworkTrace('https://api.example.com', 'GET');
      expect(handle).toHaveProperty('stop');
    });
  });

  // Memory tests
  describe('memory', () => {
    it('takeMemorySnapshot_returnsSnapshot', async () => {
      const snapshot = await adapter.takeMemorySnapshot();
      expect(snapshot).toHaveProperty('timestamp');
      expect(snapshot.timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('reportLeak_resolvesWithoutError', async () => {
      await expect(
        adapter.reportLeak({
          hasLeak: true,
          severity: 'warning',
          message: 'Test leak',
          source: 'TestComponent',
          leakType: 'subscription',
          suggestions: ['Test suggestion'],
        })
      ).resolves.toBeUndefined();
    });
  });

  // Render tests
  describe('render', () => {
    it('recordRender_resolvesWithoutError', async () => {
      await expect(
        adapter.recordRender({
          componentName: 'TestComponent',
          renderCount: 1,
          lastRenderDuration: 5,
          averageRenderDuration: 5,
          isRerender: false,
        })
      ).resolves.toBeUndefined();
    });

    it('reportExcessiveRenders_resolvesWithoutError', async () => {
      await expect(
        adapter.reportExcessiveRenders('TestComponent', 15, 10)
      ).resolves.toBeUndefined();
    });
  });

  // Configuration tests
  describe('configuration', () => {
    it('setEnabled_changesState', async () => {
      expect(adapter.isEnabled()).toBe(true);
      await adapter.setEnabled(false);
      expect(adapter.isEnabled()).toBe(false);
    });

    it('setAttributes_resolvesWithoutError', async () => {
      await expect(adapter.setAttributes({ env: 'test' })).resolves.toBeUndefined();
    });
  });
});

describe('ConsoleAdapter', () => {
  let adapter: ConsoleAdapter;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    adapter = new ConsoleAdapter({
      prefix: '[Test]',
      timestamps: false,
      minSeverity: 'info',
    });
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('has_correct_name', () => {
    expect(adapter.name).toBe('console');
  });

  it('initialize_logsToConsole', async () => {
    await adapter.initialize();
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Test] 📊 INIT:',
      expect.objectContaining({ adapter: 'console' })
    );
  });

  // Trace tests
  describe('traces', () => {
    it('startTrace_logsStart', async () => {
      await adapter.startTrace('test_trace');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] 📊 TRACE_START:',
        expect.objectContaining({ traceName: 'test_trace' })
      );
    });

    it('traceHandle_stop_logsStop', async () => {
      const handle = await adapter.startTrace('test_trace');
      handle.stop();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] 📊 TRACE_STOP:',
        expect.objectContaining({ traceName: 'test_trace' })
      );
    });

    it('traceHandle_stop_includesDuration', async () => {
      const handle = await adapter.startTrace('test_trace');
      // Small delay to ensure measurable duration
      await new Promise((resolve) => setTimeout(resolve, 10));
      handle.stop();

      const stopCall = consoleSpy.mock.calls.find((call) =>
        call[0].includes('TRACE_STOP')
      );
      expect(stopCall).toBeDefined();
      expect(stopCall?.[1]).toHaveProperty('duration');
    });

    it('traceHandle_putAttribute_storesAttribute', async () => {
      const handle = await adapter.startTrace('test_trace');
      handle.putAttribute('key', 'value');
      handle.stop();

      const stopCall = consoleSpy.mock.calls.find((call) =>
        call[0].includes('TRACE_STOP')
      );
      expect(stopCall?.[1].attributes).toHaveProperty('key', 'value');
    });

    it('traceHandle_putMetric_storesMetric', async () => {
      const handle = await adapter.startTrace('test_trace');
      handle.putMetric('count', 42);
      handle.stop();

      const stopCall = consoleSpy.mock.calls.find((call) =>
        call[0].includes('TRACE_STOP')
      );
      expect(stopCall?.[1].metrics).toHaveProperty('count', 42);
    });

    it('recordMetric_logsMetric', async () => {
      await adapter.recordMetric({
        name: 'test_metric',
        type: 'custom',
        startTime: Date.now(),
        duration: 100,
        attributes: { key: 'value' },
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] 📊 METRIC:',
        expect.objectContaining({
          name: 'test_metric',
          type: 'custom',
          duration: '100ms',
        })
      );
    });

    it('recordMetric_logsWarning_whenAnomaly', async () => {
      await adapter.recordMetric({
        name: 'test_metric',
        type: 'custom',
        startTime: Date.now(),
        isAnomaly: true,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] ⚠️ METRIC:',
        expect.objectContaining({ isAnomaly: true })
      );
    });

    it('startNetworkTrace_logsStart', async () => {
      await adapter.startNetworkTrace('https://api.example.com', 'GET');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] 📊 NETWORK_START:',
        expect.objectContaining({
          url: 'https://api.example.com',
          method: 'GET',
        })
      );
    });
  });

  // Memory tests
  describe('memory', () => {
    it('takeMemorySnapshot_logsAndReturns', async () => {
      const snapshot = await adapter.takeMemorySnapshot();

      expect(snapshot).toHaveProperty('timestamp');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] 📊 MEMORY_SNAPSHOT:',
        expect.objectContaining({ timestamp: expect.any(Number) })
      );
    });

    it('reportLeak_logsWithSeverity', async () => {
      await adapter.reportLeak({
        hasLeak: true,
        severity: 'error',
        message: 'Memory leak detected',
        source: 'TestComponent',
        leakType: 'subscription',
        suggestions: ['Clean up subscription'],
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] ❌ LEAK_DETECTED:',
        expect.objectContaining({
          source: 'TestComponent',
          leakType: 'subscription',
        })
      );
    });
  });

  // Render tests
  describe('render', () => {
    it('recordRender_logsInfo_forFastRender', async () => {
      await adapter.recordRender({
        componentName: 'FastComponent',
        renderCount: 1,
        lastRenderDuration: 5,
        averageRenderDuration: 5,
        isRerender: false,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] 📊 RENDER:',
        expect.objectContaining({ component: 'FastComponent' })
      );
    });

    it('recordRender_logsWarning_forSlowRender', async () => {
      await adapter.recordRender({
        componentName: 'SlowComponent',
        renderCount: 1,
        lastRenderDuration: 50,
        averageRenderDuration: 50,
        isRerender: false,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] ⚠️ RENDER:',
        expect.objectContaining({ component: 'SlowComponent' })
      );
    });

    it('reportExcessiveRenders_logsWarning', async () => {
      await adapter.reportExcessiveRenders('TestComponent', 15, 10);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] ⚠️ EXCESSIVE_RENDERS:',
        expect.objectContaining({
          component: 'TestComponent',
          renderCount: 15,
          threshold: 10,
        })
      );
    });
  });

  // Configuration tests
  describe('configuration', () => {
    it('setEnabled_logsChange', async () => {
      await adapter.setEnabled(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] 📊 SET_ENABLED:',
        { enabled: false }
      );
    });

    it('setEnabled_false_stopsLogging', async () => {
      await adapter.setEnabled(false);
      consoleSpy.mockClear();

      await adapter.recordMetric({
        name: 'test',
        type: 'custom',
        startTime: Date.now(),
      });

      // Should not log when disabled
      const metricCall = consoleSpy.mock.calls.find((call) =>
        call[0].includes('METRIC')
      );
      expect(metricCall).toBeUndefined();
    });

    it('setAttributes_logsAttributes', async () => {
      await adapter.setAttributes({ env: 'test', version: '1.0.0' });
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Test] 📊 SET_ATTRIBUTES:',
        { attributes: { env: 'test', version: '1.0.0' } }
      );
    });
  });

  // Timestamp option
  describe('timestamps', () => {
    it('includesTimestamp_whenEnabled', async () => {
      const adapterWithTimestamps = new ConsoleAdapter({ timestamps: true });
      await adapterWithTimestamps.initialize();

      const callArgs = consoleSpy.mock.calls[0][0];
      expect(callArgs).toMatch(/\d{4}-\d{2}-\d{2}T/);
    });
  });

  // Severity filtering
  describe('severity_filtering', () => {
    it('filters_lowSeverity_logs', async () => {
      const errorOnlyAdapter = new ConsoleAdapter({
        prefix: '[Err]',
        minSeverity: 'error',
      });

      // Info log should be filtered
      await errorOnlyAdapter.recordMetric({
        name: 'test',
        type: 'custom',
        startTime: Date.now(),
        isAnomaly: false,
      });

      // Check that info-level log was filtered
      const infoCall = consoleSpy.mock.calls.find(
        (call) => call[0].includes('[Err]') && call[0].includes('METRIC')
      );
      expect(infoCall).toBeUndefined();
    });
  });
});
