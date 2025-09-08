/**
 * WAGMI Crypto Investment Manager - Configuration
 * Central configuration file for environment variables and app settings
 */

export const config = {
  // Google Sheets Configuration
  googleSheets: {
    endpoint: process.env.GOOGLE_SHEETS_ENDPOINT!,
    spreadsheetId: '1h04nkcnQmxaFml8RubIGmPgffMiyoEIg350ryjXK0tM',
  },

  // CoinGecko API Configuration
  coingecko: {
    apiKey: process.env.COINGECKO_API_KEY!,
    baseUrl: 'https://api.coingecko.com/api/v3',
  },

  // NextAuth Configuration
  auth: {
    secret: process.env.NEXTAUTH_SECRET!,
    url: process.env.NEXTAUTH_URL!,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  // Sentry Configuration
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },

  // App Configuration
  app: {
    name: 'WAGMI Crypto Investment Manager',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
} as const;

// Validation function to ensure required environment variables are set
export function validateConfig() {
  const required = [
    'GOOGLE_SHEETS_ENDPOINT',
    'COINGECKO_API_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Export types for TypeScript
export type Config = typeof config;
