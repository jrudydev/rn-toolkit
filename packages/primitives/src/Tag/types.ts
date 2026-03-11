import type { ViewStyle, StyleProp } from 'react-native';

export type TagColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type TagSize = 'sm' | 'md' | 'lg';
export type TagVariant = 'outlined' | 'filled';

export interface TagProps {
  /**
   * Tag label text
   */
  label: string;

  /**
   * Tag color scheme
   * @default 'default'
   */
  color?: TagColor;

  /**
   * Tag size
   * @default 'md'
   */
  size?: TagSize;

  /**
   * Tag variant style
   * - outlined: border with light background
   * - filled: solid background
   * @default 'outlined'
   */
  variant?: TagVariant;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
