import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@rn-toolkit/theming';

export default function HomeScreen() {
  const { colors, spacing, mode, setMode } = useTheme();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { padding: spacing.lg }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            RN SDUI Toolkit
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Theme: {mode}
          </Text>
        </View>

        {/* Theme Toggle */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              marginTop: spacing.xl,
            },
          ]}
          onPress={toggleTheme}
        >
          <Text style={[styles.buttonText, { color: colors.textInverse }]}>
            Toggle Theme
          </Text>
        </TouchableOpacity>

        {/* Color Swatches */}
        <View style={[styles.section, { marginTop: spacing.xl }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Color Tokens
          </Text>

          <View style={styles.swatches}>
            <ColorSwatch label="Primary" color={colors.primary} textColor={colors.textInverse} />
            <ColorSwatch label="Secondary" color={colors.secondary} textColor={colors.textInverse} />
            <ColorSwatch label="Success" color={colors.success} textColor={colors.textInverse} />
            <ColorSwatch label="Error" color={colors.error} textColor={colors.textInverse} />
            <ColorSwatch label="Warning" color={colors.warning} textColor={colors.text} />
            <ColorSwatch label="Info" color={colors.info} textColor={colors.textInverse} />
          </View>
        </View>

        {/* Surface Cards */}
        <View style={[styles.section, { marginTop: spacing.xl }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Surface Variants
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                marginTop: spacing.md,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>Surface</Text>
            <Text style={[styles.cardBody, { color: colors.textSecondary }]}>
              Basic surface color for cards and containers.
            </Text>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                marginTop: spacing.md,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>Surface Elevated</Text>
            <Text style={[styles.cardBody, { color: colors.textSecondary }]}>
              Elevated surface for modals and dropdowns.
            </Text>
          </View>
        </View>

        {/* Spacing Demo */}
        <View style={[styles.section, { marginTop: spacing.xl }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Spacing Scale
          </Text>

          <View style={styles.spacingDemo}>
            <SpacingBar label="xs" size={spacing.xs} color={colors.primary} />
            <SpacingBar label="sm" size={spacing.sm} color={colors.primary} />
            <SpacingBar label="md" size={spacing.md} color={colors.primary} />
            <SpacingBar label="lg" size={spacing.lg} color={colors.primary} />
            <SpacingBar label="xl" size={spacing.xl} color={colors.primary} />
            <SpacingBar label="xxl" size={spacing.xxl} color={colors.primary} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ColorSwatch({
  label,
  color,
  textColor,
}: {
  label: string;
  color: string;
  textColor: string;
}) {
  const { spacing } = useTheme();

  return (
    <View
      style={[
        styles.swatch,
        {
          backgroundColor: color,
          marginRight: spacing.sm,
          marginBottom: spacing.sm,
        },
      ]}
    >
      <Text style={[styles.swatchLabel, { color: textColor }]}>{label}</Text>
    </View>
  );
}

function SpacingBar({ label, size, color }: { label: string; size: number; color: string }) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.spacingRow, { marginBottom: spacing.xs }]}>
      <Text style={[styles.spacingLabel, { color: colors.textSecondary, width: 30 }]}>
        {label}
      </Text>
      <View style={[styles.spacingBarBg, { backgroundColor: colors.border, flex: 1 }]}>
        <View
          style={[
            styles.spacingBarFill,
            { backgroundColor: color, width: size * 3 },
          ]}
        />
      </View>
      <Text style={[styles.spacingValue, { color: colors.textMuted, width: 30 }]}>
        {size}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  swatch: {
    width: 80,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swatchLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 14,
    marginTop: 4,
  },
  spacingDemo: {},
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacingLabel: {
    fontSize: 12,
  },
  spacingBarBg: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  spacingBarFill: {
    height: 8,
    borderRadius: 4,
  },
  spacingValue: {
    fontSize: 12,
    textAlign: 'right',
  },
});
