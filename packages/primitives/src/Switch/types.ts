import type { ViewStyle, StyleProp } from 'react-native';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  /**
   * Current value of the switch
   */
  value: boolean;

  /**
   * Called when value changes
   */
  onValueChange: (value: boolean) => void;

  /**
   * Switch size
   * @default 'md'
   */
  size?: SwitchSize;

  /**
   * Disable the switch
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional label to display next to switch
   */
  label?: string;

  /**
   * Label position
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';

  /**
   * Custom track color when on (overrides theme)
   */
  activeColor?: string;

  /**
   * Custom track color when off (overrides theme)
   */
  inactiveColor?: string;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
