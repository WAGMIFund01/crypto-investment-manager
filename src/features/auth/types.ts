/**
 * WAGMI Crypto Investment Manager - Auth Types
 * Authentication-specific type definitions
 */

import { User } from '@/shared/types';

export interface AuthFormData {
  email: string;
  password?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  redirectToAppropriatePage: () => void;
  hasPermission: (permission: string) => boolean;
  getDataScope: () => { scope: string; description: string; investorId?: string } | null;
  logAction: (action: string, target: string, before: unknown, after: unknown) => Promise<boolean>;
  isManager: boolean;
  isInvestor: boolean;
}

export interface PermissionCheck {
  permission: string;
  required: boolean;
  message?: string;
}

export interface AuthGuardProps {
  requiredRole?: 'manager' | 'investor';
  requiredPermissions?: string[];
  fallbackUrl?: string;
  children: React.ReactNode;
}

export interface LoginFormProps {
  onSubmit: (data: AuthFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}

export type AuthAction = 'signin' | 'signout' | 'validate' | 'refresh';

export interface AuthEvent {
  action: AuthAction;
  user?: User;
  timestamp: string;
  success: boolean;
  error?: string;
}
