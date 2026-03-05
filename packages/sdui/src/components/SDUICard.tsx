import React from 'react';
import { Card, CardProps } from '@rn-toolkit/primitives';

export interface SDUICardProps extends CardProps {
  /**
   * Optional press handler (from SDUI actions)
   */
  onPress?: () => void;
}

/**
 * SDUI Card component
 * Wraps @rn-toolkit/primitives Card with SDUI-specific props
 */
export function SDUICard({ children, onPress: _onPress, ...props }: SDUICardProps) {
  // If onPress is provided, we could wrap in Pressable, but for now just render Card
  // TODO: Add Pressable wrapper when onPress is provided
  return <Card {...props}>{children}</Card>;
}
