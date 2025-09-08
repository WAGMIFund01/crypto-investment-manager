'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCard, ManagerAccessButton, SettingsIcon } from './components';

export default function HomePage() {
  const [investorId, setInvestorId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInvestorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!investorId.trim()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to investor dashboard
      router.push('/investor');
    } catch (error) {
      console.error('Investor login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManagerAccess = () => {
    console.log('🔧 Manager access requested');
    // Redirect to manager dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4" style={{
      background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%)'
    }}>
      <SettingsIcon />
      
      <div className="flex flex-col items-center justify-center w-full max-w-md">
        {/* WAGMI Branding */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2" style={{
            color: '#00D4AA',
            textShadow: '0 0 20px rgba(0, 212, 170, 0.3)'
          }}>
            WAGMI
          </h1>
          <p className="text-[#a0a0a0] text-sm">
            We&apos;re All Gonna Make It
          </p>
        </div>

        <LoginCard
          investorId={investorId}
          setInvestorId={setInvestorId}
          isLoading={isLoading}
          onSubmit={handleInvestorLogin}
        />
      </div>

      <ManagerAccessButton handleManagerAccess={handleManagerAccess} />
    </div>
  );
}