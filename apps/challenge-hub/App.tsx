/**
 * Challenge Hub
 *
 * A React Native app for browsing and completing coding challenges
 * using @astacinco packages.
 *
 * Supports both free and pro challenges (pro added via dependency).
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';

import { ChallengeListScreen, ChallengeDetailScreen } from './src/screens';

// Navigation types
export type RootStackParamList = {
  ChallengeList: undefined;
  ChallengeDetail: { challengeId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { colors, mode } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ChallengeList"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="ChallengeList"
          component={ChallengeListScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChallengeDetail"
          component={ChallengeDetailScreen}
          options={{
            title: 'Challenge',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider mode="auto">
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
