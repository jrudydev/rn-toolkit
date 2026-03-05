import React from 'react';
import { VStack, HStack, StackProps } from '@rn-toolkit/primitives';

export interface SDUIStackProps extends StackProps {
  /**
   * Stack direction
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';
}

/**
 * SDUI Stack component
 * Wraps @rn-toolkit/primitives VStack/HStack with direction prop
 */
export function SDUIStack({
  direction = 'vertical',
  children,
  ...props
}: SDUIStackProps) {
  const StackComponent = direction === 'horizontal' ? HStack : VStack;
  return <StackComponent {...props}>{children}</StackComponent>;
}

/**
 * SDUI VStack component (alias)
 */
export function SDUIVStack(props: StackProps) {
  return <VStack {...props} />;
}

/**
 * SDUI HStack component (alias)
 */
export function SDUIHStack(props: StackProps) {
  return <HStack {...props} />;
}
