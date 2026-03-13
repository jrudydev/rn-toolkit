import { ThemeTokens, ColorTokens, SpacingTokens, TypographyTokens, ShadowTokens } from '../types';

/**
 * SparkLabs Theme
 *
 * Cyberpunk/neon aesthetic inspired by the SparkLabs343 landing page.
 * Features glowing accents, deep dark backgrounds, and vibrant accent colors.
 */

/**
 * SparkLabs Light colors (muted cyberpunk for light mode)
 */
export const sparkLabsLightColors: ColorTokens = {
  // Backgrounds - Light with subtle cool tint
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#F8FAFC',

  // Brand - Cyan accent
  primary: '#00B4D8',
  primaryLight: '#48CAE4',
  primaryDark: '#0096C7',
  secondary: '#F472B6',

  // Semantic
  success: '#00FF9D',
  error: '#FF4757',
  warning: '#FFD166',
  info: '#00D4FF',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderFocus: '#00D4FF',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: '#000000',
};

/**
 * SparkLabs Dark colors (full cyberpunk aesthetic)
 *
 * Color reference from landing page:
 * --bg:       #07090d
 * --surface:  #0f1520
 * --accent:   #00d4ff (cyan)
 * --gold:     #ffd166
 * --orange:   #ff6b35
 * --green:    #00ff9d
 * --red:      #ff4757
 */
export const sparkLabsDarkColors: ColorTokens = {
  // Backgrounds - Deep space blacks
  background: '#07090D',
  backgroundSecondary: '#0B0E14',
  surface: '#0F1520',
  surfaceElevated: '#141D2B',

  // Text - High contrast whites
  text: '#E2EEF5',
  textSecondary: '#7A9DB0',
  textMuted: '#3D5566',
  textInverse: '#07090D',

  // Brand - Neon cyan
  primary: '#00D4FF',
  primaryLight: '#48E5FF',
  primaryDark: '#0099BB',
  secondary: '#FF6B35', // Orange accent

  // Semantic - Vibrant neons
  success: '#00FF9D',
  error: '#FF4757',
  warning: '#FFD166',
  info: '#00D4FF',

  // Borders - Subtle glows
  border: '#1A2535',
  borderLight: '#243040',
  borderFocus: '#00D4FF',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.85)',
  shadow: '#00D4FF', // Cyan shadow for glow effects
};

/**
 * Extended SparkLabs accent colors (for direct use)
 */
export const sparkLabsAccents = {
  cyan: '#00D4FF',
  cyanGlow: 'rgba(0, 212, 255, 0.15)',
  cyanMuted: '#0099BB',
  gold: '#FFD166',
  goldGlow: 'rgba(255, 209, 102, 0.15)',
  orange: '#FF6B35',
  orangeGlow: 'rgba(255, 107, 53, 0.15)',
  green: '#00FF9D',
  greenGlow: 'rgba(0, 255, 157, 0.15)',
  red: '#FF4757',
  redGlow: 'rgba(255, 71, 87, 0.15)',
};

/**
 * SparkLabs spacing (same as default)
 */
export const sparkLabsSpacing: SpacingTokens = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * SparkLabs typography with display font
 */
export const sparkLabsTypography: TypographyTokens = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    // Note: For full effect, load 'Rajdhani' for display and 'Share Tech Mono' for mono
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
    tight: 1.05,
    normal: 1.5,
    relaxed: 1.75,
  },
};

/**
 * SparkLabs light shadows (standard)
 */
export const sparkLabsLightShadows: ShadowTokens = {
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
 * SparkLabs dark shadows (neon glow effects)
 */
export const sparkLabsDarkShadows: ShadowTokens = {
  sm: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
};

/**
 * Complete SparkLabs theme
 */
export const sparkLabsTheme: ThemeTokens = {
  colors: {
    light: sparkLabsLightColors,
    dark: sparkLabsDarkColors,
  },
  spacing: sparkLabsSpacing,
  typography: sparkLabsTypography,
  shadows: {
    light: sparkLabsLightShadows,
    dark: sparkLabsDarkShadows,
  },
};
