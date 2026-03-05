import type { SDUIAction, ActionHandler } from './types';

/**
 * Default action handlers for common SDUI actions
 */
const defaultHandlers: Record<string, (payload?: Record<string, unknown>) => void | Promise<void>> = {
  /**
   * Navigate action - logs by default, should be overridden
   */
  navigate: (payload) => {
    console.warn('[SDUI] Navigate action called but no handler provided:', payload);
  },

  /**
   * API action - logs by default, should be overridden
   */
  api: (payload) => {
    console.warn('[SDUI] API action called but no handler provided:', payload);
  },

  /**
   * setState action - logs by default, should be overridden
   */
  setState: (payload) => {
    console.warn('[SDUI] setState action called but no handler provided:', payload);
  },

  /**
   * Custom action - logs by default, should be overridden
   */
  custom: (payload) => {
    console.warn('[SDUI] Custom action called but no handler provided:', payload);
  },
};

/**
 * Creates an action handler that wraps a custom handler with defaults
 *
 * @param customHandler - Optional custom handler to use
 * @returns Combined action handler function
 *
 * @example
 * ```typescript
 * const handleAction = createActionHandler((action) => {
 *   if (action.type === 'navigate') {
 *     navigation.navigate(action.payload?.to as string);
 *   }
 * });
 * ```
 */
export function createActionHandler(customHandler?: ActionHandler): ActionHandler {
  return (action: SDUIAction) => {
    // If custom handler is provided, use it
    if (customHandler) {
      return customHandler(action);
    }

    // Otherwise use default handlers
    const handler = defaultHandlers[action.type];
    if (handler) {
      return handler(action.payload);
    }

    console.warn(`[SDUI] Unknown action type: ${action.type}`);
  };
}

/**
 * Creates event handler props from SDUI actions
 *
 * @param actions - SDUI actions object
 * @param actionHandler - The action handler to use
 * @returns Props object with event handlers
 *
 * @example
 * ```typescript
 * const actions = { onPress: { type: 'navigate', payload: { to: '/home' } } };
 * const handlers = createEventHandlers(actions, handleAction);
 * // handlers = { onPress: () => handleAction({ type: 'navigate', ... }) }
 * ```
 */
export function createEventHandlers(
  actions: Record<string, SDUIAction> | undefined,
  actionHandler: ActionHandler
): Record<string, () => void> {
  if (!actions) return {};

  const handlers: Record<string, () => void> = {};

  Object.entries(actions).forEach(([eventName, action]) => {
    handlers[eventName] = () => actionHandler(action);
  });

  return handlers;
}
