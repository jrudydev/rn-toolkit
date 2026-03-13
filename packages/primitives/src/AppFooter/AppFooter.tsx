import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import { HStack } from '../Stack';
import type { AppFooterProps } from './types';

/**
 * AppFooter - Consistent footer across apps
 *
 * Features:
 * - SparkLabs branding with Patreon link
 * - Social links (GitHub, YouTube, etc.)
 * - Copyright
 * - Optional version info
 */
export function AppFooter({
  showPatreonLink = true,
  showGitHub = true,
  showCopyright = true,
  version,
  customLinks,
  testID,
}: AppFooterProps) {
  const { colors, spacing } = useTheme();

  const handleLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
        },
      ]}
    >
      {/* Links Row */}
      <HStack justify="center" spacing="lg" style={styles.linksRow}>
        {showPatreonLink && (
          <Pressable onPress={() => handleLink('https://patreon.com/SparkLabs343')}>
            <Text variant="caption" color={colors.primary}>
              ⚡ SparkLabs343
            </Text>
          </Pressable>
        )}

        {showGitHub && (
          <Pressable onPress={() => handleLink('https://github.com/jrudydev')}>
            <Text variant="caption" color={colors.textSecondary}>
              GitHub
            </Text>
          </Pressable>
        )}

        {customLinks?.map((link, index) => (
          <Pressable key={index} onPress={() => handleLink(link.url)}>
            <Text variant="caption" color={colors.textSecondary}>
              {link.label}
            </Text>
          </Pressable>
        ))}
      </HStack>

      {/* Bottom Row */}
      <HStack justify="center" spacing="sm" style={styles.bottomRow}>
        {showCopyright && (
          <Text variant="caption" color={colors.textMuted}>
            © {new Date().getFullYear()} Rudy Gomez
          </Text>
        )}

        {version && (
          <Text variant="caption" color={colors.textMuted}>
            · v{version}
          </Text>
        )}
      </HStack>

      {/* Powered by */}
      <View style={styles.poweredBy}>
        <Text variant="caption" color={colors.textMuted} style={styles.poweredByText}>
          Built with @astacinco packages
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  linksRow: {
    marginBottom: 8,
  },
  bottomRow: {
    marginBottom: 4,
  },
  poweredBy: {
    alignItems: 'center',
  },
  poweredByText: {
    fontSize: 10,
    letterSpacing: 1,
  },
});
