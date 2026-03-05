import { createContext } from 'react';
import { ThemeContextValue } from './types';
import { lightColors, spacing, typography, lightShadows } from './themes/default';

/**
 * Default theme context value
 */
export const defaultThemeContextValue: ThemeContextValue = {
  mode: 'light',
  colors: lightColors,
  spacing,
  typography,
  shadows: lightShadows,
  setMode: () => {
    // eslint-disable-next-line no-console
    console.warn('ThemeProvider not found. Wrap your app with <ThemeProvider>.');
  },
  scope: 'global',
};

/**
 * Theme context for React
 */
export const ThemeContext = createContext<ThemeContextValue>(defaultThemeContextValue);

ThemeContext.displayName = 'ThemeContext';
