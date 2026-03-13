import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import { HStack } from '../Stack';
import type { AppHeaderProps } from './types';

/**
 * AppHeader - Consistent header across apps
 *
 * Features:
 * - App title with optional glow effect
 * - Theme mode toggle (light/dark)
 * - Optional theme variant selector
 * - Optional Patreon link
 * - Optional custom actions
 */
export function AppHeader({
  title = 'SparkLabs',
  subtitle,
  showThemeToggle = true,
  showPatreonLink = true,
  onThemeChange,
  glow = false,
  actions,
  testID,
}: AppHeaderProps) {
  const { colors, mode, setMode, spacing, shadows } = useTheme();

  const handleThemeToggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    onThemeChange?.(newMode);
  };

  const handlePatreonPress = () => {
    Linking.openURL('https://patreon.com/SparkLabs343');
  };

  const glowStyle = glow && mode === 'dark' ? {
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  } : {};

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        },
      ]}
    >
      <HStack justify="space-between" align="center">
        {/* Left: Title */}
        <View style={styles.titleContainer}>
          <Text
            variant="subtitle"
            style={[
              styles.title,
              glowStyle,
              { color: glow && mode === 'dark' ? colors.primary : colors.text },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text variant="caption" color={colors.textMuted}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right: Actions */}
        <HStack spacing="sm" align="center">
          {actions}

          {showPatreonLink && (
            <Pressable
              onPress={handlePatreonPress}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: pressed ? colors.backgroundSecondary : 'transparent',
                  borderColor: colors.border,
                },
              ]}
            >
              <Text variant="caption" color={colors.primary}>
                ⚡ Patreon
              </Text>
            </Pressable>
          )}

          {showThemeToggle && (
            <Pressable
              onPress={handleThemeToggle}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: pressed ? colors.backgroundSecondary : 'transparent',
                  borderColor: colors.border,
                },
              ]}
              accessibilityLabel={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
              accessibilityRole="button"
            >
              <Text variant="body">
                {mode === 'light' ? '🌙' : '☀️'}
              </Text>
            </Pressable>
          )}
        </HStack>
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    fontWeight: '700',
    letterSpacing: 1,
  },
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
});
