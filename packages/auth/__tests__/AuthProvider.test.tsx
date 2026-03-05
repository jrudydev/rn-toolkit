/**
 * AuthProvider Tests
 */

import React from 'react';
import { Text, View } from 'react-native';
import { render, waitFor, act } from '@testing-library/react-native';
import { AuthProvider } from '../src/AuthProvider';
import { useAuth } from '../src/hooks/useAuth';
import { NoOpAdapter } from '../src/adapters/NoOpAdapter';
import { ConsoleAdapter } from '../src/adapters/ConsoleAdapter';

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
      const adapter = new NoOpAdapter();
      const { getByTestId } = render(
        <AuthProvider adapter={adapter}>
          <Text testID="child">Hello</Text>
        </AuthProvider>
      );

      expect(getByTestId('child')).toBeTruthy();
    });

    it('provides_auth_context', async () => {
      const adapter = new NoOpAdapter();
      const { getByTestId } = render(
        <AuthProvider adapter={adapter}>
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
      const adapter = new NoOpAdapter();
      const { getByTestId } = render(
        <AuthProvider adapter={adapter}>
          <TestComponent />
        </AuthProvider>
      );

      expect(getByTestId('loading')).toBeTruthy();
    });

    it('shows_not_authenticated_when_no_user', async () => {
      const adapter = new NoOpAdapter();
      const { getByTestId, queryByTestId } = render(
        <AuthProvider adapter={adapter}>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(queryByTestId('loading')).toBeNull();
      });

      expect(getByTestId('auth-status').props.children).toBe('not-authenticated');
    });

    it('shows_authenticated_with_autoSignIn', async () => {
      const adapter = new NoOpAdapter({ autoSignIn: true });
      const { getByTestId, queryByTestId } = render(
        <AuthProvider adapter={adapter}>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(queryByTestId('loading')).toBeNull();
      });

      expect(getByTestId('auth-status').props.children).toBe('authenticated');
    });
  });

  describe('configuration', () => {
    it('accepts_config_prop', () => {
      const adapter = new NoOpAdapter();
      const onAuthStateChange = jest.fn();

      render(
        <AuthProvider adapter={adapter} config={{ onAuthStateChange }}>
          <TestComponent />
        </AuthProvider>
      );

      // Config should be accepted without error
      expect(true).toBe(true);
    });

    it('accepts_onError_callback', () => {
      const adapter = new NoOpAdapter();
      const onError = jest.fn();

      render(
        <AuthProvider adapter={adapter} config={{ onError }}>
          <TestComponent />
        </AuthProvider>
      );

      // Config should be accepted without error
      expect(true).toBe(true);
    });
  });

  describe('adapter pattern', () => {
    it('works_with_NoOpAdapter', async () => {
      const adapter = new NoOpAdapter();
      const { getByTestId } = render(
        <AuthProvider adapter={adapter}>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('auth-status')).toBeTruthy();
      });
    });

    it('works_with_ConsoleAdapter', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const adapter = new ConsoleAdapter({ prefix: '[Test]' });

      const { getByTestId } = render(
        <AuthProvider adapter={adapter}>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('auth-status')).toBeTruthy();
      });

      // Console adapter should have logged initialization
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Test] INIT'),
        expect.anything()
      );

      consoleSpy.mockRestore();
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

describe('Auth operations', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('signInWithEmail_callsAdapter', async () => {
    const adapter = new ConsoleAdapter({ prefix: '[Test]' });
    let authContext: ReturnType<typeof useAuth>;

    function CaptureAuth() {
      authContext = useAuth();
      return null;
    }

    render(
      <AuthProvider adapter={adapter}>
        <CaptureAuth />
      </AuthProvider>
    );

    await act(async () => {
      await authContext!.signInWithEmail({ email: 'test@test.com', password: 'password' });
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('SIGN_IN_EMAIL'),
      expect.objectContaining({ email: 'test@test.com' })
    );
  });

  it('signOut_callsAdapter', async () => {
    const adapter = new NoOpAdapter({ autoSignIn: true });
    let authContext: ReturnType<typeof useAuth>;

    function CaptureAuth() {
      authContext = useAuth();
      return null;
    }

    const { getByTestId } = render(
      <AuthProvider adapter={adapter}>
        <CaptureAuth />
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial auth
    await waitFor(() => {
      expect(getByTestId('auth-status').props.children).toBe('authenticated');
    });

    await act(async () => {
      await authContext!.signOut();
    });

    await waitFor(() => {
      expect(getByTestId('auth-status').props.children).toBe('not-authenticated');
    });
  });
});
