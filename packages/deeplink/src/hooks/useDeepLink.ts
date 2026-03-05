/**
 * useDeepLink Hook
 *
 * Main hook for accessing navigation state and methods.
 */

import { useContext } from 'react';
import { DeepLinkContext } from '../DeepLinkContext';
import type { DeepLinkContextValue } from '../types';

/**
 * Hook to access deep linking and navigation
 *
 * @returns Deep link context with navigation methods
 *
 * @example
 * ```tsx
 * import { useDeepLink } from '@rn-toolkit/deeplink';
 *
 * function MyComponent() {
 *   const { navigate, goBack, currentRoute, canGoBack } = useDeepLink();
 *
 *   return (
 *     <View>
 *       <Text>Current: {currentRoute?.name}</Text>
 *       {canGoBack && (
 *         <Button title="Back" onPress={goBack} />
 *       )}
 *       <Button
 *         title="Go to Profile"
 *         onPress={() => navigate('profile', { id: '123' })}
 *       />
 *     </View>
 *   );
 * }
 * ```
 */
export function useDeepLink(): DeepLinkContextValue {
  return useContext(DeepLinkContext);
}
