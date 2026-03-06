import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import type { ButtonProps, ButtonVariant, ButtonSize } from './types';

const sizeStyles: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 14 },
  md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 16 },
  lg: { paddingVertical: 16, paddingHorizontal: 28, fontSize: 18 },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  style,
  testID,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();
  const sizeStyle = sizeStyles[size];

  const getVariantStyles = (v: ButtonVariant, pressed: boolean) => {
    const opacity = pressed ? 0.8 : 1;

    switch (v) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
          textColor: colors.textInverse,
          opacity,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderWidth: 0,
          textColor: colors.textInverse,
          opacity,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
          textColor: colors.primary,
          opacity,
        };
      case 'ghost':
        return {
          backgroundColor: pressed ? colors.surface : 'transparent',
          borderWidth: 0,
          textColor: colors.primary,
          opacity: 1,
        };
    }
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }): StyleProp<ViewStyle> => {
        const variantStyle = getVariantStyles(variant, pressed);
        return [
          styles.base,
          {
            backgroundColor: variantStyle.backgroundColor,
            borderWidth: variantStyle.borderWidth,
            borderColor: variantStyle.borderColor,
            paddingVertical: sizeStyle.paddingVertical,
            paddingHorizontal: sizeStyle.paddingHorizontal,
            opacity: isDisabled ? 0.5 : variantStyle.opacity,
          },
          style as ViewStyle,
        ];
      }}
      {...props}
    >
      {({ pressed }) => {
        const variantStyle = getVariantStyles(variant, pressed);
        return loading ? (
          <ActivityIndicator color={variantStyle.textColor} size="small" />
        ) : (
          <Text
            style={[
              styles.label,
              {
                color: variantStyle.textColor,
                fontSize: sizeStyle.fontSize,
              },
            ]}
          >
            {label}
          </Text>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
