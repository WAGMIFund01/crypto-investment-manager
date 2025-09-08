/**
 * WAGMI Crypto Investment Manager - Portfolio Types
 * Shared types for portfolio data and operations
 */

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  value: number;
  change24h: number;
  changePercent24h: number;
  image?: string;
  marketCap?: number;
  volume24h?: number;
  lastUpdated: string;
}

export interface Portfolio {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercent: number;
  assets: Asset[];
  lastUpdated: string;
}

export interface Investor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalInvestment: number;
  currentValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  sharePercentage: number;
  joinDate: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  investorId: string;
  assetSymbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  timestamp: string;
  notes?: string;
}

export interface KPIData {
  totalAUM: number;
  totalReturn: number;
  totalReturnPercent: number;
  activeInvestors: number;
  lastUpdated: string;
}

// Portfolio calculation types
export interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercent: number;
  bestPerformer: Asset | null;
  worstPerformer: Asset | null;
  diversificationScore: number;
}

// Asset search and selection types
export interface CoinGeckoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

export interface AssetSearchResult {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
}
