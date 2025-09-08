'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/useAuth';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, LoadingSpinner } from '@/shared/components';
import { TrendingUp, Shield, Users, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  const { user, loading, redirectToAppropriatePage } = useAuth();
  const router = useRouter();
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        redirectToAppropriatePage();
      }
    }
  }, [user, loading, redirectToAppropriatePage]);

  useEffect(() => {
    // Show features after a short delay
    const timer = setTimeout(() => setShowFeatures(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1d23] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading WAGMI Crypto Investment Manager..." />
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[#1a1d23] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Redirecting to your dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d23]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00d4aa]/10 via-transparent to-[#3b82f6]/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-[#e5e7eb] mb-6">
              🚀 WAGMI
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-[#00d4aa] mb-4">
              Crypto Investment Manager
            </h2>
            <p className="text-xl text-[#999999] mb-8 max-w-3xl mx-auto">
              Professional cryptocurrency portfolio tracking platform with real-time data, 
              role-based access, and comprehensive analytics for managers and investors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => router.push('/login')}
                variant="primary"
                size="lg"
                className="text-lg px-8 py-4"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
              >
                View Demo
              </Button>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-sm font-medium">
              <CheckCircle className="h-4 w-4 mr-2" />
              Phase 2 Complete - Authentication & API Ready
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-[#e5e7eb] mb-4">
            Built for Professional Crypto Management
          </h3>
          <p className="text-lg text-[#999999] max-w-2xl mx-auto">
            Everything you need to manage cryptocurrency portfolios with enterprise-grade security and real-time insights.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ${showFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Card className="text-center hover:glow-hover transition-all duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-[#00d4aa]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-[#00d4aa]" />
              </div>
              <h4 className="text-lg font-semibold text-[#e5e7eb] mb-2">Secure Authentication</h4>
              <p className="text-[#999999] text-sm">
                Google OAuth integration with role-based access control for managers and investors.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:glow-hover transition-all duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-[#3b82f6]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-[#3b82f6]" />
              </div>
              <h4 className="text-lg font-semibold text-[#e5e7eb] mb-2">Real-Time Data</h4>
              <p className="text-[#999999] text-sm">
                Live cryptocurrency prices and portfolio updates powered by CoinGecko API.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:glow-hover transition-all duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-[#8b5cf6]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-[#8b5cf6]" />
              </div>
              <h4 className="text-lg font-semibold text-[#e5e7eb] mb-2">Multi-User Support</h4>
              <p className="text-[#999999] text-sm">
                Manage multiple investors with individual portfolio views and permissions.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:glow-hover transition-all duration-300">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-[#ff6b35]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-[#ff6b35]" />
              </div>
              <h4 className="text-lg font-semibold text-[#e5e7eb] mb-2">Advanced Analytics</h4>
              <p className="text-[#999999] text-sm">
                Comprehensive performance metrics, P&L tracking, and portfolio insights.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-[#1e2128] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#e5e7eb] mb-4">
              Development Progress
            </h3>
            <p className="text-lg text-[#999999]">
              Building the future of crypto portfolio management, one phase at a time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#00d4aa]">✅ Phase 1: Foundation</CardTitle>
                <CardDescription>Next.js 14 + TypeScript + Tailwind CSS</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[#e5e7eb]">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa] mr-2" />
                    Next.js project with App Router
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa] mr-2" />
                    Feature-based architecture
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa] mr-2" />
                    Shared components & types
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa] mr-2" />
                    Google Sheets integration
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#00d4aa]">✅ Phase 2: Data Layer</CardTitle>
                <CardDescription>Authentication & API Infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[#e5e7eb]">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa] mr-2" />
                    NextAuth.js with Google OAuth
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa] mr-2" />
                    Role-based access control
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa] mr-2" />
                    Portfolio API endpoints
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa] mr-2" />
                    Health monitoring system
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] font-medium">
              <div className="w-2 h-2 bg-[#3b82f6] rounded-full mr-3 animate-pulse"></div>
              Phase 3: Core UI - In Development
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-[#e5e7eb] mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-[#999999] mb-8">
            Join the WAGMI Crypto Investment Manager and take control of your cryptocurrency portfolio.
          </p>
          <Button
            onClick={() => router.push('/login')}
            variant="primary"
            size="lg"
            className="text-lg px-8 py-4"
          >
            Sign In with Google
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#2d3139] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[#64748b] text-sm">
            <p>&copy; 2025 WAGMI Crypto Investment Manager. Built with Next.js 14 and TypeScript.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
