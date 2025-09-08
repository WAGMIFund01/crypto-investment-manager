'use client';

import { useRouter } from 'next/navigation';

export default function InvestorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#00D4AA' }}>
            Investor Dashboard
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
        
        <div className="bg-[#181a20] rounded-xl p-6 border border-[#333]">
          <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
          <p className="text-[#888]">
            Your investor dashboard is being prepared. This will show your portfolio data, 
            performance metrics, and transaction history.
          </p>
        </div>
      </div>
    </div>
  );
}
