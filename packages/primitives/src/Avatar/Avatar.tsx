import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import type { AvatarProps, AvatarSize } from './types';

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const fontSizeMap: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 32,
};

export function Avatar({
  source,
  fallback,
  size = 'md',
  customSize,
  rounded = true,
  borderColor,
  borderWidth = 0,
  backgroundColor,
  textColor,
  style,
  testID,
}: AvatarProps) {
  const { colors } = useTheme();
  const [imageError, setImageError] = useState(false);

  const avatarSize = customSize ?? sizeMap[size];
  const fontSize = customSize ? customSize * 0.4 : fontSizeMap[size];
  const borderRadius = rounded ? avatarSize / 2 : avatarSize * 0.15;

  const bgColor = backgroundColor ?? colors.surface;
  const txtColor = textColor ?? colors.text;
  const border = borderColor ?? colors.border;

  const showFallback = !source || imageError;

  // Generate initials from fallback text
  const getInitials = (text: string): string => {
    const words = text.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const containerStyle = [
    styles.container,
    {
      width: avatarSize,
      height: avatarSize,
      borderRadius,
      backgroundColor: bgColor,
      borderWidth,
      borderColor: border,
    },
    style,
  ];

  if (showFallback) {
    return (
      <View testID={testID} style={containerStyle}>
        <Text
          variant="body"
          style={{ fontSize, color: txtColor, fontWeight: '600' }}
        >
          {fallback ? getInitials(fallback) : '?'}
        </Text>
      </View>
    );
  }

  return (
    <View testID={testID} style={containerStyle}>
      <Image
        source={source}
        style={[
          styles.image,
          {
            width: avatarSize - borderWidth * 2,
            height: avatarSize - borderWidth * 2,
            borderRadius: borderRadius - borderWidth,
          },
        ]}
        onError={() => setImageError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
});
