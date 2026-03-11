import type { ImageSourcePropType, ViewStyle, StyleProp } from 'react-native';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /**
   * Image source (local or remote)
   */
  source?: ImageSourcePropType;

  /**
   * Fallback text (usually initials) when no image
   */
  fallback?: string;

  /**
   * Avatar size
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Custom size in pixels (overrides size prop)
   */
  customSize?: number;

  /**
   * Make avatar circular
   * @default true
   */
  rounded?: boolean;

  /**
   * Border color (overrides theme)
   */
  borderColor?: string;

  /**
   * Border width
   * @default 0
   */
  borderWidth?: number;

  /**
   * Background color for fallback (overrides theme)
   */
  backgroundColor?: string;

  /**
   * Text color for fallback (overrides theme)
   */
  textColor?: string;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
