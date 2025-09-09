'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InvestorDashboard() {
  const [investorId, setInvestorId] = useState<string>('');
  const [investorName, setInvestorName] = useState<string>('');
  const [privacyMode, setPrivacyMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const storedInvestorId = sessionStorage.getItem('investorId');
    if (storedInvestorId) {
      setInvestorId(storedInvestorId);
      setInvestorName('John Doe'); // Placeholder for now
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  const handleSignOut = () => {
    sessionStorage.removeItem('investorId');
    router.push('/');
  };

  const togglePrivacyMode = () => {
    setPrivacyMode(!privacyMode);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#1A1A1A', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ color: '#E0E0E0' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1A1A1A',
      color: '#FFFFFF'
    }}>
      {/* Header */}
      <header style={{ 
        borderBottom: '1px solid #333',
        padding: '1rem 2rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <h1 style={{ 
              color: '#00FF95', 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              margin: 0
            }}>
              WAGMI
            </h1>
            <h2 style={{ 
              color: '#FFFFFF', 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              margin: '0.25rem 0 0 0'
            }}>
              {investorName}
            </h2>
            <p style={{ 
              color: '#E0E0E0', 
              fontSize: '0.875rem',
              margin: '0.25rem 0 0 0'
            }}>
              ID: {investorId}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={togglePrivacyMode}
              style={{
                backgroundColor: privacyMode ? '#00FF95' : 'transparent',
                color: privacyMode ? 'white' : '#00FF95',
                border: '1px solid #00FF95',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              {privacyMode ? 'Show Data' : 'Privacy Mode'}
            </button>

            <button
              onClick={handleSignOut}
              style={{
                backgroundColor: 'transparent',
                color: '#00FF95',
                border: '1px solid #00FF95',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* KPI Cards */}
          <div style={{
            backgroundColor: '#2D2D2D',
            border: '1px solid #404040',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#E0E0E0', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              Initial Investment
            </h3>
            <p style={{ color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              {privacyMode ? '•••••' : '$10,000'}
            </p>
          </div>

          <div style={{
            backgroundColor: '#2D2D2D',
            border: '1px solid #404040',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#E0E0E0', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              Current Value
            </h3>
            <p style={{ color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              {privacyMode ? '•••••' : '$16,000'}
            </p>
          </div>

          <div style={{
            backgroundColor: '#2D2D2D',
            border: '1px solid #404040',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#E0E0E0', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              Total P&L
            </h3>
            <p style={{ color: '#00FF95', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              {privacyMode ? '•••••' : '+$6,000'}
            </p>
          </div>

          <div style={{
            backgroundColor: '#2D2D2D',
            border: '1px solid #404040',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#E0E0E0', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
              Total Return
            </h3>
            <p style={{ color: '#00FF95', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              {privacyMode ? '•••••' : '+60.0%'}
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div style={{
          backgroundColor: '#2D2D2D',
          border: '1px solid #404040',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <h2 style={{ color: '#00FF95', fontSize: '1.125rem', margin: '0 0 1rem 0' }}>
            Transaction History
          </h2>
          <div style={{ color: '#E0E0E0' }}>
            <p>Transaction data will be loaded here...</p>
          </div>
        </div>
      </main>
    </div>
  );
}