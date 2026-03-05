import React from 'react';
import { Container, ContainerProps } from '@rn-toolkit/primitives';

/**
 * SDUI Container component
 * Wraps @rn-toolkit/primitives Container
 */
export function SDUIContainer({ children, ...props }: ContainerProps) {
  return <Container {...props}>{children}</Container>;
}
