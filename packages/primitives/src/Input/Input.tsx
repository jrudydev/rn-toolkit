import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useTheme } from '@rn-toolkit/theming';
import type { InputProps } from './types';

export function Input({
  label,
  error,
  disabled = false,
  style,
  testID,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const { colors, spacing, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const borderColor = error
    ? colors.error
    : isFocused
      ? colors.borderFocus
      : colors.border;

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.textSecondary,
              fontSize: typography.fontSize.sm,
              marginBottom: spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        testID={testID}
        editable={!disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: disabled ? colors.surface : colors.background,
            borderColor,
            color: colors.text,
            fontSize: typography.fontSize.md,
            padding: spacing.sm,
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
        {...props}
      />
      {error && (
        <Text
          style={[
            styles.error,
            {
              color: colors.error,
              fontSize: typography.fontSize.sm,
              marginTop: spacing.xs,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
  },
  error: {
    // Error text styles
  },
});
