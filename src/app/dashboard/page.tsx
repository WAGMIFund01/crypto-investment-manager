'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#00D4AA' }}>
            Manager Dashboard
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#333]">
            <h2 className="text-xl font-semibold mb-4">Portfolio Management</h2>
            <p className="text-[#888]">
              Manage investor portfolios, view performance metrics, and track transactions.
            </p>
          </div>
          
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#333]">
            <h2 className="text-xl font-semibold mb-4">Investor Management</h2>
            <p className="text-[#888]">
              Add new investors, manage access permissions, and view investor details.
            </p>
          </div>
          
          <div className="bg-[#181a20] rounded-xl p-6 border border-[#333]">
            <h2 className="text-xl font-semibold mb-4">Analytics & Reports</h2>
            <p className="text-[#888]">
              Generate reports, view analytics, and track fund performance over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
