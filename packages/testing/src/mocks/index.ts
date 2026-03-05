/**
 * Mock utilities for testing
 */

export { mockNavigation, createMockUseDeepLink } from './mockNavigation';
export type { MockNavigationState, MockNavigationReturn } from './mockNavigation';

export {
  mockSDUISchema,
  mockTextNode,
  mockButtonNode,
  mockCardNode,
  mockListNode,
  mockImageNode,
  mockNavigateAction,
  mockApiAction,
  mockProfileScreenSchema,
} from './mockSDUI';
export type { SDUIActionType, SDUIAction, SDUINode, SDUISchema } from './mockSDUI';
