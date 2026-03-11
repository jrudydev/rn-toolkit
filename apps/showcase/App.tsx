import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';
import {
  Text,
  Button,
  Card,
  VStack,
  HStack,
  Input,
  Divider,
  Container,
  Tag,
  Timer,
  Tabs,
  type TabOption,
} from '@astacinco/rn-primitives';
import {
  I18nProvider,
  ConsoleAdapter as I18nConsoleAdapter,
  useTranslation,
  useLocale,
} from '@astacinco/rn-i18n';
import {
  PerformanceProvider,
  ConsoleAdapter as PerfConsoleAdapter,
  usePerformance,
  useRenderTracker,
} from '@astacinco/rn-performance';

// i18n adapter setup
const i18nAdapter = new I18nConsoleAdapter({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'],
  resources: {
    en: {
      common: {
        welcome: 'Welcome, {{name}}!',
        items: { one: '1 item', other: '{{count}} items' },
        greeting: 'Hello',
        goodbye: 'Goodbye',
      },
    },
    es: {
      common: {
        welcome: 'Bienvenido, {{name}}!',
        items: { one: '1 artículo', other: '{{count}} artículos' },
        greeting: 'Hola',
        goodbye: 'Adiós',
      },
    },
    fr: {
      common: {
        welcome: 'Bienvenue, {{name}}!',
        items: { one: '1 article', other: '{{count}} articles' },
        greeting: 'Bonjour',
        goodbye: 'Au revoir',
      },
    },
  },
});

// Performance adapter setup
const perfAdapter = new PerfConsoleAdapter({ prefix: '[Perf]' });

function ThemedStatusBar() {
  const { mode } = useTheme();
  return <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />;
}

type DemoSection = 'theming' | 'primitives' | 'i18n' | 'performance' | 'all';

function HomeScreen() {
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                <Button
                  label="i18n"
                  variant={activeSection === 'i18n' ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => setActiveSection('i18n')}
                />
                <Button
                  label="Perf"
                  variant={activeSection === 'performance' ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => setActiveSection('performance')}
                />
              </HStack>
            </ScrollView>

            <Divider />

            {/* Theming Section */}
            {(activeSection === 'all' || activeSection === 'theming') && (
              <VStack spacing="md">
                <Text variant="subtitle">@astacinco/rn-theming</Text>

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
                <Text variant="subtitle">@astacinco/rn-primitives</Text>

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

                {/* Tag Demo */}
                <Card variant="outlined">
                  <VStack spacing="sm">
                    <Text variant="label">Tag Component</Text>
                    <Text variant="caption">Colors (outlined):</Text>
                    <HStack spacing="sm" style={styles.buttonRow}>
                      <Tag label="Default" color="default" />
                      <Tag label="Primary" color="primary" />
                      <Tag label="Success" color="success" />
                    </HStack>
                    <HStack spacing="sm" style={styles.buttonRow}>
                      <Tag label="Warning" color="warning" />
                      <Tag label="Error" color="error" />
                      <Tag label="Info" color="info" />
                    </HStack>
                    <Text variant="caption">Filled variant:</Text>
                    <HStack spacing="sm" style={styles.buttonRow}>
                      <Tag label="Easy" color="success" variant="filled" />
                      <Tag label="Medium" color="warning" variant="filled" />
                      <Tag label="Hard" color="error" variant="filled" />
                    </HStack>
                    <Text variant="caption">Sizes:</Text>
                    <HStack spacing="sm" align="center">
                      <Tag label="Small" color="primary" size="sm" />
                      <Tag label="Medium" color="primary" size="md" />
                      <Tag label="Large" color="primary" size="lg" />
                    </HStack>
                  </VStack>
                </Card>

                {/* Tabs Demo */}
                <TabsDemo />

                {/* Timer Demo */}
                <VStack spacing="sm">
                  <Text variant="label">Timer Component</Text>
                  <Text variant="caption">
                    Countdown timer with pause/resume/reset controls
                  </Text>
                  <Timer durationMinutes={1} showProgress={true} />
                </VStack>
              </VStack>
            )}

            {/* i18n Section */}
            {(activeSection === 'all' || activeSection === 'i18n') && (
              <I18nDemo />
            )}

            {/* Performance Section */}
            {(activeSection === 'all' || activeSection === 'performance') && (
              <PerformanceDemo />
            )}

            {/* Footer */}
            <Divider />
            <VStack spacing="xs" align="center">
              <Text variant="caption">Built at Spark Labs</Text>
              <Text variant="caption" style={{ color: colors.textMuted }}>
                Testing: theming, primitives, i18n, performance
              </Text>
            </VStack>
          </VStack>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}

function I18nDemo() {
  const { t, tp } = useTranslation();
  const { locale, setLocale, formatCurrency, formatNumber, formatDate } = useLocale();
  const [itemCount, setItemCount] = useState(1);

  return (
    <VStack spacing="md">
      <Text variant="subtitle">@astacinco/rn-i18n</Text>

      {/* Locale Switcher */}
      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Locale: {locale.toUpperCase()}</Text>
          <HStack spacing="sm">
            <Button
              label="EN"
              variant={locale === 'en' ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setLocale('en')}
            />
            <Button
              label="ES"
              variant={locale === 'es' ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setLocale('es')}
            />
            <Button
              label="FR"
              variant={locale === 'fr' ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setLocale('fr')}
            />
          </HStack>
        </VStack>
      </Card>

      {/* Translations */}
      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Translations</Text>
          <Text variant="body">{t('common.greeting')}</Text>
          <Text variant="body">{t('common.welcome', { name: 'Developer' })}</Text>
          <Text variant="body">{t('common.goodbye')}</Text>
        </VStack>
      </Card>

      {/* Pluralization */}
      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Pluralization</Text>
          <Text variant="body">{tp('common.items', itemCount)}</Text>
          <HStack spacing="sm">
            <Button
              label="-"
              variant="outline"
              size="sm"
              onPress={() => setItemCount(Math.max(0, itemCount - 1))}
            />
            <Text variant="body" style={styles.countText}>{itemCount}</Text>
            <Button
              label="+"
              variant="outline"
              size="sm"
              onPress={() => setItemCount(itemCount + 1)}
            />
          </HStack>
        </VStack>
      </Card>

      {/* Formatting */}
      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Formatting</Text>
          <Text variant="body">Currency: {formatCurrency(1234.56, 'USD')}</Text>
          <Text variant="body">Number: {formatNumber(1234567.89)}</Text>
          <Text variant="body">Date: {formatDate(new Date())}</Text>
        </VStack>
      </Card>
    </VStack>
  );
}

function PerformanceDemo() {
  const { colors } = useTheme();
  const { measure, startTrace } = usePerformance();
  const renderInfo = useRenderTracker({ componentName: 'PerformanceDemo' });
  const [measureResult, setMeasureResult] = useState<string | null>(null);
  const [traceActive, setTraceActive] = useState(false);
  const [activeTrace, setActiveTrace] = useState<{ stop: () => void } | null>(null);

  const handleMeasure = async () => {
    const result = await measure(
      'demo_operation',
      async () => {
        // Simulate async work
        await new Promise(resolve => setTimeout(resolve, 500));
        return 'Operation complete!';
      },
      'custom'
    );
    setMeasureResult(result);
    setTimeout(() => setMeasureResult(null), 2000);
  };

  const handleToggleTrace = async () => {
    if (traceActive && activeTrace) {
      activeTrace.stop();
      setActiveTrace(null);
      setTraceActive(false);
    } else {
      const trace = await startTrace('demo_trace');
      setActiveTrace(trace);
      setTraceActive(true);
    }
  };

  return (
    <VStack spacing="md">
      <Text variant="subtitle">@astacinco/rn-performance</Text>

      {/* Render Tracking */}
      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Render Tracking</Text>
          <HStack spacing="md">
            <VStack spacing="xs">
              <Text variant="caption">Render Count</Text>
              <Text variant="title" style={{ color: colors.primary }}>
                {renderInfo.renderCount}
              </Text>
            </VStack>
            <VStack spacing="xs">
              <Text variant="caption">Last Render</Text>
              <Text variant="body">
                {renderInfo.lastRenderDuration ? `${renderInfo.lastRenderDuration.toFixed(1)}ms` : '-'}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Card>

      {/* Measure Function */}
      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Performance Measurement</Text>
          <Text variant="caption">
            Wraps async operations to measure execution time
          </Text>
          <Button
            label="Run Measured Operation (500ms)"
            variant="primary"
            onPress={handleMeasure}
          />
          {measureResult && (
            <Text variant="body" style={{ color: colors.success }}>
              {measureResult}
            </Text>
          )}
        </VStack>
      </Card>

      {/* Trace */}
      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Trace</Text>
          <Text variant="caption">
            Manual start/stop for tracking longer operations
          </Text>
          <Button
            label={traceActive ? 'Stop Trace' : 'Start Trace'}
            variant={traceActive ? 'secondary' : 'outline'}
            onPress={handleToggleTrace}
          />
          {traceActive && (
            <Text variant="caption" style={{ color: colors.warning }}>
              Trace active... (check console)
            </Text>
          )}
        </VStack>
      </Card>

      {/* Console Note */}
      <Card variant="filled">
        <VStack spacing="xs">
          <Text variant="caption" style={{ color: colors.textSecondary }}>
            Note: Using ConsoleAdapter - check browser console for performance logs
          </Text>
        </VStack>
      </Card>
    </VStack>
  );
}

function TabsDemo() {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [selectedVariant, setSelectedVariant] = useState<string>('pills');

  const tabOptions: TabOption<string>[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  const variantOptions: TabOption<string>[] = [
    { value: 'pills', label: 'Pills' },
    { value: 'outlined', label: 'Outlined' },
    { value: 'filled', label: 'Filled' },
  ];

  return (
    <Card variant="outlined">
      <VStack spacing="sm">
        <Text variant="label">Tabs Component</Text>
        <Text variant="caption">Pills variant (default):</Text>
        <Tabs
          options={tabOptions}
          selected={selectedTab}
          onSelect={setSelectedTab}
          variant="pills"
        />
        <Text variant="caption">Outlined variant:</Text>
        <Tabs
          options={tabOptions}
          selected={selectedTab}
          onSelect={setSelectedTab}
          variant="outlined"
        />
        <Text variant="caption">Filled variant:</Text>
        <Tabs
          options={tabOptions}
          selected={selectedTab}
          onSelect={setSelectedTab}
          variant="filled"
        />
        <Text variant="caption">Sizes:</Text>
        <VStack spacing="xs">
          <Tabs options={variantOptions} selected={selectedVariant} onSelect={setSelectedVariant} size="sm" />
          <Tabs options={variantOptions} selected={selectedVariant} onSelect={setSelectedVariant} size="md" />
          <Tabs options={variantOptions} selected={selectedVariant} onSelect={setSelectedVariant} size="lg" />
        </VStack>
      </VStack>
    </Card>
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

function App() {
  return (
    <SafeAreaProvider>
      <PerformanceProvider adapter={perfAdapter} config={{ debug: true }}>
        <I18nProvider adapter={i18nAdapter}>
          <ThemeProvider mode="auto">
            <ThemedStatusBar />
            <HomeScreen />
          </ThemeProvider>
        </I18nProvider>
      </PerformanceProvider>
    </SafeAreaProvider>
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
  countText: {
    minWidth: 40,
    textAlign: 'center',
  },
});

export default App;
