'use client';

import { useState } from 'react';
import { LoginCard } from './components/LoginCard';
import { ManagerAccessButton } from './components/ManagerAccessButton';
import { SettingsIcon } from './components/SettingsIcon';

export function HomePage() {
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
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%)'
    }}>
      {/* Settings Icon - Top Right */}
      <SettingsIcon />

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 min-h-screen">
        {/* WAGMI Branding */}
        <div className="text-center mb-16">
          <h1 
            className="text-6xl md:text-7xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #00d4aa 0%, #00e6b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(0, 212, 170, 0.3)'
            }}
          >
            WAGMI
          </h1>
          <p className="text-xl text-[#a0a0a0] font-medium">
            We&apos;re All Gonna Make It
          </p>
        </div>

        {/* Login Card */}
        <LoginCard 
          investorId={investorId}
          setInvestorId={setInvestorId}
          isLoading={isLoading}
          onSubmit={handleInvestorLogin}
        />
      </div>

      {/* Manager Access Button - Bottom Right */}
      <ManagerAccessButton onClick={handleManagerAccess} />
    </div>
  );
}
