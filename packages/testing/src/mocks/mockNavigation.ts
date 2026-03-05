/**
 * Mock navigation utilities for testing.
 * These mocks simulate the @rn-toolkit/deeplink package behavior.
 */

export interface MockNavigationState {
  history: string[];
  currentIndex: number;
}

export interface MockNavigationReturn {
  /**
   * Navigate to a route
   */
  navigate: (route: string, params?: Record<string, string>) => void;

  /**
   * Go back in history
   */
  back: () => void;

  /**
   * Get current route
   */
  currentRoute: () => string;

  /**
   * Get navigation history
   */
  getHistory: () => string[];

  /**
   * Reset navigation state
   */
  reset: () => void;

  /**
   * Get the internal state (for assertions)
   */
  getState: () => MockNavigationState;
}

/**
 * Creates a mock navigation instance for testing.
 *
 * @param initialRoute - Starting route, defaults to '/home'
 * @returns Mock navigation utilities
 *
 * @example
 * ```typescript
 * const nav = mockNavigation('/home');
 *
 * nav.navigate('/profile/123');
 * expect(nav.currentRoute()).toBe('/profile/123');
 *
 * nav.back();
 * expect(nav.currentRoute()).toBe('/home');
 * ```
 */
export function mockNavigation(initialRoute: string = '/home'): MockNavigationReturn {
  const state: MockNavigationState = {
    history: [initialRoute],
    currentIndex: 0,
  };

  return {
    navigate(route: string, params?: Record<string, string>) {
      let finalRoute = route;

      // Replace route params (e.g., /profile/:id -> /profile/123)
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          finalRoute = finalRoute.replace(`:${key}`, value);
        });
      }

      // Remove forward history if navigating from middle
      state.history = state.history.slice(0, state.currentIndex + 1);
      state.history.push(finalRoute);
      state.currentIndex = state.history.length - 1;
    },

    back() {
      if (state.currentIndex > 0) {
        state.currentIndex--;
      }
    },

    currentRoute() {
      return state.history[state.currentIndex];
    },

    getHistory() {
      return [...state.history];
    },

    reset() {
      state.history = [initialRoute];
      state.currentIndex = 0;
    },

    getState() {
      return { ...state };
    },
  };
}

/**
 * Creates a Jest mock for the useDeepLink hook.
 * Use this with jest.mock() to replace the real implementation.
 *
 * @example
 * ```typescript
 * jest.mock('@rn-toolkit/deeplink', () => ({
 *   useDeepLink: createMockUseDeepLink(),
 * }));
 * ```
 */
export function createMockUseDeepLink(initialRoute: string = '/home') {
  const nav = mockNavigation(initialRoute);

  return () => ({
    navigate: nav.navigate,
    back: nav.back,
    currentRoute: nav.currentRoute(),
    params: {},
  });
}
