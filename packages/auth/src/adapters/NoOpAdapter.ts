/**
 * NoOp Auth Adapter
 *
 * A silent adapter that does nothing - useful for testing.
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

/**
 * Mock user for NoOp adapter
 */
const mockUser: AuthUser = {
  uid: 'mock-user-id',
  email: 'mock@example.com',
  displayName: 'Mock User',
  phoneNumber: null,
  photoURL: null,
  emailVerified: true,
  isAnonymous: false,
  providerId: 'mock',
  createdAt: new Date(),
  lastSignInAt: new Date(),
  providerData: [],
};

/**
 * NoOp Auth Adapter
 *
 * A silent adapter for testing that simulates authentication
 * without actually connecting to any backend.
 *
 * @example
 * ```tsx
 * import { AuthProvider, NoOpAdapter } from '@rn-toolkit/auth';
 *
 * // In tests
 * <AuthProvider adapter={new NoOpAdapter()}>
 *   <App />
 * </AuthProvider>
 * ```
 */
export class NoOpAdapter implements AuthAdapter {
  readonly name = 'noop';

  private currentUser: AuthUser | null = null;
  private listeners: Set<AuthStateCallback> = new Set();
  private autoSignIn: boolean;

  /**
   * Create a NoOp adapter
   * @param autoSignIn - Automatically sign in with mock user (default: false)
   */
  constructor(options: { autoSignIn?: boolean } = {}) {
    this.autoSignIn = options.autoSignIn ?? false;
  }

  async initialize(): Promise<void> {
    if (this.autoSignIn) {
      this.currentUser = mockUser;
      this.notifyListeners();
    }
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

  async signInWithEmail(_credentials: EmailPasswordCredentials): Promise<AuthUser> {
    this.currentUser = { ...mockUser, email: _credentials.email };
    this.notifyListeners();
    return this.currentUser;
  }

  async signUpWithEmail(_credentials: EmailPasswordCredentials): Promise<AuthUser> {
    this.currentUser = { ...mockUser, email: _credentials.email };
    this.notifyListeners();
    return this.currentUser;
  }

  async signInWithProvider(provider: SocialProvider): Promise<AuthUser> {
    this.currentUser = { ...mockUser, providerId: `${provider}.com` };
    this.notifyListeners();
    return this.currentUser;
  }

  async signInWithPhone(_options: PhoneAuthOptions): Promise<PhoneVerificationResult> {
    return { verificationId: 'mock-verification-id' };
  }

  async confirmPhoneNumber(_verificationId: string, _code: string): Promise<AuthUser> {
    this.currentUser = { ...mockUser, phoneNumber: '+1234567890' };
    this.notifyListeners();
    return this.currentUser;
  }

  async signInAnonymously(): Promise<AuthUser> {
    this.currentUser = { ...mockUser, isAnonymous: true };
    this.notifyListeners();
    return this.currentUser;
  }

  // ============================================
  // SIGN OUT
  // ============================================

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.notifyListeners();
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  async getSession(): Promise<Session | null> {
    if (!this.currentUser) return null;
    return {
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
      isValid: true,
    };
  }

  async refreshSession(): Promise<Session | null> {
    return this.getSession();
  }

  // ============================================
  // PASSWORD MANAGEMENT
  // ============================================

  async sendPasswordResetEmail(_email: string): Promise<void> {
    // No-op
  }

  async sendEmailVerification(): Promise<void> {
    // No-op
  }

  async updatePassword(_newPassword: string): Promise<void> {
    // No-op
  }

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  async updateProfile(data: Partial<Pick<AuthUser, 'displayName' | 'photoURL'>>): Promise<AuthUser> {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...data };
      this.notifyListeners();
    }
    return this.currentUser || mockUser;
  }

  async updateEmail(newEmail: string): Promise<void> {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, email: newEmail };
      this.notifyListeners();
    }
  }

  async deleteAccount(): Promise<void> {
    this.currentUser = null;
    this.notifyListeners();
  }

  // ============================================
  // PROVIDER LINKING
  // ============================================

  async linkProvider(_provider: SocialProvider): Promise<void> {
    // No-op
  }

  async unlinkProvider(_provider: SocialProvider): Promise<void> {
    // No-op
  }

  async reauthenticate(_credentials: EmailPasswordCredentials): Promise<void> {
    // No-op
  }

  // ============================================
  // MFA
  // ============================================

  async getMfaFactors(): Promise<MfaEnrollmentInfo[]> {
    return [];
  }

  async enrollMfa(_method: MfaMethod, _phoneNumber?: string): Promise<void> {
    // No-op
  }

  async unenrollMfa(_factorUid: string): Promise<void> {
    // No-op
  }
}
