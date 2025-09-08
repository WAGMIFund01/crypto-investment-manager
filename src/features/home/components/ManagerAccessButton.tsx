'use client';

import { useState } from 'react';

interface ManagerAccessButtonProps {
  handleManagerAccess: () => void;
}

export function ManagerAccessButton({ handleManagerAccess }: ManagerAccessButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleClick = () => {
    console.log('🔧 Manager access requested');
    setIsRedirecting(true);
    
    // Show redirecting message
    setTimeout(() => {
      handleManagerAccess();
    }, 500); // Small delay to show the message
  };

  return (
    <div className="absolute bottom-8 right-8 z-10">
      <button
        onClick={handleClick}
        disabled={isRedirecting}
        className="bg-[#00d4aa] hover:bg-[#00e6b8] text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#00d4aa]/25 transform hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed"
        style={{
          background: isRedirecting 
            ? '#666' 
            : 'linear-gradient(135deg, #00d4aa 0%, #00e6b8 100%)',
          boxShadow: isRedirecting 
            ? 'none' 
            : '0 10px 25px rgba(0, 212, 170, 0.3)'
        }}
        aria-label="Access manager dashboard"
      >
        {isRedirecting ? 'Redirecting...' : 'Manager Access'}
      </button>
    </div>
  );
}