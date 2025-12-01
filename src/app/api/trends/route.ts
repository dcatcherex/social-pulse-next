import { NextRequest, NextResponse } from 'next/server';

const SERPAPI_KEY = process.env.SERPAPI_KEY || '';
const SERPAPI_BASE = 'https://serpapi.com/search.json';

export interface GoogleTrendingSearch {
  query: string;
  title: string;
  formattedTraffic: string;
  searchVolume: number;
  relatedQueries: string[];
}

/**
 * GET /api/trends
 * Fetches Google Trends data from SerpApi (server-side, no CORS issues!)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const geo = searchParams.get('geo') || 'US';
  const hours = searchParams.get('hours') || '24';

  if (!SERPAPI_KEY) {
    return NextResponse.json(
      { error: 'SerpApi key not configured' },
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      engine: 'google_trends_trending_now',
      geo,
      hours,
      hl: 'en',
      api_key: SERPAPI_KEY,
    });

    const response = await fetch(`${SERPAPI_BASE}?${params}`, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[API/trends] SerpApi error:', error);
      return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
    }

    const data = await response.json();

    if (data.error) {
      console.error('[API/trends] SerpApi error:', data.error);
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    // Transform response
    const trendingSearches = data.trending_searches || [];
    const trends: GoogleTrendingSearch[] = trendingSearches.map((search: {
      query: string;
      search_volume?: number;
      trend_breakdown?: string[];
    }) => {
      const volume = search.search_volume || 0;
      let formattedTraffic = '10K+';
      if (volume >= 1000000) {
        formattedTraffic = `${(volume / 1000000).toFixed(1)}M+`;
      } else if (volume >= 1000) {
        formattedTraffic = `${Math.round(volume / 1000)}K+`;
      }

      return {
        query: search.query,
        title: search.query,
        formattedTraffic,
        searchVolume: volume,
        relatedQueries: search.trend_breakdown || [],
      };
    });

    return NextResponse.json({
      trends: trends.slice(0, 15),
      count: trends.length,
      cached: false,
    });
  } catch (error) {
    console.error('[API/trends] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
