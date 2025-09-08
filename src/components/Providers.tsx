/**
 * WAGMI Crypto Investment Manager - Providers Component
 * Client-side providers wrapper
 */

'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
