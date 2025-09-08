'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/useAuth';
import { LoadingSpinner } from '@/shared/components';

export default function Home() {
  const { user, loading, redirectToAppropriatePage } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        redirectToAppropriatePage();
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, redirectToAppropriatePage, router]);

  return (
    <div className="min-h-screen bg-[#1a1d23] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" text="Loading WAGMI Crypto Investment Manager..." />
      </div>
    </div>
  );
}
