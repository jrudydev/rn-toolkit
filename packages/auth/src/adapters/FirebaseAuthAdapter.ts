/**
 * Firebase Auth Adapter
 *
 * Production adapter using Firebase Authentication.
 * Requires @react-native-firebase/auth to be installed.
 */

import type {
  AuthUser,
  EmailPasswordCredentials,
  MfaEnrollmentInfo,
  MfaMethod,
  PhoneAuthOptions,
  PhoneVerificationResult,
  Session,
  SocialProvider,
} from '../types';
import type { AuthAdapter, AuthStateCallback } from './types';

// Firebase imports will be optional - we use dynamic imports
let firebaseAuth: typeof import('@react-native-firebase/auth').default | null = null;

/**
 * Try to import Firebase Auth
 */
async function loadFirebaseAuth() {
  if (firebaseAuth) return firebaseAuth;
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
 * Firebase Auth Adapter
 *
 * Production adapter that integrates with Firebase Authentication.
 *
 * @example
 * ```tsx
 * import { AuthProvider, FirebaseAuthAdapter } from '@rn-toolkit/auth';
 *
 * // In production
 * <AuthProvider adapter={new FirebaseAuthAdapter()}>
 *   <App />
 * </AuthProvider>
 * ```
 */
export class FirebaseAuthAdapter implements AuthAdapter {
  readonly name = 'firebase';

  private currentUser: AuthUser | null = null;
  private unsubscribe: (() => void) | null = null;
  private listeners: Set<AuthStateCallback> = new Set();

  async initialize(): Promise<void> {
    const auth = await loadFirebaseAuth();
    if (!auth) {
      return;
    }

    // Subscribe to auth state changes
    this.unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        this.currentUser = toAuthUser(firebaseUser as Parameters<typeof toAuthUser>[0]);
      } else {
        this.currentUser = null;
      }
      this.notifyListeners();
    });
  }

  onAuthStateChanged(callback: AuthStateCallback): () => void {
    this.listeners.add(callback);
    // Immediately call with current state
    callback(this.currentUser);
    return () => {
      this.listeners.delete(callback);
    };
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback(this.currentUser));
  }

  // ============================================
  // SIGN IN METHODS
  // ============================================

  async signInWithEmail(credentials: EmailPasswordCredentials): Promise<AuthUser> {
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
  }

  async signUpWithEmail(credentials: EmailPasswordCredentials): Promise<AuthUser> {
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
  }

  async signInWithProvider(provider: SocialProvider): Promise<AuthUser> {
    const auth = await loadFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not available');
    }

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
  }

  async signInWithPhone(options: PhoneAuthOptions): Promise<PhoneVerificationResult> {
    const auth = await loadFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not available');
    }
    const confirmation = await auth().signInWithPhoneNumber(options.phoneNumber);
    return {
      verificationId: confirmation.verificationId || '',
    };
  }

  async confirmPhoneNumber(verificationId: string, code: string): Promise<AuthUser> {
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
  }

  async signInAnonymously(): Promise<AuthUser> {
    const auth = await loadFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not available');
    }
    const result = await auth().signInAnonymously();
    if (!result.user) {
      throw new Error('No user returned from anonymous sign in');
    }
    return toAuthUser(result.user as Parameters<typeof toAuthUser>[0]);
  }

  // ============================================
  // SIGN OUT
  // ============================================

  async signOut(): Promise<void> {
    const auth = await loadFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not available');
    }
    await auth().signOut();
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  async getSession(): Promise<Session | null> {
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
  }

  async refreshSession(): Promise<Session | null> {
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
      refreshToken: '',
      expiresAt: new Date(tokenResult.expirationTime),
      isValid: new Date(tokenResult.expirationTime) > new Date(),
    };
  }

  // ============================================
  // PASSWORD MANAGEMENT
  // ============================================

  async sendPasswordResetEmail(email: string): Promise<void> {
    const auth = await loadFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not available');
    }
    await auth().sendPasswordResetEmail(email);
  }

  async sendEmailVerification(): Promise<void> {
    const auth = await loadFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not available');
    }
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    await currentUser.sendEmailVerification();
  }

  async updatePassword(newPassword: string): Promise<void> {
    const auth = await loadFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not available');
    }
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    await currentUser.updatePassword(newPassword);
  }

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  async updateProfile(data: Partial<Pick<AuthUser, 'displayName' | 'photoURL'>>): Promise<AuthUser> {
    const auth = await loadFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not available');
    }
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    await currentUser.updateProfile(data);
    return toAuthUser(currentUser as Parameters<typeof toAuthUser>[0]);
  }

  async updateEmail(newEmail: string): Promise<void> {
    const auth = await loadFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not available');
    }
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    await currentUser.updateEmail(newEmail);
  }

  async deleteAccount(): Promise<void> {
    const auth = await loadFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not available');
    }
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    await currentUser.delete();
  }

  // ============================================
  // PROVIDER LINKING
  // ============================================

  async linkProvider(provider: SocialProvider): Promise<void> {
    // TODO: Implement provider linking
    throw new Error(`Link provider ${provider} not yet implemented`);
  }

  async unlinkProvider(provider: SocialProvider): Promise<void> {
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
  }

  async reauthenticate(credentials: EmailPasswordCredentials): Promise<void> {
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
  }

  // ============================================
  // MFA
  // ============================================

  async getMfaFactors(): Promise<MfaEnrollmentInfo[]> {
    // TODO: Implement MFA factors retrieval
    return [];
  }

  async enrollMfa(_method: MfaMethod, _phoneNumber?: string): Promise<void> {
    throw new Error('MFA enrollment not yet implemented');
  }

  async unenrollMfa(_factorUid: string): Promise<void> {
    throw new Error('MFA unenrollment not yet implemented');
  }
}
