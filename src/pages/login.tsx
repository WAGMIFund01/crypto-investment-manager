/**
 * WAGMI Crypto Investment Manager - Login Page
 * Professional login page with Google OAuth integration
 */

import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components';
import { authOptions } from './api/auth/[...nextauth]';

interface LoginPageProps {
  error?: string;
}

export default function LoginPage({ error }: LoginPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check if user is already logged in
    getSession().then((session) => {
      if (session) {
        setSession(session);
        // Redirect based on role
        if (session.user.role === 'manager') {
          router.push('/dashboard');
        } else {
          router.push('/investor');
        }
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false,
      });
      
      if (result?.error) {
        console.error('Sign in error:', result.error);
        // Handle error - could show a toast or error message
      } else if (result?.ok) {
        // Success - redirect will be handled by the session callback
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (session) {
    return (
      <div className="min-h-screen bg-[#1a1d23] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d4aa] mx-auto mb-4"></div>
              <p className="text-[#e5e7eb]">Redirecting...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d23] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#e5e7eb] mb-2">
            🚀 WAGMI
          </h1>
          <p className="text-[#999999] text-lg">
            Crypto Investment Manager
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#e5e7eb]">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-[#999999]">
              Sign in to access your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-3">
                <p className="text-[#ef4444] text-sm">
                  {error === 'AccessDenied' 
                    ? 'Access denied. Please contact your administrator.'
                    : 'An error occurred during sign in. Please try again.'
                  }
                </p>
              </div>
            )}
            
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              loading={isLoading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
            
            <div className="text-center">
              <p className="text-[#64748b] text-sm">
                Secure authentication powered by Google OAuth
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-[#64748b] text-sm">
            Need access? Contact your portfolio manager.
          </p>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  if (session) {
    // Redirect based on role
    const redirectUrl = session.user.role === 'manager' ? '/dashboard' : '/investor';
    return {
      redirect: {
        destination: redirectUrl,
        permanent: false,
      },
    };
  }

  return {
    props: {
      error: context.query.error || null,
    },
  };
};
