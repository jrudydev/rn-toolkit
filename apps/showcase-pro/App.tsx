/**
 * RN Toolkit Pro - Showcase App
 *
 * This app demonstrates ALL @rn-toolkit packages working together.
 * It's provided to Pro Developer+ Patreon supporters.
 */

import { useState } from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// FREE packages
import { ThemeProvider, useTheme } from '@rn-toolkit/theming';
import { Text, Button, Card, VStack, HStack, Divider, Container } from '@rn-toolkit/primitives';
import { I18nProvider, ConsoleAdapter as I18nConsoleAdapter, useTranslation, useLocale } from '@rn-toolkit/i18n';
import { PerformanceProvider, ConsoleAdapter as PerfConsoleAdapter, usePerformance, useRenderTracker } from '@rn-toolkit/performance';

// PAID packages
import { SDUIProvider, SDUIRenderer } from '@rn-toolkit/sdui';
import { AuthProvider, useAuth, NoOpAdapter as AuthNoOpAdapter } from '@rn-toolkit/auth';
import { AnalyticsProvider, useAnalytics, NoOpAdapter as AnalyticsNoOpAdapter } from '@rn-toolkit/analytics';
import { NotificationProvider, useNotifications, NoOpAdapter as NotificationNoOpAdapter } from '@rn-toolkit/notifications';

// Types
type DemoScreen = 'home' | 'sdui' | 'auth' | 'analytics' | 'i18n' | 'performance' | 'notifications';

// Adapter Setup
const i18nAdapter = new I18nConsoleAdapter({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr', 'de', 'ja'],
  resources: {
    en: {
      common: {
        welcome: 'Welcome, {{name}}!',
        items: { one: '1 item', other: '{{count}} items' },
        home: 'Home',
        settings: 'Settings',
        profile: 'Profile',
      },
      auth: {
        signIn: 'Sign In',
        signOut: 'Sign Out',
        signUp: 'Sign Up',
      },
    },
    es: {
      common: {
        welcome: '¡Bienvenido, {{name}}!',
        items: { one: '1 artículo', other: '{{count}} artículos' },
        home: 'Inicio',
        settings: 'Configuración',
        profile: 'Perfil',
      },
      auth: {
        signIn: 'Iniciar Sesión',
        signOut: 'Cerrar Sesión',
        signUp: 'Registrarse',
      },
    },
    fr: {
      common: {
        welcome: 'Bienvenue, {{name}}!',
        items: { one: '1 article', other: '{{count}} articles' },
        home: 'Accueil',
        settings: 'Paramètres',
        profile: 'Profil',
      },
      auth: {
        signIn: 'Se Connecter',
        signOut: 'Se Déconnecter',
        signUp: "S'inscrire",
      },
    },
    de: {
      common: {
        welcome: 'Willkommen, {{name}}!',
        items: { one: '1 Artikel', other: '{{count}} Artikel' },
        home: 'Startseite',
        settings: 'Einstellungen',
        profile: 'Profil',
      },
      auth: {
        signIn: 'Anmelden',
        signOut: 'Abmelden',
        signUp: 'Registrieren',
      },
    },
    ja: {
      common: {
        welcome: 'ようこそ、{{name}}さん！',
        items: { one: '1件', other: '{{count}}件' },
        home: 'ホーム',
        settings: '設定',
        profile: 'プロフィール',
      },
      auth: {
        signIn: 'サインイン',
        signOut: 'サインアウト',
        signUp: '新規登録',
      },
    },
  },
});

const perfAdapter = new PerfConsoleAdapter({ prefix: '[Perf]' });
const authAdapter = new AuthNoOpAdapter();
const analyticsAdapter = new AnalyticsNoOpAdapter();
const notificationAdapter = new NotificationNoOpAdapter();

// Example SDUI Schema
const homeScreenSchema = {
  type: 'container',
  props: { padding: 'md' },
  children: [
    {
      type: 'vstack',
      props: { spacing: 'md' },
      children: [
        {
          type: 'text',
          props: { variant: 'title', children: 'Server-Driven UI' },
        },
        {
          type: 'text',
          props: {
            variant: 'body',
            children: 'This entire section is rendered from a JSON schema!'
          },
        },
        {
          type: 'card',
          props: { variant: 'elevated' },
          children: [
            {
              type: 'vstack',
              props: { spacing: 'sm' },
              children: [
                {
                  type: 'text',
                  props: { variant: 'subtitle', children: 'Dynamic Content' },
                },
                {
                  type: 'text',
                  props: {
                    variant: 'caption',
                    children: 'Update this from your server without app releases'
                  },
                },
                {
                  type: 'button',
                  props: {
                    label: 'Server Action',
                    variant: 'primary',
                    action: { type: 'analytics', event: 'sdui_button_pressed' },
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'hstack',
          props: { spacing: 'sm' },
          children: [
            {
              type: 'button',
              props: { label: 'Option A', variant: 'outline', size: 'sm' },
            },
            {
              type: 'button',
              props: { label: 'Option B', variant: 'outline', size: 'sm' },
            },
            {
              type: 'button',
              props: { label: 'Option C', variant: 'outline', size: 'sm' },
            },
          ],
        },
      ],
    },
  ],
};

function ThemedStatusBar() {
  const { mode } = useTheme();
  return <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />;
}

function TabBar({
  activeScreen,
  onSelect
}: {
  activeScreen: DemoScreen;
  onSelect: (screen: DemoScreen) => void;
}) {
  const { colors, spacing } = useTheme();

  const tabs: { key: DemoScreen; label: string; icon: string }[] = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'sdui', label: 'SDUI', icon: '📱' },
    { key: 'auth', label: 'Auth', icon: '🔐' },
    { key: 'analytics', label: 'Analytics', icon: '📊' },
    { key: 'i18n', label: 'i18n', icon: '🌍' },
    { key: 'performance', label: 'Perf', icon: '⚡' },
  ];

  return (
    <View style={[styles.tabBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack spacing="xs">
          {tabs.map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => onSelect(tab.key)}
              style={[
                styles.tab,
                {
                  backgroundColor: activeScreen === tab.key ? colors.primary : 'transparent',
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: activeScreen === tab.key ? '#fff' : colors.text,
                }}
              >
                {tab.icon} {tab.label}
              </Text>
            </Pressable>
          ))}
        </HStack>
      </ScrollView>
    </View>
  );
}

function HomeScreen() {
  const { colors, mode, setMode } = useTheme();
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const { user } = useAuth();

  return (
    <VStack spacing="lg">
      <VStack spacing="xs" align="center">
        <Text variant="title">RN Toolkit Pro</Text>
        <Text variant="caption">All Packages Demo</Text>
      </VStack>

      <Card variant="elevated">
        <VStack spacing="md">
          <Text variant="subtitle">Quick Actions</Text>

          <HStack spacing="sm">
            <Button
              label={mode === 'light' ? '🌙 Dark' : '☀️ Light'}
              variant="outline"
              size="sm"
              onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
            />
            <Button
              label={`🌍 ${locale.toUpperCase()}`}
              variant="outline"
              size="sm"
              onPress={() => {
                const locales = ['en', 'es', 'fr', 'de', 'ja'];
                const next = locales[(locales.indexOf(locale) + 1) % locales.length];
                setLocale(next);
              }}
            />
          </HStack>

          <Divider />

          <Text variant="body">
            {t('common.welcome', { name: user?.displayName || 'Developer' })}
          </Text>
        </VStack>
      </Card>

      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Packages Included</Text>
          <HStack spacing="xs" style={styles.packageTags}>
            {['theming', 'primitives', 'sdui', 'auth', 'analytics', 'i18n', 'performance', 'notifications', 'deeplink', 'security'].map(pkg => (
              <View key={pkg} style={[styles.packageTag, { backgroundColor: colors.surfaceElevated }]}>
                <Text variant="caption">{pkg}</Text>
              </View>
            ))}
          </HStack>
        </VStack>
      </Card>
    </VStack>
  );
}

function SDUIScreen() {
  const { colors } = useTheme();
  const { trackEvent } = useAnalytics();

  const handleAction = (action: { type: string; event?: string }) => {
    if (action.type === 'analytics' && action.event) {
      trackEvent(action.event, { source: 'sdui' });
    }
  };

  return (
    <VStack spacing="lg">
      <VStack spacing="xs">
        <Text variant="title">SDUI Engine</Text>
        <Text variant="caption">Server-Driven UI Rendering</Text>
      </VStack>

      <Card variant="filled">
        <VStack spacing="sm">
          <Text variant="label">Live Schema Preview</Text>
          <Text variant="caption" style={{ color: colors.textSecondary }}>
            The content below is rendered from JSON:
          </Text>
        </VStack>
      </Card>

      <View style={[styles.sduiContainer, { borderColor: colors.border }]}>
        <SDUIRenderer
          schema={homeScreenSchema}
          onAction={handleAction}
        />
      </View>

      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Schema Source</Text>
          <ScrollView horizontal>
            <Text variant="caption" style={styles.codeBlock}>
              {JSON.stringify(homeScreenSchema, null, 2).slice(0, 500)}...
            </Text>
          </ScrollView>
        </VStack>
      </Card>
    </VStack>
  );
}

function AuthScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mockUser, setMockUser] = useState<{ name: string; email: string } | null>(null);

  return (
    <VStack spacing="lg">
      <VStack spacing="xs">
        <Text variant="title">Authentication</Text>
        <Text variant="caption">Multi-provider Auth System</Text>
      </VStack>

      <Card variant="elevated">
        <VStack spacing="md">
          <Text variant="subtitle">Current State</Text>

          <HStack spacing="sm" align="center">
            <View style={[
              styles.statusDot,
              { backgroundColor: mockUser ? colors.success : colors.warning }
            ]} />
            <Text variant="body">
              {mockUser ? `Signed in as ${mockUser.name}` : 'Not authenticated'}
            </Text>
          </HStack>

          <Divider />

          {!mockUser ? (
            <VStack spacing="sm">
              <Button
                label="Sign In with Email"
                variant="primary"
                onPress={() => setMockUser({ name: 'John Doe', email: 'john@example.com' })}
              />
              <Button
                label="Sign In with Google"
                variant="outline"
                onPress={() => setMockUser({ name: 'Jane Smith', email: 'jane@gmail.com' })}
              />
              <Button
                label="Sign In with Apple"
                variant="outline"
                onPress={() => setMockUser({ name: 'Apple User', email: 'user@icloud.com' })}
              />
            </VStack>
          ) : (
            <VStack spacing="sm">
              <Card variant="filled">
                <VStack spacing="xs">
                  <Text variant="label">User Info</Text>
                  <Text variant="body">{mockUser.name}</Text>
                  <Text variant="caption">{mockUser.email}</Text>
                </VStack>
              </Card>
              <Button
                label={t('auth.signOut')}
                variant="secondary"
                onPress={() => setMockUser(null)}
              />
            </VStack>
          )}
        </VStack>
      </Card>

      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Supported Providers</Text>
          <HStack spacing="sm" style={styles.providerRow}>
            {['Email', 'Google', 'Apple', 'Facebook', 'Phone'].map(provider => (
              <View key={provider} style={[styles.providerBadge, { backgroundColor: colors.surfaceElevated }]}>
                <Text variant="caption">{provider}</Text>
              </View>
            ))}
          </HStack>
        </VStack>
      </Card>
    </VStack>
  );
}

function AnalyticsScreen() {
  const { colors } = useTheme();
  const { trackEvent, trackScreenView } = useAnalytics();
  const [events, setEvents] = useState<string[]>([]);

  const logEvent = (name: string) => {
    trackEvent(name, { timestamp: Date.now() });
    setEvents(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${name}`]);
  };

  return (
    <VStack spacing="lg">
      <VStack spacing="xs">
        <Text variant="title">Analytics</Text>
        <Text variant="caption">Event Tracking & Metrics</Text>
      </VStack>

      <Card variant="elevated">
        <VStack spacing="md">
          <Text variant="subtitle">Track Events</Text>

          <HStack spacing="sm" style={styles.buttonRow}>
            <Button
              label="Button Click"
              variant="primary"
              size="sm"
              onPress={() => logEvent('button_click')}
            />
            <Button
              label="Purchase"
              variant="outline"
              size="sm"
              onPress={() => logEvent('purchase_complete')}
            />
          </HStack>

          <HStack spacing="sm" style={styles.buttonRow}>
            <Button
              label="Sign Up"
              variant="outline"
              size="sm"
              onPress={() => logEvent('sign_up')}
            />
            <Button
              label="Share"
              variant="outline"
              size="sm"
              onPress={() => logEvent('content_share')}
            />
          </HStack>
        </VStack>
      </Card>

      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Event Log</Text>
          <View style={[styles.eventLog, { backgroundColor: colors.surfaceElevated }]}>
            {events.length === 0 ? (
              <Text variant="caption" style={{ color: colors.textMuted }}>
                No events tracked yet. Press a button above.
              </Text>
            ) : (
              events.map((event, i) => (
                <Text key={i} variant="caption">{event}</Text>
              ))
            )}
          </View>
        </VStack>
      </Card>
    </VStack>
  );
}

function I18nScreen() {
  const { colors } = useTheme();
  const { t, tp } = useTranslation();
  const { locale, setLocale, formatCurrency, formatNumber, formatDate } = useLocale();
  const [count, setCount] = useState(1);

  const locales = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  return (
    <VStack spacing="lg">
      <VStack spacing="xs">
        <Text variant="title">Internationalization</Text>
        <Text variant="caption">Multi-language Support</Text>
      </VStack>

      <Card variant="elevated">
        <VStack spacing="md">
          <Text variant="subtitle">Select Language</Text>
          <HStack spacing="sm" style={styles.localeRow}>
            {locales.map(l => (
              <Pressable
                key={l.code}
                onPress={() => setLocale(l.code)}
                style={[
                  styles.localeButton,
                  {
                    backgroundColor: locale === l.code ? colors.primary : colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text variant="body">{l.flag}</Text>
                <Text
                  variant="caption"
                  style={{ color: locale === l.code ? '#fff' : colors.text }}
                >
                  {l.code.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </VStack>
      </Card>

      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Translations</Text>
          <Text variant="body">{t('common.home')}</Text>
          <Text variant="body">{t('common.settings')}</Text>
          <Text variant="body">{t('common.welcome', { name: 'Developer' })}</Text>
          <Text variant="body">{t('auth.signIn')}</Text>
        </VStack>
      </Card>

      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Pluralization</Text>
          <Text variant="body">{tp('common.items', count)}</Text>
          <HStack spacing="sm">
            <Button label="-" variant="outline" size="sm" onPress={() => setCount(Math.max(0, count - 1))} />
            <Text variant="body" style={styles.countText}>{count}</Text>
            <Button label="+" variant="outline" size="sm" onPress={() => setCount(count + 1)} />
          </HStack>
        </VStack>
      </Card>

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

function PerformanceScreen() {
  const { colors } = useTheme();
  const { measure, startTrace } = usePerformance();
  const renderInfo = useRenderTracker({ componentName: 'PerformanceScreen' });
  const [measuring, setMeasuring] = useState(false);
  const [traceActive, setTraceActive] = useState(false);

  const runMeasurement = async () => {
    setMeasuring(true);
    await measure('demo_operation', async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    }, 'custom');
    setMeasuring(false);
  };

  const toggleTrace = async () => {
    if (traceActive) {
      setTraceActive(false);
    } else {
      const trace = await startTrace('demo_trace');
      setTraceActive(true);
      // Auto-stop after 3 seconds for demo
      setTimeout(() => {
        trace.stop();
        setTraceActive(false);
      }, 3000);
    }
  };

  return (
    <VStack spacing="lg">
      <VStack spacing="xs">
        <Text variant="title">Performance</Text>
        <Text variant="caption">Monitoring & Optimization</Text>
      </VStack>

      <Card variant="elevated">
        <VStack spacing="md">
          <Text variant="subtitle">Render Tracking</Text>
          <HStack spacing="lg">
            <VStack spacing="xs" align="center">
              <Text variant="title" style={{ color: colors.primary }}>
                {renderInfo.renderCount}
              </Text>
              <Text variant="caption">Renders</Text>
            </VStack>
            <VStack spacing="xs" align="center">
              <Text variant="title" style={{ color: colors.secondary }}>
                {renderInfo.lastRenderDuration.toFixed(1)}ms
              </Text>
              <Text variant="caption">Last Duration</Text>
            </VStack>
            <VStack spacing="xs" align="center">
              <Text variant="title" style={{ color: colors.success }}>
                {renderInfo.averageRenderDuration.toFixed(1)}ms
              </Text>
              <Text variant="caption">Average</Text>
            </VStack>
          </HStack>
        </VStack>
      </Card>

      <Card variant="outlined">
        <VStack spacing="sm">
          <Text variant="label">Measurement Tools</Text>
          <Button
            label={measuring ? 'Measuring...' : 'Run Measurement (500ms)'}
            variant="primary"
            disabled={measuring}
            onPress={runMeasurement}
          />
          <Button
            label={traceActive ? 'Trace Active (3s)...' : 'Start Trace'}
            variant={traceActive ? 'secondary' : 'outline'}
            onPress={toggleTrace}
          />
        </VStack>
      </Card>

      <Card variant="filled">
        <Text variant="caption" style={{ color: colors.textSecondary }}>
          Check the console for performance logs. In production, these would go to Firebase Performance or your analytics backend.
        </Text>
      </Card>
    </VStack>
  );
}

function MainContent({ activeScreen }: { activeScreen: DemoScreen }) {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}>
        {activeScreen === 'home' && <HomeScreen />}
        {activeScreen === 'sdui' && <SDUIScreen />}
        {activeScreen === 'auth' && <AuthScreen />}
        {activeScreen === 'analytics' && <AnalyticsScreen />}
        {activeScreen === 'i18n' && <I18nScreen />}
        {activeScreen === 'performance' && <PerformanceScreen />}
      </ScrollView>
    </SafeAreaView>
  );
}

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<DemoScreen>('home');

  return (
    <>
      <ThemedStatusBar />
      <MainContent activeScreen={activeScreen} />
      <TabBar activeScreen={activeScreen} onSelect={setActiveScreen} />
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <PerformanceProvider adapter={perfAdapter} config={{ debug: true }}>
        <AnalyticsProvider adapter={analyticsAdapter}>
          <AuthProvider adapter={authAdapter}>
            <NotificationProvider adapter={notificationAdapter}>
              <I18nProvider adapter={i18nAdapter}>
                <ThemeProvider mode="auto">
                  <SDUIProvider>
                    <AppContent />
                  </SDUIProvider>
                </ThemeProvider>
              </I18nProvider>
            </NotificationProvider>
          </AuthProvider>
        </AnalyticsProvider>
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
  tabBar: {
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tab: {
    borderRadius: 16,
    marginRight: 4,
  },
  packageTags: {
    flexWrap: 'wrap',
  },
  packageTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  sduiContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  codeBlock: {
    fontFamily: 'monospace',
    fontSize: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  providerRow: {
    flexWrap: 'wrap',
  },
  providerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 4,
  },
  buttonRow: {
    flexWrap: 'wrap',
  },
  eventLog: {
    padding: 12,
    borderRadius: 8,
    minHeight: 100,
  },
  localeRow: {
    flexWrap: 'wrap',
  },
  localeButton: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
  },
  countText: {
    minWidth: 40,
    textAlign: 'center',
  },
});

registerRootComponent(App);

export default App;
