/**
 * WAGMI Crypto Investment Manager - NextAuth Configuration
 * Authentication setup with Google OAuth and role-based access
 */

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { sheetsAdapter } from '@/lib/sheetsAdapter';
import { User } from '@/shared/types';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists in our Users tab
        const validation = await sheetsAdapter.validateUser(user.email!);
        
        if (!validation.success) {
          console.error('User validation failed:', validation.error);
          return false;
        }

        if (!validation.user) {
          console.error('User not found in database:', user.email);
          return false;
        }

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    
    async session({ session, token }) {
      try {
        // Get user data from Google Sheets
        const validation = await sheetsAdapter.validateUser(session.user.email!);
        
        if (validation.success && validation.user) {
          const userData = validation.user as User;
          
          // Add role and investorId to session
          session.user = {
            ...session.user,
            role: userData.role,
            investorId: userData.investorId,
          };
        }
        
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
    
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error=AccessDenied',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
