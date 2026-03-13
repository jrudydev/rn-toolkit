/**
 * ProLockOverlay component
 *
 * Displays over locked pro content with blur effect and unlock CTA.
 * Uses themed colors for consistency.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import { VStack } from '../Stack';
import { Button } from '../Button';
import { ProBadge } from '../ProBadge';
import type { ProLockOverlayProps } from './types';

export function ProLockOverlay({
  onUnlockPress,
  message = 'Unlock with Pro to access this content',
  buttonLabel = 'Unlock Pro Content',
}: ProLockOverlayProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Blur/dim overlay */}
      <View
        style={[
          styles.backdrop,
          { backgroundColor: colors.background },
        ]}
      />

      {/* Content */}
      <View style={styles.content}>
        <VStack spacing="md" align="center">
          {/* Lock icon */}
          <View
            style={[
              styles.lockIcon,
              {
                borderColor: colors.pro,
                backgroundColor: colors.proGlow,
              },
            ]}
          >
            <Text style={styles.lockEmoji}>🔒</Text>
          </View>

          {/* Pro badge */}
          <ProBadge size="lg" />

          {/* Message */}
          <Text
            variant="body"
            color={colors.textSecondary}
            style={styles.message}
          >
            {message}
          </Text>

          {/* Unlock button */}
          <Button
            label={buttonLabel}
            onPress={onUnlockPress}
            variant="primary"
            size="md"
          />
        </VStack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.92,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  lockIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockEmoji: {
    fontSize: 24,
  },
  message: {
    textAlign: 'center',
    maxWidth: 280,
  },
});
