import { ThemeTokens, ColorTokens, SpacingTokens, TypographyTokens, ShadowTokens } from '../types';

/**
 * Light mode colors
 */
export const lightColors: ColorTokens = {
  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  textInverse: '#FFFFFF',

  // Brand
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#EC4899',

  // Semantic
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Pro tier
  pro: '#F59E0B',
  proGlow: 'rgba(245, 158, 11, 0.15)',

  // Borders
  border: '#E5E5E5',
  borderLight: '#F0F0F0',
  borderFocus: '#6366F1',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: '#000000',
};

/**
 * Dark mode colors
 */
export const darkColors: ColorTokens = {
  // Backgrounds
  background: '#0A0A0A',
  backgroundSecondary: '#1A1A1A',
  surface: '#1A1A1A',
  surfaceElevated: '#262626',

  // Text
  text: '#FAFAFA',
  textSecondary: '#A3A3A3',
  textMuted: '#737373',
  textInverse: '#0A0A0A',

  // Brand
  primary: '#818CF8',
  primaryLight: '#A5B4FC',
  primaryDark: '#6366F1',
  secondary: '#F472B6',

  // Semantic
  success: '#4ADE80',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',

  // Pro tier
  pro: '#FBBF24',
  proGlow: 'rgba(251, 191, 36, 0.15)',

  // Borders
  border: '#404040',
  borderLight: '#2D2D2D',
  borderFocus: '#818CF8',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: '#000000',
};

/**
 * Spacing scale
 */
export const spacing: SpacingTokens = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Typography tokens
 */
export const typography: TypographyTokens = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

/**
 * Light mode shadows
 */
export const lightShadows: ShadowTokens = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};

/**
 * Dark mode shadows
 */
export const darkShadows: ShadowTokens = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
};

/**
 * Complete default theme
 */
export const defaultTheme: ThemeTokens = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  spacing,
  typography,
  shadows: {
    light: lightShadows,
    dark: darkShadows,
  },
};
