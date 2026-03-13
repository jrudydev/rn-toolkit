/**
 * ProBadge types
 */

export type ProBadgeSize = 'sm' | 'md' | 'lg';

export interface ProBadgeProps {
  /**
   * Size of the badge
   * @default 'md'
   */
  size?: ProBadgeSize;
}
