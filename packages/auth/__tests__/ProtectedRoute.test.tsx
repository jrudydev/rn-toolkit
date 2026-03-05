/**
 * ProtectedRoute Tests
 */

import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { AuthContext } from '../src/AuthContext';
import { ProtectedRoute } from '../src/components/ProtectedRoute';
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
  providerId: 'firebase',
  createdAt: null,
  lastSignInAt: null,
  providerData: [],
};

// Create wrapper with mock context
function createWrapper(overrides: Partial<AuthContextValue> = {}) {
  const value: AuthContextValue = {
    state: { user: null, loading: false, error: null, isAuthenticated: false },
    user: null,
    loading: false,
    isAuthenticated: false,
    signInWithEmail: jest.fn(),
    signUpWithEmail: jest.fn(),
    signInWithProvider: jest.fn(),
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

  return ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

describe('ProtectedRoute', () => {
  describe('when loading', () => {
    it('shows_default_loading_indicator', () => {
      const wrapper = createWrapper({ loading: true });

      const { UNSAFE_root } = render(
        <ProtectedRoute>
          <Text testID="protected">Protected Content</Text>
        </ProtectedRoute>,
        { wrapper }
      );

      // Should show loading indicator, not protected content
      expect(UNSAFE_root.findAllByType(Text).length).toBe(0);
    });

    it('shows_custom_loading_component', () => {
      const wrapper = createWrapper({ loading: true });

      const { getByTestId } = render(
        <ProtectedRoute loadingComponent={<Text testID="custom-loading">Loading...</Text>}>
          <Text testID="protected">Protected Content</Text>
        </ProtectedRoute>,
        { wrapper }
      );

      expect(getByTestId('custom-loading')).toBeTruthy();
    });
  });

  describe('when not authenticated', () => {
    it('renders_nothing_by_default', () => {
      const wrapper = createWrapper({ isAuthenticated: false, loading: false });

      const { queryByTestId } = render(
        <ProtectedRoute>
          <Text testID="protected">Protected Content</Text>
        </ProtectedRoute>,
        { wrapper }
      );

      expect(queryByTestId('protected')).toBeNull();
    });

    it('renders_fallback_when_provided', () => {
      const wrapper = createWrapper({ isAuthenticated: false, loading: false });

      const { getByTestId, queryByTestId } = render(
        <ProtectedRoute fallback={<Text testID="fallback">Please log in</Text>}>
          <Text testID="protected">Protected Content</Text>
        </ProtectedRoute>,
        { wrapper }
      );

      expect(getByTestId('fallback')).toBeTruthy();
      expect(queryByTestId('protected')).toBeNull();
    });

    it('calls_onUnauthenticated_callback', () => {
      const onUnauthenticated = jest.fn();
      const wrapper = createWrapper({ isAuthenticated: false, loading: false });

      render(
        <ProtectedRoute onUnauthenticated={onUnauthenticated}>
          <Text testID="protected">Protected Content</Text>
        </ProtectedRoute>,
        { wrapper }
      );

      expect(onUnauthenticated).toHaveBeenCalled();
    });
  });

  describe('when authenticated', () => {
    it('renders_children', () => {
      const wrapper = createWrapper({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
      });

      const { getByTestId } = render(
        <ProtectedRoute>
          <Text testID="protected">Protected Content</Text>
        </ProtectedRoute>,
        { wrapper }
      );

      expect(getByTestId('protected')).toBeTruthy();
    });

    it('does_not_render_fallback', () => {
      const wrapper = createWrapper({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
      });

      const { queryByTestId } = render(
        <ProtectedRoute fallback={<Text testID="fallback">Please log in</Text>}>
          <Text testID="protected">Protected Content</Text>
        </ProtectedRoute>,
        { wrapper }
      );

      expect(queryByTestId('fallback')).toBeNull();
    });

    it('does_not_call_onUnauthenticated', () => {
      const onUnauthenticated = jest.fn();
      const wrapper = createWrapper({
        user: mockUser,
        isAuthenticated: true,
        loading: false,
      });

      render(
        <ProtectedRoute onUnauthenticated={onUnauthenticated}>
          <Text testID="protected">Protected Content</Text>
        </ProtectedRoute>,
        { wrapper }
      );

      expect(onUnauthenticated).not.toHaveBeenCalled();
    });
  });

  describe('email verification requirement', () => {
    it('shows_fallback_when_email_not_verified', () => {
      const wrapper = createWrapper({
        user: { ...mockUser, emailVerified: false },
        isAuthenticated: true,
        loading: false,
      });

      const { getByTestId, queryByTestId } = render(
        <ProtectedRoute
          requireEmailVerified
          fallback={<Text testID="verify-email">Please verify your email</Text>}
        >
          <Text testID="protected">Protected Content</Text>
        </ProtectedRoute>,
        { wrapper }
      );

      expect(getByTestId('verify-email')).toBeTruthy();
      expect(queryByTestId('protected')).toBeNull();
    });

    it('renders_children_when_email_verified', () => {
      const wrapper = createWrapper({
        user: mockUser, // emailVerified: true
        isAuthenticated: true,
        loading: false,
      });

      const { getByTestId } = render(
        <ProtectedRoute requireEmailVerified>
          <Text testID="protected">Protected Content</Text>
        </ProtectedRoute>,
        { wrapper }
      );

      expect(getByTestId('protected')).toBeTruthy();
    });

    it('does_not_require_email_verification_by_default', () => {
      const wrapper = createWrapper({
        user: { ...mockUser, emailVerified: false },
        isAuthenticated: true,
        loading: false,
      });

      const { getByTestId } = render(
        <ProtectedRoute>
          <Text testID="protected">Protected Content</Text>
        </ProtectedRoute>,
        { wrapper }
      );

      expect(getByTestId('protected')).toBeTruthy();
    });
  });
});
