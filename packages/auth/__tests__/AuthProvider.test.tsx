/**
 * AuthProvider Tests
 */

import React from 'react';
import { Text, View } from 'react-native';
import { render, waitFor, act } from '@testing-library/react-native';
import { AuthProvider } from '../src/AuthProvider';
import { useAuth } from '../src/hooks/useAuth';

// Mock Firebase Auth
jest.mock('@react-native-firebase/auth');

// Test component that uses auth
function TestComponent() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Text testID="loading">Loading...</Text>;
  }

  return (
    <View>
      <Text testID="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</Text>
      {user && <Text testID="user-email">{user.email}</Text>}
    </View>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders_children', () => {
      const { getByTestId } = render(
        <AuthProvider>
          <Text testID="child">Hello</Text>
        </AuthProvider>
      );

      expect(getByTestId('child')).toBeTruthy();
    });

    it('provides_auth_context', async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for auth state to resolve
      await waitFor(() => {
        expect(getByTestId('auth-status')).toBeTruthy();
      });
    });
  });

  describe('initial state', () => {
    it('starts_in_loading_state', () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(getByTestId('loading')).toBeTruthy();
    });

    it('shows_not_authenticated_when_no_user', async () => {
      const { getByTestId, queryByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(queryByTestId('loading')).toBeNull();
      });

      expect(getByTestId('auth-status').props.children).toBe('not-authenticated');
    });
  });

  describe('configuration', () => {
    it('accepts_config_prop', () => {
      const onAuthStateChange = jest.fn();

      render(
        <AuthProvider config={{ onAuthStateChange }}>
          <TestComponent />
        </AuthProvider>
      );

      // Config should be accepted without error
      expect(true).toBe(true);
    });

    it('accepts_onError_callback', () => {
      const onError = jest.fn();

      render(
        <AuthProvider config={{ onError }}>
          <TestComponent />
        </AuthProvider>
      );

      // Config should be accepted without error
      expect(true).toBe(true);
    });
  });
});

describe('useAuth outside provider', () => {
  it('provides_default_methods_that_throw', () => {
    // Temporarily suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    let capturedAuth: ReturnType<typeof useAuth> | null = null;

    function CaptureAuth() {
      capturedAuth = useAuth();
      return null;
    }

    // Render without provider - should not crash
    render(<CaptureAuth />);

    // Methods should throw when called
    expect(capturedAuth?.signInWithEmail({ email: '', password: '' })).rejects.toThrow(
      'AuthProvider not found'
    );

    consoleSpy.mockRestore();
  });
});
