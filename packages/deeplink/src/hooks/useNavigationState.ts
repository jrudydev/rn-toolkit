/**
 * useNavigationState Hook
 *
 * Hook for managing navigation state that persists across navigation.
 */

import { useCallback, useContext, useMemo } from 'react';
import { DeepLinkContext } from '../DeepLinkContext';

/**
 * Navigation state result
 */
export interface UseNavigationStateResult<S> {
  /** Current state */
  state: S | undefined;
  /** Update state */
  setState: (newState: S | ((prev: S | undefined) => S)) => void;
  /** Clear state */
  clearState: () => void;
  /** Check if state exists */
  hasState: boolean;
}

/**
 * Hook to manage navigation state
 *
 * State is preserved when navigating back to a screen that was in history.
 *
 * @param defaultState - Default state if none exists
 * @returns Navigation state and methods
 *
 * @example
 * ```tsx
 * import { useNavigationState } from '@rn-toolkit/deeplink';
 *
 * interface FormState {
 *   name: string;
 *   email: string;
 * }
 *
 * function FormScreen() {
 *   const { state, setState, hasState } = useNavigationState<FormState>({
 *     name: '',
 *     email: '',
 *   });
 *
 *   // State is restored when coming back to this screen
 *   return (
 *     <View>
 *       <TextInput
 *         value={state?.name || ''}
 *         onChangeText={(name) => setState({ ...state, name })}
 *       />
 *       <TextInput
 *         value={state?.email || ''}
 *         onChangeText={(email) => setState({ ...state, email })}
 *       />
 *     </View>
 *   );
 * }
 * ```
 */
export function useNavigationState<S = unknown>(
  defaultState?: S
): UseNavigationStateResult<S> {
  const { getState, setState: setContextState } = useContext(DeepLinkContext);

  const state = useMemo(() => {
    const currentState = getState<S>();
    return currentState ?? defaultState;
  }, [getState, defaultState]);

  const setState = useCallback(
    (newState: S | ((prev: S | undefined) => S)) => {
      if (typeof newState === 'function') {
        const fn = newState as (prev: S | undefined) => S;
        const currentState = getState<S>();
        setContextState(fn(currentState));
      } else {
        setContextState(newState);
      }
    },
    [getState, setContextState]
  );

  const clearState = useCallback(() => {
    setContextState(undefined);
  }, [setContextState]);

  const hasState = state !== undefined;

  return {
    state,
    setState,
    clearState,
    hasState,
  };
}
