import type { ViewStyle, StyleProp } from 'react-native';
import type { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'error' | 'success' | 'warning';
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /**
   * Content to wrap with badge
   */
  children?: ReactNode;

  /**
   * Badge count (displays number)
   * If > maxCount, shows "maxCount+"
   */
  count?: number;

  /**
   * Maximum count to display
   * @default 99
   */
  maxCount?: number;

  /**
   * Show as dot instead of count
   * @default false
   */
  dot?: boolean;

  /**
   * Badge variant (color scheme)
   * @default 'error'
   */
  variant?: BadgeVariant;

  /**
   * Badge position relative to children
   * @default 'top-right'
   */
  position?: BadgePosition;

  /**
   * Badge size
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Show badge even when count is 0
   * @default false
   */
  showZero?: boolean;

  /**
   * Custom badge label (overrides count)
   */
  label?: string;

  /**
   * Offset from corner [x, y]
   * @default [0, 0]
   */
  offset?: [number, number];

  /**
   * Hide the badge
   * @default false
   */
  hidden?: boolean;

  /**
   * Standalone badge (no children)
   * @default false
   */
  standalone?: boolean;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Custom badge style
   */
  badgeStyle?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
