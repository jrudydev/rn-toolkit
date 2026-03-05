import React, { useMemo, useState, useCallback } from 'react';
import { ThemeContext } from './ThemeContext';
import { useColorScheme } from './useColorScheme';
import { defaultTheme } from './themes/default';
import {
  ThemeProviderProps,
  ThemeMode,
  ResolvedThemeMode,
  ThemeContextValue,
  ThemeTokens,
} from './types';

/**
 * Deep merge two objects
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue !== undefined &&
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      !Array.isArray(sourceValue) &&
      typeof targetValue === 'object' &&
      targetValue !== null
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        targetValue as object,
        sourceValue as object
      );
    } else if (sourceValue !== undefined) {
      (result as Record<string, unknown>)[key] = sourceValue;
    }
  }

  return result;
}

/**
 * ThemeProvider component
 *
 * Provides theme context to all child components.
 * Supports light/dark/auto modes and scoped theming.
 */
export function ThemeProvider({
  children,
  mode: initialMode = 'auto',
  theme: customTheme,
  scope = 'global',
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [modeOverride, setModeOverride] = useState<ThemeMode>(initialMode);

  // Merge custom theme with default theme
  const mergedTheme = useMemo<ThemeTokens>(() => {
    if (!customTheme) return defaultTheme;
    return deepMerge(defaultTheme, customTheme);
  }, [customTheme]);

  // Resolve the actual mode (auto -> light/dark based on system)
  const resolvedMode: ResolvedThemeMode = useMemo(() => {
    if (modeOverride === 'auto') {
      return systemColorScheme;
    }
    return modeOverride;
  }, [modeOverride, systemColorScheme]);

  // Set mode handler
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeOverride(newMode);
  }, []);

  // Build context value
  const contextValue = useMemo<ThemeContextValue>(() => {
    const colors = mergedTheme.colors[resolvedMode];
    const shadows = mergedTheme.shadows[resolvedMode];

    return {
      mode: resolvedMode,
      colors,
      spacing: mergedTheme.spacing,
      typography: mergedTheme.typography,
      shadows,
      setMode,
      scope,
    };
  }, [resolvedMode, mergedTheme, setMode, scope]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
