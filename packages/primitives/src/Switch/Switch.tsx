import React from 'react';
import {
  Switch as RNSwitch,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import type { SwitchProps, SwitchSize } from './types';

const sizeConfig: Record<SwitchSize, { scale: number }> = {
  sm: { scale: 0.8 },
  md: { scale: 1 },
  lg: { scale: 1.2 },
};

export function Switch({
  value,
  onValueChange,
  size = 'md',
  disabled = false,
  label,
  labelPosition = 'right',
  activeColor,
  inactiveColor,
  style,
  testID,
}: SwitchProps) {
  const { colors } = useTheme();
  const config = sizeConfig[size];

  const trackColorOn = activeColor ?? colors.primary;
  const trackColorOff = inactiveColor ?? colors.border;
  const thumbColor = value ? colors.surface : colors.textMuted;

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const switchElement = (
    <View style={{ transform: [{ scale: config.scale }] }}>
      <RNSwitch
        testID={testID}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: trackColorOff,
          true: trackColorOn,
        }}
        thumbColor={thumbColor}
        ios_backgroundColor={trackColorOff}
      />
    </View>
  );

  if (!label) {
    return (
      <View style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}>
        {switchElement}
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.container,
        styles.withLabel,
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      {labelPosition === 'left' && (
        <Text
          variant="body"
          style={styles.labelLeft}
          color={disabled ? colors.textMuted : colors.text}
        >
          {label}
        </Text>
      )}
      {switchElement}
      {labelPosition === 'right' && (
        <Text
          variant="body"
          style={styles.labelRight}
          color={disabled ? colors.textMuted : colors.text}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  withLabel: {
    justifyContent: 'space-between',
  },
  labelLeft: {
    marginRight: 12,
  },
  labelRight: {
    marginLeft: 12,
  },
});
