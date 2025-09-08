/**
 * WAGMI Crypto Investment Manager - Portfolio API
 * API endpoints for portfolio data operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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

// Get portfolio data
async function handleGetPortfolio(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    let portfolioData;
    
    if (session.user.role === 'manager') {
      // Manager gets all investor data
      portfolioData = await sheetsAdapter.getInvestorsData();
    } else if (session.user.investorId) {
      // Investor gets only their data
      portfolioData = await sheetsAdapter.getInvestorData(session.user.investorId);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid user role' } as ApiResponse,
        { status: 403 }
      );
    }

    if (!portfolioData) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch portfolio data' } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: portfolioData
    } as ApiResponse);

  } catch (error) {
    console.error('Portfolio GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}

// Add new asset
async function handleAddAsset(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Manager access required' } as ApiResponse,
        { status: 401 }
      );
    }

    const body = await req.json();
    const { investorId, asset, quantity, price } = body;

    if (!investorId || !asset || !quantity || !price) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse,
        { status: 400 }
      );
    }

    const assetData = {
      investorId,
      asset,
      quantity: parseFloat(quantity),
      price: parseFloat(price)
    };

    const result = await sheetsAdapter.addAsset(assetData);

    if (result.success) {
      // Log the action
      await sheetsAdapter.logAction(
        session.user.email,
        'create',
        'asset',
        null,
        assetData
      );

      return NextResponse.json({
        success: true,
        data: result.data
      } as ApiResponse);
    } else {
      return NextResponse.json(
        { success: false, error: result.error } as ApiResponse,
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Portfolio POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}

// Update existing asset
async function handleUpdateAsset(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Manager access required' } as ApiResponse,
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, investorId, asset, quantity, price } = body;

    if (!id || !investorId || !asset || !quantity || !price) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' } as ApiResponse,
        { status: 400 }
      );
    }

    const assetData = {
      investorId,
      asset,
      quantity: parseFloat(quantity),
      price: parseFloat(price)
    };

    const result = await sheetsAdapter.updateAsset(id, assetData);

    if (result.success) {
      // Log the action
      await sheetsAdapter.logAction(
        session.user.email,
        'update',
        'asset',
        null, // We don't have the before state
        assetData
      );

      return NextResponse.json({
        success: true,
        data: result.data
      } as ApiResponse);
    } else {
      return NextResponse.json(
        { success: false, error: result.error } as ApiResponse,
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Portfolio PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}

// Delete asset
async function handleDeleteAsset(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.role !== 'manager') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Manager access required' } as ApiResponse,
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const investorId = searchParams.get('investorId');

    if (!id || !investorId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' } as ApiResponse,
        { status: 400 }
      );
    }

    const result = await sheetsAdapter.deleteAsset(id);

    if (result.success) {
      // Log the action
      await sheetsAdapter.logAction(
        session.user.email,
        'delete',
        'asset',
        { id, investorId },
        null
      );

      return NextResponse.json({
        success: true,
        data: result.data
      } as ApiResponse);
    } else {
      return NextResponse.json(
        { success: false, error: result.error } as ApiResponse,
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Portfolio DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}