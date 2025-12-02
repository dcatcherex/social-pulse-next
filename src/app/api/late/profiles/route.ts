import { NextRequest, NextResponse } from 'next/server';

const LATE_API_URL = 'https://getlate.dev/api/v1';
const LATE_API_KEY = process.env.LATE_API_KEY;

// GET /api/late/profiles - Get all profiles
export async function GET() {
  if (!LATE_API_KEY) {
    return NextResponse.json(
      { error: 'Late API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${LATE_API_URL}/profiles`, {
      headers: {
        'Authorization': `Bearer ${LATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Late API] Get profiles error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profiles' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Late API] Get profiles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/late/profiles - Create a new profile
export async function POST(request: NextRequest) {
  if (!LATE_API_KEY) {
    return NextResponse.json(
      { error: 'Late API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    
    const response = await fetch(`${LATE_API_URL}/profiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Late API] Create profile error:', error);
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[Late API] Create profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
