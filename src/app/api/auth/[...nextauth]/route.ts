/**
 * WAGMI Crypto Investment Manager - NextAuth Route Handler
 * Authentication API route for NextAuth
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };