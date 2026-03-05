/**
 * useUser Hook
 *
 * Hook to access current user information.
 */

import { useContext, useMemo } from 'react';
import { AuthContext } from '../AuthContext';
import type { AuthUser } from '../types';

/**
 * User with additional helper methods
 */
export interface UseUserResult {
  /** Current user or null if not authenticated */
  user: AuthUser | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether the authentication state is loading */
  loading: boolean;
  /** Whether the user's email is verified */
  isEmailVerified: boolean;
  /** Whether the user is anonymous */
  isAnonymous: boolean;
  /** Get the user's initials (from display name or email) */
  getInitials: () => string;
  /** Get the user's avatar URL or a fallback */
  getAvatarUrl: (fallback?: string) => string;
  /** Check if user has a specific provider linked */
  hasProvider: (providerId: string) => boolean;
}

/**
 * Hook to access current user information
 *
 * @returns User information with helper methods
 *
 * @example
 * ```tsx
 * import { useUser } from '@rn-toolkit/auth';
 *
 * function ProfileScreen() {
 *   const { user, isAuthenticated, getInitials, getAvatarUrl } = useUser();
 *
 *   if (!isAuthenticated) {
 *     return <LoginPrompt />;
 *   }
 *
 *   return (
 *     <View>
 *       <Avatar
 *         source={{ uri: getAvatarUrl() }}
 *         fallbackText={getInitials()}
 *       />
 *       <Text>{user?.displayName || user?.email}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useUser(): UseUserResult {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  const result = useMemo<UseUserResult>(() => {
    const getInitials = (): string => {
      if (!user) return '';

      if (user.displayName) {
        const parts = user.displayName.trim().split(/\s+/);
        if (parts.length >= 2) {
          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
      }

      if (user.email) {
        return user.email.substring(0, 2).toUpperCase();
      }

      return 'U';
    };

    const getAvatarUrl = (fallback?: string): string => {
      if (user?.photoURL) {
        return user.photoURL;
      }
      // Return a default gravatar-style URL or the provided fallback
      return fallback || `https://ui-avatars.com/api/?name=${encodeURIComponent(getInitials())}&background=random`;
    };

    const hasProvider = (providerId: string): boolean => {
      if (!user) return false;
      return user.providerData.some((p) => p.providerId === providerId);
    };

    return {
      user,
      isAuthenticated,
      loading,
      isEmailVerified: user?.emailVerified ?? false,
      isAnonymous: user?.isAnonymous ?? false,
      getInitials,
      getAvatarUrl,
      hasProvider,
    };
  }, [user, isAuthenticated, loading]);

  return result;
}
