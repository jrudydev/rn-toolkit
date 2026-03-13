/**
 * Theme mode - light, dark, or auto (follows system)
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Resolved theme mode (never 'auto')
 */
export type ResolvedThemeMode = 'light' | 'dark';

/**
 * Color tokens for theming
 */
export interface ColorTokens {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Brand
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;

  // Semantic
  success: string;
  error: string;
  warning: string;
  info: string;

  // Pro tier
  pro: string;
  proGlow: string;

  // Borders
  border: string;
  borderLight: string;
  borderFocus: string;

  // Overlays
  overlay: string;
  shadow: string;
}

/**
 * Spacing tokens (in pixels)
 */
export interface SpacingTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

/**
 * Typography tokens
 */
export interface TypographyTokens {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

/**
 * Shadow tokens
 */
export interface ShadowTokens {
  sm: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  md: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  lg: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

/**
 * Complete theme definition
 */
export interface ThemeTokens {
  colors: {
    light: ColorTokens;
    dark: ColorTokens;
  };
  spacing: SpacingTokens;
  typography: TypographyTokens;
  shadows: {
    light: ShadowTokens;
    dark: ShadowTokens;
  };
}

/**
 * Theme context value exposed to consumers
 */
export interface ThemeContextValue {
  mode: ResolvedThemeMode;
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  shadows: ShadowTokens;
  setMode: (mode: ThemeMode) => void;
  scope: string;
}

/**
 * ThemeProvider props
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
  mode?: ThemeMode;
  theme?: Partial<ThemeTokens>;
  scope?: string;
}
