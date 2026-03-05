/**
 * useAnalytics Hook
 *
 * Main hook for accessing analytics context.
 */

import { useContext } from 'react';
import { AnalyticsContext } from '../AnalyticsContext';
import type { AnalyticsContextValue } from '../types';

/**
 * Hook to access analytics context
 *
 * @returns Analytics context with methods and state
 *
 * @example
 * ```tsx
 * import { useAnalytics } from '@rn-toolkit/analytics';
 *
 * function MyComponent() {
 *   const { logEvent, logScreenView, setUserId } = useAnalytics();
 *
 *   useEffect(() => {
 *     logScreenView('HomeScreen');
 *   }, []);
 *
 *   const handleButtonPress = () => {
 *     logEvent('button_press', { button_name: 'submit' });
 *   };
 *
 *   return <Button onPress={handleButtonPress} title="Submit" />;
 * }
 * ```
 */
export function useAnalytics(): AnalyticsContextValue {
  return useContext(AnalyticsContext);
}
