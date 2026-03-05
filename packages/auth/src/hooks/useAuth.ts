/**
 * useAuth Hook
 *
 * Hook to access authentication state and methods.
 */

import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import type { AuthContextValue } from '../types';

/**
 * Hook to access authentication state and methods
 *
 * @returns Authentication context value with state and methods
 * @throws Error if used outside AuthProvider
 *
 * @example
 * ```tsx
 * import { useAuth } from '@rn-toolkit/auth';
 *
 * function LoginScreen() {
 *   const { signInWithEmail, signInWithProvider, loading, error } = useAuth();
 *
 *   async function handleEmailLogin() {
 *     try {
 *       await signInWithEmail({ email, password });
 *     } catch (e) {
 *       console.error('Login failed:', e);
 *     }
 *   }
 *
 *   async function handleGoogleLogin() {
 *     await signInWithProvider('google');
 *   }
 *
 *   return (
 *     <View>
 *       <Button onPress={handleEmailLogin} disabled={loading}>
 *         Sign In
 *       </Button>
 *       <Button onPress={handleGoogleLogin} disabled={loading}>
 *         Sign in with Google
 *       </Button>
 *       {error && <Text>{error.message}</Text>}
 *     </View>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  return context;
}
