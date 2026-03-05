/**
 * @rn-toolkit/sdui
 *
 * Server-Driven UI engine for React Native.
 * Render dynamic UIs from JSON schemas.
 *
 * @example
 * ```typescript
 * import { SDUIRenderer, registerBuiltInComponents } from '@rn-toolkit/sdui';
 *
 * // Register built-in components (call once at app start)
 * registerBuiltInComponents();
 *
 * // Render a schema
 * const schema = {
 *   type: 'screen',
 *   children: [
 *     { type: 'text', props: { content: 'Hello', variant: 'title' } },
 *     { type: 'button', props: { label: 'Click' }, actions: { onPress: { type: 'navigate', payload: { to: '/home' } } } },
 *   ],
 * };
 *
 * <SDUIRenderer
 *   schema={schema}
 *   onAction={(action) => handleAction(action)}
 * />
 * ```
 */

// Core
export { SDUIRenderer } from './SDUIRenderer';
export { ComponentRegistry, registerComponents } from './ComponentRegistry';
export { createActionHandler, createEventHandlers } from './ActionHandler';

// Types
export type {
  SDUISchema,
  SDUINode,
  SDUIAction,
  SDUIActionType,
  SDUIRendererProps,
  ActionHandler,
  RegisteredComponent,
  ComponentRegistryType,
} from './types';

// Built-in components
export {
  SDUIText,
  SDUIButton,
  SDUICard,
  SDUIStack,
  SDUIVStack,
  SDUIHStack,
  SDUIContainer,
  SDUIInput,
  SDUIDivider,
  SDUIImage,
} from './components';

export type {
  SDUITextProps,
  SDUIButtonProps,
  SDUICardProps,
  SDUIStackProps,
  SDUIInputProps,
  SDUIImageProps,
  SDUIImageVariant,
} from './components';

// Component registration
import { ComponentRegistry } from './ComponentRegistry';
import {
  SDUIText,
  SDUIButton,
  SDUICard,
  SDUIStack,
  SDUIVStack,
  SDUIHStack,
  SDUIContainer,
  SDUIInput,
  SDUIDivider,
  SDUIImage,
} from './components';

/**
 * Register all built-in SDUI components.
 * Call this once at app startup before rendering any SDUI schemas.
 *
 * @example
 * ```typescript
 * // In App.tsx
 * import { registerBuiltInComponents } from '@rn-toolkit/sdui';
 *
 * registerBuiltInComponents();
 *
 * function App() {
 *   return <SDUIRenderer schema={mySchema} />;
 * }
 * ```
 */
export function registerBuiltInComponents(): void {
  // Text
  ComponentRegistry.register('text', SDUIText);

  // Button
  ComponentRegistry.register('button', SDUIButton);

  // Card
  ComponentRegistry.register('card', SDUICard);

  // Stack variants
  ComponentRegistry.register('stack', SDUIStack);
  ComponentRegistry.register('vstack', SDUIVStack);
  ComponentRegistry.register('hstack', SDUIHStack);

  // Container
  ComponentRegistry.register('container', SDUIContainer);

  // Input
  ComponentRegistry.register('input', SDUIInput);

  // Divider
  ComponentRegistry.register('divider', SDUIDivider);

  // Image
  ComponentRegistry.register('image', SDUIImage);
}
