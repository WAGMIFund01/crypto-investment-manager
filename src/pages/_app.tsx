/**
 * WAGMI Crypto Investment Manager - App Component
 * Main app wrapper with NextAuth session provider
 */

import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <SessionProvider session={pageProps.session}>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </SessionProvider>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, redirectToAppropriatePage } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect on login page or if still loading
    if (loading || router.pathname === '/login') {
      return;
    }

    // Redirect unauthenticated users to login
    if (!user) {
      router.push('/login');
      return;
    }

    // Redirect authenticated users to appropriate page
    if (user && router.pathname === '/') {
      redirectToAppropriatePage();
    }
  }, [user, loading, router, redirectToAppropriatePage]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1d23] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4aa] mx-auto mb-4"></div>
          <p className="text-[#e5e7eb]">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default App;
