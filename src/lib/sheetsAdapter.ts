/**
 * WAGMI Crypto Investment Manager - Google Sheets Adapter
 * Central wrapper around Google Sheets API calls
 */

import { config } from './config';

export interface SheetsResponse {
  success: boolean;
  data?: unknown[];
  error?: string;
}

export interface SheetsUpdateRequest {
  tab: string;
  data?: unknown;
  action: 'add' | 'update' | 'delete';
  id?: string;
}

export class SheetsAdapter {
  private readonly baseUrl: string;
  private readonly spreadsheetId: string;

  constructor() {
    this.baseUrl = config.googleSheets.endpoint;
    this.spreadsheetId = config.googleSheets.spreadsheetId;
  }

  /**
   * Generic method to fetch data from any tab
   */
  async getData(tab: string): Promise<SheetsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}?action=get&tab=${tab}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error fetching data from ${tab}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generic method to update data in any tab
   */
  async updateData(request: SheetsUpdateRequest): Promise<SheetsResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: request.action,
          tab: request.tab,
          data: request.data,
          id: request.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error updating data in ${request.tab}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Portfolio-specific methods
   */
  async getPortfolioData(): Promise<SheetsResponse> {
    return this.getData('Portfolio');
  }

  async addAsset(asset: unknown): Promise<SheetsResponse> {
    return this.updateData({
      tab: 'Portfolio',
      action: 'add',
      data: asset,
    });
  }

  async updateAsset(id: string, asset: unknown): Promise<SheetsResponse> {
    return this.updateData({
      tab: 'Portfolio',
      action: 'update',
      id,
      data: asset,
    });
  }

  async deleteAsset(id: string): Promise<SheetsResponse> {
    return this.updateData({
      tab: 'Portfolio',
      action: 'delete',
      id,
    });
  }

  /**
   * Investor-specific methods
   */
  async getInvestorsData(): Promise<SheetsResponse> {
    return this.getData('Investors');
  }

  async getInvestorData(investorId: string): Promise<SheetsResponse> {
    const result = await this.getData('Investors');
    if (result.success && result.data) {
      const investor = result.data.find((inv: unknown) => (inv as { id: string }).id === investorId);
      return {
        success: true,
        data: investor ? [investor] : [],
      };
    }
    return result;
  }

  /**
   * User authentication methods
   */
  async getUsersData(): Promise<SheetsResponse> {
    return this.getData('Users');
  }

  async validateUser(email: string): Promise<{ success: boolean; user?: unknown; error?: string }> {
    const result = await this.getUsersData();
    if (result.success && result.data) {
      const user = result.data.find((u: unknown) => (u as { email: string }).email === email);
      return {
        success: !!user,
        user: user || undefined,
      };
    }
    return {
      success: false,
      error: result.error || 'Failed to validate user',
    };
  }

  /**
   * KPI and analytics methods
   */
  async getKPIData(): Promise<SheetsResponse> {
    return this.getData('KPIs');
  }

  async getLastUpdateData(): Promise<SheetsResponse> {
    return this.getData('Last Update');
  }

  /**
   * Audit logging methods
   */
  async logAction(user: string, action: string, target: string, before: unknown, after: unknown): Promise<SheetsResponse> {
    return this.updateData({
      tab: 'Audit',
      action: 'add',
      data: {
        timestamp: new Date().toISOString(),
        user,
        action,
        target,
        before: JSON.stringify(before),
        after: JSON.stringify(after),
      },
    });
  }

  /**
   * Configuration methods
   */
  async getConfigData(): Promise<SheetsResponse> {
    return this.getData('Config');
  }

  async getConfigValue(key: string): Promise<{ success: boolean; value?: string; error?: string }> {
    const result = await this.getConfigData();
    if (result.success && result.data) {
      const config = result.data.find((c: unknown) => (c as { key: string }).key === key) as { key: string; value: string } | undefined;
      return {
        success: !!config,
        value: config?.value,
      };
    }
    return {
      success: false,
      error: result.error || 'Failed to get config value',
    };
  }
}

// Export singleton instance
export const sheetsAdapter = new SheetsAdapter();
