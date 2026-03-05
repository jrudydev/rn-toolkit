/**
 * useNotifications Hook
 *
 * Main hook for accessing notification context.
 */

import { useContext } from 'react';
import { NotificationContext } from '../NotificationContext';
import type { NotificationContextValue } from '../types';

/**
 * Hook to access notification context
 *
 * @returns Notification context with methods and state
 *
 * @example
 * ```tsx
 * import { useNotifications } from '@rn-toolkit/notifications';
 *
 * function MyComponent() {
 *   const {
 *     token,
 *     hasPermission,
 *     requestPermission,
 *     subscribeToTopic,
 *   } = useNotifications();
 *
 *   useEffect(() => {
 *     if (hasPermission) {
 *       subscribeToTopic('news');
 *     }
 *   }, [hasPermission]);
 *
 *   return (
 *     <View>
 *       <Text>Token: {token}</Text>
 *       {!hasPermission && (
 *         <Button title="Enable Notifications" onPress={requestPermission} />
 *       )}
 *     </View>
 *   );
 * }
 * ```
 */
export function useNotifications(): NotificationContextValue {
  return useContext(NotificationContext);
}
