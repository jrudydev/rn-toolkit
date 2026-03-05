/**
 * Auth Adapter Types
 *
 * Interface definitions for authentication adapters.
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

/**
 * Auth state change callback
 */
export type AuthStateCallback = (user: AuthUser | null) => void;

/**
 * Auth Adapter Interface
 *
 * Implement this interface to create a custom authentication backend.
 */
export interface AuthAdapter {
  /** Adapter name for identification */
  readonly name: string;

  /**
   * Initialize the adapter
   */
  initialize(): Promise<void>;

  /**
   * Subscribe to auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChanged(callback: AuthStateCallback): () => void;

  /**
   * Get the current user
   */
  getCurrentUser(): AuthUser | null;

  // ============================================
  // SIGN IN METHODS
  // ============================================

  /**
   * Sign in with email and password
   */
  signInWithEmail(credentials: EmailPasswordCredentials): Promise<AuthUser>;

  /**
   * Sign up with email and password
   */
  signUpWithEmail(credentials: EmailPasswordCredentials): Promise<AuthUser>;

  /**
   * Sign in with social provider
   */
  signInWithProvider(provider: SocialProvider): Promise<AuthUser>;

  /**
   * Sign in with phone number
   */
  signInWithPhone(options: PhoneAuthOptions): Promise<PhoneVerificationResult>;

  /**
   * Confirm phone number with verification code
   */
  confirmPhoneNumber(verificationId: string, code: string): Promise<AuthUser>;

  /**
   * Sign in anonymously
   */
  signInAnonymously(): Promise<AuthUser>;

  // ============================================
  // SIGN OUT
  // ============================================

  /**
   * Sign out the current user
   */
  signOut(): Promise<void>;

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  /**
   * Get the current session
   */
  getSession(): Promise<Session | null>;

  /**
   * Refresh the current session
   */
  refreshSession(): Promise<Session | null>;

  // ============================================
  // PASSWORD MANAGEMENT
  // ============================================

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Send email verification
   */
  sendEmailVerification(): Promise<void>;

  /**
   * Update user password
   */
  updatePassword(newPassword: string): Promise<void>;

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  /**
   * Update user profile
   */
  updateProfile(data: Partial<Pick<AuthUser, 'displayName' | 'photoURL'>>): Promise<AuthUser>;

  /**
   * Update user email
   */
  updateEmail(newEmail: string): Promise<void>;

  /**
   * Delete the current user account
   */
  deleteAccount(): Promise<void>;

  // ============================================
  // PROVIDER LINKING
  // ============================================

  /**
   * Link a social provider to the current account
   */
  linkProvider(provider: SocialProvider): Promise<void>;

  /**
   * Unlink a social provider from the current account
   */
  unlinkProvider(provider: SocialProvider): Promise<void>;

  /**
   * Re-authenticate the user
   */
  reauthenticate(credentials: EmailPasswordCredentials): Promise<void>;

  // ============================================
  // MFA
  // ============================================

  /**
   * Get enrolled MFA factors
   */
  getMfaFactors(): Promise<MfaEnrollmentInfo[]>;

  /**
   * Enroll a new MFA factor
   */
  enrollMfa(method: MfaMethod, phoneNumber?: string): Promise<void>;

  /**
   * Unenroll an MFA factor
   */
  unenrollMfa(factorUid: string): Promise<void>;
}
