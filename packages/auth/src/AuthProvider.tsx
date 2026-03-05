/**
 * Authentication Provider
 *
 * Provides authentication state and methods to the component tree.
 * Wraps Firebase Authentication with a clean React interface.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { AuthContext, initialAuthState } from './AuthContext';
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

// Firebase imports will be optional - we use dynamic imports
let firebaseAuth: typeof import('@react-native-firebase/auth').default | null = null;

/**
 * Try to import Firebase Auth
 */
async function loadFirebaseAuth() {
  try {
    const module = await import('@react-native-firebase/auth');
    firebaseAuth = module.default;
    return firebaseAuth;
  } catch {
    console.warn(
      '[@rn-toolkit/auth] Firebase Auth not installed. Install @react-native-firebase/auth for full functionality.'
    );
    return null;
  }
}

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
 * Convert Firebase error to AuthError
 */
function toAuthError(error: unknown): AuthError {
  if (error && typeof error === 'object' && 'code' in error) {
    const firebaseError = error as { code: string; message: string };
    return {
      code: firebaseError.code as AuthErrorCode,
      message: firebaseError.message,
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
 * Convert Firebase user to AuthUser
 */
function toAuthUser(firebaseUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerId: string;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  providerData: Array<{
    providerId: string;
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
  }>;
}): AuthUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    phoneNumber: firebaseUser.phoneNumber,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    isAnonymous: firebaseUser.isAnonymous,
    providerId: firebaseUser.providerId,
    createdAt: firebaseUser.metadata.creationTime
      ? new Date(firebaseUser.metadata.creationTime)
      : null,
    lastSignInAt: firebaseUser.metadata.lastSignInTime
      ? new Date(firebaseUser.metadata.lastSignInTime)
      : null,
    providerData: firebaseUser.providerData.map((p) => ({
      providerId: p.providerId,
      uid: p.uid,
      displayName: p.displayName,
      email: p.email,
      phoneNumber: p.phoneNumber,
      photoURL: p.photoURL,
    })),
  };
}

/**
 * AuthProvider props
 */
export interface AuthProviderProps {
  /** Child components */
  children: ReactNode;
  /** Configuration options */
  config?: AuthProviderConfig;
}

/**
 * AuthProvider component
 *
 * Provides authentication context to the component tree.
 *
 * @example
 * ```tsx
 * import { AuthProvider } from '@rn-toolkit/auth';
 *
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <MyApp />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children, config = {} }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const { onAuthStateChange, onError } = config;

  // Initialize Firebase Auth and listen for auth state changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      const auth = await loadFirebaseAuth();
      if (!auth) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Subscribe to auth state changes
      unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          const user = toAuthUser(firebaseUser as Parameters<typeof toAuthUser>[0]);
          dispatch({ type: 'SET_USER', payload: user });
          onAuthStateChange?.(user);
        } else {
          dispatch({ type: 'SET_USER', payload: null });
          onAuthStateChange?.(null);
        }
      });
    }

    initAuth();

    return () => {
      unsubscribe?.();
    };
  }, [onAuthStateChange]);

  // Sign in with email and password
  const signInWithEmail = useCallback(
    async (credentials: EmailPasswordCredentials): Promise<AuthUser> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const auth = await loadFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase Auth not available');
        }
        const result = await auth().signInWithEmailAndPassword(
          credentials.email,
          credentials.password
        );
        if (!result.user) {
          throw new Error('No user returned from sign in');
        }
        return toAuthUser(result.user as Parameters<typeof toAuthUser>[0]);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [onError]
  );

  // Sign up with email and password
  const signUpWithEmail = useCallback(
    async (credentials: EmailPasswordCredentials): Promise<AuthUser> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const auth = await loadFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase Auth not available');
        }
        const result = await auth().createUserWithEmailAndPassword(
          credentials.email,
          credentials.password
        );
        if (!result.user) {
          throw new Error('No user returned from sign up');
        }
        return toAuthUser(result.user as Parameters<typeof toAuthUser>[0]);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [onError]
  );

  // Sign in with social provider
  const signInWithProvider = useCallback(
    async (provider: SocialProvider): Promise<AuthUser> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const auth = await loadFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase Auth not available');
        }

        // Dynamic import of the provider module
        let providerInstance;
        switch (provider) {
          case 'google': {
            const GoogleSignIn = await import('@react-native-google-signin/google-signin');
            await GoogleSignIn.GoogleSignin.hasPlayServices();
            const { idToken } = await GoogleSignIn.GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const result = await auth().signInWithCredential(googleCredential);
            if (!result.user) {
              throw new Error('No user returned from Google sign in');
            }
            return toAuthUser(result.user as Parameters<typeof toAuthUser>[0]);
          }
          case 'apple': {
            const AppleAuth = await import('@invertase/react-native-apple-authentication');
            const appleAuthRequestResponse = await AppleAuth.appleAuth.performRequest({
              requestedOperation: AppleAuth.appleAuth.Operation.LOGIN,
              requestedScopes: [
                AppleAuth.appleAuth.Scope.EMAIL,
                AppleAuth.appleAuth.Scope.FULL_NAME,
              ],
            });
            const { identityToken, nonce } = appleAuthRequestResponse;
            if (!identityToken) {
              throw new Error('Apple Sign In failed - no identity token');
            }
            const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
            const result = await auth().signInWithCredential(appleCredential);
            if (!result.user) {
              throw new Error('No user returned from Apple sign in');
            }
            return toAuthUser(result.user as Parameters<typeof toAuthUser>[0]);
          }
          case 'facebook': {
            const FacebookLogin = await import('react-native-fbsdk-next');
            const loginResult = await FacebookLogin.LoginManager.logInWithPermissions([
              'public_profile',
              'email',
            ]);
            if (loginResult.isCancelled) {
              throw new Error('User cancelled Facebook login');
            }
            const data = await FacebookLogin.AccessToken.getCurrentAccessToken();
            if (!data?.accessToken) {
              throw new Error('Failed to get Facebook access token');
            }
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
            const result = await auth().signInWithCredential(facebookCredential);
            if (!result.user) {
              throw new Error('No user returned from Facebook sign in');
            }
            return toAuthUser(result.user as Parameters<typeof toAuthUser>[0]);
          }
          default:
            throw new Error(`Provider ${provider} not supported`);
        }
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [onError]
  );

  // Sign in with phone number
  const signInWithPhone = useCallback(
    async (options: PhoneAuthOptions): Promise<PhoneVerificationResult> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const auth = await loadFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase Auth not available');
        }
        const confirmation = await auth().signInWithPhoneNumber(options.phoneNumber);
        dispatch({ type: 'SET_LOADING', payload: false });
        return {
          verificationId: confirmation.verificationId || '',
        };
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [onError]
  );

  // Confirm phone number with verification code
  const confirmPhoneNumber = useCallback(
    async (verificationId: string, code: string): Promise<AuthUser> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const auth = await loadFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase Auth not available');
        }
        const credential = auth.PhoneAuthProvider.credential(verificationId, code);
        const result = await auth().signInWithCredential(credential);
        if (!result.user) {
          throw new Error('No user returned from phone verification');
        }
        return toAuthUser(result.user as Parameters<typeof toAuthUser>[0]);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [onError]
  );

  // Send password reset email
  const sendPasswordResetEmail = useCallback(
    async (email: string): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const auth = await loadFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase Auth not available');
        }
        await auth().sendPasswordResetEmail(email);
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [onError]
  );

  // Send email verification
  const sendEmailVerification = useCallback(async (): Promise<void> => {
    try {
      const auth = await loadFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase Auth not available');
      }
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      await currentUser.sendEmailVerification();
    } catch (error) {
      const authError = toAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: authError });
      onError?.(authError);
      throw authError;
    }
  }, [onError]);

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    try {
      const auth = await loadFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase Auth not available');
      }
      await auth().signOut();
    } catch (error) {
      const authError = toAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: authError });
      onError?.(authError);
      throw authError;
    }
  }, [onError]);

  // Refresh session
  const refreshSession = useCallback(async (): Promise<Session | null> => {
    try {
      const auth = await loadFirebaseAuth();
      if (!auth) {
        return null;
      }
      const currentUser = auth().currentUser;
      if (!currentUser) {
        return null;
      }
      const tokenResult = await currentUser.getIdTokenResult(true);
      return {
        token: tokenResult.token,
        refreshToken: '', // Firebase handles refresh internally
        expiresAt: new Date(tokenResult.expirationTime),
        isValid: new Date(tokenResult.expirationTime) > new Date(),
      };
    } catch (error) {
      const authError = toAuthError(error);
      onError?.(authError);
      return null;
    }
  }, [onError]);

  // Get current session
  const getSession = useCallback(async (): Promise<Session | null> => {
    try {
      const auth = await loadFirebaseAuth();
      if (!auth) {
        return null;
      }
      const currentUser = auth().currentUser;
      if (!currentUser) {
        return null;
      }
      const tokenResult = await currentUser.getIdTokenResult();
      return {
        token: tokenResult.token,
        refreshToken: '',
        expiresAt: new Date(tokenResult.expirationTime),
        isValid: new Date(tokenResult.expirationTime) > new Date(),
      };
    } catch {
      return null;
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(
    async (data: Partial<Pick<AuthUser, 'displayName' | 'photoURL'>>): Promise<void> => {
      try {
        const auth = await loadFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase Auth not available');
        }
        const currentUser = auth().currentUser;
        if (!currentUser) {
          throw new Error('No user is currently signed in');
        }
        await currentUser.updateProfile(data);
        // Refresh user data
        const updatedUser = toAuthUser(currentUser as Parameters<typeof toAuthUser>[0]);
        dispatch({ type: 'SET_USER', payload: updatedUser });
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [onError]
  );

  // Update email
  const updateEmail = useCallback(
    async (newEmail: string): Promise<void> => {
      try {
        const auth = await loadFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase Auth not available');
        }
        const currentUser = auth().currentUser;
        if (!currentUser) {
          throw new Error('No user is currently signed in');
        }
        await currentUser.updateEmail(newEmail);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [onError]
  );

  // Update password
  const updatePassword = useCallback(
    async (newPassword: string): Promise<void> => {
      try {
        const auth = await loadFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase Auth not available');
        }
        const currentUser = auth().currentUser;
        if (!currentUser) {
          throw new Error('No user is currently signed in');
        }
        await currentUser.updatePassword(newPassword);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [onError]
  );

  // Delete account
  const deleteAccount = useCallback(async (): Promise<void> => {
    try {
      const auth = await loadFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase Auth not available');
      }
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      await currentUser.delete();
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error) {
      const authError = toAuthError(error);
      dispatch({ type: 'SET_ERROR', payload: authError });
      onError?.(authError);
      throw authError;
    }
  }, [onError]);

  // Link provider
  const linkProvider = useCallback(
    async (provider: SocialProvider): Promise<void> => {
      // Implementation depends on provider - similar to signInWithProvider
      throw new Error(`Link provider ${provider} not yet implemented`);
    },
    []
  );

  // Unlink provider
  const unlinkProvider = useCallback(
    async (provider: SocialProvider): Promise<void> => {
      try {
        const auth = await loadFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase Auth not available');
        }
        const currentUser = auth().currentUser;
        if (!currentUser) {
          throw new Error('No user is currently signed in');
        }
        const providerMapping: Record<SocialProvider, string> = {
          google: 'google.com',
          apple: 'apple.com',
          facebook: 'facebook.com',
          twitter: 'twitter.com',
          github: 'github.com',
        };
        await currentUser.unlink(providerMapping[provider]);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [onError]
  );

  // Re-authenticate
  const reauthenticate = useCallback(
    async (credentials: EmailPasswordCredentials): Promise<void> => {
      try {
        const auth = await loadFirebaseAuth();
        if (!auth) {
          throw new Error('Firebase Auth not available');
        }
        const currentUser = auth().currentUser;
        if (!currentUser) {
          throw new Error('No user is currently signed in');
        }
        const credential = auth.EmailAuthProvider.credential(
          credentials.email,
          credentials.password
        );
        await currentUser.reauthenticateWithCredential(credential);
      } catch (error) {
        const authError = toAuthError(error);
        dispatch({ type: 'SET_ERROR', payload: authError });
        onError?.(authError);
        throw authError;
      }
    },
    [onError]
  );

  // Get MFA factors
  const getMfaFactors = useCallback(async (): Promise<MfaEnrollmentInfo[]> => {
    // MFA implementation would go here
    return [];
  }, []);

  // Enroll MFA
  const enrollMfa = useCallback(
    async (method: MfaMethod, phoneNumber?: string): Promise<void> => {
      // MFA enrollment implementation
      throw new Error('MFA enrollment not yet implemented');
    },
    []
  );

  // Unenroll MFA
  const unenrollMfa = useCallback(async (factorUid: string): Promise<void> => {
    // MFA unenrollment implementation
    throw new Error('MFA unenrollment not yet implemented');
  }, []);

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
