'use client';

import { useState, useEffect } from 'react';

interface LoginCardProps {
  investorId: string;
  setInvestorId: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

// Valid investor IDs (whitelist)
const VALID_INVESTOR_IDS = ['INV001', 'INV002', 'INV003', 'INV004', 'INV005', 'INV006'];

export function LoginCard({ investorId, setInvestorId, isLoading, onSubmit }: LoginCardProps) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // Format validation: 2-3 characters, alphanumeric only
  const validateFormat = (id: string): boolean => {
    const cleanId = id.trim().toUpperCase();
    return /^[A-Z0-9]{2,3}$/.test(cleanId);
  };

  // Whitelist validation: check against valid investor IDs
  const validateWhitelist = (id: string): boolean => {
    const cleanId = id.trim().toUpperCase();
    return VALID_INVESTOR_IDS.includes(cleanId);
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // Auto-convert to uppercase
    setInvestorId(value);
    
    // Clear errors when user starts typing
    if (error) {
      setError('');
    }
    if (success) {
      setSuccess('');
    }
    
    // Enable button if there's any content
    setIsButtonEnabled(value.trim().length > 0);
  };

  // Handle form submission with full validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isButtonEnabled || isLoading) return;
    
    const cleanId = investorId.trim().toUpperCase();
    
    // Format validation
    if (!validateFormat(cleanId)) {
      setError('Invalid Investor ID');
      setSuccess('');
      return;
    }
    
    // Whitelist validation
    if (!validateWhitelist(cleanId)) {
      setError('Invalid Investor ID');
      setSuccess('');
      return;
    }
    
    // Valid ID - show success and redirect
    setError('');
    setSuccess(`Welcome, Investor ${cleanId}! Redirecting to your portfolio...`);
    
    // Call the parent onSubmit handler
    onSubmit(e);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isButtonEnabled && !isLoading) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <div 
        className="bg-[#181a20] rounded-3xl p-8 shadow-2xl border border-[#333] backdrop-blur-sm"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        <h2 className="text-xl font-bold text-white text-center mb-8">
          Investor Login
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="investorId" className="block text-white text-sm font-semibold mb-3">
              Investor ID
            </label>
            <input
              type="text"
              id="investorId"
              value={investorId}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your Investor ID"
              className={`w-full px-4 py-3 bg-[#22252c] border rounded-xl text-white placeholder-[#888] focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all duration-300 ${
                error ? 'border-red-500' : 'border-[#444]'
              }`}
              required
              aria-describedby={error ? "investorId-error" : success ? "investorId-success" : undefined}
              aria-invalid={error ? "true" : "false"}
            />
            
            {/* Error Message */}
            {error && (
              <p id="investorId-error" className="text-red-400 text-sm mt-2" role="alert">
                {error}
              </p>
            )}
            
            {/* Success Message */}
            {success && (
              <p id="investorId-success" className="text-green-400 text-sm mt-2" role="status">
                {success}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!isButtonEnabled || isLoading}
            className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg transform ${
              isButtonEnabled && !isLoading
                ? 'bg-[#00d4aa] hover:bg-[#00e6b8] text-white hover:shadow-xl hover:shadow-[#00d4aa]/25 hover:-translate-y-0.5 cursor-pointer'
                : 'bg-[#666] text-gray-400 cursor-not-allowed opacity-55'
            }`}
            style={{
              background: isButtonEnabled && !isLoading 
                ? 'linear-gradient(135deg, #00d4aa 0%, #00e6b8 100%)'
                : '#666',
              boxShadow: isButtonEnabled && !isLoading 
                ? '0 10px 25px rgba(0, 212, 170, 0.3)'
                : 'none'
            }}
            aria-describedby={!isButtonEnabled ? "button-disabled-help" : undefined}
          >
            {isLoading ? 'Accessing...' : 'Access Portfolio'}
          </button>
          
          {/* Hidden help text for screen readers */}
          {!isButtonEnabled && (
            <div id="button-disabled-help" className="sr-only">
              Button is disabled. Enter an Investor ID to enable.
            </div>
          )}
        </form>
        
        <p className="text-center text-[#888] text-xs mt-6 leading-relaxed">
          Don&apos;t have your Investor ID? Contact your fund manager for access credentials.
        </p>
      </div>
    </div>
  );
}