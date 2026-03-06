import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react-native';
import { ThemeProvider, ThemeMode } from '@astacinco/rn-theming';

/**
 * Options for renderWithProviders
 */
export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Theme mode to use
   * @default 'light'
   */
  theme?: ThemeMode;

  /**
   * Initial route for navigation testing (future use)
   */
  initialRoute?: string;
}

/**
 * Renders a component wrapped in all necessary providers for testing.
 * Currently supports: ThemeProvider
 * Future: NavigationProvider, SDUIProvider
 *
 * @param component - React element to render
 * @param options - Provider configuration options
 * @returns All utilities from @testing-library/react-native
 *
 * @example
 * ```typescript
 * const { getByTestId } = renderWithProviders(<Screen />, {
 *   theme: 'dark',
 *   initialRoute: '/home',
 * });
 * ```
 */
export function renderWithProviders(
  component: React.ReactElement,
  options: RenderWithProvidersOptions = {}
): RenderResult {
  // initialRoute will be used when NavigationProvider is added
  const { theme = 'light', initialRoute, ...renderOptions } = options;
  void initialRoute; // Placeholder for future navigation provider

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Future: Add more providers here
    // <NavigationProvider initialRoute={initialRoute}>
    //   <SDUIProvider>
    //     {children}
    //   </SDUIProvider>
    // </NavigationProvider>
    return <ThemeProvider mode={theme}>{children}</ThemeProvider>;
  };

  return render(component, { wrapper: Wrapper, ...renderOptions });
}
