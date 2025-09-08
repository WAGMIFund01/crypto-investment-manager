/**
 * WAGMI Crypto Investment Manager - Health Check API
 * System health monitoring and status checks
 */

import { NextRequest, NextResponse } from 'next/server';
import { sheetsAdapter } from '@/lib/sheetsAdapter';
import { HealthCheck } from '@/shared/types';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check Google Sheets connection
    const sheetsResult = await sheetsAdapter.getData('KPIs');
    const sheetsHealthy = sheetsResult.success;

    // Check CoinGecko API (basic connectivity)
    let coingeckoHealthy = false;
    try {
      const coingeckoResponse = await fetch(
        'https://api.coingecko.com/api/v3/ping',
        {
          headers: {
            'x-cg-demo-api-key': process.env.COINGECKO_API_KEY || '',
          },
        }
      );
      coingeckoHealthy = coingeckoResponse.ok;
    } catch (error) {
      console.error('CoinGecko health check failed:', error);
    }

    // Check database (Google Sheets) connectivity
    const databaseHealthy = sheetsHealthy;

    const isHealthy = sheetsHealthy && coingeckoHealthy && databaseHealthy;
    const uptime = Date.now() - startTime;

    const healthCheck: HealthCheck = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        sheets: sheetsHealthy,
        coingecko: coingeckoHealthy,
        database: databaseHealthy,
      },
      uptime,
      version: '1.0.0',
    };

    return NextResponse.json(healthCheck, { 
      status: isHealthy ? 200 : 503 
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    const healthCheck: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        sheets: false,
        coingecko: false,
        database: false,
      },
      uptime: Date.now() - startTime,
      version: '1.0.0',
    };

    return NextResponse.json(healthCheck, { status: 503 });
  }
}