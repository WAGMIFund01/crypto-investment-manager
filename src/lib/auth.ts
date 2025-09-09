import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import '@/shared/types/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Allow sign in for authorized users
      const authorizedEmails = [
        'wagmifund01@gmail.com', // Manager
        'investor1@example.com', // Investor 1
        'investor2@example.com', // Investor 2
        // Add more authorized emails as needed
      ];
      
      return authorizedEmails.includes(user.email || '');
    },
    async session({ session }) {
      // Add custom user properties to session
      const userEmail = session.user?.email;
      
      // Determine user role and investor ID based on email
      let role: 'manager' | 'investor' = 'investor';
      let investorId: string | undefined;
      
      if (userEmail === 'wagmifund01@gmail.com') {
        role = 'manager';
      } else {
        // Map investor emails to investor IDs
        const investorMap: Record<string, string> = {
          'investor1@example.com': 'INV001',
          'investor2@example.com': 'INV002',
          // Add more mappings as needed
        };
        investorId = investorMap[userEmail || ''];
      }
      
      session.user = {
        ...session.user,
        role,
        investorId,
      };
      
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};
