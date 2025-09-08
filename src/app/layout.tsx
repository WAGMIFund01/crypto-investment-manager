/**
 * WAGMI Crypto Investment Manager - Root Layout
 * Main app layout with NextAuth session provider
 */

import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WAGMI Crypto Investment Manager',
  description: 'Professional cryptocurrency portfolio tracking platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}