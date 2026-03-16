import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import { HStack } from '../Stack';
import { Avatar } from '../Avatar';
import type { AppHeaderProps } from './types';

/**
 * AppHeader - Consistent header across apps
 *
 * Features:
 * - App title with optional glow effect
 * - Theme variant toggle (default/sparklabs)
 * - Theme mode toggle (light/dark)
 * - Optional profile button (top right)
 * - Optional custom actions
 */
export function AppHeader({
  showBack = false,
  onBack,
  title = 'SparkLabs',
  subtitle,
  showThemeToggle = true,
  showThemeVariant = false,
  themeVariant = 'default',
  onThemeVariantChange,
  onThemeChange,
  showProfile = false,
  profileImageUrl,
  profileFallback = '?',
  onProfilePress,
  glow = false,
  actions,
  testID,
}: AppHeaderProps) {
  const { colors, mode, setMode, spacing } = useTheme();

  const handleThemeToggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    onThemeChange?.(newMode);
  };

  const handleThemeVariantToggle = () => {
    const newVariant = themeVariant === 'default' ? 'sparklabs' : 'default';
    onThemeVariantChange?.(newVariant);
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
        {/* Left: Back button + Title */}
        <HStack spacing="sm" align="center">
          {showBack && (
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: pressed ? colors.backgroundSecondary : 'transparent',
                },
              ]}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Text variant="body" style={{ color: colors.primary }}>
                ← Back
              </Text>
            </Pressable>
          )}
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
        </HStack>

        {/* Right: Actions */}
        <HStack spacing="sm" align="center">
          {/* Custom actions */}
          {actions}

          {/* Theme variant toggle */}
          {showThemeVariant && (
            <Pressable
              onPress={handleThemeVariantToggle}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: pressed ? colors.backgroundSecondary : 'transparent',
                  borderColor: colors.border,
                },
              ]}
              accessibilityLabel={`Switch to ${themeVariant === 'default' ? 'SparkLabs' : 'Default'} theme`}
              accessibilityRole="button"
            >
              <Text variant="caption" color={colors.primary}>
                {themeVariant === 'default' ? '✨ Spark' : '🎨 Default'}
              </Text>
            </Pressable>
          )}

          {/* Light/dark mode toggle */}
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

          {/* Profile button */}
          {showProfile && (
            <Pressable onPress={onProfilePress}>
              <Avatar
                source={profileImageUrl ? { uri: profileImageUrl } : undefined}
                fallback={profileFallback}
                size="sm"
              />
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
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
});
