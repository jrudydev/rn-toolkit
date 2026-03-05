import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../src';

describe('useTheme', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it('returns_themeContext_whenInsideProvider', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toHaveProperty('colors');
    expect(result.current).toHaveProperty('spacing');
    expect(result.current).toHaveProperty('typography');
    expect(result.current).toHaveProperty('shadows');
    expect(result.current).toHaveProperty('mode');
    expect(result.current).toHaveProperty('setMode');
  });

  it('returns_lightColors_whenModeIsLight', () => {
    const lightWrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider mode="light">{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper: lightWrapper });

    expect(result.current.mode).toBe('light');
    expect(result.current.colors.background).toBe('#FFFFFF');
    expect(result.current.colors.text).toBe('#1A1A1A');
  });

  it('returns_darkColors_whenModeIsDark', () => {
    const darkWrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider mode="dark">{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper: darkWrapper });

    expect(result.current.mode).toBe('dark');
    expect(result.current.colors.background).toBe('#0A0A0A');
    expect(result.current.colors.text).toBe('#FAFAFA');
  });

  it('returns_spacingTokens_correctly', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.spacing.xs).toBe(4);
    expect(result.current.spacing.sm).toBe(8);
    expect(result.current.spacing.md).toBe(16);
    expect(result.current.spacing.lg).toBe(24);
    expect(result.current.spacing.xl).toBe(32);
    expect(result.current.spacing.xxl).toBe(48);
  });

  it('returns_scope_correctly', () => {
    const scopedWrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider scope="modal">{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper: scopedWrapper });

    expect(result.current.scope).toBe('modal');
  });

  it('returns_defaultScope_whenNotSpecified', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.scope).toBe('global');
  });
});
