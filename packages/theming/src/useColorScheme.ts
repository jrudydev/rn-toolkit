import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { ResolvedThemeMode } from './types';

/**
 * Hook to get and subscribe to system color scheme changes
 * @returns Current system color scheme ('light' or 'dark')
 */
export function useColorScheme(): ResolvedThemeMode {
  const [colorScheme, setColorScheme] = useState<ResolvedThemeMode>(() => {
    const scheme = Appearance.getColorScheme();
    return scheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme: newScheme }: { colorScheme: ColorSchemeName }) => {
        setColorScheme(newScheme === 'dark' ? 'dark' : 'light');
      }
    );

    return () => {
      subscription?.remove?.();
    };
  }, []);

  return colorScheme;
}
