import type { Trend, TrendCategory, TrendVolume, TrendSentiment, YouTubeSettings } from '../types';
import { TREND_CACHE_KEY, TREND_CACHE_TTL, DEFAULT_YOUTUBE_SETTINGS, YOUTUBE_SETTINGS_KEY } from '../types';

interface TrendCache {
  trends: Trend[];
  timestamp: number;
  industry: string;
  keywords: string[];
}

/**
 * Get cached trends if valid
 */
export const getCachedTrends = (industry: string, keywords: string[]): Trend[] | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(TREND_CACHE_KEY);
    if (!stored) return null;

    const cache: TrendCache = JSON.parse(stored);
    const isExpired = Date.now() - cache.timestamp > TREND_CACHE_TTL;
    const sameIndustry = cache.industry === industry;
    const sameKeywords = JSON.stringify(cache.keywords.sort()) === JSON.stringify(keywords.sort());

    if (!isExpired && sameIndustry && sameKeywords) {
      return cache.trends;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Save trends to cache
 */
const saveTrendsToCache = (trends: Trend[], industry: string, keywords: string[]) => {
  if (typeof window === 'undefined') return;
  
  const cache: TrendCache = {
    trends,
    timestamp: Date.now(),
    industry,
    keywords,
  };
  localStorage.setItem(TREND_CACHE_KEY, JSON.stringify(cache));
};

/**
 * Fetch Google Trends from our API route
 */
const fetchGoogleTrends = async () => {
  const response = await fetch('/api/trends?geo=US&hours=24');
  if (!response.ok) {
    console.error('[TrendService] Failed to fetch Google Trends');
    return [];
  }
  const data = await response.json();
  return data.trends || [];
};

/**
 * Fetch YouTube videos from our API route
 */
const fetchYouTubeVideos = async (settings: YouTubeSettings, industry: string, keywords: string[]) => {
  const params = new URLSearchParams({
    mode: settings.searchMode,
    region: 'US',
    maxResults: '8',
  });

  if (settings.searchMode === 'keyword' && keywords.length > 0) {
    params.set('q', keywords.slice(0, 3).join(' '));
  }

  if (settings.categoryId) {
    params.set('categoryId', settings.categoryId);
  }

  const response = await fetch(`/api/youtube?${params}`);
  if (!response.ok) {
    console.error('[TrendService] Failed to fetch YouTube videos');
    return [];
  }
  const data = await response.json();
  return data.videos || [];
};

/**
 * Fetch news from our API route
 */
const fetchNews = async (industry: string, keywords: string[]) => {
  const query = keywords.length > 0 ? keywords.slice(0, 3).join(' OR ') : industry;
  const response = await fetch(`/api/news?q=${encodeURIComponent(query)}&pageSize=5`);
  if (!response.ok) {
    console.error('[TrendService] Failed to fetch news');
    return [];
  }
  const data = await response.json();
  return data.articles || [];
};

/**
 * Analyze items with AI
 */
const analyzeWithAI = async (
  items: unknown[],
  type: 'trends' | 'youtube' | 'news',
  industry: string,
  brandName?: string
) => {
  if (items.length === 0) return [];

  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, type, industry, brandName }),
    });

    if (!response.ok) {
      console.error('[TrendService] AI analysis failed');
      return [];
    }

    const data = await response.json();
    return data.analyses || [];
  } catch (error) {
    console.error('[TrendService] AI analysis error:', error);
    return [];
  }
};

/**
 * Transform Google Trends to Trend format
 */
const transformGoogleTrends = (
  trends: { query: string; formattedTraffic: string; relatedQueries?: string[] }[],
  analyses: { relevanceScore: number; contentAngles: string[]; hashtags: string[]; platforms: string[]; volume: string }[]
): Trend[] => {
  return trends.slice(0, 5).map((trend, index) => {
    const analysis = analyses[index] || {};
    return {
      id: `google-${Date.now()}-${index}`,
      title: trend.query,
      description: `${trend.formattedTraffic} searches • ${trend.relatedQueries?.slice(0, 2).join(', ') || 'Trending now'}`,
      category: 'viral' as TrendCategory,
      relevanceScore: Math.min(100, Math.max(1, Number(analysis.relevanceScore) || 50)),
      volume: validateVolume(String(analysis.volume || 'high')),
      sentiment: 'neutral' as TrendSentiment,
      hashtags: Array.isArray(analysis.hashtags) ? analysis.hashtags : [],
      contentAngles: Array.isArray(analysis.contentAngles) ? analysis.contentAngles : [],
      platforms: Array.isArray(analysis.platforms) ? analysis.platforms : ['TikTok', 'Instagram', 'Twitter'],
      timeframe: 'Today',
      source: 'google' as const,
      newsSource: 'Google Trends',
      newsUrl: `https://trends.google.com/trends/explore?q=${encodeURIComponent(trend.query)}`,
    };
  });
};

/**
 * Transform YouTube videos to Trend format
 */
const transformYouTubeVideos = (
  videos: { id: string; title: string; channelTitle: string; viewCount: string; tags?: string[] }[],
  analyses: { relevanceScore: number; contentAngles: string[]; hashtags: string[]; platforms: string[]; volume: string }[]
): Trend[] => {
  return videos.slice(0, 5).map((video, index) => {
    const analysis = analyses[index] || {};
    return {
      id: `youtube-${Date.now()}-${index}`,
      title: video.title,
      description: `${formatViewCount(video.viewCount)} views • ${video.channelTitle}`,
      category: 'viral' as TrendCategory,
      relevanceScore: Math.min(100, Math.max(1, Number(analysis.relevanceScore) || 50)),
      volume: validateVolume(String(analysis.volume || 'high')),
      sentiment: 'positive' as TrendSentiment,
      hashtags: Array.isArray(analysis.hashtags) ? analysis.hashtags : video.tags?.slice(0, 4) || [],
      contentAngles: Array.isArray(analysis.contentAngles) ? analysis.contentAngles : [],
      platforms: Array.isArray(analysis.platforms) ? analysis.platforms : ['YouTube', 'TikTok', 'Instagram'],
      timeframe: 'Today',
      source: 'youtube' as const,
      newsSource: 'YouTube Trending',
      newsUrl: `https://www.youtube.com/watch?v=${video.id}`,
    };
  });
};

/**
 * Transform news articles to Trend format
 */
const transformNewsArticles = (
  articles: { title: string; source: string; url: string; description?: string }[],
  analyses: { relevanceScore: number; contentAngles: string[]; hashtags: string[]; platforms: string[]; volume: string }[]
): Trend[] => {
  return articles.slice(0, 5).map((article, index) => {
    const analysis = analyses[index] || {};
    return {
      id: `news-${Date.now()}-${index}`,
      title: article.title,
      description: article.description || `From ${article.source}`,
      category: 'news' as TrendCategory,
      relevanceScore: Math.min(100, Math.max(1, Number(analysis.relevanceScore) || 50)),
      volume: validateVolume(String(analysis.volume || 'medium')),
      sentiment: 'neutral' as TrendSentiment,
      hashtags: Array.isArray(analysis.hashtags) ? analysis.hashtags : [],
      contentAngles: Array.isArray(analysis.contentAngles) ? analysis.contentAngles : [],
      platforms: Array.isArray(analysis.platforms) ? analysis.platforms : ['Twitter', 'LinkedIn', 'Facebook'],
      timeframe: 'Today',
      source: 'news' as const,
      newsSource: article.source,
      newsUrl: article.url,
    };
  });
};

/**
 * Validate volume value
 */
const validateVolume = (volume: string): TrendVolume => {
  const valid: TrendVolume[] = ['low', 'medium', 'high', 'viral'];
  const lower = volume.toLowerCase() as TrendVolume;
  return valid.includes(lower) ? lower : 'medium';
};

/**
 * Format view count
 */
const formatViewCount = (count: string): string => {
  const num = parseInt(count, 10);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return count;
};

/**
 * Get YouTube settings from localStorage
 */
const getYouTubeSettings = (): YouTubeSettings => {
  if (typeof window === 'undefined') return DEFAULT_YOUTUBE_SETTINGS;
  
  try {
    const saved = localStorage.getItem(YOUTUBE_SETTINGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_YOUTUBE_SETTINGS;
};

/**
 * Main function to discover trends
 */
export const discoverTrends = async (
  industry: string,
  keywords: string[],
  brandName?: string
): Promise<Trend[]> => {
  // Check cache first
  const cached = getCachedTrends(industry, keywords);
  if (cached) {
    console.log('[TrendService] Returning cached trends');
    return cached;
  }

  console.log('[TrendService] Fetching fresh trends for:', industry);

  // Get YouTube settings
  const youtubeSettings = getYouTubeSettings();

  // Fetch all data sources in parallel
  const [googleTrends, youtubeVideos, newsArticles] = await Promise.all([
    fetchGoogleTrends(),
    fetchYouTubeVideos(youtubeSettings, industry, keywords),
    fetchNews(industry, keywords),
  ]);

  console.log('[TrendService] Google trends:', googleTrends.length);
  console.log('[TrendService] YouTube videos:', youtubeVideos.length);
  console.log('[TrendService] News articles:', newsArticles.length);

  // Analyze all sources with AI in parallel
  const [googleAnalyses, youtubeAnalyses, newsAnalyses] = await Promise.all([
    analyzeWithAI(googleTrends.slice(0, 5), 'trends', industry, brandName),
    analyzeWithAI(youtubeVideos.slice(0, 5), 'youtube', industry, brandName),
    analyzeWithAI(newsArticles.slice(0, 5), 'news', industry, brandName),
  ]);

  // Transform to Trend format
  const googleTrendItems = transformGoogleTrends(googleTrends, googleAnalyses);
  const youtubeTrends = transformYouTubeVideos(youtubeVideos, youtubeAnalyses);
  const newsTrends = transformNewsArticles(newsArticles, newsAnalyses);

  // Filter YouTube by relevance setting
  const filteredYoutubeTrends = youtubeTrends.filter(
    trend => trend.relevanceScore >= youtubeSettings.minRelevance || youtubeSettings.includeGlobalTrends
  );

  // Combine all sources
  const allTrends = [...googleTrendItems, ...filteredYoutubeTrends, ...newsTrends];

  // Sort by relevance score
  allTrends.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Limit to top 12
  const topTrends = allTrends.slice(0, 12);

  // Cache results
  saveTrendsToCache(topTrends, industry, keywords);

  return topTrends;
};

/**
 * Force refresh trends (bypass cache)
 */
export const refreshTrends = async (
  industry: string,
  keywords: string[],
  brandName?: string
): Promise<Trend[]> => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TREND_CACHE_KEY);
  }
  return discoverTrends(industry, keywords, brandName);
};

/**
 * Clear trend cache
 */
export const clearTrendCache = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TREND_CACHE_KEY);
  }
};
