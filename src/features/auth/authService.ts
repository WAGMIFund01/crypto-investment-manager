/**
 * WAGMI Crypto Investment Manager - Auth Service
 * Authentication logic and API calls
 */

import { sheetsAdapter } from '@/lib/sheetsAdapter';
import { User, AuthResponse } from '@/shared/types';

export class AuthService {
  /**
   * Validate user credentials against Google Sheets
   */
  async validateUser(email: string): Promise<AuthResponse> {
    try {
      const result = await sheetsAdapter.validateUser(email);
      
      if (result.success && result.user) {
        const user = result.user as User;
        return {
          success: true,
          user: {
            email: user.email,
            role: user.role,
            investorId: user.investorId,
          },
        };
      }
      
      return {
        success: false,
        error: 'User not found or not authorized',
      };
    } catch (error) {
      console.error('Auth validation error:', error);
      return {
        success: false,
        error: 'Authentication service unavailable',
      };
    }
  }

  /**
   * Get user permissions based on role
   */
  getUserPermissions(user: User) {
    const permissions = {
      canViewAllInvestors: user.role === 'manager',
      canEditPortfolio: user.role === 'manager',
      canViewAnalytics: user.role === 'manager',
      canManageUsers: user.role === 'manager',
      canViewAuditLog: user.role === 'manager',
    };

    return permissions;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(user: User, permission: keyof ReturnType<typeof this.getUserPermissions>): boolean {
    const permissions = this.getUserPermissions(user);
    return permissions[permission];
  }

  /**
   * Get user's accessible data scope
   */
  getDataScope(user: User) {
    if (user.role === 'manager') {
      return {
        scope: 'all',
        description: 'Full access to all portfolio data',
      };
    } else {
      return {
        scope: 'investor',
        investorId: user.investorId,
        description: `Access limited to investor ${user.investorId} data`,
      };
    }
  }

  /**
   * Log user action for audit trail
   */
  async logUserAction(
    user: User,
    action: string,
    target: string,
    before: unknown,
    after: unknown
  ): Promise<boolean> {
    try {
      const result = await sheetsAdapter.logAction(
        user.email,
        action,
        target,
        before,
        after
      );
      return result.success;
    } catch (error) {
      console.error('Failed to log user action:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
