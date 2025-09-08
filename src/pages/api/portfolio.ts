/**
 * WAGMI Crypto Investment Manager - Portfolio API
 * API endpoints for portfolio data operations
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { sheetsAdapter } from '@/lib/sheetsAdapter';
import { ApiResponse } from '@/shared/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Please sign in',
    });
  }

  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await handleGetPortfolio(req, res, session);
      case 'POST':
        return await handleAddAsset(req, res, session);
      case 'PUT':
        return await handleUpdateAsset(req, res, session);
      case 'DELETE':
        return await handleDeleteAsset(req, res, session);
      default:
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`,
        });
    }
  } catch (error) {
    console.error('Portfolio API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

async function handleGetPortfolio(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  session: any
) {
  try {
    let result;
    
    if (session.user.role === 'manager') {
      // Manager gets all portfolio data
      result = await sheetsAdapter.getPortfolioData();
    } else {
      // Investor gets only their data
      result = await sheetsAdapter.getInvestorData(session.user.investorId);
    }

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to fetch portfolio data',
      });
    }
  } catch (error) {
    console.error('Get portfolio error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio data',
    });
  }
}

async function handleAddAsset(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  session: any
) {
  // Only managers can add assets
  if (session.user.role !== 'manager') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden - Only managers can add assets',
    });
  }

  try {
    const { asset } = req.body;
    
    if (!asset) {
      return res.status(400).json({
        success: false,
        error: 'Asset data is required',
      });
    }

    const result = await sheetsAdapter.addAsset(asset);
    
    if (result.success) {
      // Log the action
      await sheetsAdapter.logAction(
        session.user.email,
        'create',
        'asset',
        null,
        asset
      );
      
      return res.status(201).json({
        success: true,
        data: result.data,
        message: 'Asset added successfully',
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to add asset',
      });
    }
  } catch (error) {
    console.error('Add asset error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add asset',
    });
  }
}

async function handleUpdateAsset(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  session: any
) {
  // Only managers can update assets
  if (session.user.role !== 'manager') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden - Only managers can update assets',
    });
  }

  try {
    const { id, asset } = req.body;
    
    if (!id || !asset) {
      return res.status(400).json({
        success: false,
        error: 'Asset ID and data are required',
      });
    }

    // Get current asset data for audit log
    const currentResult = await sheetsAdapter.getPortfolioData();
    const currentAsset = currentResult.data?.find((a: any) => a.id === id);

    const result = await sheetsAdapter.updateAsset(id, asset);
    
    if (result.success) {
      // Log the action
      await sheetsAdapter.logAction(
        session.user.email,
        'update',
        'asset',
        currentAsset,
        asset
      );
      
      return res.status(200).json({
        success: true,
        data: result.data,
        message: 'Asset updated successfully',
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to update asset',
      });
    }
  } catch (error) {
    console.error('Update asset error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update asset',
    });
  }
}

async function handleDeleteAsset(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  session: any
) {
  // Only managers can delete assets
  if (session.user.role !== 'manager') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden - Only managers can delete assets',
    });
  }

  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Asset ID is required',
      });
    }

    // Get current asset data for audit log
    const currentResult = await sheetsAdapter.getPortfolioData();
    const currentAsset = currentResult.data?.find((a: any) => a.id === id);

    const result = await sheetsAdapter.deleteAsset(id);
    
    if (result.success) {
      // Log the action
      await sheetsAdapter.logAction(
        session.user.email,
        'delete',
        'asset',
        currentAsset,
        null
      );
      
      return res.status(200).json({
        success: true,
        message: 'Asset deleted successfully',
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to delete asset',
      });
    }
  } catch (error) {
    console.error('Delete asset error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete asset',
    });
  }
}
