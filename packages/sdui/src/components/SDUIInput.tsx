import React from 'react';
import { Input, InputProps } from '@rn-toolkit/primitives';

export interface SDUIInputProps extends Omit<InputProps, 'onChange'> {
  /**
   * onValueChange handler (from SDUI actions)
   * Named differently to avoid conflict with native onChange
   */
  onValueChange?: (value: string) => void;
}

/**
 * SDUI Input component
 * Wraps @rn-toolkit/primitives Input with SDUI-specific props
 */
export function SDUIInput({ onValueChange, onChangeText, ...props }: SDUIInputProps) {
  return (
    <Input
      {...props}
      onChangeText={(text) => {
        onChangeText?.(text);
        onValueChange?.(text);
      }}
    />
  );
}
