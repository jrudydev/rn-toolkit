/**
 * Authentication Provider
 *
 * Provides authentication state and methods to the component tree.
 * Uses the adapter pattern for swappable authentication backends.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { AuthContext, initialAuthState } from './AuthContext';
import type { AuthAdapter } from './adapters/types';
import type {
  AuthContextValue,
  AuthError,
  AuthErrorCode,
  AuthProviderConfig,
  AuthState,
  AuthUser,
  EmailPasswordCredentials,
  MfaEnrollmentInfo,
  MfaMethod,
  PhoneAuthOptions,
  PhoneVerificationResult,
  Session,
  SocialProvider,
} from './types';

/**
 * Auth state reducer actions
 */
type AuthAction =
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: AuthError | null }
  | { type: 'RESET' };

/**
 * Auth state reducer
 */
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'RESET':
      return initialAuthState;
    default:
      return state;
  }
}

/**
 * Convert error to AuthError
 */
function toAuthError(error: unknown): AuthError {
  if (error && typeof error === 'object' && 'code' in error) {
    const authError = error as { code: string; message: string };
    return {
      code: authError.code as AuthErrorCode,
      message: authError.message,
      originalError: error,
    };
  }
  return {
    code: 'auth/unknown',
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    originalError: error,
  };
}

/**
 * AuthProvider props
 */
export interface AuthProviderProps {
  /** Child components */
  children: ReactNode;
  /** Authentication adapter (required) */
  adapter: AuthAdapter;
  /** Configuration options */
  config?: AuthProviderConfig;
}

/**
 * AuthProvider component
 *
 * Provides authentication context to the component tree using the adapter pattern.
 *
 * @example
 * ```tsx
 * import { AuthProvider, FirebaseAuthAdapter } from '@rn-toolkit/auth';
 *
 * // Production: Firebase Auth
 * const adapter = new FirebaseAuthAdapter();
 *
 * // Development: Console logging
 * const adapter = new ConsoleAdapter({ prefix: '[Auth]' });
 *
 * // Testing: NoOp
 * const adapter = new NoOpAdapter();
 *
 * function App() {
 *   return (
 *     <AuthProvider adapter={adapter}>
 *       <MyApp />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children, adapter, config = {} }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const { onAuthStateChange, onError } = config;

  // Initialize adapter and listen for auth state changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      try {
        await adapter.initialize();

        // Subscribe to auth state changes
        unsubscribe = adapter.onAuthStateChanged((user) => {
          dispatch({ type: 'SET_USER', payload: user });
          onAuthStateChange?.(user);
        });
      } catch (error) {
        console.error('[@rn-toolkit/auth] Failed to initialize:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    initAuth();

    return () => {
      unsubscribe?.();
    };
  }, [adapter, onAuthStateChange]);

  // Sign in with email and password
  const signInWithEmail = useCallback(
    async (credentials: EmailPasswordCredentials): Promise<AuthUser> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const user = await adapter.signInWithEmail(credentials);
        return user;
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Sign up with email and password
  const signUpWithEmail = useCallback(
    async (credentials: EmailPasswordCredentials): Promise<AuthUser> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const user = await adapter.signUpWithEmail(credentials);
        return user;
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Sign in with social provider
  const signInWithProvider = useCallback(
    async (provider: SocialProvider): Promise<AuthUser> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const user = await adapter.signInWithProvider(provider);
        return user;
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Sign in with phone number
  const signInWithPhone = useCallback(
    async (options: PhoneAuthOptions): Promise<PhoneVerificationResult> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const result = await adapter.signInWithPhone(options);
        dispatch({ type: 'SET_LOADING', payload: false });
        return result;
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Confirm phone number with verification code
  const confirmPhoneNumber = useCallback(
    async (verificationId: string, code: string): Promise<AuthUser> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const user = await adapter.confirmPhoneNumber(verificationId, code);
        return user;
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Send password reset email
  const sendPasswordResetEmail = useCallback(
    async (email: string): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await adapter.sendPasswordResetEmail(email);
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Send email verification
  const sendEmailVerification = useCallback(async (): Promise<void> => {
    try {
      await adapter.sendEmailVerification();
    } catch (error) {
      const authError = toAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: authError });
      onError?.(authError);
      throw authError;
    }
  }, [adapter, onError]);

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await adapter.signOut();
    } catch (error) {
      const authError = toAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: authError });
      onError?.(authError);
      throw authError;
    }
  }, [adapter, onError]);

  // Refresh session
  const refreshSession = useCallback(async (): Promise<Session | null> => {
    try {
      return await adapter.refreshSession();
    } catch (error) {
      const authError = toAuthError(error);
      onError?.(authError);
      return null;
    }
  }, [adapter, onError]);

  // Get current session
  const getSession = useCallback(async (): Promise<Session | null> => {
    try {
      return await adapter.getSession();
    } catch {
      return null;
    }
  }, [adapter]);

  // Update profile
  const updateProfile = useCallback(
    async (data: Partial<Pick<AuthUser, 'displayName' | 'photoURL'>>): Promise<void> => {
      try {
        const updatedUser = await adapter.updateProfile(data);
        dispatch({ type: 'SET_USER', payload: updatedUser });
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Update email
  const updateEmail = useCallback(
    async (newEmail: string): Promise<void> => {
      try {
        await adapter.updateEmail(newEmail);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Update password
  const updatePassword = useCallback(
    async (newPassword: string): Promise<void> => {
      try {
        await adapter.updatePassword(newPassword);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Delete account
  const deleteAccount = useCallback(async (): Promise<void> => {
    try {
      await adapter.deleteAccount();
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error) {
      const authError = toAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: authError });
      onError?.(authError);
      throw authError;
    }
  }, [adapter, onError]);

  // Link provider
  const linkProvider = useCallback(
    async (provider: SocialProvider): Promise<void> => {
      try {
        await adapter.linkProvider(provider);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Unlink provider
  const unlinkProvider = useCallback(
    async (provider: SocialProvider): Promise<void> => {
      try {
        await adapter.unlinkProvider(provider);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Re-authenticate
  const reauthenticate = useCallback(
    async (credentials: EmailPasswordCredentials): Promise<void> => {
      try {
        await adapter.reauthenticate(credentials);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [adapter, onError]
  );

  // Get MFA factors
  const getMfaFactors = useCallback(async (): Promise<MfaEnrollmentInfo[]> => {
    return adapter.getMfaFactors();
  }, [adapter]);

  // Enroll MFA
  const enrollMfa = useCallback(
    async (method: MfaMethod, phoneNumber?: string): Promise<void> => {
      await adapter.enrollMfa(method, phoneNumber);
    },
    [adapter]
  );

  // Unenroll MFA
  const unenrollMfa = useCallback(
    async (factorUid: string): Promise<void> => {
      await adapter.unenrollMfa(factorUid);
    },
    [adapter]
  );

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      state,
      user: state.user,
      loading: state.loading,
      isAuthenticated: state.isAuthenticated,
      signInWithEmail,
      signUpWithEmail,
      signInWithProvider,
      signInWithPhone,
      confirmPhoneNumber,
      sendPasswordResetEmail,
      sendEmailVerification,
      signOut,
      refreshSession,
      getSession,
      updateProfile,
      updateEmail,
      updatePassword,
      deleteAccount,
      linkProvider,
      unlinkProvider,
      reauthenticate,
      getMfaFactors,
      enrollMfa,
      unenrollMfa,
    }),
    [
      state,
      signInWithEmail,
      signUpWithEmail,
      signInWithProvider,
      signInWithPhone,
      confirmPhoneNumber,
      sendPasswordResetEmail,
      sendEmailVerification,
      signOut,
      refreshSession,
      getSession,
      updateProfile,
      updateEmail,
      updatePassword,
      deleteAccount,
      linkProvider,
      unlinkProvider,
      reauthenticate,
      getMfaFactors,
      enrollMfa,
      unenrollMfa,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
