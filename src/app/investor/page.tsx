'use client';

import { useRouter } from 'next/navigation';

export default function InvestorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-[#2a2a2a]">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className="text-[#00d4aa] hover:text-[#00e6b8] transition-colors"
          >
            ← Back to Login
          </button>
          <h1 className="text-2xl font-bold text-[#00d4aa]">WAGMI</h1>
        </div>
        <div className="text-sm text-[#999999]">
          Investor Portal
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Portfolio Overview</h2>
          
          {/* Placeholder Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Total Value</h3>
              <p className="text-2xl font-bold text-[#00d4aa]">$0.00</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">24h Change</h3>
              <p className="text-2xl font-bold text-[#00d4aa]">+0.00%</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Total Return</h3>
              <p className="text-2xl font-bold text-[#00d4aa]">+0.00%</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Portfolio Assets</h3>
            <p className="text-[#999999]">No assets found. This is a placeholder investor dashboard.</p>
            <p className="text-[#999999] mt-2">Real portfolio data will be loaded from Google Sheets.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
