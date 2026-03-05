/**
 * HistoryStack Tests
 */

import { HistoryStack } from '../src/HistoryStack';
import type { ParsedRoute } from '../src/types';

// Helper to create mock routes
function createMockRoute(name: string, path: string = `/${name}`): ParsedRoute {
  return {
    pattern: path,
    path,
    name,
    params: {},
    query: {},
    hash: '',
  };
}

describe('HistoryStack', () => {
  describe('constructor', () => {
    it('creates_emptyStack', () => {
      const stack = new HistoryStack();

      expect(stack.entries).toEqual([]);
      expect(stack.currentIndex).toBe(-1);
    });

    it('accepts_maxSize', () => {
      const stack = new HistoryStack({ maxSize: 5 });

      // Push 10 entries
      for (let i = 0; i < 10; i++) {
        stack.push(createMockRoute(`route-${i}`));
      }

      // Should only keep the last 5
      expect(stack.entries.length).toBe(5);
    });
  });

  describe('push', () => {
    it('adds_entry_toEmptyStack', () => {
      const stack = new HistoryStack();
      const route = createMockRoute('home');

      stack.push(route);

      expect(stack.entries.length).toBe(1);
      expect(stack.currentIndex).toBe(0);
      expect(stack.entries[0].route).toBe(route);
    });

    it('adds_entry_toExistingStack', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));
      stack.push(createMockRoute('profile'));

      expect(stack.entries.length).toBe(2);
      expect(stack.currentIndex).toBe(1);
    });

    it('stores_state', () => {
      const stack = new HistoryStack();
      const state = { tab: 'posts', scroll: 100 };

      stack.push(createMockRoute('profile'), state);

      expect(stack.entries[0].state?.data).toEqual(state);
    });

    it('generates_uniqueId', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));
      stack.push(createMockRoute('profile'));

      expect(stack.entries[0].id).not.toBe(stack.entries[1].id);
    });

    it('records_timestamp', () => {
      const before = Date.now();
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));
      const after = Date.now();

      expect(stack.entries[0].timestamp).toBeGreaterThanOrEqual(before);
      expect(stack.entries[0].timestamp).toBeLessThanOrEqual(after);
    });

    it('clears_forwardHistory_whenPushing', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));
      stack.push(createMockRoute('profile'));
      stack.push(createMockRoute('settings'));

      // Go back twice
      stack.goBack();
      stack.goBack();

      // Push new route
      stack.push(createMockRoute('new'));

      expect(stack.entries.length).toBe(2);
      expect(stack.currentIndex).toBe(1);
      expect(stack.entries[1].route.name).toBe('new');
    });

    it('calls_onChange', () => {
      const onChange = jest.fn();
      const stack = new HistoryStack({ onChange });
      const route = createMockRoute('home');

      stack.push(route);

      expect(onChange).toHaveBeenCalledWith(stack.entries, 0);
    });

    it('enforces_maxSize', () => {
      const stack = new HistoryStack({ maxSize: 3 });

      stack.push(createMockRoute('a'));
      stack.push(createMockRoute('b'));
      stack.push(createMockRoute('c'));
      stack.push(createMockRoute('d'));

      expect(stack.entries.length).toBe(3);
      expect(stack.entries[0].route.name).toBe('b');
      expect(stack.entries[2].route.name).toBe('d');
    });
  });

  describe('replace', () => {
    it('replaces_currentEntry', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));
      stack.push(createMockRoute('profile'));

      stack.replace(createMockRoute('newProfile'));

      expect(stack.entries.length).toBe(2);
      expect(stack.entries[1].route.name).toBe('newProfile');
    });

    it('replaces_withState', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));

      stack.replace(createMockRoute('home'), { refreshed: true });

      expect(stack.entries[0].state?.data).toEqual({ refreshed: true });
    });

    it('pushes_ifStackEmpty', () => {
      const stack = new HistoryStack();

      stack.replace(createMockRoute('home'));

      expect(stack.entries.length).toBe(1);
    });
  });

  describe('goBack', () => {
    it('returns_null_whenAtStart', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));

      const result = stack.goBack();

      expect(result).toBeNull();
      expect(stack.currentIndex).toBe(0);
    });

    it('returns_previousEntry', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));
      stack.push(createMockRoute('profile'));

      const result = stack.goBack();

      expect(result?.route.name).toBe('home');
      expect(stack.currentIndex).toBe(0);
    });

    it('preserves_state_onGoBack', () => {
      const stack = new HistoryStack();
      const homeState = { scroll: 500 };
      stack.push(createMockRoute('home'), homeState);
      stack.push(createMockRoute('profile'));

      stack.goBack();

      expect(stack.entries[stack.currentIndex].state?.data).toEqual(homeState);
    });

    it('calls_onChange', () => {
      const onChange = jest.fn();
      const stack = new HistoryStack({ onChange });
      stack.push(createMockRoute('home'));
      stack.push(createMockRoute('profile'));

      onChange.mockClear();
      stack.goBack();

      expect(onChange).toHaveBeenCalledWith(stack.entries, 0);
    });
  });

  describe('goForward', () => {
    it('returns_null_whenAtEnd', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));

      const result = stack.goForward();

      expect(result).toBeNull();
    });

    it('returns_nextEntry', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));
      stack.push(createMockRoute('profile'));
      stack.goBack();

      const result = stack.goForward();

      expect(result?.route.name).toBe('profile');
      expect(stack.currentIndex).toBe(1);
    });
  });

  describe('reset', () => {
    it('clears_allEntries', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));
      stack.push(createMockRoute('profile'));
      stack.push(createMockRoute('settings'));

      stack.reset(createMockRoute('newHome'));

      expect(stack.entries.length).toBe(1);
      expect(stack.currentIndex).toBe(0);
      expect(stack.entries[0].route.name).toBe('newHome');
    });

    it('sets_initialState', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('old'));

      stack.reset(createMockRoute('new'), { initial: true });

      expect(stack.entries[0].state?.data).toEqual({ initial: true });
    });
  });

  describe('canGoBack', () => {
    it('returns_false_whenEmpty', () => {
      const stack = new HistoryStack();

      expect(stack.canGoBack).toBe(false);
    });

    it('returns_false_whenAtStart', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));

      expect(stack.canGoBack).toBe(false);
    });

    it('returns_true_whenNotAtStart', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));
      stack.push(createMockRoute('profile'));

      expect(stack.canGoBack).toBe(true);
    });
  });

  describe('canGoForward', () => {
    it('returns_false_whenAtEnd', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));

      expect(stack.canGoForward).toBe(false);
    });

    it('returns_true_whenNotAtEnd', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));
      stack.push(createMockRoute('profile'));
      stack.goBack();

      expect(stack.canGoForward).toBe(true);
    });
  });

  describe('current', () => {
    it('returns_null_whenEmpty', () => {
      const stack = new HistoryStack();

      expect(stack.current).toBeNull();
    });

    it('returns_currentEntry', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'));

      expect(stack.current?.route.name).toBe('home');
    });
  });

  describe('getState', () => {
    it('returns_undefined_whenEmpty', () => {
      const stack = new HistoryStack();

      expect(stack.getState()).toBeUndefined();
    });

    it('returns_currentState', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'), { foo: 'bar' });

      expect(stack.getState()).toEqual({ foo: 'bar' });
    });

    it('returns_typed_state', () => {
      interface MyState {
        count: number;
      }

      const stack = new HistoryStack();
      stack.push(createMockRoute('home'), { count: 42 });

      const state = stack.getState<MyState>();
      expect(state?.count).toBe(42);
    });
  });

  describe('setState', () => {
    it('updates_currentState', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('home'), { old: true });

      stack.setState({ new: true });

      expect(stack.getState()).toEqual({ new: true });
    });

    it('doesNothing_whenEmpty', () => {
      const stack = new HistoryStack();

      // Should not throw
      stack.setState({ foo: 'bar' });

      expect(stack.getState()).toBeUndefined();
    });
  });

  describe('goTo', () => {
    it('navigates_toSpecificIndex', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('a'));
      stack.push(createMockRoute('b'));
      stack.push(createMockRoute('c'));
      stack.push(createMockRoute('d'));

      stack.goTo(1);

      expect(stack.currentIndex).toBe(1);
      expect(stack.current?.route.name).toBe('b');
    });

    it('clamps_toValidRange', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('a'));
      stack.push(createMockRoute('b'));

      stack.goTo(100);
      expect(stack.currentIndex).toBe(1);

      stack.goTo(-10);
      expect(stack.currentIndex).toBe(0);
    });
  });

  describe('clear', () => {
    it('removes_allEntries', () => {
      const stack = new HistoryStack();
      stack.push(createMockRoute('a'));
      stack.push(createMockRoute('b'));

      stack.clear();

      expect(stack.entries).toEqual([]);
      expect(stack.currentIndex).toBe(-1);
    });
  });
});
