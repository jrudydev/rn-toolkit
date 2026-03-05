/**
 * Authentication Types
 *
 * Type definitions for the @rn-toolkit/auth package.
 */

/**
 * User profile information
 */
export interface AuthUser {
  /** Unique user identifier */
  uid: string;
  /** User's email address */
  email: string | null;
  /** User's display name */
  displayName: string | null;
  /** User's phone number */
  phoneNumber: string | null;
  /** URL to user's profile photo */
  photoURL: string | null;
  /** Whether the email has been verified */
  emailVerified: boolean;
  /** Whether the user is anonymous */
  isAnonymous: boolean;
  /** Authentication provider ID (e.g., 'google.com', 'apple.com') */
  providerId: string;
  /** Timestamp when the account was created */
  createdAt: Date | null;
  /** Timestamp of the last sign-in */
  lastSignInAt: Date | null;
  /** Provider-specific data */
  providerData: ProviderUserInfo[];
}

/**
 * Provider-specific user information
 */
export interface ProviderUserInfo {
  providerId: string;
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

/**
 * Authentication state
 */
export interface AuthState {
  /** Current user or null if not authenticated */
  user: AuthUser | null;
  /** Whether authentication state is being loaded */
  loading: boolean;
  /** Current error if any */
  error: AuthError | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

/**
 * Session information
 */
export interface Session {
  /** Session token */
  token: string;
  /** Token refresh token */
  refreshToken: string;
  /** Token expiration timestamp */
  expiresAt: Date;
  /** Whether the session is valid */
  isValid: boolean;
}

/**
 * Authentication error
 */
export interface AuthError {
  /** Error code */
  code: AuthErrorCode;
  /** Human-readable error message */
  message: string;
  /** Original error (if any) */
  originalError?: unknown;
}

/**
 * Authentication error codes
 */
export type AuthErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/operation-not-allowed'
  | 'auth/invalid-credential'
  | 'auth/invalid-verification-code'
  | 'auth/invalid-verification-id'
  | 'auth/missing-verification-code'
  | 'auth/missing-verification-id'
  | 'auth/phone-number-already-exists'
  | 'auth/invalid-phone-number'
  | 'auth/quota-exceeded'
  | 'auth/cancelled-popup-request'
  | 'auth/popup-blocked'
  | 'auth/popup-closed-by-user'
  | 'auth/provider-already-linked'
  | 'auth/credential-already-in-use'
  | 'auth/requires-recent-login'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed'
  | 'auth/timeout'
  | 'auth/unknown';

/**
 * Sign-in credentials for email/password
 */
export interface EmailPasswordCredentials {
  email: string;
  password: string;
}

/**
 * Phone authentication options
 */
export interface PhoneAuthOptions {
  phoneNumber: string;
  /** Force reCAPTCHA verification (optional) */
  forceResend?: boolean;
  /** Timeout in seconds for code delivery (default: 60) */
  timeout?: number;
}

/**
 * Phone verification result
 */
export interface PhoneVerificationResult {
  /** Verification ID to use with confirmPhoneNumber */
  verificationId: string;
}

/**
 * Social provider types
 */
export type SocialProvider = 'google' | 'apple' | 'facebook' | 'twitter' | 'github';

/**
 * MFA (Multi-Factor Authentication) method types
 */
export type MfaMethod = 'phone' | 'totp' | 'email';

/**
 * MFA enrollment info
 */
export interface MfaEnrollmentInfo {
  /** MFA factor UID */
  uid: string;
  /** MFA method type */
  method: MfaMethod;
  /** Display name for this factor */
  displayName: string | null;
  /** Enrollment timestamp */
  enrolledAt: Date;
  /** Phone number (if phone MFA) */
  phoneNumber?: string;
}

/**
 * Auth provider configuration
 */
export interface AuthProviderConfig {
  /** Firebase configuration object (optional if already initialized) */
  firebaseConfig?: FirebaseConfig;
  /** Whether to persist authentication state (default: true) */
  persistence?: boolean;
  /** Storage key prefix for auth tokens (default: '@rn-toolkit/auth') */
  storageKeyPrefix?: string;
  /** Whether to use secure storage (default: true) */
  useSecureStorage?: boolean;
  /** Callback when authentication state changes */
  onAuthStateChange?: (user: AuthUser | null) => void;
  /** Callback when an error occurs */
  onError?: (error: AuthError) => void;
}

/**
 * Firebase configuration
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
}

/**
 * Sign-in button props
 */
export interface SignInButtonProps {
  /** Provider to sign in with */
  provider: SocialProvider;
  /** Button style variant */
  variant?: 'filled' | 'outlined' | 'icon';
  /** Custom button text (overrides default) */
  text?: string;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether to show loading state */
  loading?: boolean;
  /** Callback when sign-in completes */
  onSuccess?: (user: AuthUser) => void;
  /** Callback when sign-in fails */
  onError?: (error: AuthError) => void;
}

/**
 * Auth context value
 */
export interface AuthContextValue {
  /** Current authentication state */
  state: AuthState;
  /** Current user (convenience alias for state.user) */
  user: AuthUser | null;
  /** Whether loading (convenience alias for state.loading) */
  loading: boolean;
  /** Whether authenticated (convenience alias for state.isAuthenticated) */
  isAuthenticated: boolean;
  /** Sign in with email and password */
  signInWithEmail: (credentials: EmailPasswordCredentials) => Promise<AuthUser>;
  /** Sign up with email and password */
  signUpWithEmail: (credentials: EmailPasswordCredentials) => Promise<AuthUser>;
  /** Sign in with social provider */
  signInWithProvider: (provider: SocialProvider) => Promise<AuthUser>;
  /** Sign in with phone number */
  signInWithPhone: (options: PhoneAuthOptions) => Promise<PhoneVerificationResult>;
  /** Confirm phone number with verification code */
  confirmPhoneNumber: (verificationId: string, code: string) => Promise<AuthUser>;
  /** Send password reset email */
  sendPasswordResetEmail: (email: string) => Promise<void>;
  /** Send email verification to current user */
  sendEmailVerification: () => Promise<void>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Refresh the current session */
  refreshSession: () => Promise<Session | null>;
  /** Get the current session */
  getSession: () => Promise<Session | null>;
  /** Update user profile */
  updateProfile: (data: Partial<Pick<AuthUser, 'displayName' | 'photoURL'>>) => Promise<void>;
  /** Update user email */
  updateEmail: (newEmail: string) => Promise<void>;
  /** Update user password */
  updatePassword: (newPassword: string) => Promise<void>;
  /** Delete the current user account */
  deleteAccount: () => Promise<void>;
  /** Link a social provider to the current account */
  linkProvider: (provider: SocialProvider) => Promise<void>;
  /** Unlink a social provider from the current account */
  unlinkProvider: (provider: SocialProvider) => Promise<void>;
  /** Re-authenticate the user (required for sensitive operations) */
  reauthenticate: (credentials: EmailPasswordCredentials) => Promise<void>;
  /** Get enrolled MFA factors */
  getMfaFactors: () => Promise<MfaEnrollmentInfo[]>;
  /** Enroll a new MFA factor */
  enrollMfa: (method: MfaMethod, phoneNumber?: string) => Promise<void>;
  /** Unenroll an MFA factor */
  unenrollMfa: (factorUid: string) => Promise<void>;
}
