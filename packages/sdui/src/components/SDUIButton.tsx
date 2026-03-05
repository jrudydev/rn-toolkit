import React from 'react';
import { Button, ButtonProps } from '@rn-toolkit/primitives';

export interface SDUIButtonProps extends Omit<ButtonProps, 'onPress'> {
  /**
   * onPress is handled by SDUI actions, but we need a fallback
   */
  onPress?: () => void;
}

/**
 * SDUI Button component
 * Wraps @rn-toolkit/primitives Button with SDUI-specific props
 */
export function SDUIButton({ onPress, ...props }: SDUIButtonProps) {
  // Provide a no-op if onPress not provided (action will be injected by renderer)
  return <Button {...props} onPress={onPress ?? (() => {})} />;
}
