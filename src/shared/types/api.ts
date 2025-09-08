/**
 * WAGMI Crypto Investment Manager - API Types
 * Shared types for API responses and requests
 */

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API error types
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Health check types
export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    sheets: boolean;
    coingecko: boolean;
    database: boolean;
  };
  uptime: number;
  version: string;
}

// Audit log types
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'create' | 'update' | 'delete' | 'view';
  target: string;
  before: unknown;
  after: unknown;
  ipAddress?: string;
  userAgent?: string;
}

// Configuration types
export interface ConfigItem {
  key: string;
  value: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  updatedAt: string;
  updatedBy: string;
}

// Request/Response types for specific endpoints
export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  user: {
    email: string;
    role: string;
    investorId?: string;
  };
  token?: string;
}

export interface RefreshPricesRequest {
  symbols: string[];
}

export interface RefreshPricesResponse {
  updated: number;
  failed: number;
  errors: string[];
}

// WebSocket types (for future real-time updates)
export interface WebSocketMessage {
  type: 'price_update' | 'portfolio_update' | 'notification';
  data: unknown;
  timestamp: string;
}

export interface PriceUpdateMessage {
  type: 'price_update';
  data: {
    symbol: string;
    price: number;
    change24h: number;
    changePercent24h: number;
  };
  timestamp: string;
}
