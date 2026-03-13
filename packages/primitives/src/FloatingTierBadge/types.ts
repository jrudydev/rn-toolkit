/**
 * FloatingTierBadge types
 */

export type TierBadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface FloatingTierBadgeProps {
  /**
   * Whether to show the badge (typically only for pro users)
   */
  visible: boolean;

  /**
   * Position of the floating badge
   * @default 'bottom-right'
   */
  position?: TierBadgePosition;

  /**
   * Label to display
   * @default 'PRO'
   */
  label?: string;

  /**
   * Optional callback when badge is pressed
   */
  onPress?: () => void;
}
