/**
 * WAGMI Crypto Investment Manager - NextAuth Type Extensions
 * Extend NextAuth types to include custom user properties
 */

import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      role: 'manager' | 'investor';
      investorId?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'manager' | 'investor';
    investorId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: 'manager' | 'investor';
    investorId?: string;
  }
}
