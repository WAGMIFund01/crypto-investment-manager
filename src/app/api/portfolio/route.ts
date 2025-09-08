/**
 * WAGMI Crypto Investment Manager - Portfolio API
 * API endpoints for portfolio data operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { sheetsAdapter } from '@/lib/sheetsAdapter';
import { ApiResponse } from '@/shared/types';

export async function GET(req: NextRequest) {
  return handleGetPortfolio(req);
}

export async function POST(req: NextRequest) {
  return handleAddAsset(req);
}

export async function PUT(req: NextRequest) {
  return handleUpdateAsset(req);
}

export async function DELETE(req: NextRequest) {
  return handleDeleteAsset(req);
}

async function handleGetPortfolio(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Please sign in',
      }, { status: 401 });
    }

    let result;
    
    if (session.user.role === 'manager') {
      // Manager gets all portfolio data
      result = await sheetsAdapter.getPortfolioData();
    } else {
      // Investor gets only their data
      if (session.user.investorId) {
        result = await sheetsAdapter.getInvestorData(session.user.investorId);
      } else {
        return NextResponse.json({
          success: false,
          error: 'Investor ID not found',
        }, { status: 400 });
      }
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to fetch portfolio data',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Get portfolio error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch portfolio data',
    }, { status: 500 });
  }
}

async function handleAddAsset(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Please sign in',
      }, { status: 401 });
    }

    // Only managers can add assets
    if (session.user.role !== 'manager') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden - Only managers can add assets',
      }, { status: 403 });
    }

    const { asset } = await req.json();
    
    if (!asset) {
      return NextResponse.json({
        success: false,
        error: 'Asset data is required',
      }, { status: 400 });
    }

    const result = await sheetsAdapter.addAsset(asset);
    
    if (result.success) {
      // Log the action
      if (session.user.email) {
        await sheetsAdapter.logAction(
          session.user.email,
          'create',
          'asset',
          null,
          asset
        );
      }
      
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Asset added successfully',
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to add asset',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Add asset error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add asset',
    }, { status: 500 });
  }
}

async function handleUpdateAsset(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Please sign in',
      }, { status: 401 });
    }

    // Only managers can update assets
    if (session.user.role !== 'manager') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden - Only managers can update assets',
      }, { status: 403 });
    }

    const { id, asset } = await req.json();
    
    if (!id || !asset) {
      return NextResponse.json({
        success: false,
        error: 'Asset ID and data are required',
      }, { status: 400 });
    }

    // Get current asset data for audit log
    const currentResult = await sheetsAdapter.getPortfolioData();
    const currentAsset = currentResult.data?.find((a: unknown) => (a as { id: string }).id === id);

    const result = await sheetsAdapter.updateAsset(id, asset);
    
    if (result.success) {
      // Log the action
      if (session.user.email) {
        await sheetsAdapter.logAction(
          session.user.email,
          'update',
          'asset',
          currentAsset,
          asset
        );
      }
      
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Asset updated successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to update asset',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Update asset error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update asset',
    }, { status: 500 });
  }
}

async function handleDeleteAsset(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Please sign in',
      }, { status: 401 });
    }

    // Only managers can delete assets
    if (session.user.role !== 'manager') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden - Only managers can delete assets',
      }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Asset ID is required',
      }, { status: 400 });
    }

    // Get current asset data for audit log
    const currentResult = await sheetsAdapter.getPortfolioData();
    const currentAsset = currentResult.data?.find((a: unknown) => (a as { id: string }).id === id);

    const result = await sheetsAdapter.deleteAsset(id);
    
    if (result.success) {
      // Log the action
      if (session.user.email) {
        await sheetsAdapter.logAction(
          session.user.email,
          'delete',
          'asset',
          currentAsset,
          null
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Asset deleted successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to delete asset',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Delete asset error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete asset',
    }, { status: 500 });
  }
}
