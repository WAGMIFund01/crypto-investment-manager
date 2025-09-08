/**
 * WAGMI Crypto Investment Manager - useAuth Hook
 * Custom hook for authentication state management
 */

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, AuthState } from '@/shared/types';
import { authService } from './authService';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (status === 'loading') {
      setAuthState({
        user: null,
        loading: true,
        error: null,
      });
      return;
    }

    if (status === 'unauthenticated') {
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
      return;
    }

    if (session?.user) {
      const user = session.user as User;
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    }
  }, [session, status]);

  const signOut = async () => {
    try {
      await import('next-auth/react').then(({ signOut: nextAuthSignOut }) => 
        nextAuthSignOut({ callbackUrl: '/login' })
      );
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to sign out',
      }));
    }
  };

  const redirectToAppropriatePage = () => {
    if (authState.user) {
      if (authState.user.role === 'manager') {
        router.push('/dashboard');
      } else {
        router.push('/investor');
      }
    } else {
      router.push('/login');
    }
  };

  const hasPermission = (permission: keyof ReturnType<typeof authService.getUserPermissions>) => {
    if (!authState.user) return false;
    return authService.hasPermission(authState.user, permission);
  };

  const getDataScope = () => {
    if (!authState.user) return null;
    return authService.getDataScope(authState.user);
  };

  const logAction = async (
    action: string,
    target: string,
    before: unknown,
    after: unknown
  ) => {
    if (!authState.user) return false;
    return authService.logUserAction(authState.user, action, target, before, after);
  };

  return {
    ...authState,
    signOut,
    redirectToAppropriatePage,
    hasPermission,
    getDataScope,
    logAction,
    isManager: authState.user?.role === 'manager',
    isInvestor: authState.user?.role === 'investor',
  };
}
