import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';
import { LogProvider, ConsoleAdapter } from '@astacinco/rn-logging';

// Configure logging adapter
const logAdapter = new ConsoleAdapter({
  prefix: '[Scaffold]',
  minLevel: 'debug',
  useColors: true,
  showTimestamp: true,
});

function ThemedStatusBar() {
  const { mode } = useTheme();
  return <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider mode="auto">
        <LogProvider adapter={logAdapter}>
          <ThemedStatusBar />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </LogProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
