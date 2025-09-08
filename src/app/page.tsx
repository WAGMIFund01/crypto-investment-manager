'use client';

import { useState } from 'react';

export default function Home() {
  const [investorId, setInvestorId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInvestorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investorId.trim()) return;
    
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      alert('Login successful! (This is a demo)');
    }, 1000);
  };

  const handleManagerAccess = () => {
    alert('Manager access clicked! (This is a demo)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%)'
    }}>
      {/* SaaS-Style Login Card - Much Narrower */}
      <div className="w-full max-w-xs">
        <div 
          className="bg-[#181a20] rounded-2xl p-6 border border-[#333]"
          style={{
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Card Header */}
          <div className="text-center mb-6">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{
                color: '#00D4AA',
                textShadow: '0 0 20px rgba(0, 212, 170, 0.3)'
              }}
            >
              WAGMI
            </h1>
            <p className="text-[#a0a0a0] text-sm">
              We&apos;re All Gonna Make It
            </p>
          </div>

          {/* Login Form */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4 text-center">
              Investor Login
            </h2>
            
            <form onSubmit={handleInvestorLogin} className="space-y-4">
              <div>
                <label htmlFor="investorId" className="block text-white text-sm font-medium mb-2">
                  Investor ID
                </label>
                <input
                  type="text"
                  id="investorId"
                  value={investorId}
                  onChange={(e) => setInvestorId(e.target.value)}
                  placeholder="Enter your Investor ID"
                  className="w-full px-3 py-2 bg-[#22252c] border border-[#444] rounded-lg text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !investorId.trim()}
                className="w-full bg-[#00d4aa] hover:bg-[#00e6b8] disabled:bg-[#666] disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                {isLoading ? 'Accessing...' : 'Access Portfolio'}
              </button>
            </form>
          </div>

          {/* Helper Text */}
          <p className="text-center text-[#888] text-xs">
            Don&apos;t have your Investor ID? Contact your fund manager for access credentials.
          </p>

          {/* Manager Access Link */}
          <div className="mt-4 text-center">
            <button
              onClick={handleManagerAccess}
              className="text-[#00d4aa] hover:text-[#00e6b8] text-xs font-medium transition-colors"
            >
              Manager Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}