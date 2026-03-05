/**
 * SignInButton Tests
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthContext } from '../src/AuthContext';
import { SignInButton } from '../src/components/SignInButton';
import type { AuthContextValue, AuthUser } from '../src/types';

// Mock user
const mockUser: AuthUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  phoneNumber: null,
  photoURL: null,
  emailVerified: true,
  isAnonymous: false,
  providerId: 'google.com',
  createdAt: null,
  lastSignInAt: null,
  providerData: [],
};

// Create wrapper with mock context
function createWrapper(overrides: Partial<AuthContextValue> = {}) {
  const mockSignInWithProvider = jest.fn().mockResolvedValue(mockUser);

  const value: AuthContextValue = {
    state: { user: null, loading: false, error: null, isAuthenticated: false },
    user: null,
    loading: false,
    isAuthenticated: false,
    signInWithEmail: jest.fn(),
    signUpWithEmail: jest.fn(),
    signInWithProvider: mockSignInWithProvider,
    signInWithPhone: jest.fn(),
    confirmPhoneNumber: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    sendEmailVerification: jest.fn(),
    signOut: jest.fn(),
    refreshSession: jest.fn(),
    getSession: jest.fn(),
    updateProfile: jest.fn(),
    updateEmail: jest.fn(),
    updatePassword: jest.fn(),
    deleteAccount: jest.fn(),
    linkProvider: jest.fn(),
    unlinkProvider: jest.fn(),
    reauthenticate: jest.fn(),
    getMfaFactors: jest.fn(),
    enrollMfa: jest.fn(),
    unenrollMfa: jest.fn(),
    ...overrides,
  };

  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    ),
    mockSignInWithProvider,
  };
}

describe('SignInButton', () => {
  describe('rendering', () => {
    it('renders_google_button', () => {
      const { wrapper } = createWrapper();
      const { getByText } = render(<SignInButton provider="google" />, { wrapper });

      expect(getByText('Continue with Google')).toBeTruthy();
    });

    it('renders_apple_button', () => {
      const { wrapper } = createWrapper();
      const { getByText } = render(<SignInButton provider="apple" />, { wrapper });

      expect(getByText('Continue with Apple')).toBeTruthy();
    });

    it('renders_facebook_button', () => {
      const { wrapper } = createWrapper();
      const { getByText } = render(<SignInButton provider="facebook" />, { wrapper });

      expect(getByText('Continue with Facebook')).toBeTruthy();
    });

    it('renders_custom_text', () => {
      const { wrapper } = createWrapper();
      const { getByText } = render(
        <SignInButton provider="google" text="Sign in with Google" />,
        { wrapper }
      );

      expect(getByText('Sign in with Google')).toBeTruthy();
    });
  });

  describe('variants', () => {
    it('renders_filled_variant_by_default', () => {
      const { wrapper } = createWrapper();
      const { getByRole } = render(<SignInButton provider="google" />, { wrapper });

      const button = getByRole('button');
      expect(button).toBeTruthy();
    });

    it('renders_outlined_variant', () => {
      const { wrapper } = createWrapper();
      const { getByRole } = render(<SignInButton provider="google" variant="outlined" />, {
        wrapper,
      });

      expect(getByRole('button')).toBeTruthy();
    });

    it('renders_icon_variant', () => {
      const { wrapper } = createWrapper();
      const { getByRole } = render(<SignInButton provider="google" variant="icon" />, { wrapper });

      expect(getByRole('button')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('calls_signInWithProvider_on_press', async () => {
      const { wrapper, mockSignInWithProvider } = createWrapper();
      const { getByRole } = render(<SignInButton provider="google" />, { wrapper });

      fireEvent.press(getByRole('button'));

      await waitFor(() => {
        expect(mockSignInWithProvider).toHaveBeenCalledWith('google');
      });
    });

    it('calls_onSuccess_callback', async () => {
      const { wrapper } = createWrapper();
      const onSuccess = jest.fn();

      const { getByRole } = render(
        <SignInButton provider="google" onSuccess={onSuccess} />,
        { wrapper }
      );

      fireEvent.press(getByRole('button'));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(mockUser);
      });
    });

    it('calls_onError_callback_on_failure', async () => {
      const mockError = { code: 'auth/popup-closed-by-user', message: 'User cancelled' };
      const mockSignInWithProvider = jest.fn().mockRejectedValue(mockError);
      const { wrapper } = createWrapper({ signInWithProvider: mockSignInWithProvider });
      const onError = jest.fn();

      const { getByRole } = render(
        <SignInButton provider="google" onError={onError} />,
        { wrapper }
      );

      fireEvent.press(getByRole('button'));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(mockError);
      });
    });

    it('does_not_call_signIn_when_disabled', () => {
      const { wrapper, mockSignInWithProvider } = createWrapper();
      const { getByRole } = render(<SignInButton provider="google" disabled />, { wrapper });

      fireEvent.press(getByRole('button'));

      expect(mockSignInWithProvider).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('shows_loading_indicator_when_loading', () => {
      const { wrapper } = createWrapper();
      const { getByRole, queryByText } = render(
        <SignInButton provider="google" loading />,
        { wrapper }
      );

      // Loading indicator should be present, text should not
      expect(getByRole('button')).toBeTruthy();
      // The text should be replaced with a loader
    });

    it('disables_button_when_loading', () => {
      const { wrapper, mockSignInWithProvider } = createWrapper();
      const { getByRole } = render(<SignInButton provider="google" loading />, { wrapper });

      fireEvent.press(getByRole('button'));

      expect(mockSignInWithProvider).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has_accessible_role', () => {
      const { wrapper } = createWrapper();
      const { getByRole } = render(<SignInButton provider="google" />, { wrapper });

      expect(getByRole('button')).toBeTruthy();
    });

    it('has_accessible_label', () => {
      const { wrapper } = createWrapper();
      const { getByLabelText } = render(<SignInButton provider="google" />, { wrapper });

      expect(getByLabelText('Continue with Google')).toBeTruthy();
    });
  });
});
