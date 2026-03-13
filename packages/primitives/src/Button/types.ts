import type { PressableProps } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /**
   * Button label text (required)
   */
  label: string;

  /**
   * Button variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Disable the button
   */
  disabled?: boolean;

  /**
   * Show loading state
   */
  loading?: boolean;

  /**
   * Press handler (required)
   */
  onPress: () => void;

  /**
   * Test ID for testing
   */
  testID?: string;
}
