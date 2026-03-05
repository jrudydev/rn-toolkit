/**
 * useSession Hook
 *
 * Hook to manage user session and tokens.
 */

import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import type { Session } from '../types';

/**
 * Session result
 */
export interface UseSessionResult {
  /** Current session or null */
  session: Session | null;
  /** Whether session is being loaded */
  loading: boolean;
  /** Whether session is valid (not expired) */
  isValid: boolean;
  /** Time remaining until session expires (in seconds) */
  expiresIn: number | null;
  /** Refresh the session token */
  refresh: () => Promise<Session | null>;
  /** Get the current access token */
  getToken: () => Promise<string | null>;
}

/**
 * Hook to manage user session
 *
 * Provides session information and token management.
 *
 * @returns Session state and methods
 *
 * @example
 * ```tsx
 * import { useSession } from '@rn-toolkit/auth';
 *
 * function ApiCall() {
 *   const { getToken, isValid, refresh } = useSession();
 *
 *   async function fetchData() {
 *     if (!isValid) {
 *       await refresh();
 *     }
 *
 *     const token = await getToken();
 *     const response = await fetch('/api/data', {
 *       headers: {
 *         Authorization: `Bearer ${token}`,
 *       },
 *     });
 *     return response.json();
 *   }
 * }
 * ```
 */
export function useSession(): UseSessionResult {
  const { getSession, refreshSession, isAuthenticated } = useContext(AuthContext);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial session
  useEffect(() => {
    async function loadSession() {
      if (!isAuthenticated) {
        setSession(null);
        setLoading(false);
        return;
      }

      try {
        const currentSession = await getSession();
        setSession(currentSession);
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [isAuthenticated, getSession]);

  // Calculate expires in
  const expiresIn = session?.expiresAt
    ? Math.max(0, Math.floor((session.expiresAt.getTime() - Date.now()) / 1000))
    : null;

  // Check if valid
  const isValid = session?.isValid ?? false;

  // Refresh session
  const refresh = useCallback(async (): Promise<Session | null> => {
    setLoading(true);
    try {
      const newSession = await refreshSession();
      setSession(newSession);
      return newSession;
    } catch {
      setSession(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [refreshSession]);

  // Get token
  const getToken = useCallback(async (): Promise<string | null> => {
    // If session is expired, refresh first
    if (session && !session.isValid) {
      const newSession = await refresh();
      return newSession?.token ?? null;
    }
    return session?.token ?? null;
  }, [session, refresh]);

  return {
    session,
    loading,
    isValid,
    expiresIn,
    refresh,
    getToken,
  };
}
