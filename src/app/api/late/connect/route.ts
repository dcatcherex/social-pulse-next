import { NextRequest, NextResponse } from 'next/server';

const LATE_API_URL = 'https://getlate.dev/api/v1';
const LATE_API_KEY = process.env.LATE_API_KEY;

// GET /api/late/connect - Get OAuth URL for connecting a platform
export async function GET(request: NextRequest) {
  if (!LATE_API_KEY) {
    return NextResponse.json(
      { error: 'Late API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const profileId = searchParams.get('profileId');
    const redirectUrl = searchParams.get('redirect_url');
    
    if (!platform || !profileId) {
      return NextResponse.json(
        { error: 'Platform and profileId are required' },
        { status: 400 }
      );
    }

    // Build Late OAuth URL
    const url = new URL(`${LATE_API_URL}/connect/${platform}`);
    url.searchParams.set('profileId', profileId);
    
    if (redirectUrl) {
      url.searchParams.set('redirect_url', redirectUrl);
    }

    // Make request to Late to get the OAuth redirect URL
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${LATE_API_KEY}`,
      },
      redirect: 'manual', // Don't follow redirects, return the URL
    });

    // Late returns a redirect, we need to capture it
    if (response.status === 302 || response.status === 301) {
      const oauthUrl = response.headers.get('location');
      if (oauthUrl) {
        return NextResponse.json({ oauthUrl });
      }
    }

    // If Late returns the URL in the response body
    if (response.ok) {
      const data = await response.json();
      // Late API returns { authUrl: "...", state: "..." }
      const oauthUrl = data.authUrl || data.url || data.oauthUrl;
      if (oauthUrl) {
        return NextResponse.json({ oauthUrl });
      }
    }

    // If we reach here, something went wrong
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error('[Late API] Connect failed:', response.status, errorText);
    return NextResponse.json(
      { error: `Failed to get OAuth URL: ${response.status}` },
      { status: 500 }
    );
  } catch (error) {
    console.error('[Late API] Connect error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
