import React from 'react';
import { Image, ImageProps, StyleSheet } from 'react-native';

export type SDUIImageVariant = 'default' | 'avatar' | 'thumbnail' | 'banner';

export interface SDUIImageProps extends Omit<ImageProps, 'source'> {
  /**
   * Image URI
   */
  uri: string;

  /**
   * Image variant
   * @default 'default'
   */
  variant?: SDUIImageVariant;

  /**
   * Image size (for avatar/thumbnail)
   */
  size?: number;
}

const variantStyles: Record<SDUIImageVariant, { width?: number; height?: number; borderRadius?: number }> = {
  default: {},
  avatar: { width: 64, height: 64, borderRadius: 32 },
  thumbnail: { width: 80, height: 80, borderRadius: 8 },
  banner: { width: '100%' as unknown as number, height: 200, borderRadius: 0 },
};

/**
 * SDUI Image component
 * Simple image component with variant support
 */
export function SDUIImage({
  uri,
  variant = 'default',
  size,
  style,
  ...props
}: SDUIImageProps) {
  const variantStyle = variantStyles[variant];

  const computedStyle = {
    ...variantStyle,
    ...(size && variant === 'avatar' ? { width: size, height: size, borderRadius: size / 2 } : {}),
    ...(size && variant === 'thumbnail' ? { width: size, height: size } : {}),
  };

  return (
    <Image
      source={{ uri }}
      style={[styles.base, computedStyle, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    // Base image styles
  },
});
