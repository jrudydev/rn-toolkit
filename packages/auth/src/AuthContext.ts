/**
 * Authentication Context
 *
 * React context for authentication state and methods.
 */

import { createContext } from 'react';
import type { AuthContextValue, AuthState } from './types';

/**
 * Initial authentication state
 */
export const initialAuthState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

/**
 * Default context value (throws if used outside provider)
 */
const defaultContextValue: AuthContextValue = {
  state: initialAuthState,
  user: null,
  loading: true,
  isAuthenticated: false,
  signInWithEmail: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  signUpWithEmail: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  signInWithProvider: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  signInWithPhone: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  confirmPhoneNumber: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  sendPasswordResetEmail: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  sendEmailVerification: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  signOut: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  refreshSession: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  getSession: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  updateProfile: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  updateEmail: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  updatePassword: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  deleteAccount: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  linkProvider: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  unlinkProvider: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  reauthenticate: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  getMfaFactors: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  enrollMfa: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
  unenrollMfa: async () => {
    throw new Error('AuthProvider not found. Wrap your app with <AuthProvider>.');
  },
};

/**
 * Authentication context
 */
export const AuthContext = createContext<AuthContextValue>(defaultContextValue);
