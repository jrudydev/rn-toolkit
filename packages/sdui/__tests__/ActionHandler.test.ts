import { createActionHandler, createEventHandlers } from '../src/ActionHandler';
import type { SDUIAction } from '../src/types';

describe('createActionHandler', () => {
  it('calls_customHandler_whenProvided', () => {
    const mockHandler = jest.fn();
    const handler = createActionHandler(mockHandler);

    const action: SDUIAction = { type: 'navigate', payload: { to: '/home' } };
    handler(action);

    expect(mockHandler).toHaveBeenCalledWith(action);
  });

  it('uses_defaultHandler_whenNoCustomHandler', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const handler = createActionHandler();

    const action: SDUIAction = { type: 'navigate', payload: { to: '/home' } };
    handler(action);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('handles_unknownActionType', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const handler = createActionHandler();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const action: SDUIAction = { type: 'unknown' as any, payload: {} };
    handler(action);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown action type'));
    consoleSpy.mockRestore();
  });
});

describe('createEventHandlers', () => {
  it('returns_emptyObject_forUndefinedActions', () => {
    const mockHandler = jest.fn();
    const handlers = createEventHandlers(undefined, mockHandler);

    expect(handlers).toEqual({});
  });

  it('creates_handlerForEachAction', () => {
    const mockHandler = jest.fn();
    const actions = {
      onPress: { type: 'navigate' as const, payload: { to: '/a' } },
      onLongPress: { type: 'api' as const, payload: { endpoint: '/api' } },
    };

    const handlers = createEventHandlers(actions, mockHandler);

    expect(handlers.onPress).toBeDefined();
    expect(handlers.onLongPress).toBeDefined();
    expect(typeof handlers.onPress).toBe('function');
    expect(typeof handlers.onLongPress).toBe('function');
  });

  it('calls_actionHandler_whenEventFires', () => {
    const mockHandler = jest.fn();
    const actions = {
      onPress: { type: 'navigate' as const, payload: { to: '/home' } },
    };

    const handlers = createEventHandlers(actions, mockHandler);
    handlers.onPress();

    expect(mockHandler).toHaveBeenCalledWith({
      type: 'navigate',
      payload: { to: '/home' },
    });
  });

  it('calls_correctAction_forMultipleEvents', () => {
    const mockHandler = jest.fn();
    const actions = {
      onPress: { type: 'navigate' as const, payload: { to: '/a' } },
      onLongPress: { type: 'navigate' as const, payload: { to: '/b' } },
    };

    const handlers = createEventHandlers(actions, mockHandler);

    handlers.onPress();
    expect(mockHandler).toHaveBeenLastCalledWith({
      type: 'navigate',
      payload: { to: '/a' },
    });

    handlers.onLongPress();
    expect(mockHandler).toHaveBeenLastCalledWith({
      type: 'navigate',
      payload: { to: '/b' },
    });
  });
});
