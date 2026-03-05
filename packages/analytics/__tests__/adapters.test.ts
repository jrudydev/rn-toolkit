/**
 * Analytics Adapters Tests
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

  it('logEvent_resolvesWithoutError', async () => {
    await expect(adapter.logEvent('test_event', { key: 'value' })).resolves.toBeUndefined();
  });

  it('logScreenView_resolvesWithoutError', async () => {
    await expect(adapter.logScreenView('TestScreen', 'TestClass')).resolves.toBeUndefined();
  });

  it('setUserId_resolvesWithoutError', async () => {
    await expect(adapter.setUserId('user123')).resolves.toBeUndefined();
    await expect(adapter.setUserId(null)).resolves.toBeUndefined();
  });

  it('setUserProperties_resolvesWithoutError', async () => {
    await expect(adapter.setUserProperties({ plan: 'premium' })).resolves.toBeUndefined();
  });

  it('setUserProperty_resolvesWithoutError', async () => {
    await expect(adapter.setUserProperty('plan', 'premium')).resolves.toBeUndefined();
  });

  it('setAnalyticsCollectionEnabled_resolvesWithoutError', async () => {
    await expect(adapter.setAnalyticsCollectionEnabled(true)).resolves.toBeUndefined();
    await expect(adapter.setAnalyticsCollectionEnabled(false)).resolves.toBeUndefined();
  });

  it('resetAnalyticsData_resolvesWithoutError', async () => {
    await expect(adapter.resetAnalyticsData()).resolves.toBeUndefined();
  });

  it('getSessionId_returnsNull', async () => {
    const sessionId = await adapter.getSessionId();
    expect(sessionId).toBeNull();
  });

  it('getAppInstanceId_returnsNull', async () => {
    const appInstanceId = await adapter.getAppInstanceId();
    expect(appInstanceId).toBeNull();
  });

  it('logAppOpen_resolvesWithoutError', async () => {
    await expect(adapter.logAppOpen()).resolves.toBeUndefined();
  });

  it('logSignUp_resolvesWithoutError', async () => {
    await expect(adapter.logSignUp('email')).resolves.toBeUndefined();
  });

  it('logLogin_resolvesWithoutError', async () => {
    await expect(adapter.logLogin('google')).resolves.toBeUndefined();
  });

  it('logShare_resolvesWithoutError', async () => {
    await expect(adapter.logShare('article', 'article123', 'twitter')).resolves.toBeUndefined();
  });

  it('logSearch_resolvesWithoutError', async () => {
    await expect(adapter.logSearch('test query')).resolves.toBeUndefined();
  });

  it('logSelectContent_resolvesWithoutError', async () => {
    await expect(adapter.logSelectContent('product', 'product123')).resolves.toBeUndefined();
  });

  it('logPurchase_resolvesWithoutError', async () => {
    const items = [{ itemId: 'item1', itemName: 'Item 1', price: 10, quantity: 1 }];
    await expect(adapter.logPurchase(10, 'USD', items, 'txn123')).resolves.toBeUndefined();
  });

  it('logAddToCart_resolvesWithoutError', async () => {
    const items = [{ itemId: 'item1', itemName: 'Item 1', price: 10, quantity: 1 }];
    await expect(adapter.logAddToCart(10, 'USD', items)).resolves.toBeUndefined();
  });

  it('logBeginCheckout_resolvesWithoutError', async () => {
    const items = [{ itemId: 'item1', itemName: 'Item 1', price: 10, quantity: 1 }];
    await expect(adapter.logBeginCheckout(10, 'USD', items)).resolves.toBeUndefined();
  });
});

describe('ConsoleAdapter', () => {
  let adapter: ConsoleAdapter;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    adapter = new ConsoleAdapter({ prefix: '[Test]', timestamps: false });
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
    expect(consoleSpy).toHaveBeenCalledWith('[Test] INIT:', { adapter: 'console' });
  });

  it('logEvent_logsToConsole', async () => {
    await adapter.logEvent('test_event', { key: 'value' });
    expect(consoleSpy).toHaveBeenCalledWith('[Test] EVENT:', {
      name: 'test_event',
      params: { key: 'value' },
      userId: null,
    });
  });

  it('logScreenView_logsToConsole', async () => {
    await adapter.logScreenView('HomeScreen', 'HomeScreenClass');
    expect(consoleSpy).toHaveBeenCalledWith('[Test] SCREEN_VIEW:', {
      screenName: 'HomeScreen',
      screenClass: 'HomeScreenClass',
      userId: null,
    });
  });

  it('setUserId_logsAndStoresUserId', async () => {
    await adapter.setUserId('user123');
    expect(consoleSpy).toHaveBeenCalledWith('[Test] SET_USER_ID:', { userId: 'user123' });

    // Verify userId is stored
    await adapter.logEvent('test', {});
    expect(consoleSpy).toHaveBeenLastCalledWith('[Test] EVENT:', {
      name: 'test',
      params: {},
      userId: 'user123',
    });
  });

  it('setUserProperties_logsAndStoresProperties', async () => {
    await adapter.setUserProperties({ plan: 'premium', level: 5 });
    expect(consoleSpy).toHaveBeenCalledWith('[Test] SET_USER_PROPERTIES:', {
      properties: { plan: 'premium', level: 5 },
      all: { plan: 'premium', level: 5 },
    });
  });

  it('setUserProperty_logsAndStoresProperty', async () => {
    await adapter.setUserProperty('theme', 'dark');
    expect(consoleSpy).toHaveBeenCalledWith('[Test] SET_USER_PROPERTY:', {
      name: 'theme',
      value: 'dark',
    });
  });

  it('resetAnalyticsData_clearsUserData', async () => {
    await adapter.setUserId('user123');
    await adapter.setUserProperties({ plan: 'premium' });
    await adapter.resetAnalyticsData();

    expect(consoleSpy).toHaveBeenCalledWith('[Test] RESET:', {});

    // Verify data is cleared
    await adapter.logEvent('test', {});
    expect(consoleSpy).toHaveBeenLastCalledWith('[Test] EVENT:', {
      name: 'test',
      params: {},
      userId: null,
    });
  });

  it('getSessionId_returnsString', async () => {
    const sessionId = await adapter.getSessionId();
    expect(sessionId).toMatch(/^console-session-\d+$/);
  });

  it('getAppInstanceId_returnsString', async () => {
    const appInstanceId = await adapter.getAppInstanceId();
    expect(appInstanceId).toMatch(/^console-instance-\d+$/);
  });

  it('logPurchase_logsEcommerceData', async () => {
    const items = [
      { itemId: 'item1', itemName: 'Product 1', price: 29.99, quantity: 2 },
    ];
    await adapter.logPurchase(59.98, 'USD', items, 'txn-123');
    expect(consoleSpy).toHaveBeenCalledWith('[Test] PURCHASE:', {
      value: 59.98,
      currency: 'USD',
      items,
      transactionId: 'txn-123',
      userId: null,
    });
  });

  it('respects_timestamps_option', async () => {
    const adapterWithTimestamps = new ConsoleAdapter({ timestamps: true });
    await adapterWithTimestamps.initialize();

    // Should include ISO timestamp in the log
    expect(consoleSpy).toHaveBeenCalled();
    const callArgs = consoleSpy.mock.calls[0][0];
    expect(callArgs).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });
});
