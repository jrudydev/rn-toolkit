/**
 * @rn-toolkit/auth
 *
 * Authentication with **adapter pattern** for React Native - swap auth backends without code changes.
 *
 * @example
 * ```tsx
 * import {
 *   AuthProvider,
 *   FirebaseAuthAdapter,
 *   ConsoleAdapter,
 *   NoOpAdapter,
 *   useAuth,
 *   SignInButton,
 * } from '@rn-toolkit/auth';
 *
 * // Production: Firebase Auth
 * const adapter = new FirebaseAuthAdapter();
 *
 * // Development: Console logging
 * const adapter = new ConsoleAdapter({ prefix: '[Auth]' });
 *
 * // Testing: NoOp (silent)
 * const adapter = new NoOpAdapter();
 *
 * function App() {
 *   return (
 *     <AuthProvider adapter={adapter}>
 *       <MyApp />
 *     </AuthProvider>
 *   );
 * }
 *
 * function LoginScreen() {
 *   const { signInWithEmail, isAuthenticated } = useAuth();
 *
 *   if (isAuthenticated) {
 *     return <HomeScreen />;
 *   }
 *
 *   return (
 *     <View>
 *       <SignInButton provider="google" />
 *       <SignInButton provider="apple" />
 *     </View>
 *   );
 * }
 * ```
 */

// Provider
export { AuthProvider, type AuthProviderProps } from './AuthProvider';

// Context
export { AuthContext, initialAuthState } from './AuthContext';

// Adapters
export {
  NoOpAdapter,
  ConsoleAdapter,
  FirebaseAuthAdapter,
  type AuthAdapter,
  type AuthStateCallback,
  type ConsoleAdapterOptions,
} from './adapters';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useUser, type UseUserResult } from './hooks/useUser';
export { useSession, type UseSessionResult } from './hooks/useSession';

// Components
export { SignInButton } from './components/SignInButton';
export { ProtectedRoute, type ProtectedRouteProps } from './components/ProtectedRoute';

// Types
export type {
  AuthUser,
  AuthState,
  AuthError,
  AuthErrorCode,
  AuthContextValue,
  AuthProviderConfig,
  EmailPasswordCredentials,
  PhoneAuthOptions,
  PhoneVerificationResult,
  Session,
  SocialProvider,
  MfaMethod,
  MfaEnrollmentInfo,
  SignInButtonProps,
  FirebaseConfig,
  ProviderUserInfo,
} from './types';
