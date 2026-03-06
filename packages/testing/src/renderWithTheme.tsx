import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react-native';
import { ThemeProvider, ThemeMode } from '@astacinco/rn-theming';

/**
 * Renders a component wrapped in ThemeProvider for testing.
 *
 * @param component - React element to render
 * @param mode - Theme mode ('light' | 'dark'), defaults to 'light'
 * @param options - Additional render options from @testing-library/react-native
 * @returns All utilities from @testing-library/react-native
 *
 * @example
 * ```typescript
 * const { getByTestId } = renderWithTheme(<Button />, 'dark');
 * expect(getByTestId('button')).toBeTruthy();
 * ```
 */
export function renderWithTheme(
  component: React.ReactElement,
  mode: ThemeMode = 'light',
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider mode={mode}>{children}</ThemeProvider>
  );

  return render(component, { wrapper: Wrapper, ...options });
}
