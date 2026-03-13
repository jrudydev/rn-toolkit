// Core exports
export { ThemeProvider } from './ThemeProvider';
export { useTheme } from './useTheme';
export { useColorScheme } from './useColorScheme';
export { useResponsive, breakpoints } from './useResponsive';
export { ThemeContext } from './ThemeContext';

// Theme exports
export { defaultTheme, lightColors, darkColors, spacing, typography } from './themes/default';
export {
  sparkLabsTheme,
  sparkLabsLightColors,
  sparkLabsDarkColors,
  sparkLabsAccents,
  sparkLabsSpacing,
  sparkLabsTypography,
} from './themes/sparklabs';

// Type exports
export type {
  ThemeMode,
  ResolvedThemeMode,
  ColorTokens,
  SpacingTokens,
  TypographyTokens,
  ShadowTokens,
  ThemeTokens,
  ThemeContextValue,
  ThemeProviderProps,
} from './types';

export type { Breakpoint, ResponsiveInfo } from './useResponsive';
