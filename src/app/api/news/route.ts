import { NextRequest, NextResponse } from 'next/server';

const NEWS_API_KEY = process.env.NEWS_API_KEY || '';
const NEWS_API_BASE = 'https://newsapi.org/v2';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

/**
 * GET /api/news
 * Fetches news headlines from NewsAPI
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const country = searchParams.get('country') || 'us';
  const pageSize = searchParams.get('pageSize') || '10';

  if (!NEWS_API_KEY) {
    return NextResponse.json(
      { error: 'NewsAPI key not configured' },
      { status: 500 }
    );
  }

  try {
    let url: string;
    
    if (query) {
      // Search by keywords
      const params = new URLSearchParams({
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize,
        apiKey: NEWS_API_KEY,
      });
      url = `${NEWS_API_BASE}/everything?${params}`;
    } else {
      // Top headlines
      const params = new URLSearchParams({
        country,
        pageSize,
        apiKey: NEWS_API_KEY,
      });
      if (category) {
        params.set('category', category);
      }
      url = `${NEWS_API_BASE}/top-headlines?${params}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[API/news] NewsAPI error:', error);
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      console.error('[API/news] NewsAPI error:', data.message);
      return NextResponse.json({ error: data.message }, { status: 500 });
    }

    const articles: NewsArticle[] = (data.articles || []).map((article: {
      title: string;
      description: string;
      url: string;
      source: { name: string };
      publishedAt: string;
      urlToImage?: string;
    }) => ({
      title: article.title,
      description: article.description || '',
      url: article.url,
      source: article.source?.name || 'Unknown',
      publishedAt: article.publishedAt,
      imageUrl: article.urlToImage,
    }));

    return NextResponse.json({
      articles,
      count: articles.length,
      totalResults: data.totalResults,
    });
  } catch (error) {
    console.error('[API/news] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
