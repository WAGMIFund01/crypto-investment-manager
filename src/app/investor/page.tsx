'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, LogOut } from 'lucide-react';

export default function InvestorDashboard() {
  const [investorId, setInvestorId] = useState<string>('');
  const [investorName, setInvestorName] = useState<string>('');
  const [privacyMode, setPrivacyMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Get investor ID from session storage
    const storedInvestorId = sessionStorage.getItem('investorId');
    if (storedInvestorId) {
      setInvestorId(storedInvestorId);
      fetchInvestorData(storedInvestorId);
      fetchTransactions(storedInvestorId);
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

  const fetchInvestorData = async (investorId: string) => {
    try {
      const response = await fetch('/api/get-investor-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ investorId }),
      });

      const data = await response.json();
      
      if (data.success && data.investorData) {
        setPortfolioData(data.investorData);
        setInvestorName(data.investorData.name);
      } else {
        console.error('Failed to fetch investor data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching investor data:', error);
    }
  };

  const fetchTransactions = async (investorId: string) => {
    setTransactionsLoading(true);
    try {
      const response = await fetch('/api/get-transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ investorId }),
      });

      const data = await response.json();
      
      if (data.success && data.transactions) {
        setTransactions(data.transactions);
      } else {
        console.error('Failed to fetch transactions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const formatCurrency = (amount: number, masked: boolean) => {
    if (masked) return '•••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number, masked: boolean) => {
    if (masked) return '•••••%';
    return `${percentage.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#00FF95' }}></div>
          <p style={{ color: '#E0E0E0' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen h-full w-full" 
      style={{ 
        backgroundColor: '#1A1A1A',
        minHeight: '100vh',
        height: '100%'
      }}
    >
      {/* Header */}
      <header className="border-b" style={{ borderColor: '#333' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - User Info */}
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-2xl font-bold text-white">{investorName}</h1>
                <p className="text-sm" style={{ color: '#E0E0E0' }}>ID: {investorId}</p>
              </div>
            </div>

            {/* Right side - Controls */}
            <div className="flex items-center space-x-4">
              {/* Privacy Mode Toggle */}
              <button
                onClick={togglePrivacyMode}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                style={{ backgroundColor: privacyMode ? '#00FF95' : 'transparent' }}
              >
                {privacyMode ? (
                  <EyeOff className="h-5 w-5 text-white" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-white" />
                )}
              </button>

              {/* Sign Out Button */}
              <Button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-md font-medium transition-all duration-200"
                style={{
                  backgroundColor: '#00FF95',
                  color: 'white',
                  border: 'none',
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Initial Investment */}
          <Card 
            className="hover:shadow-lg transition-shadow duration-200"
            style={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #404040',
              borderRadius: '12px',
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#E0E0E0' }}>
                Initial Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">
                {portfolioData ? formatCurrency(portfolioData.investmentValue, privacyMode) : '•••••'}
              </p>
            </CardContent>
          </Card>

          {/* Current Value */}
          <Card 
            className="hover:shadow-lg transition-shadow duration-200"
            style={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #404040',
              borderRadius: '12px',
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#E0E0E0' }}>
                Current Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">
                {portfolioData ? formatCurrency(portfolioData.currentValue, privacyMode) : '•••••'}
              </p>
            </CardContent>
          </Card>

          {/* Total P&L */}
          <Card 
            className="hover:shadow-lg transition-shadow duration-200"
            style={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #404040',
              borderRadius: '12px',
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#E0E0E0' }}>
                Total P&L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" style={{ color: '#00FF95' }}>
                {portfolioData ? (
                  privacyMode ? '•••••' : 
                  (portfolioData.totalPnl >= 0 ? '+' : '') + formatCurrency(portfolioData.totalPnl, false)
                ) : '•••••'}
              </p>
            </CardContent>
          </Card>

          {/* Total Return */}
          <Card 
            className="hover:shadow-lg transition-shadow duration-200"
            style={{
              backgroundColor: '#2D2D2D',
              border: '1px solid #404040',
              borderRadius: '12px',
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#E0E0E0' }}>
                Total Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" style={{ color: '#00FF95' }}>
                {portfolioData ? formatPercentage(portfolioData.returnPercentage, privacyMode) : '•••••%'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card
          style={{
            backgroundColor: '#2D2D2D',
            border: '1px solid #404040',
            borderRadius: '12px',
          }}
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold" style={{ color: '#00FF95' }}>
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: '#404040' }}>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: '#E0E0E0' }}>Date</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: '#E0E0E0' }}>Transaction Type</th>
                    <th className="text-right py-3 px-4 font-medium" style={{ color: '#E0E0E0' }}>Amount</th>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: '#E0E0E0' }}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsLoading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 mr-3" style={{ borderColor: '#00FF95' }}></div>
                          <span style={{ color: '#E0E0E0' }}>Loading transactions...</span>
                        </div>
                      </td>
                    </tr>
                  ) : transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={transaction.transactionId || index} className="border-b" style={{ borderColor: '#404040' }}>
                        <td className="py-3 px-4" style={{ color: '#E0E0E0' }}>
                          {new Date(transaction.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: transaction.type === 'Investment' ? '#00FF95' : 
                                             transaction.type === 'Dividend' ? '#00FF95' :
                                             transaction.type === 'Fee' ? '#FF4444' : '#A0A0A0',
                              color: 'white',
                            }}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold" style={{ 
                          color: transaction.amount >= 0 ? '#00FF95' : '#FF4444' 
                        }}>
                          {privacyMode ? '•••••' : 
                           (transaction.amount >= 0 ? '+' : '') + formatCurrency(transaction.amount, false)}
                        </td>
                        <td className="py-3 px-4" style={{ color: '#E0E0E0' }}>
                          {transaction.note}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center">
                        <div className="text-center">
                          <svg 
                            className="w-12 h-12 mx-auto mb-4"
                            style={{ color: '#A0A0A0' }}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                            />
                          </svg>
                          <p style={{ color: '#E0E0E0' }}>No transactions found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
