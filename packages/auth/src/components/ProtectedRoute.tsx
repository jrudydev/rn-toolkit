/**
 * ProtectedRoute Component
 *
 * Guards routes/screens that require authentication.
 */

import React, { type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute props
 */
export interface ProtectedRouteProps {
  /** Content to render when authenticated */
  children: ReactNode;
  /** Content to render when not authenticated (optional) */
  fallback?: ReactNode;
  /** Content to render while loading (optional) */
  loadingComponent?: ReactNode;
  /** Callback when user is not authenticated */
  onUnauthenticated?: () => void;
  /** Whether to require email verification */
  requireEmailVerified?: boolean;
}

/**
 * ProtectedRoute component
 *
 * Renders children only when user is authenticated.
 * Shows fallback or loading state otherwise.
 *
 * @example
 * ```tsx
 * import { ProtectedRoute } from '@rn-toolkit/auth';
 *
 * function App() {
 *   return (
 *     <ProtectedRoute
 *       fallback={<LoginScreen />}
 *       onUnauthenticated={() => navigation.navigate('Login')}
 *     >
 *       <HomeScreen />
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With email verification requirement
 * <ProtectedRoute requireEmailVerified>
 *   <SecureContent />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  fallback,
  loadingComponent,
  onUnauthenticated,
  requireEmailVerified = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading state
  if (loading) {
    return (
      loadingComponent || (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    onUnauthenticated?.();
    return <>{fallback}</>;
  }

  // Check email verification if required
  if (requireEmailVerified && !user?.emailVerified) {
    // Could show a verification prompt here
    return <>{fallback}</>;
  }

  // User is authenticated (and email verified if required)
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
