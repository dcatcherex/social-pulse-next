import { NextRequest, NextResponse } from 'next/server';

const LATE_API_URL = 'https://getlate.dev/api/v1';
const LATE_API_KEY = process.env.LATE_API_KEY;

// GET /api/late/accounts - Get connected accounts
export async function GET(request: NextRequest) {
  if (!LATE_API_KEY) {
    return NextResponse.json(
      { error: 'Late API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    
    const url = new URL(`${LATE_API_URL}/accounts`);
    if (profileId) {
      url.searchParams.set('profileId', profileId);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${LATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Late API] Get accounts error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch accounts' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Late API] Get accounts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/late/accounts?accountId=xxx - Disconnect an account
export async function DELETE(request: NextRequest) {
  if (!LATE_API_KEY) {
    return NextResponse.json(
      { error: 'Late API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    
    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${LATE_API_URL}/accounts/${accountId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${LATE_API_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Late API] Delete account error:', error);
      return NextResponse.json(
        { error: 'Failed to disconnect account' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Late API] Delete account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
