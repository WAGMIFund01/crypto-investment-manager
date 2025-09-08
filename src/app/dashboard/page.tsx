'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
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
            ← Back to Home
          </button>
          <h1 className="text-2xl font-bold text-[#00d4aa]">WAGMI</h1>
        </div>
        <div className="text-sm text-[#999999]">
          Manager Dashboard
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Manager Dashboard</h2>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Total AUM</h3>
              <p className="text-2xl font-bold text-[#00d4aa]">$0.00</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Active Investors</h3>
              <p className="text-2xl font-bold text-[#00d4aa]">0</p>
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

          {/* Management Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Portfolio Management</h3>
              <p className="text-[#999999] mb-4">Manage assets, allocations, and investor portfolios.</p>
              <button className="bg-[#00d4aa] hover:bg-[#00e6b8] text-white font-semibold py-2 px-4 rounded-lg transition-all">
                Manage Portfolio
              </button>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Investor Management</h3>
              <p className="text-[#999999] mb-4">View and manage investor accounts and permissions.</p>
              <button className="bg-[#00d4aa] hover:bg-[#00e6b8] text-white font-semibold py-2 px-4 rounded-lg transition-all">
                Manage Investors
              </button>
            </div>
          </div>

          <div className="mt-6 bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <p className="text-[#999999]">No recent activity. This is a placeholder manager dashboard.</p>
            <p className="text-[#999999] mt-2">Real management features will be implemented in the next phase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
