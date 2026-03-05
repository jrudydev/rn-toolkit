/**
 * @rn-toolkit/auth
 *
 * Firebase authentication for React Native with social login,
 * email/password, phone authentication, and 2FA support.
 *
 * @example
 * ```tsx
 * import { AuthProvider, useAuth, SignInButton } from '@rn-toolkit/auth';
 *
 * function App() {
 *   return (
 *     <AuthProvider>
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
