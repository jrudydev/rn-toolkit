import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { ThemeContextValue } from './types';

/**
 * Hook to access theme context
 *
 * @returns Theme context value with colors, spacing, typography, shadows, and mode
 * @throws Warning if used outside of ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { colors, spacing, mode } = useTheme();
 *
 *   return (
 *     <View style={{ backgroundColor: colors.background, padding: spacing.md }}>
 *       <Text style={{ color: colors.text }}>
 *         Theme mode: {mode}
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  return context;
}
