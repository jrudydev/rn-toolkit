import type { ReactNode } from 'react';
import type { ResolvedThemeMode } from '@astacinco/rn-theming';

export type ThemeVariant = 'default' | 'sparklabs';

export interface AppHeaderProps {
  /**
   * Show back button on the left
   * @default false
   */
  showBack?: boolean;

  /**
   * Callback when back button is pressed
   */
  onBack?: () => void;

  /**
   * App title displayed in the header
   * @default 'SparkLabs'
   */
  title?: string;

  /**
   * Optional subtitle below the title
   */
  subtitle?: string;

  /**
   * Show light/dark mode toggle
   * @default true
   */
  showThemeToggle?: boolean;

  /**
   * Show theme variant toggle (default/sparklabs)
   * @default false
   */
  showThemeVariant?: boolean;

  /**
   * Current theme variant (required if showThemeVariant is true)
   */
  themeVariant?: ThemeVariant;

  /**
   * Callback when theme variant changes
   */
  onThemeVariantChange?: (variant: ThemeVariant) => void;

  /**
   * Callback when theme mode changes
   */
  onThemeChange?: (mode: ResolvedThemeMode) => void;

  /**
   * Show profile button (top right)
   * @default false
   */
  showProfile?: boolean;

  /**
   * Profile button image URL (optional, shows initials/? if not provided)
   */
  profileImageUrl?: string;

  /**
   * Profile fallback text (initials or ?)
   * @default '?'
   */
  profileFallback?: string;

  /**
   * Callback when profile button is pressed
   */
  onProfilePress?: () => void;

  /**
   * Enable glow effect on title (SparkLabs aesthetic)
   * @default false
   */
  glow?: boolean;

  /**
   * Custom action buttons to display (in addition to built-in actions)
   */
  actions?: ReactNode;

  /**
   * Test ID for testing
   */
  testID?: string;
}
