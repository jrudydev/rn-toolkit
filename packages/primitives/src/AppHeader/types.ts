import type { ReactNode } from 'react';
import type { ResolvedThemeMode } from '@astacinco/rn-theming';

export interface AppHeaderProps {
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
   * Show Patreon link
   * @default true
   */
  showPatreonLink?: boolean;

  /**
   * Callback when theme mode changes
   */
  onThemeChange?: (mode: ResolvedThemeMode) => void;

  /**
   * Enable glow effect on title (SparkLabs aesthetic)
   * @default false
   */
  glow?: boolean;

  /**
   * Custom action buttons to display
   */
  actions?: ReactNode;

  /**
   * Test ID for testing
   */
  testID?: string;
}
