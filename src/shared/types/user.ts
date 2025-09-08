/**
 * WAGMI Crypto Investment Manager - User Types
 * Shared types for user authentication and authorization
 */

export interface User {
  email: string;
  role: 'manager' | 'investor';
  investorId?: string; // null for manager, INV001/INV002/etc for investors
  name?: string;
  image?: string;
}

export interface Session {
  user: User;
  expires: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password?: string; // For future email/password auth
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Role-based access control types
export type UserRole = 'manager' | 'investor';

export interface RolePermissions {
  canViewAllInvestors: boolean;
  canEditPortfolio: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
  canViewAuditLog: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  manager: {
    canViewAllInvestors: true,
    canEditPortfolio: true,
    canViewAnalytics: true,
    canManageUsers: true,
    canViewAuditLog: true,
  },
  investor: {
    canViewAllInvestors: false,
    canEditPortfolio: false,
    canViewAnalytics: false,
    canManageUsers: false,
    canViewAuditLog: false,
  },
};
