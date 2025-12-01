import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnailUrl: string;
  viewCount: string;
  likeCount: string;
  tags: string[];
  categoryId: string;
}

/**
 * GET /api/youtube
 * Fetches YouTube trending videos or searches by keywords
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'trending'; // 'trending' or 'search'
  const query = searchParams.get('q') || '';
  const regionCode = searchParams.get('region') || 'US';
  const maxResults = searchParams.get('maxResults') || '10';
  const categoryId = searchParams.get('categoryId') || '';

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API key not configured' },
      { status: 500 }
    );
  }

  try {
    let videoIds: string[] = [];

    if (mode === 'search' && query) {
      // Search by keywords
      const searchParams = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        order: 'viewCount',
        publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        maxResults,
        relevanceLanguage: 'en',
        key: YOUTUBE_API_KEY,
      });

      if (categoryId) {
        searchParams.set('videoCategoryId', categoryId);
      }

      const searchResponse = await fetch(`${YOUTUBE_API_BASE}/search?${searchParams}`);
      
      if (!searchResponse.ok) {
        const error = await searchResponse.text();
        console.error('[API/youtube] Search error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
      }

      const searchData = await searchResponse.json();
      videoIds = (searchData.items || []).map((item: { id: { videoId: string } }) => item.id.videoId);
    } else {
      // Get trending videos
      const trendingParams = new URLSearchParams({
        part: 'snippet',
        chart: 'mostPopular',
        regionCode,
        maxResults,
        key: YOUTUBE_API_KEY,
      });

      if (categoryId) {
        trendingParams.set('videoCategoryId', categoryId);
      }

      const trendingResponse = await fetch(`${YOUTUBE_API_BASE}/videos?${trendingParams}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!trendingResponse.ok) {
        const error = await trendingResponse.text();
        console.error('[API/youtube] Trending error:', error);
        return NextResponse.json({ error: 'Trending fetch failed' }, { status: 500 });
      }

      const trendingData = await trendingResponse.json();
      
      // For trending, we already have full video data
      const videos: YouTubeVideo[] = (trendingData.items || []).map((item: {
        id: string;
        snippet: {
          title: string;
          description: string;
          channelTitle: string;
          publishedAt: string;
          thumbnails: { high?: { url: string }; medium?: { url: string }; default: { url: string } };
          tags?: string[];
          categoryId: string;
        };
        statistics?: {
          viewCount: string;
          likeCount: string;
        };
      }) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        viewCount: item.statistics?.viewCount || '0',
        likeCount: item.statistics?.likeCount || '0',
        tags: item.snippet.tags || [],
        categoryId: item.snippet.categoryId,
      }));

      return NextResponse.json({ videos, count: videos.length });
    }

    // If we searched, get full video details
    if (videoIds.length === 0) {
      return NextResponse.json({ videos: [], count: 0 });
    }

    const videoParams = new URLSearchParams({
      part: 'snippet,statistics',
      id: videoIds.join(','),
      key: YOUTUBE_API_KEY,
    });

    const videoResponse = await fetch(`${YOUTUBE_API_BASE}/videos?${videoParams}`);
    
    if (!videoResponse.ok) {
      return NextResponse.json({ error: 'Video details fetch failed' }, { status: 500 });
    }

    const videoData = await videoResponse.json();
    
    const videos: YouTubeVideo[] = (videoData.items || []).map((item: {
      id: string;
      snippet: {
        title: string;
        description: string;
        channelTitle: string;
        publishedAt: string;
        thumbnails: { high?: { url: string }; medium?: { url: string }; default: { url: string } };
        tags?: string[];
        categoryId: string;
      };
      statistics: {
        viewCount: string;
        likeCount: string;
      };
    }) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      viewCount: item.statistics?.viewCount || '0',
      likeCount: item.statistics?.likeCount || '0',
      tags: item.snippet.tags || [],
      categoryId: item.snippet.categoryId,
    }));

    return NextResponse.json({ videos, count: videos.length });
  } catch (error) {
    console.error('[API/youtube] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
