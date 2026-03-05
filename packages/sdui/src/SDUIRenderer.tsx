import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ComponentRegistry } from './ComponentRegistry';
import { createActionHandler, createEventHandlers } from './ActionHandler';
import type { SDUIRendererProps, SDUINode, ActionHandler } from './types';

/**
 * Renders a single SDUI node
 */
function renderNode(
  node: SDUINode,
  actionHandler: ActionHandler,
  index: number
): React.ReactNode {
  const registered = ComponentRegistry.get(node.type);

  if (!registered) {
    if (__DEV__) {
      console.warn(`[SDUI] Unknown component type: "${node.type}". Skipping.`);
    }
    return null;
  }

  const { component: Component, defaultProps } = registered;

  // Merge default props with node props
  const mergedProps = {
    ...defaultProps,
    ...node.props,
  };

  // Create event handlers from actions
  const eventHandlers = createEventHandlers(node.actions, actionHandler);

  // Generate key
  const key = node.key ?? `sdui-${node.type}-${index}`;

  // Render children recursively
  const children = node.children?.map((child, childIndex) =>
    renderNode(child, actionHandler, childIndex)
  );

  return (
    <Component key={key} {...mergedProps} {...eventHandlers}>
      {children}
    </Component>
  );
}

/**
 * SDUIRenderer
 *
 * Renders a complete SDUI schema into native React Native components.
 *
 * @example
 * ```typescript
 * const schema: SDUISchema = {
 *   type: 'screen',
 *   children: [
 *     { type: 'text', props: { variant: 'title', children: 'Hello' } },
 *     { type: 'button', props: { label: 'Click' }, actions: { onPress: { type: 'navigate', payload: { to: '/home' } } } },
 *   ],
 * };
 *
 * <SDUIRenderer
 *   schema={schema}
 *   onAction={(action) => {
 *     if (action.type === 'navigate') {
 *       navigation.navigate(action.payload?.to);
 *     }
 *   }}
 * />
 * ```
 */
export function SDUIRenderer({
  schema,
  onAction,
  testID,
}: SDUIRendererProps): React.ReactElement {
  // Create action handler (memoized)
  const actionHandler = useMemo(
    () => createActionHandler(onAction),
    [onAction]
  );

  // Render all children
  const children = useMemo(
    () =>
      schema.children.map((node, index) =>
        renderNode(node, actionHandler, index)
      ),
    [schema.children, actionHandler]
  );

  return (
    <View testID={testID} style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
