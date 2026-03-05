/**
 * Console Auth Adapter
 *
 * A debugging adapter that logs all auth events to console.
 * Extends NoOpAdapter to simulate actual behavior while logging.
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
import { NoOpAdapter } from './NoOpAdapter';

export interface ConsoleAdapterOptions {
  /** Log prefix */
  prefix?: string;
  /** Include timestamps in logs */
  timestamps?: boolean;
  /** Auto sign in with mock user */
  autoSignIn?: boolean;
}

/**
 * Console Auth Adapter
 *
 * A debugging adapter that logs all authentication operations to console.
 * Useful for development and debugging.
 *
 * @example
 * ```tsx
 * import { AuthProvider, ConsoleAdapter } from '@rn-toolkit/auth';
 *
 * // In development
 * <AuthProvider adapter={new ConsoleAdapter({ prefix: '[Auth]' })}>
 *   <App />
 * </AuthProvider>
 * ```
 */
export class ConsoleAdapter extends NoOpAdapter {
  override readonly name = 'console';

  private prefix: string;
  private timestamps: boolean;

  constructor(options: ConsoleAdapterOptions = {}) {
    super({ autoSignIn: options.autoSignIn });
    this.prefix = options.prefix ?? '[Auth]';
    this.timestamps = options.timestamps ?? false;
  }

  private log(action: string, data?: Record<string, unknown>): void {
    const timestamp = this.timestamps ? `${new Date().toISOString()} ` : '';
    console.log(`${timestamp}${this.prefix} ${action}`, data ?? '');
  }

  override async initialize(): Promise<void> {
    this.log('INIT', { adapter: this.name });
    await super.initialize();
  }

  // ============================================
  // SIGN IN METHODS
  // ============================================

  override async signInWithEmail(credentials: EmailPasswordCredentials): Promise<AuthUser> {
    this.log('SIGN_IN_EMAIL', { email: credentials.email });
    const user = await super.signInWithEmail(credentials);
    this.log('SIGN_IN_SUCCESS', { uid: user.uid, email: user.email });
    return user;
  }

  override async signUpWithEmail(credentials: EmailPasswordCredentials): Promise<AuthUser> {
    this.log('SIGN_UP_EMAIL', { email: credentials.email });
    const user = await super.signUpWithEmail(credentials);
    this.log('SIGN_UP_SUCCESS', { uid: user.uid, email: user.email });
    return user;
  }

  override async signInWithProvider(provider: SocialProvider): Promise<AuthUser> {
    this.log('SIGN_IN_PROVIDER', { provider });
    const user = await super.signInWithProvider(provider);
    this.log('SIGN_IN_SUCCESS', { uid: user.uid, provider });
    return user;
  }

  override async signInWithPhone(options: PhoneAuthOptions): Promise<PhoneVerificationResult> {
    this.log('SIGN_IN_PHONE', { phoneNumber: options.phoneNumber });
    const result = await super.signInWithPhone(options);
    this.log('PHONE_VERIFICATION_SENT', { verificationId: result.verificationId });
    return result;
  }

  override async confirmPhoneNumber(verificationId: string, code: string): Promise<AuthUser> {
    this.log('CONFIRM_PHONE', { verificationId, codeLength: code.length });
    const user = await super.confirmPhoneNumber(verificationId, code);
    this.log('PHONE_VERIFIED', { uid: user.uid });
    return user;
  }

  override async signInAnonymously(): Promise<AuthUser> {
    this.log('SIGN_IN_ANONYMOUS');
    const user = await super.signInAnonymously();
    this.log('SIGN_IN_SUCCESS', { uid: user.uid, isAnonymous: true });
    return user;
  }

  // ============================================
  // SIGN OUT
  // ============================================

  override async signOut(): Promise<void> {
    this.log('SIGN_OUT');
    await super.signOut();
    this.log('SIGN_OUT_SUCCESS');
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  override async getSession(): Promise<Session | null> {
    this.log('GET_SESSION');
    const session = await super.getSession();
    this.log('SESSION_RESULT', { hasSession: !!session });
    return session;
  }

  override async refreshSession(): Promise<Session | null> {
    this.log('REFRESH_SESSION');
    const session = await super.refreshSession();
    this.log('SESSION_REFRESHED', { hasSession: !!session });
    return session;
  }

  // ============================================
  // PASSWORD MANAGEMENT
  // ============================================

  override async sendPasswordResetEmail(email: string): Promise<void> {
    this.log('SEND_PASSWORD_RESET', { email });
    await super.sendPasswordResetEmail(email);
    this.log('PASSWORD_RESET_SENT');
  }

  override async sendEmailVerification(): Promise<void> {
    this.log('SEND_EMAIL_VERIFICATION');
    await super.sendEmailVerification();
    this.log('EMAIL_VERIFICATION_SENT');
  }

  override async updatePassword(_newPassword: string): Promise<void> {
    this.log('UPDATE_PASSWORD');
    await super.updatePassword(_newPassword);
    this.log('PASSWORD_UPDATED');
  }

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  override async updateProfile(data: Partial<Pick<AuthUser, 'displayName' | 'photoURL'>>): Promise<AuthUser> {
    this.log('UPDATE_PROFILE', data);
    const user = await super.updateProfile(data);
    this.log('PROFILE_UPDATED', { uid: user.uid });
    return user;
  }

  override async updateEmail(newEmail: string): Promise<void> {
    this.log('UPDATE_EMAIL', { newEmail });
    await super.updateEmail(newEmail);
    this.log('EMAIL_UPDATED');
  }

  override async deleteAccount(): Promise<void> {
    this.log('DELETE_ACCOUNT');
    await super.deleteAccount();
    this.log('ACCOUNT_DELETED');
  }

  // ============================================
  // PROVIDER LINKING
  // ============================================

  override async linkProvider(provider: SocialProvider): Promise<void> {
    this.log('LINK_PROVIDER', { provider });
    await super.linkProvider(provider);
    this.log('PROVIDER_LINKED');
  }

  override async unlinkProvider(provider: SocialProvider): Promise<void> {
    this.log('UNLINK_PROVIDER', { provider });
    await super.unlinkProvider(provider);
    this.log('PROVIDER_UNLINKED');
  }

  override async reauthenticate(credentials: EmailPasswordCredentials): Promise<void> {
    this.log('REAUTHENTICATE', { email: credentials.email });
    await super.reauthenticate(credentials);
    this.log('REAUTHENTICATED');
  }

  // ============================================
  // MFA
  // ============================================

  override async getMfaFactors(): Promise<MfaEnrollmentInfo[]> {
    this.log('GET_MFA_FACTORS');
    const factors = await super.getMfaFactors();
    this.log('MFA_FACTORS', { count: factors.length });
    return factors;
  }

  override async enrollMfa(method: MfaMethod, phoneNumber?: string): Promise<void> {
    this.log('ENROLL_MFA', { method, phoneNumber });
    await super.enrollMfa(method, phoneNumber);
    this.log('MFA_ENROLLED');
  }

  override async unenrollMfa(factorUid: string): Promise<void> {
    this.log('UNENROLL_MFA', { factorUid });
    await super.unenrollMfa(factorUid);
    this.log('MFA_UNENROLLED');
  }
}
