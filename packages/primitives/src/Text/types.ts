import type { TextProps as RNTextProps } from 'react-native';

export type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';

export interface TextProps extends RNTextProps {
  /**
   * Text variant that determines styling
   * @default 'body'
   */
  variant?: TextVariant;

  /**
   * Override text color (uses theme color by default)
   */
  color?: string;

  /**
   * Test ID for testing
   */
  testID?: string;
}
