/**
 * useUser Hook Tests
 */

import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { AuthContext } from '../src/AuthContext';
import { useUser } from '../src/hooks/useUser';
import type { AuthContextValue, AuthUser } from '../src/types';

// Create a mock user
const mockUser: AuthUser = {
  uid: 'test-uid-123',
  email: 'john.doe@example.com',
  displayName: 'John Doe',
  phoneNumber: '+1234567890',
  photoURL: 'https://example.com/photo.jpg',
  emailVerified: true,
  isAnonymous: false,
  providerId: 'firebase',
  createdAt: new Date('2024-01-01'),
  lastSignInAt: new Date('2024-01-15'),
  providerData: [
    {
      providerId: 'google.com',
      uid: 'google-123',
      displayName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: null,
      photoURL: 'https://example.com/photo.jpg',
    },
  ],
};

// Create a wrapper with custom context value
function createWrapper(contextValue: Partial<AuthContextValue>) {
  const fullValue: AuthContextValue = {
    state: {
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    },
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
    ...contextValue,
  };

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AuthContext.Provider value={fullValue}>
        {children}
      </AuthContext.Provider>
    );
  };
}

describe('useUser', () => {
  describe('when not authenticated', () => {
    it('returns_null_user', () => {
      const wrapper = createWrapper({
        user: null,
        isAuthenticated: false,
        loading: false,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.user).toBeNull();
    });

    it('returns_isAuthenticated_false', () => {
      const wrapper = createWrapper({
        user: null,
        isAuthenticated: false,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('returns_empty_initials', () => {
      const wrapper = createWrapper({
        user: null,
        isAuthenticated: false,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.getInitials()).toBe('');
    });
  });

  describe('when authenticated', () => {
    it('returns_user', () => {
      const wrapper = createWrapper({
        user: mockUser,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.user).toEqual(mockUser);
    });

    it('returns_isAuthenticated_true', () => {
      const wrapper = createWrapper({
        user: mockUser,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('returns_isEmailVerified', () => {
      const wrapper = createWrapper({
        user: mockUser,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.isEmailVerified).toBe(true);
    });

    it('returns_isAnonymous', () => {
      const wrapper = createWrapper({
        user: mockUser,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.isAnonymous).toBe(false);
    });
  });

  describe('getInitials', () => {
    it('returns_initials_from_displayName', () => {
      const wrapper = createWrapper({
        user: mockUser,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.getInitials()).toBe('JD');
    });

    it('handles_single_name', () => {
      const wrapper = createWrapper({
        user: { ...mockUser, displayName: 'John' },
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.getInitials()).toBe('JO');
    });

    it('uses_email_when_no_displayName', () => {
      const wrapper = createWrapper({
        user: { ...mockUser, displayName: null },
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.getInitials()).toBe('JO'); // From john.doe@...
    });

    it('handles_three_name_parts', () => {
      const wrapper = createWrapper({
        user: { ...mockUser, displayName: 'John Michael Doe' },
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      // Should use first and last name initials
      expect(result.current.getInitials()).toBe('JD');
    });
  });

  describe('getAvatarUrl', () => {
    it('returns_photoURL_when_available', () => {
      const wrapper = createWrapper({
        user: mockUser,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.getAvatarUrl()).toBe('https://example.com/photo.jpg');
    });

    it('returns_fallback_when_no_photoURL', () => {
      const wrapper = createWrapper({
        user: { ...mockUser, photoURL: null },
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.getAvatarUrl()).toContain('ui-avatars.com');
    });

    it('returns_custom_fallback', () => {
      const wrapper = createWrapper({
        user: { ...mockUser, photoURL: null },
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.getAvatarUrl('https://custom.com/avatar.png')).toBe(
        'https://custom.com/avatar.png'
      );
    });
  });

  describe('hasProvider', () => {
    it('returns_true_for_linked_provider', () => {
      const wrapper = createWrapper({
        user: mockUser,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.hasProvider('google.com')).toBe(true);
    });

    it('returns_false_for_unlinked_provider', () => {
      const wrapper = createWrapper({
        user: mockUser,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.hasProvider('apple.com')).toBe(false);
    });

    it('returns_false_when_no_user', () => {
      const wrapper = createWrapper({
        user: null,
        isAuthenticated: false,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.hasProvider('google.com')).toBe(false);
    });
  });

  describe('loading state', () => {
    it('reflects_loading_state', () => {
      const wrapper = createWrapper({
        user: null,
        isAuthenticated: false,
        loading: true,
      });

      const { result } = renderHook(() => useUser(), { wrapper });

      expect(result.current.loading).toBe(true);
    });
  });
});
