import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@rn-toolkit/theming';
import {
  Text,
  Button,
  Card,
  VStack,
  HStack,
  Input,
  Divider,
  Container,
} from '@rn-toolkit/primitives';

type DemoSection = 'theming' | 'primitives' | 'all';

export default function HomeScreen() {
  const { colors, spacing, mode, setMode } = useTheme();
  const [activeSection, setActiveSection] = useState<DemoSection>('all');
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState<string | undefined>();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const validateInput = (value: string) => {
    setInputValue(value);
    if (value.length > 0 && value.length < 3) {
      setInputError('Must be at least 3 characters');
    } else {
      setInputError(undefined);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Container padding={spacing.lg}>
          <VStack spacing="lg">
            {/* Header */}
            <VStack spacing="xs" align="center">
              <Text variant="title">RN SDUI Toolkit</Text>
              <Text variant="caption">Free Packages Demo</Text>
              <HStack spacing="sm">
                <Text variant="label">Theme:</Text>
                <Text variant="body" style={{ color: colors.primary }}>
                  {mode.toUpperCase()}
                </Text>
              </HStack>
            </VStack>

            {/* Theme Toggle */}
            <Button
              label={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
              variant="primary"
              onPress={toggleTheme}
            />

            {/* Section Tabs */}
            <HStack spacing="sm">
              <Button
                label="All"
                variant={activeSection === 'all' ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setActiveSection('all')}
              />
              <Button
                label="Theming"
                variant={activeSection === 'theming' ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setActiveSection('theming')}
              />
              <Button
                label="Primitives"
                variant={activeSection === 'primitives' ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setActiveSection('primitives')}
              />
            </HStack>

            <Divider />

            {/* Theming Section */}
            {(activeSection === 'all' || activeSection === 'theming') && (
              <VStack spacing="md">
                <Text variant="subtitle">@rn-toolkit/theming</Text>

                {/* Color Tokens */}
                <Card variant="outlined">
                  <VStack spacing="sm">
                    <Text variant="label">Color Tokens</Text>
                    <HStack spacing="xs" style={styles.colorRow}>
                      <ColorSwatch label="Primary" color={colors.primary} />
                      <ColorSwatch label="Secondary" color={colors.secondary} />
                      <ColorSwatch label="Success" color={colors.success} />
                    </HStack>
                    <HStack spacing="xs" style={styles.colorRow}>
                      <ColorSwatch label="Error" color={colors.error} />
                      <ColorSwatch label="Warning" color={colors.warning} />
                      <ColorSwatch label="Info" color={colors.info} />
                    </HStack>
                  </VStack>
                </Card>

                {/* Surface Variants */}
                <Card variant="outlined">
                  <VStack spacing="sm">
                    <Text variant="label">Surface Variants</Text>
                    <View style={[styles.surfaceSwatch, { backgroundColor: colors.surface }]}>
                      <Text variant="caption">surface</Text>
                    </View>
                    <View style={[styles.surfaceSwatch, { backgroundColor: colors.surfaceElevated }]}>
                      <Text variant="caption">surfaceElevated</Text>
                    </View>
                  </VStack>
                </Card>

                {/* Spacing */}
                <Card variant="outlined">
                  <VStack spacing="sm">
                    <Text variant="label">Spacing Scale</Text>
                    <SpacingDemo label="xs" size={spacing.xs} />
                    <SpacingDemo label="sm" size={spacing.sm} />
                    <SpacingDemo label="md" size={spacing.md} />
                    <SpacingDemo label="lg" size={spacing.lg} />
                    <SpacingDemo label="xl" size={spacing.xl} />
                  </VStack>
                </Card>
              </VStack>
            )}

            {/* Primitives Section */}
            {(activeSection === 'all' || activeSection === 'primitives') && (
              <VStack spacing="md">
                <Text variant="subtitle">@rn-toolkit/primitives</Text>

                {/* Text Variants */}
                <Card variant="outlined">
                  <VStack spacing="xs">
                    <Text variant="label">Text Variants</Text>
                    <Text variant="title">Title Text</Text>
                    <Text variant="subtitle">Subtitle Text</Text>
                    <Text variant="body">Body Text</Text>
                    <Text variant="caption">Caption Text</Text>
                    <Text variant="label">Label Text</Text>
                  </VStack>
                </Card>

                {/* Button Variants */}
                <Card variant="outlined">
                  <VStack spacing="sm">
                    <Text variant="label">Button Variants</Text>
                    <HStack spacing="sm" style={styles.buttonRow}>
                      <Button label="Primary" variant="primary" size="sm" onPress={() => {}} />
                      <Button label="Secondary" variant="secondary" size="sm" onPress={() => {}} />
                    </HStack>
                    <HStack spacing="sm" style={styles.buttonRow}>
                      <Button label="Outline" variant="outline" size="sm" onPress={() => {}} />
                      <Button label="Ghost" variant="ghost" size="sm" onPress={() => {}} />
                    </HStack>
                    <HStack spacing="sm" style={styles.buttonRow}>
                      <Button label="Small" variant="primary" size="sm" onPress={() => {}} />
                      <Button label="Medium" variant="primary" size="md" onPress={() => {}} />
                      <Button label="Large" variant="primary" size="lg" onPress={() => {}} />
                    </HStack>
                    <Button label="Disabled" variant="primary" disabled onPress={() => {}} />
                  </VStack>
                </Card>

                {/* Card Variants */}
                <Card variant="outlined">
                  <VStack spacing="sm">
                    <Text variant="label">Card Variants</Text>
                    <Card variant="filled">
                      <Text variant="caption">Filled Card</Text>
                    </Card>
                    <Card variant="outlined">
                      <Text variant="caption">Outlined Card</Text>
                    </Card>
                    <Card variant="elevated">
                      <Text variant="caption">Elevated Card</Text>
                    </Card>
                  </VStack>
                </Card>

                {/* Input */}
                <Card variant="outlined">
                  <VStack spacing="sm">
                    <Text variant="label">Input Component</Text>
                    <Input
                      label="Username"
                      placeholder="Enter username"
                      value={inputValue}
                      onChangeText={validateInput}
                      error={inputError}
                    />
                    <Input
                      label="Password"
                      placeholder="Enter password"
                      secureTextEntry
                    />
                    <Input
                      label="Disabled"
                      placeholder="Cannot edit"
                      editable={false}
                    />
                  </VStack>
                </Card>

                {/* Stack Demo */}
                <Card variant="outlined">
                  <VStack spacing="sm">
                    <Text variant="label">Stack Components</Text>
                    <Text variant="caption">VStack (vertical):</Text>
                    <VStack spacing="xs" style={styles.stackDemo}>
                      <View style={[styles.stackItem, { backgroundColor: colors.primary }]} />
                      <View style={[styles.stackItem, { backgroundColor: colors.secondary }]} />
                      <View style={[styles.stackItem, { backgroundColor: colors.success }]} />
                    </VStack>
                    <Text variant="caption">HStack (horizontal):</Text>
                    <HStack spacing="xs">
                      <View style={[styles.stackItem, { backgroundColor: colors.primary }]} />
                      <View style={[styles.stackItem, { backgroundColor: colors.secondary }]} />
                      <View style={[styles.stackItem, { backgroundColor: colors.success }]} />
                    </HStack>
                  </VStack>
                </Card>

                {/* Divider */}
                <Card variant="outlined">
                  <VStack spacing="sm">
                    <Text variant="label">Divider</Text>
                    <Divider />
                    <Text variant="caption">Above is a divider</Text>
                  </VStack>
                </Card>
              </VStack>
            )}

            {/* Footer */}
            <Divider />
            <VStack spacing="xs" align="center">
              <Text variant="caption">Built at Spark Labs</Text>
              <Text variant="caption" style={{ color: colors.textMuted }}>
                Testing: theming, primitives
              </Text>
            </VStack>
          </VStack>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}

function ColorSwatch({ label, color }: { label: string; color: string }) {
  const { colors } = useTheme();

  return (
    <View style={styles.colorSwatchContainer}>
      <View style={[styles.colorSwatch, { backgroundColor: color }]} />
      <Text variant="caption" style={{ color: colors.textSecondary }}>
        {label}
      </Text>
    </View>
  );
}

function SpacingDemo({ label, size }: { label: string; size: number }) {
  const { colors } = useTheme();

  return (
    <HStack spacing="sm" align="center">
      <Text variant="caption" style={styles.spacingLabel}>
        {label}
      </Text>
      <View style={[styles.spacingBar, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.spacingFill,
            { width: size * 3, backgroundColor: colors.primary },
          ]}
        />
      </View>
      <Text variant="caption" style={{ color: colors.textMuted }}>
        {size}px
      </Text>
    </HStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  colorRow: {
    flexWrap: 'wrap',
  },
  colorSwatchContainer: {
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 4,
  },
  surfaceSwatch: {
    padding: 12,
    borderRadius: 8,
  },
  spacingLabel: {
    width: 24,
  },
  spacingBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  spacingFill: {
    height: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexWrap: 'wrap',
  },
  stackDemo: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  stackItem: {
    width: 40,
    height: 24,
    borderRadius: 4,
  },
});
