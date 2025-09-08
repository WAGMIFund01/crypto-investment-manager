/**
 * WAGMI Crypto Investment Manager - Not Found Page
 * 404 error page
 */

import Link from 'next/link';
import { Button } from '@/shared/components';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1a1d23] flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#e5e7eb] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#e5e7eb] mb-4">
          Page Not Found
        </h2>
        <p className="text-[#999999] mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
