/**
 * WAGMI Crypto Investment Manager - Manager Login Page
 * Professional login page with Google OAuth integration
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // Simulate Google OAuth process
    setTimeout(() => {
      setIsLoading(false);
      // For now, redirect to a placeholder manager dashboard
      router.push('/dashboard');
    }, 1500);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <button
          onClick={handleBackToHome}
          className="text-[#00d4aa] hover:text-[#00e6b8] transition-colors"
        >
          ← Back to Home
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#0a0a0a] rounded-full"></div>
          </div>
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <div className="w-4 h-0.5 bg-[#0a0a0a]"></div>
            <div className="w-4 h-0.5 bg-[#0a0a0a] mt-1"></div>
            <div className="w-4 h-0.5 bg-[#0a0a0a] mt-1"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* WAGMI Branding */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-[#00d4aa] mb-4">
            WAGMI
          </h1>
          <p className="text-xl text-[#999999]">
            Manager Access Portal
          </p>
        </div>

        {/* Manager Login Card */}
        <div className="w-full max-w-md">
          <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Manager Login
            </h2>
            
            <div className="space-y-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-[#00d4aa] hover:bg-[#00e6b8] disabled:bg-[#666666] disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-center text-[#999999] text-sm mt-6">
              Secure authentication powered by Google OAuth
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-[#666666] text-sm">
          Need access? Contact your system administrator.
        </p>
      </div>
    </div>
  );
}

